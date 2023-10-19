import styles from './ForgotPw.module.scss';

interface ForgotPwProps {
  handleOpenModal: () => void;
}

const ForgotPw = ({ handleOpenModal }: ForgotPwProps) => {
  // 유효성 검증 로직 및 재설정 메소드 호출

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
        />
        <button className={styles.reset_btn}>비밀번호 재설정하기</button>
      </section>
    </div>
  );
};

export default ForgotPw;
