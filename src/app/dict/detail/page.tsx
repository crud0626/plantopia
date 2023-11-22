import { Children } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { codeInfo } from '@/constants/dictionary';
import paths from '@/constants/routePath';
import PageHeader from '@/components/pageHeader/PageHeader';
import { getPlantInfo } from '@/api/dictionary';
import styles from './page.module.scss';

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

const DictDetailPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const { plantName: plantNameQuery } = searchParams;
  const plantName = Array.isArray(plantNameQuery)
    ? plantNameQuery[0]
    : plantNameQuery;

  if (!plantName) redirect(paths.dict);

  const [plantInfo] = await getPlantInfo(plantName);

  const plantInfoForm = [
    {
      image: '/assets/icons/dict/plant4.png',
      title: '종',
      content: plantInfo.speciesInfo,
    },
    {
      image: '/assets/icons/dict/plant3.png',
      title: '분류',
      content: plantInfo.classificationInfo,
    },
    {
      image: '/assets/icons/dict/water1.png',
      title: '습도',
      content: codeInfo[plantInfo.humidityCode],
    },
    {
      image: '/assets/icons/dict/waterpot.png',
      title: '관리 수준',
      content: codeInfo[plantInfo.recommendCode],
    },
    {
      image: '/assets/icons/dict/bug.png',
      title: '병해충 정보',
      content: plantInfo.blightInfo,
    },
  ];

  return (
    <>
      <PageHeader title="식물 상세" />
      <main className={styles.container}>
        <section className={styles.thumbnail_wrapper}>
          <img src={plantInfo.imageUrl} alt="plant image" />
          <h3 className={styles.english_name}>{plantInfo.scientificName}</h3>
          <h3 className={styles.korean_name}>{plantInfo.name}</h3>
          <Link href={`${paths.myplantRegister}?plantName=${plantName}`}>
            <img src="/assets/icons/add_popup.png" alt="plant add image" />내
            식물로 등록
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
      </main>
    </>
  );
};

export default DictDetailPage;
