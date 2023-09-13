import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { uploadImg } from '@/api/storage';
import { getUserPlant, updateUserPlant } from '@/api/userPlant';
import { Timestamp } from 'firebase/firestore';
import {
  dateToTimestamp,
  formatFullDate,
  secondsToDate,
} from '@/utils/dateUtil';
import { errorNoti, showAlert, successNoti } from '@/utils/alarmUtil';
import { UserPlant } from '@/@types/plant.type';

import HeaderBefore from '@/components/headerBefore/HeaderBefore';
import Progress from '@/components/progress/Progress';

import './myPlantEditPage.scss';
import EDIT_ICON from '@/assets/images/icons/solar_pen-bold.png';

const MyPlantEditPage = () => {
  const navigate = useNavigate();
  const { docId } = useParams();
  const targetPlant: UserPlant | null = useLocation().state;
  const [isLoading, setIsLoading] = useState(true);
  const [userPlant, setUserPlant] = useState<UserPlant | null>(targetPlant);

  const handleInput = (type: keyof UserPlant, value: string) => {
    if (!userPlant) return;

    const watered = [...userPlant.wateredDays];
    let changedValue:
      | string
      | number
      | InstanceType<typeof Timestamp>
      | InstanceType<typeof Timestamp>[];

    switch (type) {
      case 'frequency':
        changedValue = Number(value);
        break;
      case 'purchasedDay':
        changedValue = dateToTimestamp(value);
        break;
      case 'wateredDays':
        watered.pop();
        changedValue = [...watered, dateToTimestamp(value)];
        break;
      default:
        changedValue = value;
    }

    setUserPlant({
      ...userPlant,
      [type]: changedValue,
    });
  };

  const handleFileSelect = async ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (!target.files) return;

    const file = target.files[0];

    try {
      setIsLoading(true);

      const url = await uploadImg(file, 'plant');
      handleInput('imgUrl', url);
    } catch (error) {
      errorNoti('이미지 업로드 중 에러가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!userPlant) return;

    try {
      setIsLoading(true);

      await updateUserPlant(userPlant);
      successNoti('식물 정보를 수정하였습니다!');
      navigate('/myplant');
    } catch (error) {
      errorNoti('식물 수정에 실패하였습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!docId || userPlant) {
        setIsLoading(false);
        return;
      }

      try {
        const plantInfo = await getUserPlant(docId);

        if (!plantInfo) {
          errorNoti('존재하지 않는 식물 정보입니다.');
          navigate('/myplant');
          return;
        }

        setUserPlant(plantInfo);
      } catch (error) {
        errorNoti('식물 정보를 가져올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const lastWateredDay = userPlant?.wateredDays?.at(-1);

  return (
    <div className="layout">
      <HeaderBefore ex title="식물 수정" />
      <main>
        {userPlant && (
          <>
            <div className="my_plant_edit_container">
              <div className="my_plant_edit_img_box">
                <div className="img_wrapper">
                  <span>
                    <img
                      className="main_img"
                      src={userPlant.imgUrl}
                      alt="samplePlant1"
                    />
                  </span>
                  <div className="edit_icon_wrapper">
                    <label htmlFor="photoInput" className="photo_label">
                      <img
                        className="edit_icon"
                        src={EDIT_ICON}
                        alt="editIcon"
                      />
                    </label>
                    <input
                      className="photo_input"
                      id="photoInput"
                      accept="image/*"
                      type="file"
                      onChange={handleFileSelect}
                    />
                  </div>
                </div>
                <div className="my_plant_input_box">
                  <input
                    className="my_plant_edit_input"
                    value={userPlant.plantName}
                    disabled
                  />
                </div>
              </div>
              <div className="my_plant_info_form">
                <div className="my_plant_name_title required">
                  식물 별명
                  <span>(5글자 이내로 설정해주세요)</span>
                </div>
                <input
                  className="my_plant_name"
                  maxLength={5}
                  value={userPlant.nickname}
                  onChange={e => handleInput('nickname', e.target.value)}
                />
                <div className="watering_frequency required">
                  물 주는 날<span>(주변 환경에 맞게 조절해주세요)</span>
                </div>
                <div className="watering_frequency_input_box">
                  <input
                    className="watering_frequency_input"
                    defaultValue={userPlant.frequency}
                    onChange={e => handleInput('frequency', e.target.value)}
                  />
                  <p className="watering_frequency_info">일에 한 번</p>
                </div>
                <p className="my_plant_register_small_title  required">
                  식물과 처음 함께한 날
                  <span>(달력을 클릭하여 설정해주세요)</span>
                </p>
                <div className="my_plant_register_calender_value">
                  <input
                    className="date_selector"
                    type="date"
                    value={secondsToDate(userPlant.purchasedDay.seconds)}
                    onChange={e => handleInput('purchasedDay', e.target.value)}
                  />
                </div>
                <p className="my_plant_register_small_title">
                  마지막 물준 날 <span>(선택 입력)</span>
                </p>
                <div className="my_plant_register_calender_value">
                  <input
                    type="date"
                    className="date_selector"
                    value={
                      lastWateredDay ? secondsToDate(lastWateredDay.seconds) : 0
                    }
                    max={formatFullDate(new Date())}
                    onChange={e => handleInput('wateredDays', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <button
              className="my_plant_register_btn"
              disabled={isLoading}
              onClick={e => {
                e.preventDefault();
                showAlert('수정하시겠습니까?', '', handleUpdate);
              }}
            >
              {isLoading ? '수정 중...' : '수정하기'}
            </button>
          </>
        )}
      </main>
      {isLoading && <Progress />}
    </div>
  );
};

export default MyPlantEditPage;
