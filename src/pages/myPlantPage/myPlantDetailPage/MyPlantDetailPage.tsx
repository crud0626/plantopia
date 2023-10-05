import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { differenceInMonths } from 'date-fns';
import { useAuth } from '@/hooks';
import { formatFullDate, secondsToDateStr } from '@/utils/date';
import { showAlert, showConfirm } from '@/utils/dialog';
import { PlantType } from '@/@types/dictionary.type';
import { UserPlant } from '@/@types/plant.type';
import { codeInfo } from '@/constants/dictionary';
import {
  getUserPlant,
  getUserPlantList,
  deleteUserPlant,
  updateUserPlant,
} from '@/api/userPlant';
import { getPlantInfo } from '@/api/dictionary';

import './myPlantDetailPage.scss';
import HeaderBefore from '@/components/headerBefore/HeaderBefore';
import Progress from '@/components/progress/Progress';
import EDIT_ICON from '@/assets/images/icons/my_plant_detail_edit_icon.png';

const MyPlantDetailPage = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const { docId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [plantDetail, setPlantDetail] = useState<UserPlant | null>(null);
  const [plantDictDetail, setPlantDictDetail] = useState<PlantType>();

  const deletePlant = async () => {
    if (!docId || !plantDetail || !user?.email) return;

    try {
      await deleteUserPlant(docId);

      const userPlants = await getUserPlantList(user.email);
      const hasMainPlant = userPlants.find(plant => plant.isMain);

      if (userPlants.length > 0 && !hasMainPlant) {
        const nextMainPlant = userPlants[0];
        nextMainPlant.isMain = true;
        await updateUserPlant(nextMainPlant);
      }

      showAlert('success', '내 식물이 삭제 되었습니다.');
      navigate('/myplant');
    } catch (error) {
      showAlert('error', '에러가 발생했습니다.');
    }
  };

  useEffect(() => {
    (async () => {
      if (!docId) return;

      try {
        const plantInfo = await getUserPlant(docId);
        if (!plantInfo) throw new Error();

        setPlantDetail(plantInfo);

        const plantsInfo = await getPlantInfo(plantInfo.plantName);
        setPlantDictDetail(plantsInfo[0]);
      } catch (error) {
        showAlert('error', '식물 정보를 가져오는 도중 에러가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [docId]);

  const lastWateringDate =
    (plantDetail?.wateredDays.at(-1)?.seconds || 0) * 1000;

  return (
    <div className="layout">
      <HeaderBefore title="내 식물 상세" />
      {plantDetail && (
        <main>
          <div className="my_plant_detail_upper_container">
            <span className="detail_img_wrap">
              <img
                className="detail_plant_img"
                src={plantDetail.imgUrl}
                alt="mainPlantImg"
              />
            </span>
            <p className="detail_plant_name">
              {plantDictDetail?.scientificName}
            </p>
            <div className="detail_nickname_box">
              <p
                className={`${
                  plantDetail.isMain
                    ? 'detail_plant_nickname_main'
                    : 'detail_plant_nickname'
                }`}
              >
                {plantDetail.nickname}
              </p>
            </div>
            <Link
              to={`/myplant/edit/${docId}`}
              state={plantDetail}
              className="my_plant_detail_edit_btn"
            >
              <div className="my_plant_detail_edit_btn_inner_contents">
                <img src={EDIT_ICON} alt="edit" />
                <p>식물 정보 수정하기</p>
              </div>
            </Link>
          </div>
          <div className="my_plant_detail_lower_container">
            <div className="my_plant_detail_info_box">
              <div className="my_plant_detail_info_head">
                <p>
                  ⏰ {plantDetail.nickname} 식물과 함께한지{' '}
                  <span>
                    {differenceInMonths(
                      plantDetail.purchasedDay.seconds * 1000,
                      new Date(),
                    )}
                    개월
                  </span>
                  이 지났어요
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
                    {lastWateringDate
                      ? formatFullDate(new Date(lastWateringDate))
                      : '-'}
                  </span>
                </div>
                <div className="first_day_info">
                  <span>처음 함께한 날</span>
                  <span>
                    {secondsToDateStr(plantDetail.purchasedDay.seconds)}
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
                    {codeInfo[plantDictDetail?.lightCode || 'LC']}
                  </span>
                </div>
                <div>
                  <span>물</span>
                  <span className="water_on_off">
                    {codeInfo[plantDictDetail?.waterCode || 'WC']}
                  </span>
                </div>
                <div>
                  <span>생육 적정 온도</span>
                  <span className="optimal_temp">
                    {codeInfo[plantDictDetail?.temperatureCode || 'TC']}
                  </span>
                </div>
              </div>
            </div>
            {!plantDictDetail?.adviseInfo && (
              <div className="my_plant_detail_info_box">
                <div className="my_plant_detail_info_head">
                  <p>📌 관리 Tip</p>
                </div>
                <div className="my_plant_detail_info_metadata management_tip_box">
                  <p className="management_tip">
                    {plantDictDetail?.adviseInfo}
                  </p>
                </div>
              </div>
            )}
            <Link
              to={`/dict/detail?plantName=${plantDictDetail?.name}`}
              state={plantDictDetail}
              className="more_info_btn"
            >
              식물 도감에서 이 식물 정보 더 알아보기!
            </Link>
          </div>
          <button
            className="delete_my_plant"
            onClick={() =>
              showConfirm('정말로 삭제 하시겠습니까?', deletePlant)
            }
          >
            내 식물에서 삭제하기
          </button>
        </main>
      )}
      {isLoading && <Progress />}
    </div>
  );
};

export default MyPlantDetailPage;
