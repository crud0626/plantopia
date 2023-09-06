import { auth } from '@/firebaseApp';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [user, setUser] = useState<User>();
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/login');
        return;
      }

      setUser(user);
    });
  }, []);

  return user;
};

export default useAuth;
