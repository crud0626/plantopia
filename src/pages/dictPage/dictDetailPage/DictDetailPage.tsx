import { Children, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { codeInfo } from '@/constants/dictionary';
import { PlantType } from '@/@types/dictionary.type';
import HeaderBefore from '@/components/headerBefore/HeaderBefore';
import paths from '@/constants/routePath';
import './dictDetailPage.scss';

import ADD_ICON from '@/assets/images/icons/dict_post.png';
import PLANT3_ICON from '@/assets/images/icons/dict_plant3.png';
import PLANT4_ICON from '@/assets/images/icons/dict_plant4.png';
import WATER_ICON from '@/assets/images/icons/dict_water1.png';
import WATERPOT_ICON from '@/assets/images/icons/dict_waterpot.png';
import BUG_ICON from '@/assets/images/icons/dict_bug.png';
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
  const navaigate = useNavigate();
  const plantData: PlantType | undefined = useLocation().state;

  const plantInfoForm = [
    {
      image: PLANT4_ICON,
      title: '종',
      content: plantData?.speciesInfo,
    },
    {
      image: PLANT3_ICON,
      title: '분류',
      content: plantData?.classificationInfo,
    },
    {
      image: WATER_ICON,
      title: '습도',
      content: codeInfo[plantData?.humidityCode || 'HC'],
    },
    {
      image: WATERPOT_ICON,
      title: '관리 수준',
      content: codeInfo[plantData?.recommendCode || 'RC'],
    },
    { image: BUG_ICON, title: '병해충 정보', content: plantData?.blightInfo },
  ];

  const registerState = {
    name: plantData?.name,
    image: plantData?.imageUrl,
    waterCode: plantData?.waterCode,
  };

  useEffect(() => {
    if (!plantData) {
      showAlert('error', '잘못된 접근입니다.');
      navaigate(paths.dict);
    }
  }, []);

  return (
    <div className="layout">
      <HeaderBefore title="식물 상세" />
      <main className="detail_container">
        {plantData && (
          <>
            <section className="thumbnail_wrapper">
              <img src={plantData.imageUrl} alt="plant image" />
              <h3 className="english_name">{plantData.scientificName}</h3>
              <h3 className="korean_name">{plantData.name}</h3>
              <Link to={paths.myplantRegister} state={registerState}>
                <img src={ADD_ICON} alt="plant add image" />내 식물로 등록
              </Link>
            </section>
            <div className="info_container">
              <section className="info_wrapper">
                <h3>🌱 식물정보</h3>
                <hr />
                {Children.toArray(
                  plantInfoForm.map(
                    ({ image, title, content }) =>
                      content && (
                        <div className="info_type">
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
              <section className="env_wrapper">
                <h3>👍 잘 자라는 환경</h3>
                <hr />
                {Children.toArray(
                  environmentContents.map(({ type, title }) => (
                    <div className="plant_env">
                      <h4>{title}</h4>
                      <p>{codeInfo[plantData[type]]}</p>
                    </div>
                  )),
                )}
              </section>
              {plantData.adviseInfo && (
                <section className="info_wrapper">
                  <h3>📌 관리 Tip</h3>
                  <hr />
                  <div className="info_type">
                    <p>{plantData.adviseInfo}</p>
                  </div>
                </section>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DictDetailPage;
