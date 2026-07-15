'use client';

import { useState } from 'react';

type ChatMessage = {
  from: 'admin' | 'user';
  text: string;
  time: string;
};

const now = () =>
  new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: 'admin', text: 'Hai, ada yang bisa kami bantu?', time: now() },
  ]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = message.trim();
    if (!text || sending) return;

    setSending(true);
    setError('');
    setMessages((prev) => [...prev, { from: 'user', text, time: now() }]);
    setMessage('');

    try {
      const res = await fetch('/api/chat-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, page: window.location.pathname }),
      });

      if (!res.ok) throw new Error('failed');

      setMessages((prev) => [
        ...prev,
        {
          from: 'admin',
          text: 'Terima kasih, pesan Anda sudah kami terima. Tim kami akan segera menghubungi Anda.',
          time: now(),
        },
      ]);
    } catch {
      setError('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[999] w-[320px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-[#0A1E3F] px-4 py-4 flex items-start justify-between">
            <div>
              <p className="text-white font-bold text-sm">SDBI Admin</p>
              <p className="text-white/70 text-xs mt-0.5">Biasanya membalas dalam 1 hari</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup chat"
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="px-4 py-4 space-y-3 max-h-80 overflow-y-auto bg-[#ECE5DD]">
            <p className="text-center text-[11px] text-gray-500">Hari ini</p>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm shadow-sm ${
                    m.from === 'user' ? 'bg-[#25D366] text-white' : 'bg-white text-gray-800'
                  }`}
                >
                  {m.from === 'admin' && (
                    <p className="text-[11px] font-semibold text-[#0A1E3F] mb-0.5">SDBI Admin</p>
                  )}
                  <p className="leading-snug">{m.text}</p>
                  <p className={`text-[10px] mt-1 text-right ${m.from === 'user' ? 'text-white/80' : 'text-gray-400'}`}>
                    {m.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-gray-100 bg-white">
            {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ketik pesan Anda"
                disabled={sending}
                className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none placeholder:text-gray-400 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={sending || !message.trim()}
                aria-label="Kirim pesan"
                className="shrink-0 w-10 h-10 bg-[#25D366] hover:bg-[#20BD5A] disabled:opacity-50 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="whatsapp-float"
        aria-label="Buka chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
      </button>
    </>
  );
}
