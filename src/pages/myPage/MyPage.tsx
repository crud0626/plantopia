import { useState, Children } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { errorNoti } from '@/utils/alarmUtil';
import { logout } from '@/api/auth';

import './myPage.scss';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Progress from '@/components/progress/Progress';

import PROFILE from '@/assets/images/icons/default_profile.png';

const customerService = [
  { title: '사용 가이드', url: '/mypage/guide' },
  {
    title: '자주 묻는 질문',
    url: '/mypage/question',
  },
  { title: '식물 추가 요청', url: 'https://forms.gle/g4AjkNKqVDP48Xnc7' },
];

const MyPage = () => {
  const user = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await logout();
    } catch (error) {
      errorNoti('로그아웃에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my_page layout">
      <Header />
      <main className="my_container">
        <section className="my_info_box inner">
          <h2>
            <em>{user?.displayName || '회원'}</em>님, 플랜토피아와 함께
            <br /> 슬기로운 식집사 생활을 시작하세요!
          </h2>
          <div className="my_profile">
            <img src={user?.photoURL || PROFILE} alt="profile" />
            <div className="my_info">
              <strong>{user?.displayName}</strong>
              <p>{user?.email}</p>
            </div>
            <Link to="/mypage/info" className="edit_info">
              내 정보 수정하기
            </Link>
          </div>
        </section>
        <section className="list_box">
          <span className="list_title">고객센터</span>
          <ul className="list_contents">
            {Children.toArray(
              customerService.map(({ title, url }) => (
                <li>
                  {url.startsWith('https') ? (
                    <a href={url} target="_blank" className="move">
                      {title}
                    </a>
                  ) : (
                    <Link to={url} className="move">
                      {title}
                    </Link>
                  )}
                </li>
              )),
            )}
          </ul>
          <div className="logout_wrapper">
            <button className="logout_btn" onClick={handleClick}>
              로그아웃
            </button>
          </div>
        </section>
      </main>
      <Footer />
      {isLoading && <Progress />}
    </div>
  );
};

export default MyPage;
