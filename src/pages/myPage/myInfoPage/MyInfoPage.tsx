import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { nicknameRe } from '@/constants/regEx';
import { errorNoti, successNoti } from '@/utils/alarmUtil';
import HeaderBefore from '@/components/headerBefore/HeaderBefore';
import { updateUserInfo } from '@/api/auth';
import { uploadImg } from '@/api/storage';
import './myInfoPage.scss';

import PROFILE from '@/assets/images/icons/default_profile.png';

const MyInfo = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(user?.displayName);
  const [password, setPassword] = useState('');
  const [uploadedImg, setUploadedImg] = useState<string>('');
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [isBtnActive, setIsBtnActive] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setUploadedImg(String(reader.result));
    };
    uploadProfileImg(file);
  };

  const uploadProfileImg = async (file: File) => {
    try {
      const imgPath = await uploadImg(file, 'profile');

      setImgUrl(imgPath);
    } catch (error) {
      errorNoti('이미지 등록에 실패하였습니다.');
    }
  };

  const nicknameValidation = (nickname: string | null | undefined) => {
    if (!nickname) return true;
    if (!nicknameRe.test(nickname)) {
      errorNoti('닉네임을 확인해 주세요.');
      return false;
    }
    return true;
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!nickname) {
      errorNoti('닉네임이 비어있습니다.');
      return;
    }
    if (!nicknameValidation(nickname)) return;

    try {
      setIsBtnActive(false);

      if (!user?.email) throw Error();

      await updateUserInfo(password, nickname?.trim(), imgUrl);

      successNoti('회원정보 수정에 성공했습니다.');
      navigate('/mypage');
    } catch (error) {
      errorNoti('회원정보 수정에 실패했습니다.');
    } finally {
      setIsBtnActive(true);
    }
  };

  return (
    <div className="my_info_page layout">
      <HeaderBefore title="내 정보" />
      <main className="my_info_container inner">
        <section className="profile_section">
          <div className="profile">
            <img src={uploadedImg || user?.photoURL || PROFILE} alt="profile" />
            <label htmlFor="profile" className="edit_btn" />
            <input
              onChange={handleChange}
              id="profile"
              type="file"
              accept="image/*"
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
                onChange={e => setNickname(e.target.value)}
                type="text"
                defaultValue={user?.displayName || ''}
              />
            </li>
            {user?.emailVerified || (
              <li>
                <label>비밀번호 확인</label>
                <input
                  onChange={e => setPassword(e.target.value)}
                  type="password"
                />
              </li>
            )}
          </ul>
        </section>
      </main>
      <button
        className="info_post"
        disabled={!isBtnActive}
        onClick={handleClick}
      >
        {isBtnActive ? '수정하기' : '수정 중...'}
      </button>
    </div>
  );
};

export default MyInfo;
