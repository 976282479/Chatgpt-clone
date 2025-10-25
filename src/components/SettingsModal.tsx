import React, { useState } from 'react';
import type { UserSettings } from '../types/chat';

interface Props {
  settings: UserSettings;
  onChange: (s: UserSettings) => void;
  onClose: () => void;
}

export default function SettingsModal({ settings, onChange, onClose }: Props) {
  const [local, setLocal] = useState<UserSettings>(settings);

  const apply = () => {
    onChange(local);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white w-[520px] rounded shadow">
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <div className="font-medium">Settings</div>
          <button className="px-2 py-1" onClick={onClose}>Close</button>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="jb" checked={local.jailbreak} onChange={(e) => setLocal({ ...local, jailbreak: e.target.checked })} />
            <label htmlFor="jb">Jailbreak</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="wa" checked={local.webAccess} onChange={(e) => setLocal({ ...local, webAccess: e.target.checked })} />
            <label htmlFor="wa">Enable web access</label>
          </div>
        </div>
        <div className="px-4 py-3 border-t flex justify-end gap-2">
          <button className="px-3 py-1 border rounded" onClick={onClose}>Cancel</button>
          <button className="px-3 py-1 bg-black text-white rounded" onClick={apply}>Save</button>
        </div>
      </div>
    </div>
  );
}