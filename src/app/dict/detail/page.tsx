'use client';

import { Children, useEffect, useState } from 'react';
import Link from 'next/link';
import { redirect, useSearchParams } from 'next/navigation';
import { codeInfo } from '@/constants/dictionary';
import paths from '@/constants/routePath';
import PageHeader from '@/components/pageHeader/PageHeader';
import { getPlantInfo } from '@/api/dictionary';
import styles from './page.module.scss';
import { PlantType } from '@/@types/dictionary.type';

const environmentContents: Array<{
  type: 'lightCode' | 'waterCode' | 'temperatureCode';
  title: string;
}> = [
  {
    type: 'lightCode',
    title: '햇빛',
  },
  {
    type: 'waterCode',
    title: '물',
  },
  {
    type: 'temperatureCode',
    title: '생육적정온도',
  },
];

interface PlantForm {
  image: string;
  title: string;
  content: string | JSX.Element | string[];
}

const DictDetailPage = () => {
  const plantName = useSearchParams().get('plantName');

  if (!plantName) redirect(paths.dict);
  const [plantInfo, setPlantInfo] = useState<PlantType>();
  const [plantInfoForm, setPlantInfoForm] = useState<PlantForm[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [plantData] = await getPlantInfo(plantName);
        setPlantInfo(plantData);
        setPlantInfoForm([
          {
            image: '/assets/icons/dict/plant4.png',
            title: '종',
            content: plantData.speciesInfo,
          },
          {
            image: '/assets/icons/dict/plant3.png',
            title: '분류',
            content: plantData.classificationInfo,
          },
          {
            image: '/assets/icons/dict/water1.png',
            title: '습도',
            content: codeInfo[plantData.humidityCode],
          },
          {
            image: '/assets/icons/dict/waterpot.png',
            title: '관리 수준',
            content: codeInfo[plantData.recommendCode],
          },
          {
            image: '/assets/icons/dict/bug.png',
            title: '병해충 정보',
            content: plantData.blightInfo,
          },
        ]);
      } catch (error) {
        alert('에러 발생');
      }
    })();
  }, []);

  return (
    <>
      <PageHeader title="식물 상세" />
      <main className={styles.container}>
        {plantInfo && (
          <>
            <section className={styles.thumbnail_wrapper}>
              <img src={plantInfo.imageUrl} alt="plant image" />
              <h3 className={styles.english_name}>
                {plantInfo.scientificName}
              </h3>
              <h3 className={styles.korean_name}>{plantInfo.name}</h3>
              <Link href={`${paths.myplantRegister}?plantName=${plantName}`}>
                <img src="/assets/icons/add_popup.png" alt="plant add image" />
                내 식물로 등록
              </Link>
            </section>
            <div className={styles.info_container}>
              <section className={styles.info_wrapper}>
                <h3>🌱 식물정보</h3>
                <hr />
                {Children.toArray(
                  plantInfoForm.map(
                    ({ image, title, content }) =>
                      content && (
                        <div className={styles.info_type}>
                          <h4>
                            <img src={image} alt="plant icon" />
                            {title}
                          </h4>
                          <p>
                            {Array.isArray(content)
                              ? content.map(item => `${item} `)
                              : content}
                          </p>
                        </div>
                      ),
                  ),
                )}
              </section>
              <section className={styles.env_wrapper}>
                <h3>👍 잘 자라는 환경</h3>
                <hr />
                {Children.toArray(
                  environmentContents.map(({ type, title }) => (
                    <div className={styles.plant_env}>
                      <h4>{title}</h4>
                      <p>{codeInfo[plantInfo[type]]}</p>
                    </div>
                  )),
                )}
              </section>
              {plantInfo.adviseInfo && (
                <section className={styles.info_wrapper}>
                  <h3>📌 관리 Tip</h3>
                  <hr />
                  <div className={styles.info_type}>
                    <p>{plantInfo.adviseInfo}</p>
                  </div>
                </section>
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default DictDetailPage;
