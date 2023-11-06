import Link from 'next/link';
import { usePathname } from 'next/navigation';
import paths from '@/constants/routePath';
import styles from './footer.module.scss';

const imgSrcs = {
  DICT_ON: '/assets/icons/nav/dict_on.png',
  DICT_OFF: '/assets/icons/nav/dict_off.png',
  DIARY_ON: '/assets/icons/nav/diary_on.png',
  DIARY_OFF: '/assets/icons/nav/diary_off.png',
  MYPLANT_ON: '/assets/icons/nav/myplant_on.png',
  MYPLANT_OFF: '/assets/icons/nav/myplant_off.png',
  MYPAGE_ON: '/assets/icons/nav/mypage_on.png',
  MYPAGE_OFF: '/assets/icons/nav/mypage_off.png',
};

const Footer = () => {
  const pathname = usePathname();

  const activeMapper = (path: string) => {
    if (pathname.includes(path)) {
      return styles.active;
    }

    return '';
  };

  return (
    <footer className={`${styles.footer} inner`}>
      <nav>
        <Link
          href={paths.dict}
          className={`${styles.btn} ${activeMapper(paths.dict)}`}
        >
          <img
            src={activeMapper(paths.dict) ? imgSrcs.DICT_ON : imgSrcs.DICT_OFF}
            alt="dictionary"
          />
          식물도감
        </Link>
        <Link
          href={paths.diary}
          className={`${styles.btn} ${activeMapper(paths.diary)}`}
        >
          <img
            src={
              activeMapper(paths.diary) ? imgSrcs.DIARY_ON : imgSrcs.DIARY_OFF
            }
            alt="diary"
          />
          다이어리
        </Link>
        <Link href={paths.main} className={styles.home_btn}>
          <img
            src="/assets/icons/nav/home.png"
            className={styles.main_logo}
            alt="home"
          />
        </Link>
        <Link
          href={paths.myplant}
          className={`${styles.btn} ${activeMapper(paths.myplant)}`}
        >
          <img
            src={
              activeMapper(paths.myplant)
                ? imgSrcs.MYPLANT_ON
                : imgSrcs.MYPLANT_OFF
            }
            alt="myplant"
          />
          내식물
        </Link>
        <Link
          href={paths.mypage}
          className={`${styles.btn} ${activeMapper(paths.mypage)}`}
        >
          <img
            src={
              activeMapper(paths.mypage)
                ? imgSrcs.MYPAGE_ON
                : imgSrcs.MYPAGE_OFF
            }
            alt="my"
          />
          MY
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
