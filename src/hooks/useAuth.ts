import { useEffect, useState } from 'react';
import { auth } from '@/firebaseApp';
import { User } from 'firebase/auth';
import paths from '@/constants/routePath';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const [user, setUser] = useState<User>();
  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (!user) {
        router.push(paths.login);
        return;
      }

      setUser(user);
    });
  }, []);

  return user;
};

export default useAuth;
