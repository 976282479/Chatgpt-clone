export type Role = 'user' | 'assistant' | 'system';
export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}
export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}
export interface UserSettings {
  model: string;
  jailbreak: boolean;
  webAccess: boolean;
  theme: string; // e.g. 'light' | 'dark' | 'ocean'
}