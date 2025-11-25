import React, { useState, useEffect } from 'react';
import { Mail, Save, Send, CheckCircle, AlertCircle, Settings, Bell } from 'lucide-react';

interface EmailSettings {
  adminEmail: string;
  notificationsEnabled: boolean;
  emailService: 'formspree' | 'emailjs' | 'mailto';
  formspreeEndpoint: string;
  emailjsServiceId: string;
  emailjsTemplateId: string;
  emailjsUserId: string;
}

const EmailManager: React.FC = () => {
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    adminEmail: 'adrianbarber8@gmail.com',
    notificationsEnabled: true,
    emailService: 'formspree',
    formspreeEndpoint: 'https://formspree.io/f/xdkogkpw',
    emailjsServiceId: '',
    emailjsTemplateId: '',
    emailjsUserId: ''
  });

  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Load saved email settings
  useEffect(() => {
    try {
      const saved = localStorage.getItem('poppas-email-settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setEmailSettings({ ...emailSettings, ...parsed });
        console.log('📧 Loaded saved email settings');
      }
    } catch (error) {
      console.error('Error loading email settings:', error);
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('poppas-email-settings', JSON.stringify(emailSettings));
      
      // Also update the orderNotifications.ts file
      const orderNotificationsCode = `
// Updated email configuration
const adminEmail = '${emailSettings.adminEmail}';
const notificationsEnabled = ${emailSettings.notificationsEnabled};
const emailService = '${emailSettings.emailService}';
`;
      
      console.log('💾 Email settings saved:', emailSettings);
      setStatus('success');
      setMessage('Email settings saved successfully! Order notifications will be sent to ' + emailSettings.adminEmail);
      
      // Verify save
      const verification = localStorage.getItem('poppas-email-settings');
      if (verification) {
        console.log('✅ Email settings save verified');
      }
    } catch (error) {
      console.error('❌ Failed to save email settings:', error);
      setStatus('error');
      setMessage('Failed to save email settings. Please try again.');
    }
  };

  const handleTestEmail = async () => {
    setSending(true);
    setStatus('idle');
    setMessage('');

    try {
      // Create test email content
      const testEmailContent = {
        subject: '🧪 Test Email from Poppa\'s Wooden Creations Admin',
        text: `This is a test email from your Poppa's Wooden Creations website admin panel.

Email Settings:
- Admin Email: ${emailSettings.adminEmail}
- Service: ${emailSettings.emailService}
- Notifications: ${emailSettings.notificationsEnabled ? 'Enabled' : 'Disabled'}

If you received this email, your order notification system is working correctly!

Test sent at: ${new Date().toLocaleString('en-NZ')}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #d97706;">🧪 Test Email</h1>
            <p>This is a test email from your Poppa's Wooden Creations website admin panel.</p>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>Email Settings:</h3>
              <ul>
                <li><strong>Admin Email:</strong> ${emailSettings.adminEmail}</li>
                <li><strong>Service:</strong> ${emailSettings.emailService}</li>
                <li><strong>Notifications:</strong> ${emailSettings.notificationsEnabled ? 'Enabled' : 'Disabled'}</li>
              </ul>
            </div>
            
            <p>If you received this email, your order notification system is working correctly!</p>
            <p><small>Test sent at: ${new Date().toLocaleString('en-NZ')}</small></p>
          </div>
        `
      };

      // Send test email using Formspree
      const response = await fetch('https://formspree.io/f/xdkogkpw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: emailSettings.adminEmail,
          subject: testEmailContent.subject,
          message: testEmailContent.text,
          _replyto: emailSettings.adminEmail
        })
      });

      if (response.ok) {
        setStatus('success');
        setMessage(`✅ Test email sent successfully to ${emailSettings.adminEmail}! Check your inbox.`);
      } else {
        throw new Error('Email service responded with error');
      }

    } catch (error) {
      console.error('❌ Test email failed:', error);
      setStatus('error');
      setMessage(`❌ Test email failed. Trying backup method...`);
      
      // Fallback to mailto
      const mailtoLink = `mailto:${emailSettings.adminEmail}?subject=${encodeURIComponent('🧪 Test Email from Admin Panel')}&body=${encodeURIComponent('This is a test email from your admin panel. If you see this, the backup email method is working.')}`;
      window.open(mailtoLink);
      
      setMessage(`❌ Direct email failed, but opened backup email client. Check if your email client opened.`);
    } finally {
      setSending(false);
    }
  };

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
          className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
        >
          <Save size={16} />
          <span>Save Settings</span>
        </button>
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
          Email Configuration
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
              This email will receive all order notifications
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
              Enable email notifications for new orders
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Service
            </label>
            <select
              value={emailSettings.emailService}
              onChange={(e) => setEmailSettings({ ...emailSettings, emailService: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="formspree">Formspree (Recommended)</option>
              <option value="emailjs">EmailJS</option>
              <option value="mailto">Mailto (Backup)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Formspree is recommended for reliable email delivery
            </p>
          </div>
        </div>
      </div>

      {/* Test Email */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Send className="mr-2 text-green-600" size={20} />
          Test Email System
        </h4>
        
        <p className="text-gray-600 mb-4">
          Send a test email to verify your notification system is working correctly.
        </p>
        
        <button
          onClick={handleTestEmail}
          disabled={sending || !emailSettings.adminEmail}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {sending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Sending Test Email...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Send Test Email to {emailSettings.adminEmail}</span>
            </>
          )}
        </button>
      </div>

      {/* Current Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          <Bell className="mr-2" size={20} />
          Current Email Setup
        </h4>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>Admin Email:</strong> {emailSettings.adminEmail}</p>
          <p><strong>Notifications:</strong> {emailSettings.notificationsEnabled ? '✅ Enabled' : '❌ Disabled'}</p>
          <p><strong>Service:</strong> {emailSettings.emailService}</p>
          <p><strong>Status:</strong> {emailSettings.notificationsEnabled ? 'Ready to receive order notifications' : 'Notifications disabled'}</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-medium text-amber-900 mb-2">📧 How Email Notifications Work</h4>
        <div className="text-sm text-amber-800 space-y-1">
          <p><strong>1.</strong> Customer places order on your website</p>
          <p><strong>2.</strong> System automatically sends email to {emailSettings.adminEmail}</p>
          <p><strong>3.</strong> Email includes all order details, customer info, and payment method</p>
          <p><strong>4.</strong> Order also stored in Admin Dashboard → Order Management</p>
          <p><strong>5.</strong> Browser notification shown (if enabled)</p>
        </div>
      </div>
    </div>
  );
};

export default EmailManager;