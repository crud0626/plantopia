'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginWithEmail, loginWithSocial } from '@/api/auth';
import { showAlert } from '@/utils/dialog';
import paths from '@/constants/routePath';
import { emailPattern, passwordPattern } from '@/constants/regex';
import styles from './page.module.scss';
import ForgotPw from './ForgotPw';

const LoginPage = () => {
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_TEST_ID || '');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isOpenForgotModal, setIsOpenForgotModal] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    name === 'email' ? setEmail(value) : setPassword(value);
  };

  const handleSubmit = async (defaultValue?: { email: string; pw: string }) => {
    const targets = [
      {
        key: email,
        message: '이메일 형식을 확인해주세요.',
        regex: emailPattern,
      },
      {
        key: password,
        message: '8~20자 사이의 비밀번호를 입력해주세요.',
        regex: passwordPattern,
      },
    ];

    if (!defaultValue) {
      for (const { key, message, regex } of targets) {
        if (!regex.test(key)) {
          showAlert('error', message);
          return;
        }
      }
    }

    try {
<<<<<<< HEAD:src/app/login/page.tsx
      await loginWithEmail(email, password, isChecked);
      router.push(paths.main);
=======
      defaultValue
        ? await loginWithEmail(defaultValue.email, defaultValue.pw, false)
        : await loginWithEmail(email, password, isChecked);

      navigate(paths.main);
>>>>>>> master:src/pages/loginPage/LoginPage.tsx
    } catch (error) {
      showAlert('error', '이메일 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  const handleClick = async () => {
    try {
      await loginWithSocial(isChecked);
      router.push(paths.main);
    } catch (error) {
      showAlert('error', '로그인에 실패하였습니다.');
    }
  };

  return (
    <>
      <main className={styles.container}>
        <div className={`${styles.login_box} inner`}>
          <h1>
            <span>Plantopia</span>
          </h1>
          <h2 className={styles.sub_title}>
            <div>
              간편하게 로그인하고
              <br />
              <em>다양한 서비스를 이용하세요.</em>
            </div>
          </h2>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <label htmlFor="inpEmail">이메일</label>
            <input
              type="text"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="이메일을 입력해주세요."
              id="inpEmail"
            />
            <div className={styles.pw_label_wrapper}>
              <label htmlFor="inpPwd" className={styles.mar_top32}>
                비밀번호
              </label>
              <button
                type="button"
                className={styles.forgot_pw}
                tabIndex={-1}
                onClick={() => setIsOpenForgotModal(true)}
              >
                비밀번호를 잃어버리셨나요?
              </button>
            </div>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="비밀번호를 입력해주세요."
            />
            <div className={styles.login_option}>
              <button
                type="button"
                className={styles.guest_login_btn}
                onClick={() =>
                  handleSubmit({
                    email: import.meta.env.VITE_TEST_ID,
                    pw: import.meta.env.VITE_TEST_PW,
                  })
                }
              >
                게스트 로그인
              </button>
              <div className={styles.auto_login}>
                <input
                  id="check"
                  type="checkbox"
                  onChange={() => setIsChecked(prev => !prev)}
                  checked={isChecked}
                />
                <label htmlFor="check" draggable>
                  자동 로그인
                </label>
              </div>
            </div>
            <button
              type="submit"
              className={`${styles.round_btn} ${styles.submit_btn}`}
            >
              로그인
            </button>
            <Link
              to={paths.register}
              className={`${styles.round_btn} ${styles.register_btn}`}
            >
              가입하기
            </Link>
          </form>
          <div className={styles.oauth_box}>
            <p>SNS 계정으로 로그인하기</p>
            <button className={styles.google} onClick={handleClick}>
              <span className="hide">구글 아이디로 로그인하기</span>
            </button>
          </div>
        </div>
        {isOpenForgotModal && (
          <ForgotPw
            handleOpenModal={() => setIsOpenForgotModal(prev => !prev)}
          />
        )}
      </main>
    </>
  );
};

export default LoginPage;
