import React, { useState, useEffect } from 'react';
import { Mail, Save, Send, CheckCircle, AlertCircle, Settings, Bell, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ADMIN_PASSWORD = 'Adrianbar1?';

interface EmailSettings {
  adminEmail: string;
  notificationsEnabled: boolean;
}

// FIX (16 Aug 2026): two separate problems fixed here.
//
// 1. Persistence — this previously saved only to
//    localStorage['poppas-email-settings'], so changes never reached the
//    live site. Rewired to site_settings (same pattern as HeroEditor), via
//    /api/admin-site-settings. send-low-stock-email.js now reads
//    email_settings.adminEmail from the same row, so this setting actually
//    controls where real low-stock alerts go.
//
// 2. Test Email — previously posted to a Formspree endpoint entirely
//    unrelated to the real order-notification system (which uses Resend).
//    A successful or failed test told you nothing about whether real
//    emails work. "Send Test Email" now sends a real test through
//    /api/send-low-stock-email, the actual endpoint used for live low-stock
//    alerts — a genuine end-to-end test of the real pipeline.
//
// KNOWN GAP: order-confirmation emails go through a separate endpoint
// (send-order-email.js) that wasn't available to update here — it may
// still have its own hardcoded recipient. Worth checking separately if
// you want the adminEmail setting to control that too.
const EmailManager: React.FC = () => {
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    adminEmail: 'poppas.wooden.creations@gmail.com',
    notificationsEnabled: true,
  });

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadEmailSettings();
  }, []);

  const loadEmailSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error loading email settings from Supabase:', error);
        return;
      }

      if (data) {
        setSettingsId(data.id);
        const stored = data.email_settings;
        if (stored && typeof stored === 'object') {
          setEmailSettings({
            adminEmail: stored.adminEmail || 'poppas.wooden.creations@gmail.com',
            notificationsEnabled: stored.notificationsEnabled ?? true,
          });
          console.log('📧 Loaded email settings from Supabase');
        }
      }
    } catch (error) {
      console.error('Error loading email settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus('idle');
    setMessage('');
    try {
      if (!settingsId) {
        throw new Error('Missing site_settings row id — try refreshing the page.');
      }
      const res = await fetch('/api/admin-site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: ADMIN_PASSWORD,
          action: 'update',
          id: settingsId,
          updates: { email_settings: emailSettings },
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to save email settings');

      console.log('💾 Email settings saved to Supabase:', emailSettings);
      setStatus('success');
      setMessage('Email settings saved! Low-stock alerts will now be sent to ' + emailSettings.adminEmail);
    } catch (error) {
      console.error('❌ Failed to save email settings:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to save email settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    setSending(true);
    setStatus('idle');
    setMessage('');

    try {
      // Sends a real test through the actual low-stock alert pipeline
      // (Resend), addressed to whichever email is currently saved in
      // site_settings — a genuine test of the real system, not a
      // disconnected legacy form service.
      const res = await fetch('/api/send-low-stock-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: [{ id: 'test-product', name: '🧪 Test Product (Email Manager test)', stock_quantity: 0 }],
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && !data.error) {
        setStatus('success');
        setMessage(`✅ Test alert sent through the real notification system to ${emailSettings.adminEmail}! Check your inbox.`);
      } else {
        throw new Error(data.error || `Request failed (${res.status})`);
      }
    } catch (error) {
      console.error('❌ Test email failed:', error);
      setStatus('error');
      setMessage(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="animate-spin mr-2" size={20} />
        <span>Loading email settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
          <Mail className="mr-3 text-blue-600" size={28} />
          Email Manager
        </h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <strong>Note:</strong> this controls where <em>low-stock alert</em> emails go. Order-confirmation
        emails are sent through a separate part of the system and aren't controlled by this setting.
      </div>

      {/* Status Message */}
      {status !== 'idle' && (
        <div className={`p-4 rounded-lg flex items-start space-x-3 ${
          status === 'success' ? 'bg-green-50 border border-green-200' :
          'bg-red-50 border border-red-200'
        }`}>
          {status === 'success' ? (
            <CheckCircle className="text-green-500 mt-0.5" size={20} />
          ) : (
            <AlertCircle className="text-red-500 mt-0.5" size={20} />
          )}
          <div className={`text-sm ${
            status === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            <p className="font-medium">{status === 'success' ? 'Success!' : 'Error'}</p>
            <p>{message}</p>
          </div>
        </div>
      )}

      {/* Email Configuration */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="mr-2 text-gray-600" size={20} />
          Low-Stock Alert Configuration
        </h4>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Email Address *
            </label>
            <input
              type="email"
              value={emailSettings.adminEmail}
              onChange={(e) => setEmailSettings({ ...emailSettings, adminEmail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="your-email@example.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              This email will receive low-stock alerts
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="notificationsEnabled"
              checked={emailSettings.notificationsEnabled}
              onChange={(e) => setEmailSettings({ ...emailSettings, notificationsEnabled: e.target.checked })}
              className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
            />
            <label htmlFor="notificationsEnabled" className="text-sm font-medium text-gray-700">
              Enable low-stock email alerts
            </label>
          </div>
        </div>
      </div>

      {/* Test Email */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Send className="mr-2 text-green-600" size={20} />
          Test the Real Notification System
        </h4>

        <p className="text-gray-600 mb-4">
          Sends a real test alert through the actual Resend pipeline used for live low-stock notifications.
        </p>

        <button
          onClick={handleTestEmail}
          disabled={sending || !emailSettings.adminEmail}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {sending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Sending Test Alert...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Send Test Alert to {emailSettings.adminEmail}</span>
            </>
          )}
        </button>
      </div>

      {/* Current Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          <Bell className="mr-2" size={20} />
          Current Setup
        </h4>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>Admin Email:</strong> {emailSettings.adminEmail}</p>
          <p><strong>Low-Stock Alerts:</strong> {emailSettings.notificationsEnabled ? '✅ Enabled' : '❌ Disabled'}</p>
        </div>
      </div>
    </div>
  );
};

export default EmailManager;
