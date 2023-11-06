import { useRouter } from 'next/navigation';
import styles from './pageHeader.module.scss';

interface HeaderBeforeProps {
  exitBtn?: boolean;
  title: string;
}

const PageHeader = ({ exitBtn, title }: HeaderBeforeProps) => {
  const router = useRouter();

  return (
    <header className={`${styles.container} inner`}>
      <div className={`${styles.btn_wrapper} ${exitBtn ? styles.hidden : ''}`}>
        <button
          className={styles.back_btn}
          onClick={() => router.back()}
          aria-label="back"
        ></button>
      </div>
      <h2 className={styles.title}>{title}</h2>
      <div className={`${styles.btn_wrapper} ${exitBtn ? '' : styles.hidden}`}>
        <button
          className={styles.ex_btn}
          onClick={() => router.back()}
          aria-label="exit"
        ></button>
      </div>
    </header>
  );
};

export default PageHeader;
