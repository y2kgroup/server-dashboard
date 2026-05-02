import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (data.session) {
          // Check if user has role metadata, if not set default
          const user = data.session.user;
          if (!user.user_metadata?.role) {
            // Set default role for new users
            await supabase.auth.updateUser({
              data: { role: 'user' }
            });
          }
        }

        navigate('/', { replace: true });
      } catch (error) {
        console.error('Error handling auth callback:', error);
        navigate('/?error=auth_failed', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '18px',
      color: '#64748b'
    }}>
      Signing you in...
    </div>
  );
};

export default AuthCallback;