import { useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { resetPassword } from '@/api/auth';
import { emailRe } from '@/constants/regEx';
import { showAlert } from '@/utils/dialog';
import styles from './forgotPw.module.scss';

interface ForgotPwProps {
  handleOpenModal: () => void;
}

const validateInput = (value: string) => {
  if (!value) {
    return '가입하신 이메일을 입력해주세요!';
  }

  if (!emailRe.test(value)) {
    return '이메일 형식을 확인해주세요.';
  }
};

const ForgotPw = ({ handleOpenModal }: ForgotPwProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClickReset = async () => {
    const errMsg = validateInput(inputValue);
    if (errMsg) {
      showAlert('error', errMsg);
      return;
    }

    try {
      setIsLoading(true);

      await resetPassword(inputValue);

      showAlert('success', '비밀번호 재설정 메일이 전송되었습니다.');
      handleOpenModal();
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        error.code === 'auth/user-not-found'
      ) {
        showAlert('error', '가입되지 않은 이메일입니다.');
        return;
      }

      showAlert('error', '알 수 없는 에러가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickOutside = ({
    target,
    currentTarget,
  }: React.MouseEvent<HTMLElement>) => {
    if (target === currentTarget) handleOpenModal();
  };

  return (
    <div className={styles.container} onClick={handleClickOutside}>
      <section>
        <div className={styles.header_wrapper}>
          <div className={styles.header}>
            <h3 className={styles.title}>비밀번호 재설정</h3>
            <button
              className={styles.close_btn}
              onClick={handleOpenModal}
              aria-label="close"
            ></button>
          </div>
          <p className={styles.desc}>
            가입하신 이메일 주소를 입력해주세요.
            <br />
            재설정 링크가 포함된 메일이 발송됩니다.
          </p>
        </div>
        <input
          type="text"
          className={styles.email_input}
          placeholder="이메일을 입력해주세요."
          value={inputValue}
          onChange={({ target }) => setInputValue(target.value)}
        />
        <button
          className={styles.reset_btn}
          disabled={isLoading}
          onClick={handleClickReset}
        >
          비밀번호 재설정하기
        </button>
      </section>
    </div>
  );
};

export default ForgotPw;
