import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { getUserPlantList } from '@/api/userPlant';
import { getUserDiary, updateDiary } from '@/api/userDiary';
import { showAlert } from '@/utils/dialog';
import { DiaryContentTypes, InitialDiaryContent } from '@/@types/diary.type';
import paths from '@/constants/routePath';

import './diaryEditPage.scss';
import PageHeader from '@/components/pageHeader/PageHeader';
import DiaryForm from '@/components/diaryForm/DiaryForm';
import Progress from '@/components/progress/Progress';

const DiaryEditPage = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const { docId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [plantNames, setPlantNames] = useState<string[]>([]);
  const [oldContents, setOldContents] = useState<DiaryContentTypes | null>(
    null,
  );

  const handleClickSave = async (contents: InitialDiaryContent) => {
    const isInvalid = !user?.email || !docId || !oldContents;

    try {
      if (isInvalid) throw Error();

      const updatedContents: DiaryContentTypes = {
        ...contents,
        id: docId,
        postedAt: oldContents.postedAt,
      };

      await updateDiary(updatedContents);
      navigate(paths.diary);
    } catch (error) {
      showAlert('error', '수정에 실패하였습니다.');
    }
  };

  useEffect(() => {
    (async () => {
      if (!user?.email || !docId) return;

      const userEmail = user.email;

      try {
        setIsLoading(true);

        const [plantList, diaryData] = await Promise.all([
          getUserPlantList(userEmail),
          getUserDiary(docId),
        ]);

        if (!diaryData) throw Error();

        const userPlantNames = plantList.map(({ nickname }) => nickname);

        setOldContents(diaryData);
        setPlantNames(userPlantNames);
      } catch (error) {
        showAlert('error', '유저 데이터를 가져오던 도중 에러가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user?.email]);

  return (
    <div className="layout">
      <PageHeader exitBtn title="수정하기" />
      <main className="diary_write_wrap">
        {oldContents && docId && (
          <DiaryForm
            callerType="edit"
            plantNames={plantNames}
            oldContents={oldContents}
            onSubmit={handleClickSave}
          />
        )}
      </main>
      {isLoading && <Progress />}
    </div>
  );
};

export default DiaryEditPage;
