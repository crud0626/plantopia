import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { saveDiary } from '@/api/userDiary';
import { getUserPlantList } from '@/api/userPlant';
import { showAlert } from '@/utils/dialog';
import { InitialDiaryContent } from '@/@types/diary.type';
import paths from '@/constants/routePath';

import './diaryWritePage.scss';
import PageHeader from '@/components/pageHeader/PageHeader';
import DiaryForm from '@/components/diaryForm/DiaryForm';
import Progress from '@/components/progress/Progress';

const DiaryWritePage = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [plantNames, setPlantNames] = useState<string[]>([]);

  const handleClickSave = async (contents: InitialDiaryContent) => {
    try {
      if (!contents.userEmail) throw Error();

      await saveDiary(contents);

      showAlert('success', '저장이 완료되었어요!');
      navigate(paths.diary);
    } catch (error) {
      showAlert('error', '저장에 실패하였습니다.');
    }
  };

  useEffect(() => {
    (async () => {
      if (!user?.email) return;

      try {
        setIsLoading(true);

        const plantNames = await getUserPlantList(user.email).then(plants =>
          plants.map(({ nickname }) => nickname),
        );

        setPlantNames(plantNames);
      } catch (error) {
        showAlert('error', '유저 데이터를 가져오던 도중 에러가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user?.email]);

  return (
    <div className="layout">
      <main className="diary_write_wrap">
        <PageHeader exitBtn title="글쓰기" />
        {user?.email && (
          <DiaryForm
            callerType="write"
            plantNames={plantNames}
            oldContents={{ userEmail: user.email }}
            onSubmit={handleClickSave}
          />
        )}
      </main>
      {isLoading && <Progress />}
    </div>
  );
};

export default DiaryWritePage;
