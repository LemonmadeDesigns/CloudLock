import { useState, useEffect } from 'react';
import { 
  DoorClosedIcon as LockClosedIcon, 
  PlusIcon, 
  LogOutIcon, 
  ShoppingCartIcon, 
  AlertTriangleIcon,
  MoonIcon,
  SunIcon,
  MonitorIcon,
  WifiOffIcon
} from 'lucide-react';
import { supabase, setupReconnection } from './lib/supabase';
import { Auth } from './components/Auth';
import { User } from '@supabase/supabase-js';
import { PasswordStrengthMeter } from './components/PasswordStrengthMeter';
import { PasswordCard } from './components/PasswordCard';
import { Tutorial } from './components/Tutorial';
import { SelfDestruct } from './components/SelfDestruct';
import { SearchBar } from './components/SearchBar';
import { QuickActions } from './components/QuickActions';
import { useTheme } from './utils/theme';
import type { Theme } from './utils/theme';
import type { Database } from './types/supabase';

type PasswordEntry = Database['public']['Tables']['passwords']['Row'];

function App() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [filteredPasswords, setFilteredPasswords] = useState<PasswordEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState<PasswordEntry | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSelfDestruct, setShowSelfDestruct] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const { theme, setTheme } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: ''
  });

  useEffect(() => {
    const cleanup = setupReconnection(setConnectionError);
    return () => cleanup();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const hasSeenTutorial = localStorage.getItem(`tutorial_seen_${session.user.id}`);
        if (!hasSeenTutorial) {
          setShowTutorial(true);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchPasswords();
    }
  }, [user]);

  const handleCloseTutorial = () => {
    if (user) {
      localStorage.setItem(`tutorial_seen_${user.id}`, 'true');
    }
    setShowTutorial(false);
  };

  const fetchPasswords = async () => {
    try {
      const { data, error } = await supabase
        .from('passwords')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPasswords(data || []);
      setFilteredPasswords(data || []);
    } catch (error) {
      console.error('Error fetching passwords:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedPassword) {
        const { error } = await supabase
          .from('passwords')
          .update(formData)
          .eq('id', selectedPassword.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('passwords')
          .insert([{ ...formData, user_id: user?.id }]);
        if (error) throw error;
      }
      
      setShowAddModal(false);
      setSelectedPassword(null);
      setFormData({ title: '', username: '', password: '', url: '', notes: '' });
      fetchPasswords();
    } catch (error) {
      console.error('Error saving password:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('passwords')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchPasswords();
    } catch (error) {
      console.error('Error deleting password:', error);
    }
  };

  const handleEdit = (password: PasswordEntry) => {
    setSelectedPassword(password);
    setFormData({
      title: password.title,
      username: password.username,
      password: password.password,
      url: password.url || '',
      notes: password.notes || ''
    });
    setShowAddModal(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleAddAmazon = () => {
    setSelectedPassword(null);
    setFormData({
      title: 'Amazon',
      username: '',
      password: '',
      url: 'https://www.amazon.com',
      notes: 'Amazon account credentials'
    });
    setShowAddModal(true);
  };

  const handleOpenUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredPasswords(passwords);
      return;
    }

    const filtered = passwords.filter(password => 
      password.title.toLowerCase().includes(query.toLowerCase()) ||
      password.username.toLowerCase().includes(query.toLowerCase()) ||
      password.url?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPasswords(filtered);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleSelfDestruct = () => {
    setShowSelfDestruct(true);
  };

  const handleSelfDestructComplete = async () => {
    setShowSelfDestruct(false);
    await handleSignOut();
  };

  const quickActions = [
    {
      icon: PlusIcon,
      label: 'Add Password',
      onClick: () => {
        setSelectedPassword(null);
        setFormData({ title: '', username: '', password: '', url: '', notes: '' });
        setShowAddModal(true);
      },
      variant: 'primary' as const
    },
    {
      icon: ShoppingCartIcon,
      label: 'Add Amazon',
      onClick: handleAddAmazon,
      variant: 'secondary' as const,
      hidden: passwords.some(p => p.url?.includes('amazon.com'))
    },
    {
      icon: AlertTriangleIcon,
      label: 'Self-Destruct',
      onClick: handleSelfDestruct,
      variant: 'danger' as const
    }
  ].filter(action => !action.hidden);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {connectionError && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white py-2 px-4 flex items-center justify-center z-50">
          <WifiOffIcon className="w-5 h-5 mr-2" />
          <span>Connection lost. Retrying...</span>
        </div>
      )}
      
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <LockClosedIcon className="h-8 w-8 text-primary-600 dark:text-primary-500" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">CloudLock</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">AI-Secured Password Manager</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`p-2 rounded-md ${
                    theme === 'light' 
                      ? 'bg-white dark:bg-gray-600 shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <SunIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleThemeChange('system')}
                  className={`p-2 rounded-md ${
                    theme === 'system'
                      ? 'bg-white dark:bg-gray-600 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <MonitorIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`p-2 rounded-md ${
                    theme === 'dark'
                      ? 'bg-white dark:bg-gray-600 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <MoonIcon className="h-5 w-5" />
                </button>
              </div>

              <button
                onClick={handleSignOut}
                className="btn-secondary"
              >
                <LogOutIcon className="h-5 w-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} />
            </div>
            <QuickActions actions={quickActions} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {passwords.length === 0 ? (
            <div className="card p-8 flex flex-col items-center justify-center">
              <LockClosedIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2 text-center">Your vault is empty</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm text-center">Add passwords to get started</p>
              <button
                onClick={() => setShowTutorial(true)}
                className="mt-4 btn-secondary"
              >
                Show Tutorial
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPasswords.map((entry) => (
                <PasswordCard
                  key={entry.id}
                  entry={entry}
                  onEdit={() => handleEdit(entry)}
                  onDelete={() => handleDelete(entry.id)}
                  onOpenUrl={entry.url ? () => handleOpenUrl(entry.url!) : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {selectedPassword ? 'Edit Password' : 'Add New Password'}
                </h3>
                <div className="mt-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent sm:text-sm"
                      />
                      <PasswordStrengthMeter password={formData.password} />
                    </div>
                    <div>
                      <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        URL (optional)
                      </label>
                      <input
                        type="url"
                        name="url"
                        id="url"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Notes (optional)
                      </label>
                      <textarea
                        name="notes"
                        id="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent sm:text-sm"
                      />
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        {selectedPassword ? 'Update' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTutorial && <Tutorial onClose={handleCloseTutorial} />}
      {showSelfDestruct && (
        <SelfDestruct
          onClose={() => setShowSelfDestruct(false)}
          onComplete={handleSelfDestructComplete}
        />
      )}
    </div>
  );
}

export default App;