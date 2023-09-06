import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useDiaryData from '@/hooks/useDiaryData';
import HeaderBefore from '@/components/headerBefore/HeaderBefore';
import SectionEditPhoto from './SectionEditPhoto';
import SectionEditBoard from './SectionEditBoard';
import { errorNoti, successNoti } from '@/utils/alarmUtil';
import './diaryEditPage.scss';
import { modifyDiaryData } from '@/api/userDiary';
import { Timestamp } from 'firebase/firestore';

const DiaryEditPage = () => {
  const { docId } = useParams();
  const { user, diaryData, isLoading, setIsLoading, plantTag } = useDiaryData();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [chosenPlants, setChosenPlants] = useState<string[]>([]);
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();

  const diaryToUpdate = diaryData.find(diary => diary.id === docId);

  useEffect(() => {
    if (!diaryToUpdate) {
      return;
    }

    setTitle(diaryToUpdate.title);
    setContent(diaryToUpdate.content);
    setChosenPlants(diaryToUpdate.tags);
    setImgUrls(diaryToUpdate.imgUrls);
  }, [diaryToUpdate]);

  const toggleSelect = () => {
    setIsVisible(prevVisible => !prevVisible);
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

    setIsLoading(true);

    await modifyDiaryData({
      id: docId,
      userEmail: user?.email || '',
      content: content,
      // 임시
      postedAt: Timestamp.fromDate(new Date()),
      tags: chosenPlants,
      title: title,
      imgUrls: imgUrls,
    });

    setIsLoading(false);
    successNoti('수정이 완료되었어요!');
    navigate('/diary');
  };

  if (!docId) {
    return;
  }

  return (
    <div className="layout">
      <HeaderBefore ex={true} title="수정하기" />
      <main className="diary_write_wrap">
        <SectionEditPhoto
          imgUrls={imgUrls}
          setImgUrls={setImgUrls}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        <SectionEditBoard
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          chosenPlants={chosenPlants}
          handleChosenPlantClick={handleChosenPlantClick}
          handlePlantSelection={handlePlantSelection}
          isVisible={isVisible}
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
