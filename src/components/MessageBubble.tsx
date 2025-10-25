import React, { useMemo, useEffect, useState } from 'react';
import type { ChatMessage } from '../types/chat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

export default function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';

  // typing effect for assistant
  const [display, setDisplay] = useState(msg.content);
  useEffect(() => {
    if (msg.role !== 'assistant') { setDisplay(msg.content); return; }
    setDisplay('');
    const full = msg.content;
    let i = 0;
    const id = setInterval(() => {
      i += Math.max(1, Math.floor(full.length / 60));
      setDisplay(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [msg.id, msg.content, msg.role]);

  const components = useMemo(() => ({
    code({ inline, children }: any) {
      const text = String(children).replace(/\n$/, '');
      if (inline) {
        return <code className="bg-gray-200 px-1 py-0.5 rounded">{text}</code>;
      }
      const copy = () => navigator.clipboard.writeText(text);
      return (
        <div className="relative">
          <button className="absolute top-2 right-2 text-xs px-2 py-1 bg-gray-200 rounded" onClick={copy}>Copy</button>
          <pre className="overflow-auto"><code>{text}</code></pre>
        </div>
      );
    }
  }), []);

  return (
    <div className={`flex items-start gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">🤖</div>}
      <div className={`max-w-[75%] rounded px-3 py-2 shadow ${isUser ? 'bg-black text-white' : 'bg-gray-100'}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={components as any}
        >
          {display}
        </ReactMarkdown>
      </div>
      {isUser && <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center">👤</div>}
    </div>
  );
}