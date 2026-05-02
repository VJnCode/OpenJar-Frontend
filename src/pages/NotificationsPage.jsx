import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { testTemplate } from '../services/notificationService';
import Button from '../components/Button';

const MOCK_NOTIFS = [
  { id: 1, type: 'like',    text: 'Someone liked your recipe',          time: '2m ago',  read: false },
  { id: 2, type: 'comment', text: 'New comment on your recipe',         time: '1h ago',  read: false },
  { id: 3, type: 'follow',  text: 'A new user started following you',   time: '3h ago',  read: true  },
  { id: 4, type: 'system',  text: 'Welcome to OpenJar! Start sharing.', time: '1d ago',  read: true  },
];

const ICONS = {
  like:    { bg: 'bg-red-50',    icon: '❤️' },
  comment: { bg: 'bg-blue-50',   icon: '💬' },
  follow:  { bg: 'bg-green-50',  icon: '👤' },
  system:  { bg: 'bg-orange-50', icon: '🔔' },
};

const INPUT = 'px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C8472B]/30 focus:border-[#C8472B] transition-all';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifs,   setNotifs]   = useState(MOCK_NOTIFS);
  const [testing,  setTesting]  = useState(false);
  const [testMsg,  setTestMsg]  = useState('');
  const [testForm, setTestForm] = useState({
    email: user?.userEmail || '', subject: 'Test Notification', body: 'Hello from OpenJar!',
  });

  const unread  = notifs.filter(n => !n.read).length;
  const markAll = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const markOne = (id) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));

  const handleTest = async (e) => {
    e.preventDefault();
    setTesting(true); setTestMsg('');
    try {
      await testTemplate(testForm);
      setTestMsg('✅ Test notification sent successfully!');
    } catch (err) {
      setTestMsg(`❌ ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="flex-1 bg-[#F8F7F4]">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex items-center justify-between">
          <div>
            <span className="text-[#C8472B] text-xs font-bold tracking-widest uppercase">Activity</span>
            <h1 className="font-display text-4xl font-bold text-gray-900 mt-1">Notifications</h1>
            {unread > 0 && <p className="text-gray-500 mt-1">{unread} unread</p>}
          </div>
          {unread > 0 && (
            <button onClick={markAll} className="text-sm text-[#C8472B] font-semibold hover:underline">
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* Feed */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {notifs.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">🔔</div>
              <p className="text-gray-500 font-medium">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {notifs.map(n => {
                const meta = ICONS[n.type] || ICONS.system;
                return (
                  <div key={n.id} onClick={() => markOne(n.id)}
                    className={`flex items-start gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${!n.read ? 'bg-orange-50/30' : ''}`}>
                    <div className={`w-10 h-10 rounded-full ${meta.bg} flex items-center justify-center flex-shrink-0 text-lg`}>
                      {meta.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-relaxed ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                        {n.text}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-[#C8472B] flex-shrink-0 mt-2" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Test panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-1">Test Notification Service</h2>
          <p className="text-gray-400 text-sm mb-5">Send a test via the backend notification service.</p>
          <form onSubmit={handleTest} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Email</label>
                <input type="email" value={testForm.email} placeholder="recipient@email.com" required
                  onChange={e => setTestForm(f => ({ ...f, email: e.target.value }))}
                  className={INPUT} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Subject</label>
                <input type="text" value={testForm.subject} placeholder="Subject" required
                  onChange={e => setTestForm(f => ({ ...f, subject: e.target.value }))}
                  className={INPUT} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Message</label>
              <textarea value={testForm.body} rows={3} placeholder="Message..." required
                onChange={e => setTestForm(f => ({ ...f, body: e.target.value }))}
                className={`${INPUT} resize-none`} />
            </div>
            {testMsg && (
              <p className={`text-sm px-4 py-2.5 rounded-xl ${testMsg.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                {testMsg}
              </p>
            )}
            <div>
              <Button type="submit" loading={testing}>Send Test Notification</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
