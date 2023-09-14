import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { addUserPlant } from '@/api/userPlant';
import { uploadImg } from '@/api/storage';
import { existPlant } from '@/api/userDiary';
import { waterCodeMap } from '@/constants/dictionary';
import { errorNoti, successNoti } from '@/utils/alarmUtil';
import { dateToTimestamp, formatFullDate } from '@/utils/dateUtil';
import { valueof } from '@/@types';
import { UserPlant } from '@/@types/plant.type';

import './myPlantRegisterPage.scss';
import HeaderBefore from '@/components/headerBefore/HeaderBefore';

import SAMPLE_PLANT from '@/assets/images/icons/sample_plant1.png';
import EDIT_ICON from '@/assets/images/icons/solar_pen-bold.png';
import SEARCH_ICON from '@/assets/images/icons/my_plant_input_glass.png';

interface DictPlantInfo {
  name: string;
  image: string;
  waterCode: 'WC03' | 'WC02' | 'WC01';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateInput = (arg: any): arg is Omit<UserPlant, 'id' | 'isMain'> => {
  if (!arg.plantName) {
    errorNoti('식물을 지정해주세요.');
    return false;
  }

  if (!arg.nickname) {
    errorNoti('식물의 닉네임을 설정해주세요.');
    return false;
  }
  if (!arg.frequency) {
    errorNoti('식물의 물 주기를 설정해주세요.');
    return false;
  }
  if (!arg.purchasedDay) {
    errorNoti('식물과 함께한 날을 지정해주세요.');
    return false;
  }

  return true;
};

const MyPlantRegisterPage = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const dictInfo: DictPlantInfo | null = useLocation().state;

  const [isSaving, setIsSaving] = useState(false);
  const [inputFields, setInputFields] = useState({
    nickname: '',
    frequency: waterCodeMap[dictInfo?.waterCode || 'WC01'],
    imgUrl: dictInfo?.image || '',
    purchasedDay: '',
    wateredDays: '',
  });

  const handleInputField = (type: keyof typeof inputFields, value: string) => {
    let changedValue: valueof<typeof inputFields> = value;

    if (type === 'frequency') {
      changedValue = Number(value);
    }

    setInputFields({
      ...inputFields,
      [type]: changedValue,
    });
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files) return;

    const file = event.target.files[0];

    try {
      const url = await uploadImg(file, 'plant');
      handleInputField('imgUrl', url);
    } catch (error) {
      errorNoti('이미지 업로드 도중 에러가 발생했습니다.');
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.email) return;

    const { wateredDays, purchasedDay, ...restFields } = inputFields;
    const newPlantData = {
      ...restFields,
      plantName: dictInfo?.name,
      purchasedDay: dateToTimestamp(purchasedDay),
      userEmail: user.email,
      wateredDays: wateredDays ? [dateToTimestamp(wateredDays)] : [],
    };

    if (!validateInput(newPlantData)) return;

    try {
      setIsSaving(true);

      const isFirstPlant = await existPlant(user.email);
      await addUserPlant({
        ...newPlantData,
        isMain: isFirstPlant,
      });

      successNoti('새 식물 등록에 성공하였습니다');
      navigate('/myplant');
    } catch (error) {
      errorNoti('식물 등록에 실패하였습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="layout">
      <HeaderBefore ex title="식물 등록" />
      <main>
        <form onSubmit={handleRegister}>
          <div className="my_plant_registeration_container">
            <div className="my_plant_register_img_box">
              <div className="img_wrapper">
                <span>
                  <img
                    className="main_img"
                    src={inputFields.imgUrl || SAMPLE_PLANT}
                    alt="plant"
                  />
                </span>
                <div className="edit_icon_wrapper">
                  <label htmlFor="photoInput" className="photo_label">
                    <img className="edit_icon" src={EDIT_ICON} alt="edit" />
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
            </div>
            <div className="my_plant_input_box">
              <p className="my_plant_input_title">식물선택</p>
              <Link
                to="/dict/search"
                state={{ inputValue: '' }}
                className="my_plant_input_wrapper"
              >
                <input
                  className="my_plant_input"
                  type="text"
                  placeholder="클릭하여 식물 이름을 검색해보세요."
                  value={dictInfo?.name}
                  readOnly
                />
                <img className="input_glass" src={SEARCH_ICON} alt="search" />
              </Link>
            </div>
            <div className="my_plant_info_form">
              <div className="my_plant_name_title required">
                식물별명<p>(5글자 이내로 설정해주세요)</p>
              </div>
              <input
                className="my_plant_name"
                maxLength={5}
                value={inputFields.nickname}
                onChange={e => handleInputField('nickname', e.target.value)}
              />

              <div className="watering_frequency required">
                물 주는 날<p>(주변 환경에 맞게 조절해주세요)</p>
              </div>
              <div className="watering_frequency_input_box">
                <input
                  type="number"
                  className="watering_frequency_input"
                  min={1}
                  max={60}
                  value={inputFields.frequency}
                  onChange={e => handleInputField('frequency', e.target.value)}
                />
                <p className="watering_frequency_info">일에 한 번</p>
              </div>
              <p className="my_plant_register_small_title required">
                식물과 처음 함께한 날{' '}
                <span>(달력을 클릭하여 설정해주세요)</span>
              </p>

              <div className="my_plant_register_calender_value">
                <input
                  type="date"
                  className="date_selector"
                  value={inputFields.purchasedDay}
                  max={formatFullDate(new Date())}
                  onChange={e =>
                    handleInputField('purchasedDay', e.target.value)
                  }
                />
              </div>
              <p className="my_plant_register_small_title">
                마지막 물준 날<span>(선택 입력)</span>
              </p>
              <div className="my_plant_register_calender_value">
                <input
                  type="date"
                  className="date_selector"
                  value={inputFields.wateredDays}
                  max={formatFullDate(new Date())}
                  onChange={e =>
                    handleInputField('wateredDays', e.target.value)
                  }
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="my_plant_register_btn"
            disabled={isSaving}
          >
            {isSaving ? '등록 중...' : '등록하기'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default MyPlantRegisterPage;
