import React from 'react';
import type { ChatSession } from '../types/chat';

interface SidebarProps {
  sessions: ChatSession[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  visible?: boolean;
  onClose?: () => void;
  className?: string;
}

export default function Sidebar({ sessions, currentId, onSelect, onCreate, onDelete, onClearAll, visible = true, onClose, className = '' }: SidebarProps) {
  return (
    <aside className={`border-r w-64 flex-shrink-0 ${visible ? 'block' : 'hidden'} md:block ${className}`}>
      <div className="px-3 py-2 border-b space-y-2">
        <button className="w-full px-2 py-1 text-sm bg-black text-white rounded" onClick={onCreate}>New Conversation</button>
        <button className="w-full px-2 py-1 text-sm bg-gray-200 rounded" onClick={onClearAll}>Clear Conversations</button>
        <button className="md:hidden w-full px-2 py-1 text-sm" onClick={onClose}>Close</button>
      </div>
      <ul className="divide-y">
        {sessions.length === 0 && (
          <li className="px-3 py-3 text-sm text-gray-500">No chats yet, click 'New Conversation' to start</li>
        )}
        {sessions.map((s) => (
          <li key={s.id} className={`px-3 py-2 flex items-center justify-between cursor-pointer ${currentId === s.id ? 'bg-gray-100' : ''}`}
              onClick={() => onSelect(s.id)}>
            <div className="truncate pr-2">
              <div className="text-sm font-medium truncate">{s.title || 'Untitled Chat'}</div>
              <div className="text-xs text-gray-500">{new Date(s.updatedAt).toLocaleString()}</div>
            </div>
            <button className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded" onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}>Delete</button>
          </li>
        ))}
      </ul>
    </aside>
  );
}