import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlant } from '@/@types/plant.type';
import { errorNoti, successNoti } from '@/utils/alarmUtil';
import { getPlantList, updatePlantInfo } from '@/api/userPlant';
import Toast from '@/components/notification/ToastContainer';

import './mainPagePlantList.scss';
import 'react-toastify/dist/ReactToastify.css';
import mainPlantTrueIcon from '@/assets/images/icons/main_plant_true_icon.png';
import mainPlantFalseIcon from '@/assets/images/icons/main_plant_false_icon.png';
import myPlantEditIcon from '@/assets/images/icons/my_plants_edit_icon.png';

interface MainPagePlantListProps {
  userEmail: string;
  setMyMainPlant: (data: UserPlant) => void;
  setPlantCount: (data: number) => void;
  setIsLoading: (data: boolean) => void;
}

const MainPagePlantList = ({
  userEmail,
  setMyMainPlant,
  setPlantCount,
  setIsLoading,
}: MainPagePlantListProps) => {
  const navigate = useNavigate();
  const [myPlantData, setMyPlantData] = useState<UserPlant[]>([]);

  const compare = (a: UserPlant, b: UserPlant): number => {
    if (a.isMain === b.isMain) {
      return 0;
    } else if (a.isMain) {
      return -1;
    } else {
      return 1;
    }
  };

  const getUserPlantsSorted = async () => {
    try {
      const plantData = await getPlantList(userEmail);
      if (plantData.length == 0) return;
      plantData.sort(compare);
      setMyPlantData(plantData);
      setPlantCount(plantData.length);
    } catch {
      errorNoti('유저 식물 데이터를 불러오지 못 했습니다.');
    }
  };

  const handleClickIsMain = async (clickedPlant: UserPlant) => {
    if (clickedPlant.isMain === false) {
      const previousMain = myPlantData.find(item => (item.isMain = true));

      if (!previousMain) {
        return;
      }

      const updatedTrueFields = {
        id: clickedPlant.id,
        isMain: true,
      };
      const updatedFalseFields = {
        id: previousMain.id,
        isMain: false,
      };
      try {
        await updatePlantInfo(updatedTrueFields);
        await updatePlantInfo(updatedFalseFields);

        const userPlants = await getPlantList(userEmail);
        const mainPlant =
          userPlants.find(plant => plant.isMain) || userPlants[0];
        setMyMainPlant(mainPlant);
        await getUserPlantsSorted();
        successNoti('메인 식물을 변경하였습니다.');
      } catch (error) {
        return;
      }
    }
  };

  const handleEditData = (clickedPlant: UserPlant) => {
    const dataFromList = {
      imgUrlFromList: clickedPlant.imgUrl,
      nicknameFromList: clickedPlant.nickname,
      plantNameFromList: clickedPlant.plantName,
      purchasedDayFromList: clickedPlant.purchasedDay,
      wateredDayFromList: clickedPlant.wateredDays.at(-1),
      frequencyFromList: clickedPlant.frequency,
    };
    navigate(`/myplant/${clickedPlant.id}/edit`, { state: dataFromList });
  };

  useEffect(() => {
    getUserPlantsSorted();
    setIsLoading(false);
  }, []);

  return (
    <>
      <Toast />
      <div className="subplant_container">
        {myPlantData.map(plant => (
          <Link
            key={plant.id}
            to={`/myplant/${plant.id}`}
            className="subplant_list_box_link"
          >
            <div className="subplant_list_box">
              <div className="subplant_main_data">
                <span>
                  <img
                    className="subplant_img"
                    src={plant.imgUrl}
                    alt="subPlantImg"
                  />
                </span>
                <p className="subplant_name">{plant.nickname}</p>
              </div>
              <div className="main_check_and_edit">
                <button
                  onClick={e => {
                    e.preventDefault();
                    handleClickIsMain(plant);
                  }}
                >
                  <img
                    className="main_tag_img"
                    src={plant.isMain ? mainPlantTrueIcon : mainPlantFalseIcon}
                    alt="mainPlantOrNotImg"
                  />
                </button>
                <button
                  onClick={e => {
                    e.preventDefault();
                    handleEditData(plant);
                  }}
                >
                  <img
                    className="edit_button_img"
                    src={myPlantEditIcon}
                    alt="EditPlantImg"
                  />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default MainPagePlantList;
