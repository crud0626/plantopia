import { Link } from 'react-router-dom';
import paths from '@/constants/routePath';
import { useAuth } from '@/hooks';

import './header.scss';
import MAIN_LOGO from '@/assets/images/main_logo.png';
import CALENDAR from '@/assets/icons/calendar.png';

interface HeaderProps {
  isMainPage?: boolean;
}

const Header = ({ isMainPage }: HeaderProps) => {
  const user = useAuth();

  return (
    <header className="inner header">
      <Link to={paths.main} className="main_logo">
        <img className="logo_img" src={MAIN_LOGO} alt="main logo" />
        <h1>Plantopia</h1>
      </Link>
      {isMainPage && (
        <div className="btns">
          <Link to={paths.calendar} className="calendar_btn">
            <img className="calendar" src={CALENDAR} alt="calendar" />
          </Link>
          {user?.photoURL && (
            <Link to={paths.mypage} className="profile_btn">
              <img className="profile" src={user.photoURL} />
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
