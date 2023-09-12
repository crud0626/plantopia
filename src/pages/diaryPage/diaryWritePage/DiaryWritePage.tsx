import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveDiary } from '@/api/userDiary';
import { getUserPlantList } from '@/api/userPlant';
import { useAuth } from '@/hooks';
import { errorNoti, successNoti } from '@/utils/alarmUtil';
import { InitialDiaryContent } from '@/@types/diary.type';

import HeaderBefore from '@/components/headerBefore/HeaderBefore';
import SectionPhoto from '../SectionPhoto';
import SectionBoard from '../SectionBoard';
import './diaryWritePage.scss';

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
  const [isSaving, setIsSaving] = useState(false);
  const [plantNames, setPlantNames] = useState<string[]>([]);
  const [contents, setContents] =
    useState<InitialDiaryContent>(initialContents);

  const handleTags = (targetTag: string) => {
    if (!contents) return;

    const prevTags = [...contents.tags];
    const hasTarget = prevTags.includes(targetTag);

    const newTags = hasTarget
      ? prevTags.filter(name => name === targetTag)
      : [...prevTags, targetTag];

    setContents({
      ...contents,
      tags: newTags,
    });
  };

  const validateInput = () => {
    const { title, tags, content } = contents;

    if (!title || tags.length === 0 || !content) {
      errorNoti(
        !title
          ? '제목을 작성해주세요.'
          : tags.length === 0
          ? '관련 식물을 1가지 이상 선택해주세요.'
          : '내용을 작성해주세요.',
      );
      return false;
    }

    return true;
  };

  const handleSaveClick = async () => {
    if (!validateInput() || !contents.userEmail) return;

    try {
      setIsSaving(true);

      await saveDiary(contents);

      successNoti('저장이 완료되었어요!');
      navigate('/diary');
    } catch (error) {
      errorNoti('저장에 실패하였습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleContents = (
    key: keyof InitialDiaryContent,
    value: InitialDiaryContent[typeof key],
  ) => {
    if (!contents) return;

    setContents({
      ...contents,
      [key]: value,
    });
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
        errorNoti('유저 데이터를 가져오던 도중 에러가 발생했습니다.');
      }
    })();
  }, [user?.email]);

  return (
    <div className="layout">
      <HeaderBefore ex title="글쓰기" />
      {user?.email && (
        <>
          <main className="diary_main">
            <SectionPhoto contents={contents} handleContents={handleContents} />
            <SectionBoard
              contents={contents}
              handleContents={handleContents}
              plantNames={plantNames}
              handleTags={handleTags}
            />
          </main>
          <button
            className="save_button"
            onClick={handleSaveClick}
            disabled={isSaving}
          >
            {isSaving ? '저장 중...' : '저장하기'}
          </button>
        </>
      )}
    </div>
  );
};

export default DiaryWritePage;
