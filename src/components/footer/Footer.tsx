import { Link, useLocation } from 'react-router-dom';
import paths from '@/constants/routePath';
import styles from './footer.module.scss';

import DICT_ON from '@/assets/icons/nav/dict_on.png';
import DICT_OFF from '@/assets/icons/nav/dict_off.png';
import DIARY_ON from '@/assets/icons/nav/diary_on.png';
import DIARY_OFF from '@/assets/icons/nav/diary_off.png';
import MYPLANT_ON from '@/assets/icons/nav/myplant_on.png';
import MYPLANT_OFF from '@/assets/icons/nav/myplant_off.png';
import MYPAGE_ON from '@/assets/icons/nav/mypage_on.png';
import MYPAGE_OFF from '@/assets/icons/nav/mypage_off.png';
import HOME from '@/assets/icons/nav/home.png';

const Footer = () => {
  const location = useLocation();

  const activeMapper = (path: string) => {
    if (location.pathname.includes(path)) {
      return styles.active;
    }

    return '';
  };

  return (
    <footer className={`${styles.footer} inner`}>
      <nav>
        <Link
          to={paths.dict}
          className={`${styles.btn} ${activeMapper(paths.dict)}`}
        >
          <img
            src={activeMapper(paths.dict) ? DICT_ON : DICT_OFF}
            alt="dictionary"
          />
          식물도감
        </Link>
        <Link
          to={paths.diary}
          className={`${styles.btn} ${activeMapper(paths.diary)}`}
        >
          <img
            src={activeMapper(paths.diary) ? DIARY_ON : DIARY_OFF}
            alt="diary"
          />
          다이어리
        </Link>
        <Link to={paths.main} className={styles.home_btn}>
          <img src={HOME} className={styles.main_logo} alt="home" />
        </Link>
        <Link
          to={paths.myplant}
          className={`${styles.btn} ${activeMapper(paths.myplant)}`}
        >
          <img
            src={activeMapper(paths.myplant) ? MYPLANT_ON : MYPLANT_OFF}
            alt="myplant"
          />
          내식물
        </Link>
        <Link
          to={paths.mypage}
          className={`${styles.btn} ${activeMapper(paths.mypage)}`}
        >
          <img
            src={activeMapper(paths.mypage) ? MYPAGE_ON : MYPAGE_OFF}
            alt="my"
          />
          MY
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
