'use client';

import { useAuth } from '@/hooks';
import Link from 'next/link';
import paths from '@/constants/routePath';
import styles from './not-found.module.scss';

const NotFoundPage = () => {
  useAuth();

  return (
    <main className={`inner ${styles.container}`}>
      <section className={styles.section}>
        <div className={styles.bg}></div>
        <h2>
          <strong>빈페이지</strong>를 발견하셨습니다!
        </h2>
        <p>슬기로운 식집사 생활을 이어나가시겠어요?🌱</p>
        <Link href={paths.main}>메인으로 이동하기</Link>
      </section>
    </main>
  );
};

export default NotFoundPage;
