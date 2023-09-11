import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks';
import { errorNoti, successNoti } from '@/utils/alarmUtil';
import { saveDiary } from '@/api/userDiary';
import { getUserPlantList } from '@/api/userPlant';
import { Plant } from '@/@types/diary.type';

import HeaderBefore from '@/components/headerBefore/HeaderBefore';
import SectionPhoto from './SectionPhoto';
import SectionBoard from './SectionBoard';
import './diaryWritePage.scss';

const DiaryWritePage = () => {
  const user = useAuth();
  const [plantTag, setPlantTag] = useState<Plant[]>([]);
  const navigate = useNavigate();

  const [state, setState] = useState({
    title: '',
    content: '',
    saving: false,
    isVisible: false,
  });

  const [chosenPlants, setChosenPlants] = useState<string[]>([]);
  const [imgUrls, setImgUrls] = useState<string[]>([]);

  const toggleSelect = () =>
    setState(prevState => ({ ...prevState, isVisible: !prevState.isVisible }));

  const handleChosenPlantClick = (plant: string) =>
    setChosenPlants(prev => prev.filter(p => p !== plant));

  const handlePlantSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedPlant = event.target.value;

    setChosenPlants(prev =>
      prev.includes(selectedPlant)
        ? prev.filter(p => p !== selectedPlant)
        : [...prev, selectedPlant],
    );
  };

  const handleSaveClick = async () => {
    if (!user?.email) return;

    const { title, content } = state;

    if (!title || chosenPlants.length === 0 || !content) {
      errorNoti(
        !title
          ? '제목을 작성해주세요.'
          : chosenPlants.length === 0
          ? '관련 식물을 1가지 이상 선택해주세요.'
          : '내용을 작성해주세요.',
      );
      return;
    }

    setState(prev => ({ ...prev, saving: true }));

    await saveDiary({
      userEmail: user.email,
      content,
      postedAt: Timestamp.fromDate(new Date()),
      tags: chosenPlants,
      title,
      imgUrls,
    });

    setState({ title: '', content: '', saving: false, isVisible: false });
    setChosenPlants([]);

    successNoti('저장이 완료되었어요!');
    navigate('/diary');
  };

  useEffect(() => {
    (async () => {
      if (!user?.email) return;

      const userEmail = user.email;
      try {
        const plantList = await getUserPlantList(userEmail);
        const plantsTag: Plant[] = plantList.map(({ nickname }) => ({
          nickname,
          userEmail,
        }));

        setPlantTag(plantsTag);
      } catch (error) {
        errorNoti('유저 데이터를 가져오던 도중 에러가 발생했습니다.');
      }
    })();
  }, [user?.email]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targetElement = event.target as HTMLElement;

      if (state.isVisible && !targetElement.closest('.plant_select_wrapper')) {
        setState(prev => ({ ...prev, isVisible: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [state.isVisible]);

  return (
    <div className="layout">
      <HeaderBefore ex={true} title="글쓰기" />
      {user?.email && (
        <>
          <main className="diary_main">
            <SectionPhoto
              userEmail={user.email}
              imgUrls={imgUrls}
              setImgUrls={setImgUrls}
            />
            <SectionBoard
              state={state}
              setState={setState}
              chosenPlants={chosenPlants}
              toggleSelect={toggleSelect}
              handleChosenPlantClick={handleChosenPlantClick}
              handlePlantSelection={handlePlantSelection}
              plantTag={plantTag}
            />
          </main>
          <button
            className="save_button"
            onClick={handleSaveClick}
            disabled={state.saving}
          >
            {state.saving ? '저장 중...' : '저장하기'}
          </button>
        </>
      )}
    </div>
  );
};

export default DiaryWritePage;
