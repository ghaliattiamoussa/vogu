'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { MessageCircle, Search, Send, Loader2, X, CheckCircle2, Circle, Trash2, Mail, Clock } from 'lucide-react';

interface SupportMessage {
  id: string;
  ticketId: string;
  sender: 'USER' | 'ADMIN';
  text: string;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  userId: string | null;
  userName: string;
  userEmail: string;
  subject: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'ALL') params.set('status', filter);
      if (search.trim()) params.set('search', search.trim());
      const res = await fetch(`/api/admin/support?${params}`);
      const data = await res.json();
      setTickets(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const selected = tickets.find(t => t.id === selectedId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected?.messages.length]);

  const sendReply = async () => {
    if (!selectedId || !replyText.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/admin/support/${selectedId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: replyText.trim() }),
      });
      if (res.ok) {
        setReplyText('');
        await fetchTickets();
      }
    } catch {
      alert('فشل إرسال الرد');
    } finally {
      setSending(false);
    }
  };

  const toggleStatus = async (ticket: SupportTicket) => {
    const nextStatus = ticket.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    await fetch(`/api/admin/support/${ticket.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    fetchTickets();
  };

  const deleteTicket = async (ticket: SupportTicket) => {
    if (!confirm(`حذف التذكرة من "${ticket.userName}"؟`)) return;
    await fetch(`/api/admin/support/${ticket.id}`, { method: 'DELETE' });
    if (selectedId === ticket.id) setSelectedId(null);
    fetchTickets();
  };

  const openCount = tickets.filter(t => t.status === 'OPEN').length;

  return (
    <div className="min-h-screen bg-[#070707] text-[#EDE8DF]" dir="rtl">
      <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-cormorant text-3xl text-[#EDE8DF] mb-1 flex items-center gap-2">
              <MessageCircle size={28} className="text-[#C9A86E]" />
              الدعم والشكاوى
            </h1>
            <p className="text-[#8A8480] text-sm font-tajawal">
              متابعة رسائل وشكاوى العملاء والرد عليهم.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm font-tajawal">
            <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-2">
              <span className="text-[#8A8480]">مفتوحة: </span>
              <span className="text-[#C9A86E] font-bold">{openCount}</span>
            </div>
            <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-4 py-2">
              <span className="text-[#8A8480]">الإجمالي: </span>
              <span className="text-[#EDE8DF] font-bold">{tickets.length}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex gap-1 bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-1">
            {(['ALL', 'OPEN', 'CLOSED'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-tajawal transition ${
                  filter === f ? 'bg-[#1A1200] text-[#C9A86E]' : 'text-[#8A8480] hover:text-[#EDE8DF]'
                }`}
              >
                {f === 'ALL' ? 'الكل' : f === 'OPEN' ? 'مفتوحة' : 'مغلقة'}
              </button>
            ))}
          </div>
          <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-3 py-2">
            <Search size={14} className="text-[#8A8480]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث بالاسم أو البريد أو الموضوع..."
              className="flex-1 bg-transparent text-sm text-[#EDE8DF] font-tajawal outline-none placeholder:text-[#484542]"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#C9A86E]" size={32} />
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-20 text-[#8A8480] font-tajawal">
            <MessageCircle size={48} className="mx-auto mb-3 opacity-40" />
            لا توجد تذاكر دعم
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Tickets list */}
            <div className={`lg:col-span-5 xl:col-span-4 space-y-3 ${selected ? 'hidden lg:block' : ''}`}>
              {tickets.map(t => {
                const lastMsg = t.messages[t.messages.length - 1];
                const isOpen = t.status === 'OPEN';
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedId(t.id)}
                    className={`w-full text-right bg-[#0D0D0D] border rounded-xl p-4 transition hover:border-[#C9A86E]/40 ${
                      selectedId === t.id ? 'border-[#C9A86E]/50 shadow-lg shadow-[#C9A86E]/10' : 'border-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {isOpen ? (
                          <Circle size={10} className="text-[#C9A86E] fill-[#C9A86E]" />
                        ) : (
                          <CheckCircle2 size={12} className="text-[#484542]" />
                        )}
                        <span className="font-tajawal font-bold text-sm text-[#EDE8DF]">{t.userName}</span>
                      </div>
                      <span className="text-[10px] text-[#484542] font-tajawal">{formatDate(t.createdAt)}</span>
                    </div>
                    <p className="text-xs font-tajawal text-[#C9A86E] mb-1 truncate">{t.subject}</p>
                    {lastMsg && (
                      <p className="text-[11px] font-tajawal text-[#8A8480] truncate">
                        {lastMsg.sender === 'ADMIN' ? '↩️ أنت: ' : ''}{lastMsg.text}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 mt-2">
                      <Mail size={10} className="text-[#484542]" />
                      <span className="text-[10px] text-[#484542] font-tajawal truncate">{t.userEmail}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Chat panel */}
            {selected ? (
              <div className="lg:col-span-7 xl:col-span-8 bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
                {/* Chat header */}
                <div className="flex items-center justify-between p-4 border-b border-[#1A1A1A]">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedId(null)} className="lg:hidden text-[#8A8480]">
                      <X size={18} />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-tajawal font-bold text-sm text-[#EDE8DF]">{selected.userName}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-tajawal ${
                          selected.status === 'OPEN' ? 'bg-[#C9A86E]/15 text-[#C9A86E]' : 'bg-[#1A1A1A] text-[#484542]'
                        }`}>
                          {selected.status === 'OPEN' ? 'مفتوحة' : 'مغلقة'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Mail size={11} className="text-[#484542]" />
                        <span className="text-[11px] text-[#484542] font-tajawal">{selected.userEmail}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(selected)}
                      className="text-[11px] font-tajawal bg-[#1A1A1A] text-[#8A8480] hover:text-[#EDE8DF] px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                    >
                      {selected.status === 'OPEN' ? <><CheckCircle2 size={12} /> إغلاق</> : <><Circle size={12} /> إعادة فتح</>}
                    </button>
                    <button
                      onClick={() => deleteTicket(selected)}
                      className="text-[#D07070] hover:text-[#FF9090] p-1.5 rounded-lg transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Subject */}
                <div className="px-4 py-2 bg-[#070707] border-b border-[#1A1A1A]">
                  <p className="text-xs font-tajawal text-[#8A8480]">
                    <span className="text-[#C9A86E]">الموضوع:</span> {selected.subject}
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {selected.messages.map(m => (
                    <div key={m.id} className={`flex ${m.sender === 'ADMIN' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        m.sender === 'ADMIN'
                          ? 'bg-gradient-to-l from-[#C9A86E] to-[#9A7848] text-[#070707] rounded-bl-sm'
                          : 'bg-[#1A1A1A] text-[#EDE8DF] rounded-br-sm'
                      }`}>
                        <p className="text-sm font-tajawal whitespace-pre-wrap break-words">{m.text}</p>
                        <p className={`text-[10px] mt-1 font-tajawal flex items-center gap-1 ${m.sender === 'ADMIN' ? 'text-[#070707]/60' : 'text-[#484542]'}`}>
                          <Clock size={9} />
                          {formatTime(m.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply box */}
                {selected.status === 'OPEN' ? (
                  <div className="p-4 border-t border-[#1A1A1A]">
                    <div className="flex items-center gap-2 bg-[#070707] border border-[#1A1A1A] rounded-xl p-2 focus-within:border-[#C9A86E]/50 transition">
                      <input
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') sendReply(); }}
                        placeholder="اكتب ردك هنا..."
                        className="flex-1 bg-transparent text-sm text-[#EDE8DF] font-tajawal outline-none placeholder:text-[#484542]"
                      />
                      <button
                        onClick={sendReply}
                        disabled={sending || !replyText.trim()}
                        className="bg-gradient-to-l from-[#C9A86E] to-[#9A7848] text-[#070707] p-2 rounded-lg hover:opacity-90 transition disabled:opacity-40"
                      >
                        {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border-t border-[#1A1A1A] text-center">
                    <p className="text-xs font-tajawal text-[#484542]">هذه التذكرة مغلقة. اضغط "إعادة فتح" للرد.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex lg:col-span-7 xl:col-span-8 items-center justify-center">
                <div className="text-center text-[#484542] font-tajawal">
                  <MessageCircle size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">اختر تذكرة لعرض المحادثة</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'الآن';
    if (diff < 3600000) return `قبل ${Math.floor(diff / 60000)} دقيقة`;
    if (diff < 86400000) return `قبل ${Math.floor(diff / 3600000)} ساعة`;
    if (diff < 604800000) return `قبل ${Math.floor(diff / 86400000)} يوم`;
    return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
  } catch {
    return '';
  }
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}
