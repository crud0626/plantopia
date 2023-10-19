import { Mutable } from '@/@types';
import { auth } from '@/firebaseApp';
import {
  GoogleAuthProvider,
  User,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';

export const loginWithEmail = async (
  email: string,
  pw: string,
  shouldRemember?: boolean,
) => {
  if (shouldRemember) {
    await setPersistence(auth, browserSessionPersistence);
  }

  return signInWithEmailAndPassword(auth, email, pw);
};

export const loginWithSocial = async (shouldRemember?: boolean) => {
  const provider = new GoogleAuthProvider();

  if (shouldRemember) {
    await setPersistence(auth, browserSessionPersistence);
  }

  return signInWithPopup(auth, provider);
};

export const logout = () => {
  return signOut(auth);
};

export const updateUserInfo = async (
  pw: string,
  nickname: string,
  imgUrl?: string | null,
) => {
  const user = auth.currentUser;
  if (!user?.email) return;

  const updatedUserInfo: Mutable<Partial<User>> = {
    displayName: nickname,
  };

  if (imgUrl) updatedUserInfo.photoURL = imgUrl;

  if (!user.emailVerified) {
    await signInWithEmailAndPassword(auth, user?.email, pw);
  }

  return updateProfile(user, updatedUserInfo);
};

export const deletionUser = () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('확인되지 않은 사용자입니다.');
  }

  return user.delete();
};

export const resetPassword = (email: string) =>
  sendPasswordResetEmail(auth, email);
