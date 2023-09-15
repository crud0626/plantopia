import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import { uploadImg } from '@/api/storage';
import { errorNoti, showAlert } from '@/utils/alarmUtil';
import { formatFullDate, secondsToDate } from '@/utils/dateUtil';
import { UserPlant } from '@/@types/plant.type';
import { valueof } from '@/@types';

import './myPlantForm.scss';
import DEFAULT_IMG from '@/assets/images/icons/sample_plant1.png';
import EDIT_ICON from '@/assets/images/icons/solar_pen-bold.png';
import SEARCH_ICON from '@/assets/images/icons/my_plant_input_glass.png';

interface FormStateTypes
  extends Pick<
    UserPlant,
    | 'frequency'
    | 'imgUrl'
    | 'nickname'
    | 'purchasedDay'
    | 'wateredDays'
    | 'plantName'
  > {}

interface MyPlantFormProps {
  pageName: 'edit' | 'register';
  plantInfo?: Partial<FormStateTypes>;
  isLoading: boolean;
  onSubmit: (plantInfo: Omit<UserPlant, 'id' | 'isMain' | 'userEmail'>) => void;
}

const validateForm = (arg: any): arg is Omit<UserPlant, 'id' | 'isMain'> => {
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

const subjectsText: { [key in MyPlantFormProps['pageName']]: string } = {
  edit: '수정',
  register: '등록',
};

const initialFormValue: FormStateTypes = {
  plantName: '',
  nickname: '',
  frequency: 1,
  imgUrl: '',
  purchasedDay: Timestamp.fromDate(new Date()),
  wateredDays: [],
};

const MyPlantForm = ({
  pageName,
  plantInfo = {},
  isLoading,
  onSubmit,
}: MyPlantFormProps) => {
  const subject = subjectsText[pageName];
  const [formValues, setFormValues] = useState<FormStateTypes>({
    ...initialFormValue,
    ...plantInfo,
  });

  const handleInputField = (type: keyof typeof formValues, value: string) => {
    let changedValue: valueof<typeof formValues>;

    switch (type) {
      case 'frequency':
        changedValue = Number(value);
        break;
      case 'purchasedDay':
        changedValue = Timestamp.fromDate(new Date(value));
        break;
      case 'wateredDays':
        const newWateredDays = [...formValues.wateredDays];
        const lastIndex = newWateredDays.length;
        newWateredDays[lastIndex] = Timestamp.fromDate(new Date(value));
        changedValue = newWateredDays;
        break;
      default:
        changedValue = value;
    }

    setFormValues({
      ...formValues,
      [type]: changedValue,
    });
  };

  const handlePlantImg = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];

    try {
      const url = await uploadImg(file, 'plant');
      handleInputField('imgUrl', url);
    } catch (error) {
      errorNoti('이미지 업로드 도중 에러가 발생했습니다.');
    }
  };

  const handleSubmit = () => {
    if (!validateForm(formValues)) return;

    onSubmit(formValues);
  };

  const lastWateredDay = formValues.wateredDays.at(-1);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        showAlert(`${subject}하시겠습니까?`, '', handleSubmit);
      }}
    >
      <div className="my_plant_registeration_container">
        <div className="my_plant_register_img_box">
          <div className="img_wrapper">
            <span>
              <img
                className="main_img"
                src={formValues.imgUrl || DEFAULT_IMG}
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
                onChange={handlePlantImg}
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
              value={formValues.plantName}
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
            value={formValues.nickname}
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
              value={formValues.frequency}
              onChange={e => handleInputField('frequency', e.target.value)}
            />
            <p className="watering_frequency_info">일에 한 번</p>
          </div>
          <p className="my_plant_register_small_title required">
            식물과 처음 함께한 날 <span>(달력을 클릭하여 설정해주세요)</span>
          </p>
          <div className="my_plant_register_calender_value">
            <input
              type="date"
              className="date_selector"
              value={secondsToDate(formValues.purchasedDay.seconds)}
              max={formatFullDate(new Date())}
              onChange={e => handleInputField('purchasedDay', e.target.value)}
            />
          </div>
          <p className="my_plant_register_small_title">
            마지막 물준 날<span>(선택 입력)</span>
          </p>
          <div className="my_plant_register_calender_value">
            <input
              type="date"
              className="date_selector"
              value={
                lastWateredDay ? secondsToDate(lastWateredDay.seconds) : '0'
              }
              max={formatFullDate(new Date())}
              onChange={e => handleInputField('wateredDays', e.target.value)}
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="my_plant_register_btn"
        disabled={isLoading}
      >
        {isLoading ? `${subject} 중...` : `${subject}하기`}
      </button>
    </form>
  );
};

export default MyPlantForm;
