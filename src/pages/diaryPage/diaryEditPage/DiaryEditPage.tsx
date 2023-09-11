import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { errorNoti, successNoti } from '@/utils/alarmUtil';
import { DiaryContentTypes, Plant } from '@/@types/diary.type';
import { getUserPlantList } from '@/api/userPlant';
import { getUserDiaryList, updateDiary } from '@/api/userDiary';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks';

import HeaderBefore from '@/components/headerBefore/HeaderBefore';
import SectionPhoto from '../SectionPhoto';
import SectionBoard from '../SectionBoard';
import './diaryEditPage.scss';

const DiaryEditPage = () => {
  const user = useAuth();
  const { docId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [plantTag, setPlantTag] = useState<Plant[]>([]);
  const [diaryData, setDiaryData] = useState<DiaryContentTypes[]>([]);

  const [chosenPlants, setChosenPlants] = useState<string[]>([]);
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [state, setState] = useState({
    title: '',
    content: '',
    saving: false,
    isVisible: false,
  });

  const navigate = useNavigate();

  const diaryToUpdate = diaryData.find(diary => diary.id === docId);

  useEffect(() => {
    if (!diaryToUpdate) {
      return;
    }

    const { title, content } = diaryToUpdate;

    setState(prevState => ({
      ...prevState,
      title,
      content,
    }));
    setChosenPlants(diaryToUpdate.tags);
    setImgUrls(diaryToUpdate.imgUrls);
  }, [diaryToUpdate]);

  const toggleSelect = () => {
    setState(({ isVisible, ...restState }) => ({
      ...restState,
      isVisible: !isVisible,
    }));
  };

  const handleChosenPlantClick = (plant: string) => {
    setChosenPlants(prev => prev.filter(p => p !== plant));
  };

  const handlePlantSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedPlant = event.target.value;

    setChosenPlants(prev =>
      prev.includes(selectedPlant)
        ? prev.filter(p => p !== selectedPlant)
        : [...prev, selectedPlant],
    );
  };

  const handleSaveClick = async () => {
    if (!user?.email || !docId) return;

    if (!state.title || chosenPlants.length === 0 || !state.content) {
      errorNoti(
        !state.title
          ? '제목을 작성해주세요.'
          : chosenPlants.length === 0
          ? '관련 식물을 1가지 이상 선택해주세요.'
          : '내용을 작성해주세요.',
      );
      return;
    }

    setIsLoading(true);

    await updateDiary({
      id: docId,
      userEmail: user?.email || '',
      content: state.content,
      // 임시
      postedAt: Timestamp.fromDate(new Date()),
      tags: chosenPlants,
      title: state.title,
      imgUrls: imgUrls,
    });

    setIsLoading(false);
    successNoti('수정이 완료되었어요!');
    navigate('/diary');
  };

  useEffect(() => {
    (async () => {
      if (!user?.email) return;

      const userEmail = user.email;
      try {
        setIsLoading(true);

        const [diaryList, plantList] = await Promise.all([
          getUserDiaryList(userEmail),
          getUserPlantList(userEmail),
        ]);

        const plantsTag: Plant[] = plantList.map(({ nickname }) => ({
          nickname,
          userEmail,
        }));

        setDiaryData(diaryList);
        setPlantTag(plantsTag);
      } catch (error) {
        errorNoti('유저 데이터를 가져오던 도중 에러가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user?.email]);

  if (!docId) {
    return;
  }

  return (
    <div className="layout">
      <HeaderBefore ex={true} title="수정하기" />
      <main className="diary_write_wrap">
        <SectionPhoto imgUrls={imgUrls} setImgUrls={setImgUrls} />
        <SectionBoard
          state={state}
          setState={setState}
          chosenPlants={chosenPlants}
          handleChosenPlantClick={handleChosenPlantClick}
          handlePlantSelection={handlePlantSelection}
          toggleSelect={toggleSelect}
          plantTag={plantTag}
        />
        <button
          className="save_button"
          onClick={handleSaveClick}
          disabled={isLoading}
        >
          {isLoading ? '수정 중...' : '수정하기'}
        </button>
      </main>
    </div>
  );
};

export default DiaryEditPage;
