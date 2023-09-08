import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import HeaderBefore from '@/components/headerBefore/HeaderBefore';
import Progress from '@/components/progress/Progress';
import { secondsToDate, dateToTimestamp, maxDate } from '@/utils/dateUtil';
import { errorNoti, successNoti } from '@/utils/alarmUtil';
import { UserPlant } from '@/@types/plant.type';
import { uploadImg } from '@/api/storage';
import { getUserPlant, updateUserPlant } from '@/api/userPlant';
import './myPlantEditPage.scss';

import myPlantImgEditIcon from '@/assets/images/icons/solar_pen-bold.png';

const MyPlantEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { docId } = useParams();
  const [saving, setSaving] = useState(false);

  const nicknameFromDetail = location.state?.nicknameFromDetail;
  const plantNameFromDetail = location.state?.plantNameFromDetail;
  const purchasedDayFromDetail = location.state?.purchasedDayFromDetail;
  const wateredDayFromDetail = location.state?.wateredDayFromDetail;
  const imgUrlFromDetail = location.state?.imgUrlFromDetail;
  const frequencyFromDetail = location.state?.frequencyFromDetail;

  const imgUrlFromList = location.state?.imgUrlFromList;
  const plantNameFromList = location.state?.plantNameFromList;
  const purchasedDayFromList = location.state?.purchasedDayFromList;
  const nicknameFromList = location.state?.nicknameFromList;
  const wateredDayFromList = location.state?.wateredDayFromList;
  const frequencyFromList = location.state?.frequencyFromList;

  const [myPlantData, setMyPlantData] = useState<UserPlant>();
  const [isLoading, setIsLoading] = useState(true);
  const [plantNickname, setPlantNickname] = useState<string>(
    nicknameFromDetail || nicknameFromList,
  );
  const [plantName, setPlantName] = useState<string>(
    plantNameFromDetail || plantNameFromList,
  );
  const [purchasedDay, setPurchasedDay] = useState<string>(
    secondsToDate(
      purchasedDayFromDetail?.seconds || purchasedDayFromList?.seconds,
    ),
  );
  const [wateredDay, setWateredDay] = useState<string | number>(
    wateredDayFromDetail || wateredDayFromList
      ? secondsToDate(
          wateredDayFromDetail?.seconds || wateredDayFromList?.seconds,
        )
      : 0,
  );
  const [frequency, setFrequency] = useState<number>(
    frequencyFromDetail || frequencyFromList,
  );

  const [imgUrl, setImgUrl] = useState<string>(
    imgUrlFromDetail || imgUrlFromList,
  );
  const [previewImg, setPreviewImg] = useState<string>();

  const handlePlantNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlantNickname(e.target.value);
  };
  const purchasedDayHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPurchasedDay(e.target.value);
  };
  const wateredDaysHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWateredDay(e.target.value);
  };

  const handleFrequency = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFrequency(Number(e.target.value));
  };

  const cleanFileName = (fileName: string) => {
    const cleanedName = fileName.replace(/[^\w\s.-]/gi, '');
    return cleanedName;
  };

  const readFileAsDataURL = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const previewUrl = await readFileAsDataURL(file);
      setPreviewImg(previewUrl);

      const url = await uploadImg(file, 'plant');
      setImgUrl(url);
    } catch (error) {
      return;
    }
    event.target.value = '';
  };

  const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSaving(true);
    if (!docId) return;
    if (!myPlantData?.wateredDays) {
      myPlantData?.wateredDays.push(dateToTimestamp(wateredDay));
    } else {
      myPlantData?.wateredDays.pop();
      myPlantData?.wateredDays.push(dateToTimestamp(wateredDay));
    }

    // const documentRef = doc(db, 'plant', docId);
    const updatedFields = {
      id: docId,
      imgUrl: imgUrl,
      nickname: plantNickname,
      purchasedDay: dateToTimestamp(purchasedDay),
      wateredDays: myPlantData?.wateredDays,
      frequency: frequency,
    };

    try {
      await updateUserPlant(updatedFields);
      successNoti('식물 정보를 수정하였습니다!');
      navigate('/myplant');
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    (async () => {
      if (!docId) return;

      try {
        const plantInfo = await getUserPlant(docId);

        if (!plantInfo) {
          throw new Error('식물이 존재하지 않습니다.');
        }

        setMyPlantData(plantInfo);
        setPlantName(plantInfo.plantName);
        setPlantNickname(plantInfo.nickname);
      } catch (error) {
        errorNoti('식물 정보를 가져올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="layout">
      <HeaderBefore ex={true} title="식물 수정" />
      <main>
        <div className="my_plant_edit_container">
          <div className="my_plant_edit_img_box">
            <div className="img_wrapper">
              <span>
                <img
                  className="main_img"
                  src={imgUrl || previewImg}
                  alt="samplePlant1"
                />
              </span>
              <div className="edit_icon_wrapper">
                <label htmlFor="photoInput" className="photo_label">
                  <img
                    className="edit_icon"
                    src={myPlantImgEditIcon}
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
              <div className="my_plant_input_box">
                <input
                  className="my_plant_edit_input"
                  value={plantName}
                  disabled
                />
              </div>
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
              value={plantNickname}
              onChange={handlePlantNickname}
            />

            <div className="watering_frequency required">
              물 주는 날<span>(주변 환경에 맞게 조절해주세요)</span>
            </div>
            <div className="watering_frequency_input_box">
              <input
                className="watering_frequency_input"
                onChange={handleFrequency}
                defaultValue={frequencyFromDetail || frequencyFromList}
              />
              <p className="watering_frequency_info">일에 한 번</p>
            </div>

            <p className="my_plant_register_small_title  required">
              식물과 처음 함께한 날<span>(달력을 클릭하여 설정해주세요)</span>
            </p>
            <div className="my_plant_register_calender_value">
              <input
                className="date_selector"
                type="date"
                value={purchasedDay}
                onChange={purchasedDayHandler}
              />
            </div>
            <p className="my_plant_register_small_title">
              마지막 물준 날 <span>(선택 입력)</span>
            </p>
            <div className="my_plant_register_calender_value">
              <input
                type="date"
                className="date_selector"
                value={wateredDay}
                onChange={wateredDaysHandler}
                max={maxDate()}
              />
            </div>
          </div>
        </div>
        <button
          className="my_plant_register_btn"
          onClick={handleUpdate}
          disabled={saving}
        >
          {saving ? '수정 중...' : '수정하기'}
        </button>
      </main>
      {isLoading && <Progress />}
    </div>
  );
};

export default MyPlantEditPage;
