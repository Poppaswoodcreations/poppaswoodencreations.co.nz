import React, { useState, useEffect } from 'react';
import { Lock, RefreshCw, Trash2, Mail, Phone, Ruler, TreePine, Package } from 'lucide-react';

type Order = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  product_type: string | null;
  wood_type: string | null;
  size_preset: string | null;
  length_cm: number | null;
  width_cm: number | null;
  height_cm: number | null;
  finish: string | null;
  quantity: number | null;
  details: string | null;
  status: string;
  admin_notes: string | null;
};

const STATUS_OPTIONS = ['new', 'quoted', 'in_progress', 'completed', 'cancelled'];

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-amber-100 text-amber-800 border-amber-300',
  quoted: 'bg-blue-100 text-blue-800 border-blue-300',
  in_progress: 'bg-purple-100 text-purple-800 border-purple-300',
  completed: 'bg-green-100 text-green-800 border-green-300',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-300',
};

const AdminCustomOrders: React.FC = () => {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

  const callApi = async (payload: Record<string, unknown>) => {
    const res = await fetch('/api/admin-custom-orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, ...payload }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await callApi({ action: 'list' });
      setOrders(data.orders || []);
      setAuthed(true);
      setAuthError('');
      localStorage.setItem('poppaAdminPassword', password);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Login failed');
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (id: string, updates: { status?: string; adminNotes?: string }) => {
    await callApi({ action: 'update', id, updates });
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, ...(updates.status ? { status: updates.status } : {}), ...(updates.adminNotes !== undefined ? { admin_notes: updates.adminNotes } : {}) } : o)));
  };

  const deleteOrder = async (id: string) => {
    if (!confirm('Delete this custom order permanently?')) return;
    await callApi({ action: 'delete', id });
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  useEffect(() => {
    if (authed) fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-login if this browser already logged in on the main admin page
  useEffect(() => {
    const saved = localStorage.getItem('poppaAdminPassword');
    if (saved) {
      setPassword(saved);
      callApi({ action: 'list', password: saved })
        .then((data) => {
          setOrders(data.orders || []);
          setAuthed(true);
        })
        .catch(() => {
          // Saved password no longer valid — clear it and let them log in manually
          localStorage.removeItem('poppaAdminPassword');
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleOrders = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter);

  if (!authed) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
        <form
          onSubmit={(e) => { e.preventDefault(); fetchOrders(); }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-sm w-full"
        >
          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-amber-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 text-center mb-1">Custom Orders</h1>
          <p className="text-sm text-gray-500 text-center mb-6">Enter the admin password to view submissions.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent mb-3"
          />
          {authError && <p className="text-sm text-red-600 mb-3">{authError}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 disabled:bg-gray-300 transition-colors"
          >
            {loading ? 'Checking...' : 'View Orders'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2 uppercase tracking-widest">
              <TreePine size={12} /> Admin
            </div>
            <h1 className="text-2xl font-bold">Custom Orders</h1>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {['all', ...STATUS_OPTIONS].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                statusFilter === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
              }`}
            >
              {s === 'all' ? `All (${orders.length})` : `${s.replace('_', ' ')} (${orders.filter(o => o.status === s).length})`}
            </button>
          ))}
        </div>

        {visibleOrders.length === 0 && (
          <p className="text-center text-gray-400 py-16">No custom orders in this view.</p>
        )}

        <div className="space-y-4">
          {visibleOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{order.name}</p>
                  <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString('en-NZ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrder(order.id, { status: e.target.value })}
                    className={`text-xs font-semibold px-2 py-1.5 rounded-lg border ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-700 border-gray-300'}`}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                  <button onClick={() => deleteOrder(order.id)} className="text-gray-400 hover:text-red-600 transition-colors p-1.5">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600 mb-3">
                <p className="flex items-center gap-1.5"><Mail size={13} className="text-gray-400" /> <a href={`mailto:${order.email}`} className="text-amber-700 hover:underline">{order.email}</a></p>
                {order.phone && <p className="flex items-center gap-1.5"><Phone size={13} className="text-gray-400" /> {order.phone}</p>}
                <p className="flex items-center gap-1.5"><Package size={13} className="text-gray-400" /> {order.product_type || '—'} × {order.quantity || 1}</p>
                <p className="flex items-center gap-1.5"><TreePine size={13} className="text-gray-400" /> {order.wood_type || '—'} {order.finish ? `· ${order.finish}` : ''}</p>
                <p className="flex items-center gap-1.5 sm:col-span-2"><Ruler size={13} className="text-gray-400" />
                  {order.size_preset || '—'}
                  {(order.length_cm || order.width_cm || order.height_cm) &&
                    ` — ${[order.length_cm && `L:${order.length_cm}cm`, order.width_cm && `W:${order.width_cm}cm`, order.height_cm && `H:${order.height_cm}cm`].filter(Boolean).join(', ')}`}
                </p>
              </div>

              {order.details && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap mb-3 border-l-4 border-amber-400">
                  {order.details}
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={notesDraft[order.id] ?? order.admin_notes ?? ''}
                  onChange={(e) => setNotesDraft(prev => ({ ...prev, [order.id]: e.target.value }))}
                  placeholder="Internal notes (quote sent, timeframe, etc.)"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <button
                  onClick={() => updateOrder(order.id, { adminNotes: notesDraft[order.id] ?? order.admin_notes ?? '' })}
                  className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCustomOrders;
