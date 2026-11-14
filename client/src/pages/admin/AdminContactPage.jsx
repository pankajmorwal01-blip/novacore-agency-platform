import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Loader2,
  Save
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../services/api';

const statusOptions = ['all', 'new', 'contacted', 'converted', 'archived'];

const AdminContactPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [editStatus, setEditStatus] = useState('new');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams();
      if (statusFilter !== 'all') query.append('status', statusFilter);
      if (search) query.append('search', search);

      const res = await api.get(`/admin/contact?${query.toString()}`);
      if (res.data.success) {
        setInquiries(res.data.inquiries);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve contact inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInquiries();
  };

  const openInquiryModal = (inq) => {
    setSelectedInquiry(inq);
    setEditStatus(inq.status);
    setAdminNotes(inq.adminNotes || '');
  };

  const handleUpdateInquiry = async (e) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    setSaving(true);

    try {
      const res = await api.patch(`/admin/contact/${selectedInquiry._id}`, {
        status: editStatus,
        adminNotes,
      });

      if (res.data.success) {
        setInquiries(
          inquiries.map((item) =>
            item._id === selectedInquiry._id ? res.data.inquiry : item
          )
        );
        setSelectedInquiry(null);
      }
    } catch (err) {
      alert(err.message || 'Failed to update inquiry.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono text-accent uppercase tracking-wider mb-1 font-semibold">
          INBOUND LEADS
        </div>
        <h1 className="font-serif text-3xl font-normal text-slate-900 tracking-tight">
          Contact Form Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review, triage, and follow up with public inquiries and consulting prospects.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft">
        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or message..."
            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent"
          />
        </form>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          {statusOptions.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-accent text-white shadow-pill'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {st === 'all' ? 'All Inquiries' : st.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiry List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-accent mb-3" />
          <span className="text-xs font-mono">LOADING INBOUND INQUIRIES...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
          {error}
        </div>
      ) : inquiries.length === 0 ? (
        <div className="py-16 text-center bg-white border border-slate-200 rounded-3xl p-8 shadow-soft">
          <Inbox className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 mb-1">No Inquiries Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            No submissions match the current status filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq._id}
              onClick={() => openInquiryModal(inq)}
              className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-5 cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-soft hover:shadow-card-hover group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-900 group-hover:text-accent transition-colors">
                    {inq.name}
                  </span>
                  <StatusBadge status={inq.status} />
                  <span className="text-xs font-mono text-slate-400">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  "{inq.message}"
                </p>

                <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-400">
                  <span>Email: <strong className="text-slate-800">{inq.email}</strong></span>
                  {inq.company && <span>Company: <strong className="text-slate-800">{inq.company}</strong></span>}
                  <span>Service: <strong className="text-slate-800">{inq.serviceCategory}</strong></span>
                </div>
              </div>

              <div className="shrink-0">
                <span className="px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 group-hover:border-slate-300">
                  Inspect & Reply
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-serif text-xl font-normal text-slate-900">{selectedInquiry.name}</h3>
                <p className="text-xs text-slate-500">{selectedInquiry.email}</p>
              </div>
              <StatusBadge status={selectedInquiry.status} />
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">COMPANY</span>
                  <span className="text-slate-900 font-medium">{selectedInquiry.company || 'Not Specified'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">PHONE</span>
                  <span className="text-slate-900 font-medium">{selectedInquiry.phone || 'None'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">BUDGET</span>
                  <span className="text-accent font-semibold">{selectedInquiry.budget}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">TIMELINE</span>
                  <span className="text-slate-900 font-medium">{selectedInquiry.timeline}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Message Content
                </label>
                <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message}
                </p>
              </div>
            </div>

            {/* Status & Notes form */}
            <form onSubmit={handleUpdateInquiry} className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inquiry Triage Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-accent"
                >
                  <option value="new">NEW (Unread)</option>
                  <option value="contacted">CONTACTED (Follow-up sent)</option>
                  <option value="converted">CONVERTED (Moved to project request)</option>
                  <option value="archived">ARCHIVED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admin Internal Notes
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record call outcome, proposal status, or next steps..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="px-5 py-2 rounded-full bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-full bg-accent text-white text-xs font-semibold shadow-pill flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Updating...' : 'Save Status'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactPage;
