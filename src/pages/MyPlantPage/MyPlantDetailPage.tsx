import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './myPlantDetailPage.scss';
import previousPageIcon from '@/assets/images/icons/my_plant_detail_back_to_previous_page_icon.png';
import ellipseImage from './img/Ellipse_200.png';
import editIcon from '@/assets/images/icons/my_plant_detail_edit_icon.png';
import sunOn from '@/assets/images/icons/sun_on_icon.png';
import sunOff from '@/assets/images/icons/sun_off_icon.png';
import waterOn from '@/assets/images/icons/water_on_icon.png';
import waterOff from '@/assets/images/icons/water_off_icon.png';
import { PlantType } from '../dictPage/Recommend';
import {
  doc,
  getDoc,
  getDocs,
  collection,
  where,
  query,
} from 'firebase/firestore';
import { db } from '@/utils/firebaseApp';

interface MyPlantProps {
  frequency: number;
  imgUrl: string;
  isMain: boolean;
  nickname: string;
  plantName: string;
  purchasedDay: {
    seconds: number;
    nanoseconds: number;
  };
  userEmail: string;
  wateredDays: [
    {
      seconds: number;
      nanoseconds: number;
    },
  ];
}

const MyPlantDetailPage = () => {
  const [plantDetail, setPlantDetail] = useState<MyPlantProps>({});
  const [plantDictDetail, setPlantDictDetail] = useState<PlantType>();

  function formatSeconds(seconds: number) {
    const date = new Date(seconds * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  function calculateMonthDifference(milliseconds: number) {
    const currentDate = new Date();
    const timestampDate = new Date(milliseconds);

    const yearDiff = currentDate.getFullYear() - timestampDate.getFullYear();
    const monthDiff = currentDate.getMonth() - timestampDate.getMonth();
    const totalMonthDiff = yearDiff * 12 + monthDiff;

    return totalMonthDiff;
  }

  const { docId } = useParams();
  const getPlantDetailData = async () => {
    const docRef = doc(db, 'plant', docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log(docSnap.data());
      setPlantDetail(docSnap.data());
    } else {
      console.log('문서가 존재하지 않습니다.');
    }
  };
  const q = query(
    collection(db, 'dictionary'),
    where('name', '==', '몬스테라'),
  );
  const getDictDetailData = async () => {
    const querySnapshot = await getDocs(q);
    let plantData;
    querySnapshot.forEach(doc => {
      plantData = doc.data();
    });
    setPlantDictDetail(plantData);
  };
  console.log(plantDictDetail);
  useEffect(() => {
    getPlantDetailData();
    console.log(plantDetail);
    getDictDetailData();
  }, []);

  return (
    <>
      <div className="my_plant_detail_header">
        <img src={previousPageIcon} alt="goToPreviousPage" />
        <p>식물 상세</p>
      </div>
      <div className="my_plant_detail_upper_container">
        <div className="main_plant_main_data">
          <p className="main_plant_head">메인 식물</p>
          <img
            className="main_plant_img"
            src={plantDetail.imgUrl}
            alt="mainPlantImg"
          />
          <p className="main_plant_name">{plantDetail.nickname}</p>
        </div>
        <div className="my_plant_detail_edit_btn">
          <div className="my_plant_detail_edit_btn_inner_contents">
            <img src={editIcon} alt="editIcon" />
            <p>식물 정보 수정하기</p>
          </div>
        </div>
      </div>
      <div className="my_plant_detail_lower_container">
        <div className="my_plant_detail_info_box">
          <div className="my_plant_detail_info_head">
            <p>
              ⏰ {plantDetail.nickname}와 함께한지 <span>6개월</span>이 지났어요
            </p>
          </div>
          <div className="my_plant_detail_info_metadata">
            <div className="watering_info">
              <span>물주기</span>
              <span>{plantDetail.frequency} Days</span>
            </div>
            <div className="last_watering_info">
              <span>마지막 물준 날</span>
              <span>
                {/* {plantDetail.wateredDays[plantDetail.wateredDays.length - 1] ==
                undefined
                  ? '안녕하세요'
                  : formatSeconds(
                      plantDetail.wateredDays[
                        plantDetail.wateredDays.length - 1
                      ].seconds,
                    )} */}
                미정
              </span>
            </div>
            <div className="first_day_info">
              <span>처음 함께한 날</span>
              <span>헬로우</span>
              {/* {formatSeconds(plantDetail.purchasedDay.seconds)}  */}
            </div>
          </div>
        </div>
        <div className="my_plant_detail_info_box">
          <div className="my_plant_detail_info_head">
            <p>👍 잘 자라는 환경</p>
          </div>
          <div className="my_plant_detail_info_metadata gridset">
            <div>
              <span>햇빛</span>
              <span className="sun_on_off">
                {(() => {
                  if (plantDictDetail?.lightCode === 'LC01') {
                    return (
                      <>
                        <img src={sunOn} alt="" />
                        <img src={sunOff} alt="" />
                        <img src={sunOff} alt="" />
                      </>
                    );
                  } else if (plantDictDetail?.lightCode === 'LC02') {
                    return (
                      <>
                        <img src={sunOn} alt="" />
                        <img src={sunOn} alt="" />
                        <img src={sunOff} alt="" />
                      </>
                    );
                  } else {
                    return (
                      <>
                        <img src={sunOn} alt="" />
                        <img src={sunOn} alt="" />
                        <img src={sunOn} alt="" />
                      </>
                    );
                  }
                })()}
              </span>
            </div>
            <div>
              <span>물</span>
              <span className="water_on_off">
                {(() => {
                  if (plantDictDetail?.waterCode === 'WC01') {
                    return (
                      <>
                        <img src={waterOn} alt="" />
                        <img src={waterOff} alt="" />
                        <img src={waterOff} alt="" />
                      </>
                    );
                  } else if (plantDictDetail?.lightCode === 'WC02') {
                    return (
                      <>
                        <img src={waterOn} alt="" />
                        <img src={waterOn} alt="" />
                        <img src={waterOff} alt="" />
                      </>
                    );
                  } else {
                    return (
                      <>
                        <img src={waterOn} alt="" />
                        <img src={waterOn} alt="" />
                        <img src={waterOn} alt="" />
                      </>
                    );
                  }
                })()}
              </span>
            </div>
            <div>
              <span>생육 적정 온도</span>
              <span className="optimal_temp">
                {(() => {
                  if (plantDictDetail?.temperatureCode === 'TC01') {
                    return '10 ~ 15℃';
                  } else if (plantDictDetail?.temperatureCode === 'TC02') {
                    return '16 ~ 20℃';
                  } else if (plantDictDetail?.temperatureCode === 'TC03') {
                    return '21 ~ 25℃';
                  } else {
                    return '26 ~ 30℃';
                  }
                })()}
              </span>
            </div>
          </div>
        </div>
        <div className="my_plant_detail_info_box">
          <div className="my_plant_detail_info_head">
            <p>📌 관리 Tip</p>
          </div>
          <div className="my_plant_detail_info_metadata management_tip_box">
            <p className="management_tip">{plantDictDetail?.adviseInfo}</p>
          </div>
        </div>
        <p className="more_info_btn">식물 도감에서 이 식물 정보 더 알아보기!</p>
      </div>
    </>
  );
};

export default MyPlantDetailPage;
