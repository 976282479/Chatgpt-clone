import { useEffect, useRef, useState } from 'react';

interface Props {
  onSend: (text: string) => void;
  onStop?: () => void;
  loading?: boolean;
}

export default function ChatInput({ onSend, onStop, loading }: Props) {
  const [text, setText] = useState('');
  const taRef = useRef<HTMLTextAreaElement>(null);

  // autosize
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(200, ta.scrollHeight) + 'px';
  }, [text]);

  const handleSend = () => {
    if (text.trim() && !loading) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <div className="flex gap-2 p-2 border-t bg-white">
      <textarea
        ref={taRef}
        className="flex-1 border rounded px-3 py-2 focus:outline-none resize-none"
        rows={1}
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (e.shiftKey) return; // newline
            e.preventDefault();
            handleSend();
          }
        }}
        disabled={loading}
      />
      {loading ? (
        <button className="px-4 py-2 bg-gray-200 rounded" onClick={onStop}>Stop</button>
      ) : (
        <button className="px-4 py-2 bg-black text-white rounded disabled:opacity-50" onClick={handleSend} disabled={loading}>Send</button>
      )}
    </div>
  );
}