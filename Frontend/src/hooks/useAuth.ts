import { useAuthContext } from '../contexts/AuthContexts';

export const useAuth = () => {
  return useAuthContext();
};