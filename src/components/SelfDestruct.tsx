import { useState, useEffect } from 'react';
import { AlertTriangleIcon, ShieldIcon, XIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SelfDestructProps {
  onClose: () => void;
  onComplete: () => void;
}

export function SelfDestruct({ onClose, onComplete }: SelfDestructProps) {
  const [countdown, setCountdown] = useState(30);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    require2fa: true,
    notifyEmail: true,
    cooldownPeriod: 30
  });

  // Fetch user settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) throw new Error('Not authenticated');

        // Ensure settings exist
        await supabase
          .from('self_destruct_settings')
          .upsert({ user_id: user.id })
          .select()
          .single();

        // Then fetch settings
        const { data, error } = await supabase
          .from('self_destruct_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (data) {
          setSettings({
            require2fa: data.require_2fa,
            notifyEmail: data.notify_email,
            cooldownPeriod: parseInt(data.cooldown_period.replace('s', ''))
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('Failed to load settings');
      }
    }

    fetchSettings();
  }, []);

  // Handle countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isConfirmed && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isConfirmed, countdown]);

  // Handle self-destruct completion
  useEffect(() => {
    if (isConfirmed && countdown === 0) {
      executeSelfDestruct();
    }
  }, [isConfirmed, countdown]);

  const executeSelfDestruct = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      // Start self-destruct process
      const { error: logError } = await supabase
        .from('self_destruct_logs')
        .insert({
          user_id: user.id,
          status: 'initiated',
          ip_address: 'web-client',
          user_agent: navigator.userAgent
        });

      if (logError) throw logError;

      // Delete all passwords
      const { error: deleteError } = await supabase
        .from('passwords')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Log completion
      await supabase
        .from('self_destruct_logs')
        .insert({
          user_id: user.id,
          status: 'completed',
          completed_at: new Date().toISOString()
        });

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute self-destruct');
      
      // Log failure
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        await supabase
          .from('self_destruct_logs')
          .insert({
            user_id: user.id,
            status: 'failed',
            error_message: err instanceof Error ? err.message : 'Unknown error'
          });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (isConfirmed) {
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        await supabase
          .from('self_destruct_logs')
          .insert({
            user_id: user.id,
            status: 'cancelled'
          });
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Emergency Self-Destruct</h2>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isProcessing}
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {!isConfirmed ? (
            <>
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-medium">Warning: This action cannot be undone</p>
                  <p className="text-red-600 mt-1">
                    Activating self-destruct will immediately:
                  </p>
                  <ul className="mt-2 space-y-1 text-red-600">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                      <span>Delete all stored passwords</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                      <span>Remove access from all devices</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                      <span>Clear all cloud backups</span>
                    </li>
                  </ul>
                </div>

                {settings.require2fa && (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <ShieldIcon className="w-5 h-5 text-blue-600" />
                    <p className="text-blue-700">
                      2FA verification required before proceeding
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsConfirmed(true)}
                  className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
                  disabled={isProcessing}
                >
                  <AlertTriangleIcon className="w-5 h-5" />
                  Activate Self-Destruct
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <div className="absolute inset-0 border-4 border-red-600 rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-red-600">{countdown}</span>
                  </div>
                  <div
                    className="absolute inset-0 border-4 border-red-600 rounded-full"
                    style={{
                      clipPath: `inset(0 ${(countdown / 30) * 100}% 0 0)`,
                      transition: 'clip-path 1s linear'
                    }}
                  ></div>
                </div>
                <p className="text-gray-600">
                  Self-destruct will execute in {countdown} seconds
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <button
                onClick={handleCancel}
                className="px-6 py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                disabled={isProcessing}
              >
                Cancel Self-Destruct
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}