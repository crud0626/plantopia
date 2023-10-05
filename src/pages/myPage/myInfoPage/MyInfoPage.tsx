import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { nicknameRe } from '@/constants/regEx';
import { updateUserInfo } from '@/api/auth';
import { uploadImg } from '@/api/storage';
import { showAlert } from '@/utils/dialog';
import HeaderBefore from '@/components/headerBefore/HeaderBefore';
import paths from '@/constants/routePath';
import './myInfoPage.scss';

import PROFILE from '@/assets/images/icons/default_profile.png';

const MyInfo = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    nickname: user?.displayName || '',
    imgUrl: user?.photoURL || '',
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

    if (!nicknameRe.test(nickname)) {
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

  return (
    <div className="my_info_page layout">
      <HeaderBefore title="내 정보" />
      <main className="my_info_container inner">
        <section className="profile_section">
          <div className="profile">
            <img src={userInfo.imgUrl || PROFILE} alt="profile" />
            <label htmlFor="profile" className="edit_btn" />
            <input
              id="profile"
              type="file"
              accept="image/*"
              onChange={handleImage}
            />
          </div>
        </section>
        <section className="input_section">
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
        </section>
      </main>
      <button className="info_post" disabled={isLoading} onClick={handleClick}>
        {isLoading ? '수정 중...' : '수정하기'}
      </button>
    </div>
  );
};

export default MyInfo;
