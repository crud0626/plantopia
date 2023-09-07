import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { DiaryProps, Plant } from '@/@types/diary.type';
import { errorNoti, successNoti } from '@/utils/alarmUtil';
import {
  deleteDiary,
  existPlant,
  getUserDiaryList,
  updateDiary,
} from '@/api/userDiary';
import { getUserPlantList } from '@/api/userPlant';

const useDiaryData = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [diaryData, setDiaryData] = useState<DiaryProps[]>([]);
  const [plantTag, setPlantTag] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* 다이어리 메인 데이터 불러오기 */
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return;

      try {
        setIsLoading(true);

        const data = await getUserDiaryList(user.email);

        const sortedData = data.sort(
          (a, b) =>
            b.postedAt.toDate().getTime() - a.postedAt.toDate().getTime(),
        );

        setDiaryData(sortedData);
      } catch (error) {
        errorNoti('다이어리 목록을 가져오는 도중 에러가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  /* 등록한 식물이 있는지 확인하기 => 없을 경우 등록페이지로 */
  const checkPlantExistence = async () => {
    if (!user?.email) return false;

    try {
      const result = await existPlant(user.email);
      return result;
    } catch (error) {
      return false;
    }
  };

  /* 저장하기 */
  const saveDiaryData = async (dataToSave: Omit<DiaryProps, 'id'>) => {
    if (!user?.email) return;

    try {
      setIsLoading(true);
      await saveDiaryData(dataToSave);
    } catch (error) {
      errorNoti('저장에 실패하였습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /* 수정하기 */
  const updateDiaryData = async (updatedData: DiaryProps) => {
    if (!user?.email) return;

    try {
      setIsLoading(true);

      await updateDiary(updatedData);
      const newDiaryData = await getUserDiaryList(user.email);
      setDiaryData(newDiaryData);
    } catch (error) {
      return;
    } finally {
      setIsLoading(false);
    }
  };

  /* 삭제하기 */
  const handleDelete = async (diaryId: string) => {
    if (!user?.email) return;

    try {
      await deleteDiary(diaryId);
      const newDiaryData = await getUserDiaryList(user.email);

      setDiaryData(newDiaryData);
      successNoti('삭제가 완료되었어요!');
      navigate('/diary');
    } catch (error) {
      return;
    }
  };

  /* 내 식물 목록 불러오기 */
  useEffect(() => {
    (async () => {
      if (!user?.email) return;

      const userEmail = user.email;
      const userPlantList = await getUserPlantList(userEmail);
      // 추후 수정
      const plantsTag: Plant[] = userPlantList.map(({ nickname }) => ({
        nickname,
        userEmail,
      }));

      setPlantTag(plantsTag);
    })();
  }, [user]);

  return {
    user,
    diaryData,
    handleDelete,
    checkPlantExistence,
    saveDiaryData,
    updateDiaryData,
    plantTag,
    isLoading,
    setIsLoading,
  };
};

export default useDiaryData;
