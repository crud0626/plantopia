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
  createUserWithEmailAndPassword,
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
  // signInWithEmailAndPassword메소드로 인해 auth.currentUser가 변경될 수 있어
  // const user = auth.currentUser 형식 사용 불가
  if (!auth.currentUser) return;

  const updatedUserInfo: Mutable<Partial<User>> = {
    displayName: nickname,
  };

  if (imgUrl) updatedUserInfo.photoURL = imgUrl;

  if (auth.currentUser.email && !auth.currentUser.emailVerified) {
    await signInWithEmailAndPassword(auth, auth.currentUser.email, pw);
  }

  return updateProfile(auth.currentUser, updatedUserInfo);
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

export const signUpUser = (email: string, pw: string, nickname: string) => {
  return createUserWithEmailAndPassword(auth, email, pw).then(() =>
    updateUserInfo(pw, nickname),
  );
};
