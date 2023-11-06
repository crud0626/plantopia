'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks';
import paths from '@/constants/routePath';

import styles from './page.module.scss';

const EmptyPlant = () => {
  const user = useAuth();

  return (
    <div className="inner">
      <div className={styles.main_plant}>
        <div className={styles.inner_circle}>
          <img src="/assets/images/plants/main_plant.png" alt="plant" />
        </div>
      </div>
      <p className={styles.welcome_text}>
        <strong>{user?.displayName || '회원'}</strong>님, 플랜토피아와 함께
        슬기로운 식집사 생활을 시작하세요!
      </p>
      <Link href={paths.myplantRegister} className={styles.register_btn}>
        <img src="/assets/icons/add_popup.png" alt="edit" />
        <p>내 식물 등록하기</p>
      </Link>
    </div>
  );
};

export default EmptyPlant;
