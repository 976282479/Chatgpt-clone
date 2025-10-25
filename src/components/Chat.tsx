import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChatMessage, ChatSession, UserSettings } from '../types/chat';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import { sendChatMessageWithAbort } from '../lib/api';
import Sidebar from './Sidebar';
import SettingsModal from './SettingsModal';

const SESSIONS_KEY = 'chat_sessions_v1';
const SETTINGS_KEY = 'chat_settings_v1';

function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as ChatSession[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}
function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { model: 'default', jailbreak: false, webAccess: false, theme: 'light' };
    const s = JSON.parse(raw) as UserSettings;
    return {
      model: s.model || 'default',
      jailbreak: !!s.jailbreak,
      webAccess: !!s.webAccess,
      theme: s.theme || 'light',
    };
  } catch {
    return { model: 'default', jailbreak: false, webAccess: false, theme: 'light' };
  }
}
function saveSettings(s: UserSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export default function Chat() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => loadSessions());
  const [currentId, setCurrentId] = useState<string | null>(() => sessions[0]?.id ?? null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [abortFn, setAbortFn] = useState<(() => void) | null>(null);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const currentSession = useMemo(() => sessions.find((s) => s.id === currentId) || null, [sessions, currentId]);

  useEffect(() => { saveSessions(sessions); }, [sessions]);
  useEffect(() => { saveSettings(settings); }, [settings]);

  const createSession = () => {
    const id = crypto.randomUUID();
    const now = Date.now();
    const s: ChatSession = { id, title: 'New Chat', messages: [], createdAt: now, updatedAt: now };
    setSessions((prev) => [s, ...prev]);
    setCurrentId(id);
  };
  const selectSession = (id: string) => setCurrentId(id);
  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setCurrentId((curr) => (curr === id ? (sessions.find((s) => s.id !== id)?.id ?? null) : curr));
  };
  const clearAllSessions = () => { setSessions([]); setCurrentId(null); };

  const handleSend = async (text: string) => {
    const ensureSession = () => { if (!currentSession) { createSession(); } };
    ensureSession();
    const sid = currentId || sessions[0]?.id!;
    const now = Date.now();
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text, createdAt: now };
    setSessions((prev) => prev.map((s) => (s.id === sid ? { ...s, messages: [...s.messages, userMsg], title: s.messages.length === 0 ? text.slice(0, 20) : s.title, updatedAt: now } : s)));

    setLoading(true);
    const { promise, abort } = sendChatMessageWithAbort(text, { model: settings.model, jailbreak: settings.jailbreak, webAccess: settings.webAccess });
    setAbortFn(() => abort);
    try {
      const data = await promise;
      const assistantMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: typeof data === 'string' ? data : (data.content ?? JSON.stringify(data)), createdAt: Date.now() };
      setSessions((prev) => prev.map((s) => (s.id === sid ? { ...s, messages: [...s.messages, assistantMsg], updatedAt: Date.now() } : s)));
    } catch (e: any) {
      const errMsg: ChatMessage = { id: crypto.randomUUID(), role: 'system', content: `Request failed: ${e?.message ?? e}`, createdAt: Date.now() };
      setSessions((prev) => prev.map((s) => (s.id === sid ? { ...s, messages: [...s.messages, errMsg], updatedAt: now } : s)));
    } finally {
      setAbortFn(null);
      setLoading(false);
    }
  };

  const handleStop = () => { if (abortFn) abortFn(); };

  const messages = currentSession?.messages ?? [];

  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mainRef.current) return;
    mainRef.current.scrollTop = mainRef.current.scrollHeight;
    const body = document.body;
    const html = document.documentElement;
    body.classList.remove('theme-dark', 'theme-ocean');
    html.classList.remove('theme-dark', 'theme-ocean');
    if (settings.theme === 'dark') { body.classList.add('theme-dark'); html.classList.add('theme-dark'); }
    if (settings.theme === 'ocean') { body.classList.add('theme-ocean'); html.classList.add('theme-ocean'); }
  }, [settings.theme, messages.length]);

  const themeHeader = settings.theme === 'dark' ? 'bg-neutral-900 text-white border-neutral-800' : settings.theme === 'ocean' ? 'bg-sky-100' : 'bg-white';
  const themeMain = settings.theme === 'dark' ? 'bg-neutral-950 text-white' : settings.theme === 'ocean' ? 'bg-sky-50' : 'bg-gray-50';
  const themeSidebar = settings.theme === 'dark' ? 'bg-neutral-900 text-white border-neutral-800' : settings.theme === 'ocean' ? 'bg-sky-100' : 'bg-white';
  const themeFooter = settings.theme === 'dark' ? 'bg-neutral-900 text-white border-neutral-800' : settings.theme === 'ocean' ? 'bg-sky-100' : 'bg-white';

  return (
    <div className="flex h-screen">
      <Sidebar
        sessions={sessions}
        currentId={currentId}
        onSelect={(id) => { setCurrentId(id); setSidebarVisible(false); }}
        onCreate={createSession}
        onDelete={deleteSession}
        onClearAll={clearAllSessions}
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        className={themeSidebar}
      />
      <div className="flex flex-col flex-1">
        <header className={`px-4 py-3 border-b flex items-center justify-between ${themeHeader}`}>
          <button className="md:hidden px-3 py-1 border rounded" onClick={() => setSidebarVisible((v) => !v)}>Menu</button>
          <div className="font-medium">ChatGPT Clone</div>
          <div className="flex gap-2 items-center">
            <button className="px-3 py-1 border rounded" onClick={() => setSettingsVisible(true)}>Settings</button>
          </div>
        </header>
        <main ref={mainRef} className={`flex-1 overflow-auto p-4 flex flex-col gap-3 ${themeMain}`}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
        </main>
        <ChatInput onSend={handleSend} loading={loading} onStop={handleStop} />
        <div className={`px-4 py-2 border-t flex items-center gap-3 ${themeFooter}`}>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={settings.webAccess} onChange={(e) => setSettings({ ...settings, webAccess: e.target.checked })} />
            Web Access
          </label>
          <select className="border rounded px-2 py-1 text-sm" value={settings.model} onChange={(e) => setSettings({ ...settings, model: e.target.value })}>
            <option value="default">default</option>
            <option value="gpt-4">gpt-4</option>
            <option value="gpt-4o-mini">gpt-4o-mini</option>
            <option value="llama3.1">llama3.1</option>
          </select>
          <select className="border rounded px-2 py-1 text-sm" value={settings.theme} onChange={(e) => setSettings({ ...settings, theme: e.target.value })}>
            <option value="light">light</option>
            <option value="dark">dark</option>
            <option value="ocean">ocean</option>
          </select>
        </div>
        {settingsVisible && (
          <SettingsModal
            settings={settings}
            onChange={(s) => setSettings(s)}
            onClose={() => setSettingsVisible(false)}
          />
        )}
      </div>
    </div>
  );
}