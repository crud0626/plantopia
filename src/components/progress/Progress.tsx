import styles from './progress.module.scss';

const Progress = () => {
  return (
    <div className={styles.progress_container}>
      <main className={styles.progress_wrapper}>
        <section className={styles.ball_wrapper}>
          <div className={styles.ball}></div>
          <div className={styles.ball}></div>
          <div className={styles.ball}></div>
        </section>
        <section className={styles.letter_wrapper}>
          <div className={`${styles.l_1}  ${styles.letter}`}>L</div>
          <div className={`${styles.l_2}  ${styles.letter}`}>o</div>
          <div className={`${styles.l_3}  ${styles.letter}`}>a</div>
          <div className={`${styles.l_4}  ${styles.letter}`}>d</div>
          <div className={`${styles.l_5}  ${styles.letter}`}>i</div>
          <div className={`${styles.l_6}  ${styles.letter}`}>n</div>
          <div className={`${styles.l_7}  ${styles.letter}`}>g</div>
          <div className={`${styles.l_8}  ${styles.letter}`}>.</div>
          <div className={`${styles.l_9}  ${styles.letter}`}>.</div>
          <div className={`${styles.l_10}  ${styles.letter}`}>.</div>
        </section>
      </main>
    </div>
  );
};

export default Progress;
