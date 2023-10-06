import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveDiary } from '@/api/userDiary';
import { getUserPlantList } from '@/api/userPlant';
import { useAuth } from '@/hooks';
import { showAlert } from '@/utils/dialog';
import { InitialDiaryContent } from '@/@types/diary.type';
import paths from '@/constants/routePath';

import PageHeader from '@/components/pageHeader/PageHeader';
import './diaryWritePage.scss';
import DiaryForm from '@/components/diaryForm/DiaryForm';

const initialContents: InitialDiaryContent = {
  userEmail: '',
  title: '',
  content: '',
  tags: [],
  imgUrls: [],
};

const DiaryWritePage = () => {
  const user = useAuth();
  const navigate = useNavigate();
  // const [isSaving, setIsSaving] = useState(false);
  const [plantNames, setPlantNames] = useState<string[]>([]);
  const [contents, setContents] =
    useState<InitialDiaryContent>(initialContents);

  const handleSaveClick = async (contents: InitialDiaryContent) => {
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

      const userEmail = user.email;
      try {
        const plantList = await getUserPlantList(userEmail);
        const userPlantNames = plantList.map(({ nickname }) => nickname);

        setContents(prev => ({ ...prev, userEmail }));
        setPlantNames(userPlantNames);
      } catch (error) {
        showAlert('error', '유저 데이터를 가져오던 도중 에러가 발생했습니다.');
      }
    })();
  }, [user?.email]);

  return (
    <div className="layout">
      <PageHeader exitBtn title="글쓰기" />
      {user?.email && (
        <DiaryForm
          callerType="write"
          plantNames={plantNames}
          oldContents={{ userEmail: user.email }}
          onSubmit={handleSaveClick}
        />
      )}
    </div>
  );
};

export default DiaryWritePage;
