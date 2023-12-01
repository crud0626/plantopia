'use client';

import Link from 'next/link';
import paths from '@/constants/routePath';
import { useAuth } from '@/hooks';

import styles from './header.module.scss';

interface HeaderProps {
  isMainPage?: boolean;
}

const Header = ({ isMainPage }: HeaderProps) => {
  const user = useAuth();

  return (
    <header className={`${styles.header} inner`}>
      <Link href={paths.main} className={styles.main_logo}>
        <img
          src="/assets/images/main_logo.png"
          className={styles.logo_img}
          alt="main logo"
        />
        <h1>Plantopia</h1>
      </Link>
      {isMainPage && (
        <div className={styles.btns}>
          <Link href={paths.calendar} className={styles.calendar_btn}>
            <img
              src="/assets/icons/calendar.png"
              className={styles.calendar}
              alt="calendar"
            />
          </Link>
          {user && (
            <Link href={paths.mypage} className={styles.profile_btn}>
              {user.photoURL && (
                <img src={user.photoURL} className={styles.profile} />
              )}
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
