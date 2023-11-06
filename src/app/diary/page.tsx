import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DiaryImages } from '@/constants/diary';
import { useAuth } from '@/hooks';
import { showAlert, showConfirm } from '@/utils/dialog';
import { deleteDiary, existPlant, getUserDiaryList } from '@/api/userDiary';
import { DiaryContentTypes } from '@/@types/diary.type';
import paths from '@/constants/routePath';

import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import Progress from '@/components/progress/Progress';
import ListView from './ListView';
import GalleryView from './GalleryView';

import styles from './diaryMainPage.module.scss';
import ADD_BTN from '@/assets/icons/add_white.png';

type DiaryViewTypes = 'List' | 'Gallery';

interface TabProps {
  label: DiaryViewTypes;
  onImage: string;
  offImage: string;
}

const tabData: TabProps[] = [
  {
    label: 'List',
    onImage: DiaryImages.LISTON,
    offImage: DiaryImages.LISTOFF,
  },
  {
    label: 'Gallery',
    onImage: DiaryImages.GALLERYON,
    offImage: DiaryImages.GALLERYOFF,
  },
];

const DiaryPage = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [diaryData, setDiaryData] = useState<DiaryContentTypes[] | null>(null);
  const [hasPlantsUser, setHasPlantsUser] = useState(false);
  const [currentTab, setCurrentTab] = useState<DiaryViewTypes>('List');
  const [isLoading, setIsLoading] = useState(true);

  const handleDelete = async (diaryId: string) => {
    if (!user?.email) return;

    try {
      setIsLoading(true);

      await deleteDiary(diaryId);
      const newDiaryData = await getUserDiaryList(user.email);

      setDiaryData(newDiaryData);
      showAlert('success', '삭제가 완료되었어요!');
      navigate(paths.diary);
    } catch (error) {
      showAlert('error', '다이어리 삭제 도중 에러가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: DiaryViewTypes) => {
    if (tab !== currentTab) {
      setCurrentTab(tab);
    }
  };

  const handleAddBtn = () => {
    if (hasPlantsUser) {
      navigate(paths.diaryWrite);
      return;
    }

    showConfirm(
      ['등록된 식물이 없습니다.', '내 식물을 등록하시겠습니까?'],
      () => {
        navigate(paths.myplantRegister);
      },
    );
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
        showAlert(
          'error',
          '다이어리 목록을 가져오는 도중 에러가 발생했습니다.',
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user?.email]);

  return (
    <>
      <Header />
      <main className={styles.diary_page}>
        <div className={styles.diary_container}>
          <h2 className={`${styles.title} inner`}>
            <span>{user?.displayName ?? '회원'}</span>님, 식물의 성장 기록을
            남겨보세요.
          </h2>
          <section className={styles.tab_section}>
            {tabData.map(({ label, onImage, offImage }, i) => (
              <div
                key={i}
                className={`${styles.view_tab} ${
                  currentTab === label ? styles.on : ''
                }`}
                onClick={() => handleTabChange(label)}
              >
                <img
                  src={currentTab === label ? onImage : offImage}
                  className={styles.tab_img}
                  alt={`${label}_btn`}
                />
              </div>
            ))}
          </section>
          <section className={styles.content_section}>
            {currentTab === 'List' ? (
              <ListView diaryData={diaryData} handleDelete={handleDelete} />
            ) : (
              <GalleryView diaryData={diaryData} />
            )}
          </section>
        </div>
        <div className={styles.write_btn_wrap}>
          <button className={styles.write_btn} onClick={handleAddBtn}>
            <img src={ADD_BTN} alt="add" />
          </button>
        </div>
      </main>
      <Footer />
      {isLoading && <Progress />}
    </>
  );
};

export default DiaryPage;
