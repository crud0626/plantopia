import styles from './noContent.module.scss';
import POT from '@/assets/icons/diary_pot.png';

const NoContent = () => {
  return (
    <div className={styles.no_content}>
      <div>
        <img src={POT} alt="화분 이미지" />
        <p>+ 버튼을 클릭하여 다이어리를 작성해보세요.</p>
      </div>
    </div>
  );
};

export default NoContent;
