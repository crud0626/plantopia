import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DiaryImages } from '@/constants/diary';
import { useAuth } from '@/hooks';
import { errorNoti, showAlert, successNoti } from '@/utils/alarmUtil';
import { deleteDiary, existPlant, getUserDiaryList } from '@/api/userDiary';

import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import Progress from '@/components/progress/Progress';
import ListView from './ListView';
import GalleryView from './GalleryView';

import './diaryPage.scss';
import { DiaryProps } from '@/@types/diary.type';

const tabData = [
  {
    name: 'list_tab',
    label: 'List',
    onImage: DiaryImages.LISTON,
    offImage: DiaryImages.LISTOFF,
  },
  {
    name: 'gallery_tab',
    label: 'Gallery',
    onImage: DiaryImages.GALLERYON,
    offImage: DiaryImages.GALLERYOFF,
  },
];

const DiaryPage = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [diaryData, setDiaryData] = useState<DiaryProps[] | null>(null);
  const [hasPlantsUser, setHasPlantsUser] = useState(false);
  const [currentTab, setCurrentTab] = useState('list_tab');
  const [isLoading, setIsLoading] = useState(true);

  const handleDelete = async (diaryId: string) => {
    if (!user?.email) return;

    setIsLoading(true);

    try {
      await deleteDiary(diaryId);
      const newDiaryData = await getUserDiaryList(user.email);

      setDiaryData(newDiaryData);
      successNoti('삭제가 완료되었어요!');
      navigate('/diary');
    } catch (error) {
      errorNoti('다이어리 삭제 도중 에러가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab !== currentTab) {
      setCurrentTab(tab);
    }
  };

  const handleAddBtn = () => {
    if (hasPlantsUser) {
      navigate('/diary/write');
      return;
    }

    showAlert('등록된 식물이 없습니다.', '내 식물을 등록하시겠습니까?', () => {
      navigate('/myplant/register');
    });
  };

  useEffect(() => {
    (async () => {
      if (!user?.email) return;

      try {
        const [diaryList, hasPlants] = await Promise.all([
          getUserDiaryList(user.email),
          existPlant(user.email),
        ]);

        setDiaryData(diaryList);
        setHasPlantsUser(hasPlants);
      } catch (error) {
        errorNoti('다이어리 목록을 가져오는 도중 에러가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user?.email]);

  return (
    <div className="layout">
      <Header />
      <main className="diary_page">
        <div className="diary_container">
          <h2 className="title inner">
            <span>{user?.displayName ?? '사용자'}</span>님, 식물의 성장 기록을
            남겨보세요.
            <span className="plant_icon"></span>
          </h2>
          <section className="tab_section">
            {tabData.map((tab, index) => (
              <div
                key={index}
                className={`view_tab ${tab.name} ${
                  currentTab === tab.name ? 'on' : ''
                }`}
                onClick={() => handleTabChange(tab.name)}
              >
                <img
                  src={currentTab === tab.name ? tab.onImage : tab.offImage}
                  className="tab_img"
                  alt={`Tab ${tab.label}`}
                />
              </div>
            ))}
          </section>
          <section className="content_section">
            {currentTab === 'list_tab' ? (
              <ListView diaryData={diaryData} handleDelete={handleDelete} />
            ) : (
              <GalleryView diaryData={diaryData} />
            )}
          </section>
          <div className="top_btn"></div>
        </div>
        <button onClick={handleAddBtn} className="write_btn_wrap">
          <div className="write_btn"></div>
        </button>
      </main>
      <Footer />
      {isLoading && <Progress />}
    </div>
  );
};

export default DiaryPage;
