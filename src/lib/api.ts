const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:1338';
const TIMEOUT = Number(import.meta.env.VITE_REQUEST_TIMEOUT ?? 30000);

export interface ChatResponse {
  [key: string]: any;
}

export async function sendChatMessage(prompt: string): Promise<ChatResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);

  const res = await fetch(`${BASE_URL}/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
    signal: controller.signal,
  });
  clearTimeout(timer);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function sendChatMessageWithAbort(prompt: string, opts?: { model?: string; jailbreak?: boolean; webAccess?: boolean }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  const body = { prompt, model: opts?.model, jailbreak: !!opts?.jailbreak, web_access: !!opts?.webAccess };
  const promise = fetch(`${BASE_URL}/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: controller.signal,
  }).then(async (res) => {
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });
  const abort = () => {
    clearTimeout(timer);
    controller.abort();
  };
  return { promise, abort };
}