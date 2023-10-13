import { useState, Children } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { showAlert } from '@/utils/dialog';
import { logout } from '@/api/auth';
import paths from '@/constants/routePath';
import styles from './myPage.module.scss';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Progress from '@/components/progress/Progress';

import PROFILE from '@/assets/images/profile.png';

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
      showAlert('error', '로그아웃에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.my_page}>
      <Header />
      <main className={styles.container}>
        <section className={`${styles.info_wrapper} inner`}>
          <h2>
            <em>{user?.displayName || '회원'}</em>님, 플랜토피아와 함께
            <br /> 슬기로운 식집사 생활을 시작하세요!
          </h2>
          <div className={styles.profile}>
            <img src={user?.photoURL || PROFILE} alt="profile" />
            <div className={styles.info}>
              <strong>{user?.displayName}</strong>
              <p>{user?.email}</p>
            </div>
            <Link to={paths.mypageInfo} className={styles.edit_info}>
              내 정보 수정하기
            </Link>
          </div>
        </section>
        <section className={styles.list_box}>
          <span className={styles.list_title}>고객센터</span>
          <ul className={styles.list_contents}>
            {Children.toArray(
              customerService.map(({ title, url }) => (
                <li>
                  {url.startsWith('https') ? (
                    <a href={url} target="_blank">
                      {title}
                    </a>
                  ) : (
                    <Link to={url}>{title}</Link>
                  )}
                </li>
              )),
            )}
          </ul>
          <div className={styles.logout_wrapper}>
            <button className={styles.logout_btn} onClick={handleClick}>
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
