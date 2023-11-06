'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { nanoid } from 'nanoid';
import { useAuth } from '@/hooks';
import { UserPlant } from '@/@types/plant.type';
import { getUserPlantList, updateUserPlant } from '@/api/userPlant';
import { showAlert } from '@/utils/dialog';
import { Timestamp } from 'firebase/firestore';

import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import Progress from '@/components/progress/Progress';
import MainPlantSection from './MainPlantSection';
import WeatherSection from './WeatherSection';
import 'swiper/scss';
import styles from './page.module.scss';

interface PlantListProps {
  plants: UserPlant[];
  onClickItem: (plant: UserPlant) => void;
}

const PlantList = ({ plants, onClickItem }: PlantListProps) => {
  if (plants.length > 0) {
    return (
      <div className={styles.slide_wrapper}>
        <Swiper slidesPerView={3.5} className={styles.swiper}>
          {plants.map(plant => (
            <SwiperSlide key={nanoid()}>
              <button
                className={styles.slide}
                onClick={() => onClickItem(plant)}
              >
                <div className={styles.avatar}>
                  <img src={plant.imgUrl} alt="plant" />
                </div>
                <span className={styles.name}>{plant.nickname}</span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }
};

const MainPage = () => {
  const [focusPlant, setFocusPlant] = useState<UserPlant>();
  const [plantList, setPlantList] = useState<UserPlant[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuth();

  const onWaterPlant = async () => {
    if (!(focusPlant && user?.email)) return;

    const newData = { ...focusPlant };
    newData.wateredDays = [
      ...newData.wateredDays,
      Timestamp.fromDate(new Date()),
    ];

    try {
      setIsLoading(true);

      await updateUserPlant(newData);
      const userPlantList = await getUserPlantList(user.email);
      const mainVisiblePlant = userPlantList.find(
        ({ id }) => focusPlant.id === id,
      );

      setFocusPlant(mainVisiblePlant);
      setPlantList(userPlantList);
      showAlert('success', '물을 잘 먹었어요!');
    } catch (error) {
      showAlert('error', '에러가 발생하였습니다. 잠시 후 다시 시도해주세요!');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!user?.email) return;

      setIsLoading(true);

      try {
        const userPlantList = await getUserPlantList(user.email);
        const mainVisiblePlant = userPlantList.find(({ isMain }) => isMain);

        setFocusPlant(mainVisiblePlant || userPlantList[0]);
        setPlantList(userPlantList);
      } catch (error) {
        showAlert('error', '에러가 발생하였습니다. 새로고침을 해주세요!');
        setPlantList(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user]);

  return (
    <>
      <Header isMainPage />
      <main className={styles.container}>
        <section>
          <WeatherSection />
          {plantList && (
            <>
              <MainPlantSection
                plant={focusPlant}
                onWaterPlant={onWaterPlant}
              />
              <PlantList
                plants={plantList}
                onClickItem={(plant: UserPlant) => setFocusPlant(plant)}
              />
            </>
          )}
        </section>
      </main>
      <Footer />
      {/* {isLoading && <Progress />} */}
    </>
  );
};

export default MainPage;
