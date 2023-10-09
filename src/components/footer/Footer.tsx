import { Link, useLocation } from 'react-router-dom';
import paths from '@/constants/routePath';
import './footer.scss';

import DICT_ON from '@/assets/images/icons/nav/dict_on.png';
import DICT_OFF from '@/assets/images/icons/nav/dict_off.png';
import DIARY_ON from '@/assets/images/icons/nav/diary_on.png';
import DIARY_OFF from '@/assets/images/icons/nav/diary_off.png';
import MYPLANT_ON from '@/assets/images/icons/nav/myplant_on.png';
import MYPLANT_OFF from '@/assets/images/icons/nav/myplant_off.png';
import MYPAGE_ON from '@/assets/images/icons/nav/mypage_on.png';
import MYPAGE_OFF from '@/assets/images/icons/nav/mypage_off.png';
import HOME from '@/assets/images/icons/nav/home.png';

const Footer = () => {
  const location = useLocation();

  const activeMapper = (path: string) => {
    if (location.pathname.includes(path)) {
      return 'active';
    }

    return '';
  };

  return (
    <footer className="inner footer">
      <nav>
        <Link to={paths.dict} className={`btn ${activeMapper(paths.dict)}`}>
          <img
            src={activeMapper(paths.dict) ? DICT_ON : DICT_OFF}
            alt="dictionary"
          />
          식물도감
        </Link>
        <Link to={paths.diary} className={`btn ${activeMapper(paths.diary)}`}>
          <img
            src={activeMapper(paths.diary) ? DIARY_ON : DIARY_OFF}
            alt="diary"
          />
          다이어리
        </Link>
        <Link to={paths.main} className="home_btn">
          <img src={HOME} className="main_logo" alt="home" />
        </Link>
        <Link
          to={paths.myplant}
          className={`btn ${activeMapper(paths.myplant)}`}
        >
          <img
            src={activeMapper(paths.myplant) ? MYPLANT_ON : MYPLANT_OFF}
            alt="myplant"
          />
          내식물
        </Link>
        <Link to={paths.mypage} className={`btn ${activeMapper(paths.mypage)}`}>
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
