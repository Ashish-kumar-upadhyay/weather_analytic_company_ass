import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { supabase } from '../services/supabase';
import { googleLogin } from '../store/slices/authSlice';
import Loader from '../components/common/Loader';

const AuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          navigate('/login');
          return;
        }

        const result = await dispatch(googleLogin(session.access_token));
        if (googleLogin.fulfilled.match(result)) {
          navigate('/');
        } else {
          navigate('/login');
        }
      } catch (err) {
        navigate('/login');
      }
    };

    handleCallback();
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader size="lg" text="Completing login..." />
    </div>
  );
};

export default AuthCallback;
