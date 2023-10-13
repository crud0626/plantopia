import { useNavigate } from 'react-router-dom';
import styles from './pageHeader.module.scss';

interface HeaderBeforeProps {
  exitBtn?: boolean;
  title: string;
}

const PageHeader = ({ exitBtn, title }: HeaderBeforeProps) => {
  const navigate = useNavigate();

  return (
    <header className={`${styles.container} inner`}>
      <div className={`${styles.btn_wrapper} ${exitBtn ? styles.hidden : ''}`}>
        <button
          className={styles.back_btn}
          onClick={() => navigate(-1)}
          aria-label="back"
        ></button>
      </div>
      <h2 className={styles.title}>{title}</h2>
      <div className={`${styles.btn_wrapper} ${exitBtn ? '' : styles.hidden}`}>
        <button
          className={styles.ex_btn}
          onClick={() => navigate(-1)}
          aria-label="exit"
        ></button>
      </div>
    </header>
  );
};

export default PageHeader;
