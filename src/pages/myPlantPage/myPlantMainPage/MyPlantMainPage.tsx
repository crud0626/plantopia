import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { getUserPlantList, updateUserPlant } from '@/api/userPlant';
import { showAlert } from '@/utils/dialog';
import { UserPlant } from '@/@types/plant.type';
import paths from '@/constants/routePath';

import styles from './myPlantMainPage.module.scss';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import MainPagePlantList from './MyPlantList';
import Progress from '@/components/progress/Progress';

import PLUS_ICON from '@/assets/icons/add_white.png';
import EDIT_ICON from '@/assets/icons/add_popup.png';
import SAMPLE_PLANT from '@/assets/images/default_plant.png';
import BOOKMARK_TRUE_ICON from '@/assets/icons/bookmark.png';

const PLANTS_LIMIT = 10;

const MyPlantMainPage = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [mainPlant, setMainPlant] = useState<UserPlant>();
  const [plantList, setPlantList] = useState<UserPlant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleAddPlant = () => {
    if (plantList.length >= PLANTS_LIMIT) {
      showAlert('info', `식물 등록은 ${PLANTS_LIMIT}개까지 가능합니다.`);
      return;
    }

    navigate(paths.myplantRegister);
  };

  const changeMainPlant = async (nextMainPlant: UserPlant) => {
    if (nextMainPlant.isMain || !user?.email) return;

    const prevMainPlant = mainPlant && { id: mainPlant?.id, isMain: false };
    const nMainPlant = { id: nextMainPlant.id, isMain: true };

    try {
      setIsLoading(true);

      await Promise.all([
        prevMainPlant ? updateUserPlant(prevMainPlant) : true,
        updateUserPlant(nMainPlant),
      ]);

      const userPlants = await getUserPlantList(user.email);
      const mainPlant = userPlants.find(plant => plant.isMain);

      setPlantList(userPlants);
      setMainPlant(mainPlant);
      showAlert('success', '메인 식물을 변경하였습니다.');
    } catch (error) {
      showAlert('error', '메인 식물 변경에 실패하였습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!user?.email) return;

      try {
        setIsLoading(true);

        const userPlants = await getUserPlantList(user.email);
        const mainPlant = userPlants.find(plant => plant.isMain);

        setPlantList(userPlants);
        setMainPlant(mainPlant);
      } catch (error) {
        showAlert(
          'error',
          '유저의 식물 정보를 가져오는 도중 에러가 발생했습니다.',
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user]);

  return (
    <div className="layout">
      <Header />
      <main className={styles.container}>
        <h2 className={styles.info_message}>
          <span className={styles.username}>{user?.displayName}</span>님의
          식물을 한 눈에 보기!
        </h2>
        <div className={`${styles.info_box} inner`}>
          {mainPlant ? (
            <div className={styles.main_data}>
              <span>
                <img
                  className="main_plant_img"
                  src={mainPlant?.imgUrl}
                  alt="mainPlantImg"
                />
              </span>
              <div className={styles.head}>
                <img src={BOOKMARK_TRUE_ICON} alt="main plant" />{' '}
                <p className={styles.main_plant_title}>메인 식물</p>
              </div>
              <p className={styles.main_plant_name}>{mainPlant?.plantName}</p>
              <p className={styles.main_plant_nickname}>
                {mainPlant?.nickname}
              </p>
              <p className={styles.plant_plus_btn} onClick={handleAddPlant}>
                <img src={PLUS_ICON} className="plant_plus_icon" alt="add" />
                식물 등록
              </p>
            </div>
          ) : (
            <div className={styles.empty_wrapper}>
              <img
                className={styles.main_plant_sample_img}
                src={SAMPLE_PLANT}
                alt="samplePlantImg"
              />
              <button className={styles.register_btn} onClick={handleAddPlant}>
                <img src={EDIT_ICON} alt="edit" />
                <p>내 식물 등록하기</p>
              </button>
            </div>
          )}
          <MainPagePlantList
            userPlants={plantList}
            changeMainPlant={changeMainPlant}
          />
        </div>
      </main>
      <Footer />
      {isLoading && <Progress />}
    </div>
  );
};

export default MyPlantMainPage;
