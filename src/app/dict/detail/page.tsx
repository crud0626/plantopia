'use client';

import { Children, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { codeInfo } from '@/constants/dictionary';
import { PlantType } from '@/@types/dictionary.type';
import PageHeader from '@/components/pageHeader/PageHeader';
import paths from '@/constants/routePath';
import styles from './page.module.scss';

import { showAlert } from '@/utils/dialog';

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

const DictDetailPage = () => {
  const router = useRouter();
  // 임시
  const plantData: PlantType | undefined = undefined;

  const plantInfoForm = [
    {
      image: '/assets/icons/dict/plant4.png',
      title: '종',
      content: plantData?.speciesInfo,
    },
    {
      image: '/assets/icons/dict/plant3.png',
      title: '분류',
      content: plantData?.classificationInfo,
    },
    {
      image: '/assets/icons/dict/water1.png',
      title: '습도',
      content: codeInfo[plantData?.humidityCode || 'HC'],
    },
    {
      image: '/assets/icons/dict/waterpot.png',
      title: '관리 수준',
      content: codeInfo[plantData?.recommendCode || 'RC'],
    },
    {
      image: '/assets/icons/dict/bug.png',
      title: '병해충 정보',
      content: plantData?.blightInfo,
    },
  ];

  const registerState = {
    name: plantData?.name,
    image: plantData?.imageUrl,
    waterCode: plantData?.waterCode,
  };

  useEffect(() => {
    if (!plantData) {
      showAlert('error', '잘못된 접근입니다.');
      router.push(paths.dict);
    }
  }, []);

  return (
    <>
      <PageHeader title="식물 상세" />
      <main className={styles.container}>
        {plantData && (
          <>
            <section className={styles.thumbnail_wrapper}>
              <img src={plantData.imageUrl} alt="plant image" />
              <h3 className={styles.english_name}>
                {plantData.scientificName}
              </h3>
              <h3 className={styles.korean_name}>{plantData.name}</h3>
              <Link href={paths.myplantRegister}>
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
                      <p>{codeInfo[plantData[type]]}</p>
                    </div>
                  )),
                )}
              </section>
              {plantData.adviseInfo && (
                <section className={styles.info_wrapper}>
                  <h3>📌 관리 Tip</h3>
                  <hr />
                  <div className={styles.info_type}>
                    <p>{plantData.adviseInfo}</p>
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
