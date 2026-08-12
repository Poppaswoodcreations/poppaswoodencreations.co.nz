import React, { useState, useEffect } from 'react';
import { Lock, RefreshCw, AlertTriangle, Printer, Download } from 'lucide-react';

type LowStockProduct = {
  id: string;
  name: string;
  stock_quantity: number;
  in_stock: boolean;
  category: string | null;
};

const AdminInventory: React.FC = () => {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [products, setProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(false);
  // Starts true so we never flash the password form while we're still
  // checking for an existing session from the main admin login.
  const [checkingSession, setCheckingSession] = useState(true);

  const callApi = async (payload: Record<string, unknown>) => {
    const res = await fetch('/api/admin-inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, ...payload }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  };

  const fetchLowStock = async () => {
    setLoading(true);
    try {
      const data = await callApi({ action: 'low-stock' });
      setProducts(data.products || []);
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

  // Auto-login using the same password already saved by the main admin
  // dashboard — no separate password prompt for Inventory specifically.
  useEffect(() => {
    const saved = localStorage.getItem('poppaAdminPassword');
    if (!saved) {
      setCheckingSession(false);
      return;
    }
    setPassword(saved);
    fetch('/api/admin-inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: saved, action: 'low-stock' }),
    })
      .then(async (res) => ({ ok: res.ok, data: await res.json() }))
      .then(({ ok, data }) => {
        if (ok) {
          setProducts(data.products || []);
          setAuthed(true);
        } else {
          localStorage.removeItem('poppaAdminPassword');
        }
      })
      .catch(() => localStorage.removeItem('poppaAdminPassword'))
      .finally(() => setCheckingSession(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadTextFile = () => {
    const dateLabel = new Date().toLocaleDateString('en-NZ');
    const lines = [
      "Poppa's Wooden Creations — Low Stock List",
      `Printed: ${dateLabel}`,
      '',
      ...(products.length
        ? products.map(p => `[ ] ${p.name}  —  ${p.stock_quantity} left`)
        : ['Nothing low right now.']),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `low-stock-${dateLabel.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Still checking localStorage for an existing session — render nothing
  // rather than a login form that would just flash and disappear.
  if (checkingSession) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
        <form
          onSubmit={(e) => { e.preventDefault(); fetchLowStock(); }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-sm w-full"
        >
          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-amber-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 text-center mb-1">Inventory</h1>
          <p className="text-sm text-gray-500 text-center mb-6">Enter the admin password to view stock levels.</p>
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
            {loading ? 'Checking...' : 'View Inventory'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-8 px-4 print:hidden">
        <div className="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2 uppercase tracking-widest">
              <AlertTriangle size={12} /> Low Stock
            </div>
            <h1 className="text-2xl font-bold">Inventory</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={fetchLowStock}
              disabled={loading}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Printer size={14} /> Print
            </button>
            <button
              onClick={downloadTextFile}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Download size={14} /> Download
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="hidden print:block mb-6">
          <h1 className="text-xl font-bold">Poppa's Wooden Creations — Low Stock List</h1>
          <p className="text-sm text-gray-500">Printed {new Date().toLocaleDateString('en-NZ')}</p>
        </div>

        {products.length === 0 && (
          <p className="text-center text-gray-400 py-16">Nothing's low right now — everything's above 1 in stock.</p>
        )}

        {products.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 print:border-0 print:rounded-none print:divide-gray-300">
            {products.map(p => (
              <div key={p.id} className="flex items-center justify-between px-5 py-4 print:py-2">
                <div className="flex items-center gap-3">
                  <span className="hidden print:inline text-lg">☐</span>
                  <div>
                    <p className="font-medium text-gray-900">{p.name}</p>
                    {p.category && <p className="text-xs text-gray-400 print:hidden">{p.category}</p>}
                  </div>
                </div>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  p.stock_quantity === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {p.stock_quantity} left
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInventory;
