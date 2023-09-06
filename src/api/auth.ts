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
} from 'firebase/auth';

type Writable<T> = {
  -readonly [K in keyof T]: T[K];
};

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

// 유저 정보 수정 로직 추가
// 테스트 계정으로하면 안 바뀌나?
export const updateUserInfo = async (
  pw: string,
  nickname: string,
  imgUrl: string | null,
) => {
  const user = auth.currentUser;
  if (!user?.email) return;

  const updatedUserInfo: Writable<Partial<User>> = {
    displayName: nickname,
  };

  if (imgUrl) updatedUserInfo.photoURL = imgUrl;
  // 테스트 계정인 경우
  if (!user.emailVerified) {
    await signInWithEmailAndPassword(auth, user?.email, pw);
  }

  return updateProfile(user, updatedUserInfo);
};
