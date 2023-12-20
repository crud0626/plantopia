'use client';

import { signIn } from 'next-auth/react';
import { ClientSafeProvider } from 'next-auth/react';
import styles from './page.module.scss';
import { showAlert } from '@/utils/dialog';
import paths from '@/constants/routePath';
import { useRouter } from 'next/navigation';

interface SocialBtnProps {
  provider: ClientSafeProvider;
}

export default function SocialBtn({ provider }: SocialBtnProps) {
  const router = useRouter();

  const handleClick = async (providerId: string) => {
    try {
      await signIn(providerId);
      router.push(paths.main);
    } catch (error) {
      showAlert('error', '로그인에 실패하였습니다.');
    }
  };

  return (
    <button className={styles.google} onClick={() => handleClick(provider.id)}>
      <span className="hide">구글 아이디로 로그인하기</span>
    </button>
  );
}
