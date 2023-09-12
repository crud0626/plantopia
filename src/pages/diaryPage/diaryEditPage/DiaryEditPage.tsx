import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { errorNoti, successNoti } from '@/utils/alarmUtil';
import { DiaryContentTypes } from '@/@types/diary.type';
import { getUserPlantList } from '@/api/userPlant';
import { getUserDiary, updateDiary } from '@/api/userDiary';
import { useAuth } from '@/hooks';

import HeaderBefore from '@/components/headerBefore/HeaderBefore';
import SectionPhoto from '../SectionPhoto';
import SectionBoard from '../SectionBoard';
import './diaryEditPage.scss';

const DiaryEditPage = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const { docId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [plantNames, setPlantNames] = useState<string[]>([]);
  const [contents, setContents] = useState<DiaryContentTypes | null>(null);

  const handleTags = (targetTag: string) => {
    if (!contents) return;

    const prevTags = [...contents.tags];
    const hasTarget = prevTags.includes(targetTag);

    const newTags = hasTarget
      ? prevTags.filter(name => name !== targetTag)
      : [...prevTags, targetTag];

    setContents({
      ...contents,
      tags: newTags,
    });
  };

  const validateInput = () => {
    if (!contents) return false;

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
    const isInvalid = !user?.email || !docId || !contents;
    const isValidContent = validateInput();

    if (isInvalid || !isValidContent) return;

    try {
      setIsLoading(true);

      await updateDiary({ ...contents });

      successNoti('수정이 완료되었어요!');
      navigate('/diary');
    } catch (error) {
      errorNoti('수정하는 도중 에러가 발생했습니다!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContents = (
    key: keyof DiaryContentTypes,
    value: DiaryContentTypes[typeof key],
  ) => {
    if (!contents) return;

    setContents({
      ...contents,
      [key]: value,
    });
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

        setContents(diaryData);
        setPlantNames(userPlantNames);
      } catch (error) {
        errorNoti('유저 데이터를 가져오던 도중 에러가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user?.email]);

  return (
    <div className="layout">
      <HeaderBefore ex={true} title="수정하기" />
      <main className="diary_write_wrap">
        {contents && docId && (
          <>
            <SectionPhoto
              imgUrls={contents.imgUrls}
              handleContents={handleContents}
            />
            <SectionBoard
              contents={contents}
              handleContents={handleContents}
              plantNames={plantNames}
              handleTags={handleTags}
            />
            <button
              className="save_button"
              onClick={handleSaveClick}
              disabled={isLoading}
            >
              {isLoading ? '수정 중...' : '수정하기'}
            </button>
          </>
        )}
      </main>
    </div>
  );
};

export default DiaryEditPage;
