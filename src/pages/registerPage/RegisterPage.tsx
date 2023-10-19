import { useState } from 'react';
import styles from './registerPage.module.scss';

const validateInput = () => {
  // 모든값들이 채워졌는지
  // 이메일 형식에 맞는지
  // 닉네임 형식에 맞는지
  // 비밀번호와 비밀번호 확인이 맞는지
  // 비밀번호 유효성 검사에 통과하는지
};

const RegisterPage = () => {
  const [inputValues, setInputValues] = useState({
    email: '',
    nickname: '',
    pw: '',
    pwConfirm: '',
  });

  return (
    <>
      <main className={styles.container}>
        <div className={`${styles.login_box} inner`}>
          <h1>
            <span>Plantopia</span>
          </h1>
          <h2 className={styles.sub_title}>
            <div>
              간편하게 회원가입하고
              <br />
              <em>다양한 서비스를 이용해보세요.</em>
            </div>
          </h2>
          <form>
            <label htmlFor="input_email">이메일</label>
            <input
              id="input_email"
              type="text"
              name="nickname"
              // value={email}
              // onChange={handleChange}
              placeholder="이메일을 입력해주세요."
            />
            <label id="input_nickname">닉네임</label>
            <input
              id="input_nickname"
              type="text"
              name="email"
              // value={email}
              // onChange={handleChange}
              placeholder="이메일을 입력해주세요."
            />
            <label htmlFor="input_pw">비밀번호</label>
            <input
              id="input_pw"
              type="password"
              name="pw"
              // onChange={handleChange}
              placeholder="비밀번호를 입력해주세요."
            />
            <label htmlFor="input_pw_confirm">비밀번호 확인</label>
            <input
              id="input_pw_confirm"
              type="password"
              name="pwConfirm"
              // onChange={handleChange}
              placeholder="비밀번호를 다시 입력해주세요."
            />
            <button type="submit" className={styles.submit_btn}>
              회원가입 하기
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default RegisterPage;
