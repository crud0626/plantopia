import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import HeaderBefore from '@/components/headerBefore/HeaderBefore';
import './myPlantDetailPage.scss';
import editIcon from '@/assets/images/icons/my_plant_detail_edit_icon.png';
import sunOn from '@/assets/images/icons/sun_on_icon.png';
import sunOff from '@/assets/images/icons/sun_off_icon.png';
import waterOn from '@/assets/images/icons/water_on_icon.png';
import waterOff from '@/assets/images/icons/water_off_icon.png';
import { PlantType } from '@/@types/dictionary.type';
import { UserPlant } from '@/@types/plant.type';
import format from 'date-fns/format';
import differenceInMonths from 'date-fns/differenceInMonths';
import { useAuth } from '@/hooks';
import { showAlert } from '@/utils/myPlantUtil';

import {
  doc,
  getDoc,
  getDocs,
  collection,
  where,
  query,
  deleteDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/firebaseApp';
import Toast from '@/components/notification/ToastContainer';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/custom-toast-styles.scss';
import { successNoti } from '@/utils/myPlantUtil';

const MyPlantDetailPage = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const { docId } = useParams();
  const [plantDetail, setPlantDetail] = useState<UserPlant>({
    plantName: '헬로우',
    purchasedDay: Timestamp.fromDate(new Date()),
    wateredDays: [Timestamp.fromDate(new Date())],
  });
  const [plantDictDetail, setPlantDictDetail] = useState<PlantType>();

  const formatSeconds = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const formattedDate = format(date, 'yyyy-MM-dd');
    return formattedDate;
  };

  const calculateMonthDifference = (seconds: number) => {
    const monthsDifference = differenceInMonths(
      new Date(),
      new Date(seconds * 1000),
    );
    return monthsDifference;
  };

  const deletePlant = async () => {
    if (plantDetail) {
      const docRef = doc(db, 'plant', docId);
      const documentSnapshot = await getDoc(docRef);
      const dataBeforeDeletion = documentSnapshot.data();
      if (dataBeforeDeletion?.isMain) {
        await deleteDoc(docRef);
        const querySnapshot = await getDocs(collection(db, 'plant'));
        const firstDocumentid = querySnapshot.docs[0].id;
        const documentRef = doc(db, 'plant', firstDocumentid);
        const updatedFields = {
          isMain: true,
        };
        await updateDoc(documentRef, updatedFields);

        navigate('/myplant');
        successNoti('내 식물을 삭제 하였습니다.');
      } else {
        try {
          await deleteDoc(docRef);

          navigate('/myplant');
          successNoti('내 식물이 삭제 되었습니다.');
        } catch (error) {
          console.error('Error deleting document: ', error);
        }
      }
    }
  };

  useEffect(() => {
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
      where('name', '==', plantDetail?.plantName),
    );

    const getDictDetailData = async () => {
      const querySnapshot = await getDocs(q);
      let plantData;
      querySnapshot.forEach(doc => {
        plantData = doc.data();
      });
      setPlantDictDetail(plantData);
    };
    getPlantDetailData();
    getDictDetailData();
    console.log(plantDetail);
  }, [docId]);

  return (
    <>
      <Toast />
      <HeaderBefore ex={false} title="식물 상세" />
      <main>
        <div className="my_plant_detail_upper_container">
          <img
            className="detail_plant_img"
            src={plantDetail?.imgUrl}
            alt="mainPlantImg"
          />

          <p className="detail_plant_name">{plantDetail?.plantName}</p>
          <div className="detail_nickname_box">
            <p className="detail_plant_nickname">{plantDetail?.nickname}</p>
          </div>

          <div className="my_plant_detail_edit_btn">
            <Link
              to={`/myplant/${docId}/edit`}
              state={{
                imgUrlFromDetail: plantDetail.imgUrl,
                nicknameFromDetail: plantDetail.nickname,
                plantNameFromDetail: plantDetail.plantName,
                purchasedDayFromDetail: plantDetail.purchasedDay,
                wateredDayFromDetail: plantDetail.wateredDays.at(-1),
                frequencyFromDetail: plantDetail.frequency,
              }}
            >
              <div className="my_plant_detail_edit_btn_inner_contents">
                <img src={editIcon} alt="editIcon" />
                <p>식물 정보 수정하기</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="my_plant_detail_lower_container">
          <div className="my_plant_detail_info_box">
            <div className="my_plant_detail_info_head">
              <p>
                ⏰ {plantDetail?.nickname}와 함께한지{' '}
                <span>
                  {calculateMonthDifference(
                    plantDetail?.purchasedDay?.seconds || 0,
                  )}
                  개월
                </span>
                이 지났어요
              </p>
            </div>
            <div className="my_plant_detail_info_metadata">
              <div className="watering_info">
                <span>물주기</span>
                <span>{plantDetail?.frequency} Days</span>
              </div>
              <div className="last_watering_info">
                <span>마지막 물준 날</span>
                <span>
                  {formatSeconds(
                    plantDetail?.wateredDays?.at(-1)?.seconds || 0,
                  )}
                </span>
              </div>
              <div className="first_day_info">
                <span>처음 함께한 날</span>
                <span>
                  {formatSeconds(plantDetail?.purchasedDay?.seconds || 0)}
                </span>
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
          {plantDictDetail?.adviseInfo == null ? null : (
            <div className="my_plant_detail_info_box">
              <div className="my_plant_detail_info_head">
                <p>📌 관리 Tip</p>
              </div>
              <div className="my_plant_detail_info_metadata management_tip_box">
                <p className="management_tip">{plantDictDetail?.adviseInfo}</p>
              </div>
            </div>
          )}
          <p className="more_info_btn">
            식물 도감에서 이 식물 정보 더 알아보기!
          </p>
        </div>

        <button
          className="delete_my_plant"
          onClick={() =>
            showAlert('삭제 확인', '정말로 삭제 하시겠습니까?', deletePlant)
          }
        >
          내 식물 삭제하기
        </button>
      </main>
    </>
  );
};

export default MyPlantDetailPage;
