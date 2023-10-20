import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { nicknamePattern } from '@/constants/regex';
import { deletionUser, updateUserInfo } from '@/api/auth';
import { uploadImg } from '@/api/storage';
import { showAlert, showConfirm } from '@/utils/dialog';
import PageHeader from '@/components/pageHeader/PageHeader';
import paths from '@/constants/routePath';
import styles from './myInfoPage.module.scss';
import Progress from '@/components/progress/Progress';

const MyInfo = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    nickname: user?.displayName || '',
    imgUrl: user?.photoURL,
    password: '',
  });

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];

    try {
      setIsLoading(true);

      const imgPath = await uploadImg(file, 'profile');

      setUserInfo(prev => ({
        ...prev,
        imgUrl: imgPath,
      }));
    } catch (error) {
      showAlert('error', '이미지 등록에 실패하였습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateInput = (values: typeof userInfo): boolean => {
    const { nickname, password } = values;

    if (!nickname) {
      showAlert('error', '닉네임을 입력해주세요.');
      return false;
    }

    if (!nicknamePattern.test(nickname)) {
      showAlert('error', '닉네임이 규칙에 맞지 않습니다.');
      return false;
    }

    if (!password) {
      showAlert('error', '비밀번호를 입력해주세요.');
      return false;
    }

    return true;
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateInput(userInfo)) return;

    const { nickname, password, imgUrl } = userInfo;

    try {
      setIsLoading(true);

      await updateUserInfo(password, nickname.trim(), imgUrl);

      showAlert('success', '회원정보 수정에 성공했습니다.');
      navigate(paths.mypage);
    } catch (error) {
      showAlert('error', '회원정보 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletion = async () => {
    try {
      setIsLoading(true);

      await deletionUser();
      showAlert('success', '이용해주셔서 감사합니다.');
      navigate(paths.login);
    } catch (error) {
      showAlert('error', '에러가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="내 정보" />
      <main className={`${styles.container} inner`}>
        <section className={styles.profile_section}>
          <div className={styles.profile}>
            <div className={styles.profile_img}>
              {userInfo.imgUrl && <img src={userInfo.imgUrl} alt="profile" />}
            </div>
            <label htmlFor="profile" className={styles.edit_btn} />
            <input
              id="profile"
              type="file"
              accept="image/*"
              onChange={handleImage}
            />
          </div>
        </section>
        <section className={styles.input_section}>
          <ul>
            <li>
              <label>이메일</label>
              <input type="text" placeholder={user?.email || ''} readOnly />
            </li>
            <li>
              <label>
                닉네임<small> (2~8글자, 특수문자 불가)</small>
              </label>
              <input
                type="text"
                value={userInfo.nickname}
                onChange={({ target }) => {
                  setUserInfo({
                    ...userInfo,
                    nickname: target.value,
                  });
                }}
              />
            </li>
            {user?.emailVerified || (
              <li>
                <label>비밀번호 확인</label>
                <input
                  type="password"
                  onChange={({ target }) => {
                    setUserInfo({
                      ...userInfo,
                      password: target.value,
                    });
                  }}
                />
              </li>
            )}
          </ul>
          <button
            className={styles.signout_btn}
            onClick={() => {
              showConfirm('회원탈퇴를 진행하시겠습니까?', handleDeletion);
            }}
          >
            회원탈퇴
          </button>
        </section>
      </main>
      <button
        className={styles.info_post}
        disabled={isLoading}
        onClick={handleClick}
      >
        {isLoading ? '수정 중...' : '수정하기'}
      </button>
      {isLoading && <Progress />}
    </>
  );
};

export default MyInfo;
