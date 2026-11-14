import React, { useState } from 'react';
import { Send, User, ShieldCheck, Loader2 } from 'lucide-react';
import api from '../../services/api';

const ProjectDiscussion = ({ projectId, initialMessages = [], currentUserId, isAdmin }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    setError('');

    try {
      const response = await api.post(`/projects/${projectId}/messages`, {
        message: newMessage.trim(),
      });

      if (response.data.success) {
        setMessages((prev) => [...prev, response.data.data]);
        setNewMessage('');
      }
    } catch (err) {
      setError(err.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden flex flex-col h-[520px] shadow-soft">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-sans">
            Discussion & Communications
          </h4>
          <p className="text-[11px] text-slate-500">Direct encrypted thread with engineering team</p>
        </div>
        <span className="text-[10px] font-mono font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200">
          {messages.length} {messages.length === 1 ? 'Message' : 'Messages'}
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
            <p className="text-xs">No messages yet. Send a message to start the architectural discussion.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === currentUserId;
            const isSenderAdmin = msg.senderRole === 'admin';

            return (
              <div
                key={msg._id || index}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
                  {isSenderAdmin ? (
                    <span className="inline-flex items-center gap-1 text-accent font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {msg.senderName} (Novacore Lead)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-700 font-semibold">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {msg.senderName}
                    </span>
                  )}
                  <span>•</span>
                  <span>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-[13px] leading-relaxed ${
                    isMe
                      ? 'bg-accent text-white rounded-tr-none shadow-xs'
                      : isSenderAdmin
                      ? 'bg-orange-50 text-slate-800 border border-orange-100 rounded-tl-none'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        {error && <p className="text-[11px] text-rose-600 mb-2 px-1">{error}</p>}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a technical update or question..."
            className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent shadow-xs transition-colors"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-pill transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectDiscussion;
