import { Link } from 'react-router-dom';
import paths from '@/constants/routePath';
import { useAuth } from '@/hooks';

import styles from './header.module.scss';
import MAIN_LOGO from '@/assets/images/main_logo.png';
import CALENDAR from '@/assets/icons/calendar.png';

interface HeaderProps {
  isMainPage?: boolean;
}

const Header = ({ isMainPage }: HeaderProps) => {
  const user = useAuth();

  return (
    <header className={`${styles.header} inner`}>
      <Link to={paths.main} className={styles.main_logo}>
        <img className={styles.logo_img} src={MAIN_LOGO} alt="main logo" />
        <h1>Plantopia</h1>
      </Link>
      {isMainPage && (
        <div className={styles.btns}>
          <Link to={paths.calendar} className={styles.calendar_btn}>
            <img className={styles.calendar} src={CALENDAR} alt="calendar" />
          </Link>
          {user?.photoURL && (
            <Link to={paths.mypage} className={styles.profile_btn}>
              <img className={styles.profile} src={user.photoURL} />
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
