import { differenceInDays, format, addDays } from 'date-fns';
import { Link } from 'react-router-dom';
import { UserPlant } from '@/@types/plant.type';
import { showConfirm } from '@/utils/dialog';
import EmptyPlant from './EmptyPlant';
import paths from '@/constants/routePath';

import styles from './mainPage.module.scss';
import WATERING from '@/assets/icons/watering.png';
interface MainPlantProps {
  plant?: UserPlant;
  onWaterPlant: (plantId: string) => void;
}

const MainPlantSection = ({ plant, onWaterPlant }: MainPlantProps) => {
  if (!plant) return <EmptyPlant />;

  const calcWateringDday = (
    lastWateringDate: number,
    frequency: number,
  ): number => {
    const nextWateringDate = addDays(lastWateringDate, frequency);
    const diffDays = differenceInDays(Date.now(), nextWateringDate);

    return diffDays >= 0 ? 0 : Math.abs(diffDays);
  };

  const onClickWatering = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    showConfirm('식물에 물을 주시겠습니까?', () => onWaterPlant(plant.id));
  };

  const lastWateringDate = (plant.wateredDays.at(-1)?.seconds || 0) * 1000;
  const registerDate = plant.purchasedDay.seconds * 1000;
  const wateringDday = calcWateringDday(
    lastWateringDate || registerDate,
    plant.frequency,
  );
  const dDayLabelClass =
    wateringDday === 0
      ? styles.urgent
      : wateringDday <= 3
      ? styles.upcoming
      : '';

  return (
    <div className="inner">
      <Link to={`${paths.myplant}/${plant.id}`} className={styles.main_plant}>
        <div className={styles.inner_circle}>
          <img src={plant.imgUrl} alt="plant" />
        </div>
        <button className={styles.watering_btn} onClick={onClickWatering}>
          <img src={WATERING} alt="watering" />
          <div className={styles.watering_label}>물주기</div>
        </button>
      </Link>
      {/* main_plant_info */}
      <div className={styles.main_plant_info}>
        <div className={styles.eng_name_label}>{plant.plantName}</div>
        <h2 className={styles.nickname}>
          <span className={plant.isMain ? styles.main : ''}>
            {plant.nickname}
          </span>
        </h2>
        <div className={styles.plant_info_wrapper}>
          <div className={styles.plant_info}>
            <span className={styles.title}>물주기</span>
            <div
              className={`${styles.content} ${styles.cotent_label} ${dDayLabelClass}`}
            >
              <span>{wateringDday === 0 ? 'D-day' : `D-${wateringDday}`}</span>
            </div>
          </div>
          <div className={styles.plant_info}>
            <span className={styles.title}>마지막 물준 날</span>
            <span className={styles.content}>
              {lastWateringDate ? format(lastWateringDate, 'yyyy-MM-dd') : '-'}
            </span>
          </div>
          <div className={styles.plant_info}>
            <span className={styles.title}>처음 함께한 날</span>
            <span className={styles.content}>
              {format(registerDate, 'yyyy-MM-dd')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPlantSection;
