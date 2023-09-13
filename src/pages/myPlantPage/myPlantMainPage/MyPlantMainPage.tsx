import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { getUserPlantList, updateUserPlant } from '@/api/userPlant';
import { errorNoti, infoNoti, successNoti } from '@/utils/alarmUtil';
import { UserPlant } from '@/@types/plant.type';

import './myPlantMainPage.scss';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import MainPagePlantList from '../MyPlantList';
import Progress from '@/components/progress/Progress';

import PLUS_ICON from '@/assets/images/icons/ph_plus-light.png';
import EDIT_ICON from '@/assets/images/icons/my_plant_detail_edit_icon.png';
import SAMPLE_PLANT from '@/assets/images/icons/sample_plant1.png';
import BOOKMARK_TRUE_ICON from '@/assets/images/icons/main_plant_true_icon.png';

const PLANTS_LIMIT = 10;

const MyPlantMainPage = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [mainPlant, setMainPlant] = useState<UserPlant>();
  const [plantList, setPlantList] = useState<UserPlant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleAddPlant = () => {
    if (plantList.length >= PLANTS_LIMIT) {
      infoNoti(`식물 등록은 ${PLANTS_LIMIT}개까지 가능합니다.`);
      return;
    }

    navigate('/myplant/register');
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

      // 메인 식물이 없을 때를 대응한 뒤 userPlants[0]은 삭제 예정
      setMainPlant(mainPlant || userPlants[0]);
      successNoti('메인 식물을 변경하였습니다.');
    } catch (error) {
      errorNoti('메인 식물 변경에 실패하였습니다.');
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

        // 메인 식물이 없을 때를 대응한 뒤 userPlants[0]은 삭제 예정
        setMainPlant(mainPlant || userPlants[0]);
      } catch (error) {
        errorNoti('유저의 식물 정보를 가져오는 도중 에러가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user]);

  return (
    <div className="layout">
      <Header />
      <main className="my_plant_wrapper">
        <h2 className="my_plant_info_message">
          <span className="username">{user?.displayName}</span>님의 식물을 한
          눈에 보기!
        </h2>
        <div className="main_plant_info_box inner">
          {mainPlant ? (
            <div className="main_plant_main_data">
              <span>
                <img
                  className="main_plant_img"
                  src={mainPlant?.imgUrl}
                  alt="mainPlantImg"
                />
              </span>
              <div className="main_plant_head">
                <img src={BOOKMARK_TRUE_ICON} alt="main plant" />{' '}
                <p className="main_plant_title">메인 식물</p>
              </div>
              <p className="main_plant_name">{mainPlant?.plantName}</p>
              <p className="main_plant_nickname">{mainPlant?.nickname}</p>
              <p className="plant_plus_btn" onClick={handleAddPlant}>
                <img src={PLUS_ICON} className="plant_plus_icon" alt="add" />
                식물 등록
              </p>
            </div>
          ) : (
            <div className="main_plant_main_data">
              <img
                className="main_plant_sample_img"
                src={SAMPLE_PLANT}
                alt="samplePlantImg"
              />
              <button
                className="my_plant_main_add_btn_inner_contents"
                onClick={handleAddPlant}
              >
                <div className="my_plant_main_add_btn_inner_contents_box">
                  <img src={EDIT_ICON} alt="edit" />
                  <p>내 식물 등록하기</p>
                </div>
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
