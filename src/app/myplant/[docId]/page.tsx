'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import paths from '@/constants/routePath';

import styles from './page.module.scss';
import PageHeader from '@/components/pageHeader/PageHeader';
import Progress from '@/components/progress/Progress';

const MyPlantDetailPage = ({ params }: { params: { docId: string } }) => {
  const { docId } = params;
  const user = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
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
      router.push(paths.myplant);
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

        const [plantsInfo] = await getPlantInfo(plantInfo.plantName);
        setPlantDictDetail(plantsInfo);
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
    <>
      <PageHeader title="내 식물 상세" />
      {plantDetail && (
        <main>
          <div className={styles.upper_container}>
            <img
              className={styles.plant_img}
              src={plantDetail.imgUrl}
              alt="mainPlantImg"
            />
            <p className={styles.plant_name}>
              {plantDictDetail?.scientificName}
            </p>
            <div className={styles.nickname_box}>
              <p
                className={`${styles.nickname} ${
                  plantDetail.isMain ? styles.main : ''
                }`}
              >
                {plantDetail.nickname}
              </p>
            </div>
            <Link
              href={`${paths.myplantEdit}/${docId}`}
              className={styles.edit_btn}
            >
              <img src="/assets/icons/add_popup.png" alt="edit" />
              <p>식물 정보 수정하기</p>
            </Link>
          </div>
          <div className={styles.lower_container}>
            <div className={styles.info_box}>
              <div className={styles.info_head}>
                <p>
                  ⏰ {plantDetail.nickname} 식물과 함께한지{' '}
                  <span>
                    {differenceInMonths(
                      new Date(),
                      plantDetail.purchasedDay.seconds * 1000,
                    )}
                    개월
                  </span>
                  이 지났어요
                </p>
              </div>
              <div className={styles.info_metadata}>
                <div className={styles.watering_info}>
                  <span>물주기</span>
                  <span>{plantDetail.frequency} Days</span>
                </div>
                <div className={styles.last_watering_info}>
                  <span>마지막 물준 날</span>
                  <span>
                    {lastWateringDate
                      ? formatFullDate(new Date(lastWateringDate))
                      : '-'}
                  </span>
                </div>
                <div className={styles.first_day_info}>
                  <span>처음 함께한 날</span>
                  <span>
                    {secondsToDateStr(plantDetail.purchasedDay.seconds)}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.info_box}>
              <div className={styles.info_head}>
                <p>👍 잘 자라는 환경</p>
              </div>
              <div className={`${styles.info_metadata} ${styles.gridset}`}>
                <div>
                  <span>햇빛</span>
                  <span className={styles.sun_on_off}>
                    {codeInfo[plantDictDetail?.lightCode || 'LC']}
                  </span>
                </div>
                <div>
                  <span>물</span>
                  <span className={styles.water_on_off}>
                    {codeInfo[plantDictDetail?.waterCode || 'WC']}
                  </span>
                </div>
                <div>
                  <span>생육 적정 온도</span>
                  <span className={styles.optimal_temp}>
                    {codeInfo[plantDictDetail?.temperatureCode || 'TC']}
                  </span>
                </div>
              </div>
            </div>
            {plantDictDetail?.adviseInfo && (
              <div className={styles.info_box}>
                <div className={styles.info_head}>
                  <p>📌 관리 Tip</p>
                </div>
                <div
                  className={`${styles.info_metadata} ${styles.management_tip_box}`}
                >
                  <p className={styles.management_tip}>
                    {plantDictDetail?.adviseInfo}
                  </p>
                </div>
              </div>
            )}
            <Link
              href={`${paths.dictDetail}?plantName=${plantDictDetail?.name}`}
              className={styles.more_info_btn}
            >
              식물 도감에서 이 식물 정보 더 알아보기!
            </Link>
          </div>
          <button
            className={styles.delete_btn}
            onClick={() =>
              showConfirm('정말로 삭제 하시겠습니까?', deletePlant)
            }
          >
            내 식물에서 삭제하기
          </button>
        </main>
      )}
      {isLoading && <Progress />}
    </>
  );
};

export default MyPlantDetailPage;
