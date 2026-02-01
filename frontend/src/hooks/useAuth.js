import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, token, loading, initialized } = useSelector((state) => state.auth);
  return {
    user,
    token,
    loading,
    initialized,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
  };
};
