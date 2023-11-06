import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUpUser } from '@/api/auth';
import {
  emailPattern,
  nicknamePattern,
  passwordPattern,
} from '@/constants/regex';
import { showAlert } from '@/utils/dialog';
import styles from './page.module.scss';
import paths from '@/constants/routePath';

interface InputValueTypes {
  email: string;
  nickname: string;
  pw: string;
  pwConfirm: string;
}

const validateInput = (values: InputValueTypes) => {
  for (const [_, value] of Object.entries(values)) {
    if (!value) {
      return '입력값을 모두 입력해주세요.';
    }
  }

  if (!emailPattern.test(values.email)) {
    return '이메일 형식을 확인해주세요.';
  }

  if (!nicknamePattern.test(values.nickname)) {
    return '닉네임이 규칙에 맞지 않습니다.';
  }

  if (values.pw !== values.pwConfirm) {
    return '비밀번호가 일치하지 않습니다.';
  }

  if (!passwordPattern.test(values.pw)) {
    return '비밀번호가 규칙에 맞지 않습니다.';
  }
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [inputValues, setInputValues] = useState<InputValueTypes>({
    email: '',
    nickname: '',
    pw: '',
    pwConfirm: '',
  });

  const handleChangeInput = (type: keyof InputValueTypes, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    const errMsg = validateInput(inputValues);
    if (errMsg) {
      showAlert('error', errMsg);
      return;
    }

    try {
      setIsLoading(true);

      await signUpUser(inputValues.email, inputValues.pw, inputValues.nickname);

      showAlert('success', '회원가입이 완료되었습니다.');
      navigate('/');
    } catch (error) {
      showAlert('error', '알 수 없는 에러가 발생하였습니다.');
    } finally {
      setIsLoading(false);
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
              간편하게 회원가입하고
              <br />
              <em>다양한 서비스를 이용해보세요.</em>
            </div>
          </h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="input_email">이메일</label>
            <input
              id="input_email"
              type="text"
              value={inputValues.email}
              onChange={({ target }) =>
                handleChangeInput('email', target.value)
              }
              placeholder="이메일을 입력해주세요."
            />
            <label id="input_nickname">
              닉네임<small>(2~8글자, 특수문자 불가)</small>
            </label>
            <input
              id="input_nickname"
              type="text"
              value={inputValues.nickname}
              onChange={({ target }) =>
                handleChangeInput('nickname', target.value)
              }
              placeholder="닉네임을 입력해주세요."
            />
            <label htmlFor="input_pw">
              비밀번호<small>(8~20자 영문 대 소문자, 숫자)</small>
            </label>
            <input
              id="input_pw"
              type="password"
              name="pw"
              onChange={({ target }) => handleChangeInput('pw', target.value)}
              placeholder="비밀번호를 입력해주세요."
            />
            <label htmlFor="input_pw_confirm">비밀번호 확인</label>
            <input
              id="input_pw_confirm"
              type="password"
              name="pwConfirm"
              onChange={({ target }) =>
                handleChangeInput('pwConfirm', target.value)
              }
              placeholder="비밀번호를 다시 입력해주세요."
            />
            <button
              type="submit"
              className={`${styles.btn} ${styles.submit_btn}`}
              disabled={isLoading}
            >
              회원가입 하기
            </button>
            <Link
              to={paths.login}
              className={`${styles.btn} ${styles.login_btn}`}
            >
              로그인 페이지로 이동하기
            </Link>
          </form>
        </div>
      </main>
    </>
  );
};

export default RegisterPage;
