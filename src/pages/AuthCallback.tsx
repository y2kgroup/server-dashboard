import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Let Supabase handle the OAuth callback from URL parameters
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          navigate('/login?error=auth_failed', { replace: true });
          return;
        }

        if (data.session) {
          // Check if user has role metadata, if not set default
          const user = data.session.user;
          if (!user.user_metadata?.role) {
            // Set default role for new users
            await supabase.auth.updateUser({
              data: { role: 'user' }
            });
          }

          // Successfully authenticated, redirect to dashboard
          navigate('/', { replace: true });
        } else {
          // No session found, redirect to login
          navigate('/login?error=no_session', { replace: true });
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        navigate('/login?error=callback_failed', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      fontSize: '18px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '16px'
        }}>⚡</div>
        <div style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1e293b',
          marginBottom: '8px'
        }}>Y2K Group</div>
        <div style={{
          fontSize: '14px',
          color: '#64748b',
          marginBottom: '24px'
        }}>Server Management Dashboard</div>
        <div style={{
          fontSize: '16px',
          color: '#64748b'
        }}>
          Signing you in...
        </div>
        <div style={{
          marginTop: '16px',
          fontSize: '12px',
          color: '#94a3b8'
        }}>
          Please wait while we authenticate your account
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;