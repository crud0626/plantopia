import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/firebaseApp.ts';
import {
  getDocs,
  query,
  where,
  collection,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
} from 'firebase/firestore';
import { useAuth } from '@/hooks';
import { DiaryProps, Plant } from '@/@types/diary.type';
import { successNoti } from '@/utils/alarmUtil';
import {
  deleteDiary,
  existPlant,
  getUserDiary,
  modifyDiaryData,
} from '@/api/userDiary';
import { getPlantList } from '@/api/userPlant';

const useDiaryData = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [diaryData, setDiaryData] = useState<DiaryProps[]>([]);
  const [plantTag, setPlantTag] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // const q = query(
  //   collection(db, 'diary'),
  //   where('userEmail', '==', user?.email),
  // );
  // const querySnapshot = await getDocs(q);
  // const data: DiaryProps[] = [];
  // querySnapshot.forEach(doc => {
  //   data.push({ id: doc.id, ...doc.data() } as DiaryProps);
  // });
  /* 다이어리 메인 데이터 불러오기 */
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return;

      setIsLoading(true);

      const data = await getUserDiary(user.email);
      const sortedData = data.sort(
        (a, b) => b.postedAt.toDate().getTime() - a.postedAt.toDate().getTime(),
      );

      setDiaryData(sortedData);
      setIsLoading(false);
    };

    fetchData();
  }, [user]);

  // if (user) {
  //   const plantQuery = query(
  //     collection(db, 'plant'),
  //     where('userEmail', '==', user?.email),
  //   );
  //   const plantSnapshot = await getDocs(plantQuery);
  //   const plantDataExist = !plantSnapshot.empty;
  //   return plantDataExist;
  // }
  // return false;
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

    console.log(dataToSave);
    setIsLoading(true);
    await saveDiaryData(dataToSave);
    setIsLoading(false);

    // await addDoc(collection(db, 'diary'), dataToSave);
  };

  /* 수정하기 */
  const updateDiaryData = async (diaryId: string, updatedData: DiaryProps) => {
    if (!user?.email) return;

    try {
      setIsLoading(true);

      await modifyDiaryData(updatedData);
      const newDiaryData = await getUserDiary(user.email);
      setDiaryData(newDiaryData);

      // const diaryRef = doc(db, 'diary', diaryId);
      // await updateDoc(diaryRef, updatedData);
      // setIsLoading(false);
    } catch (error) {
      // setIsLoading(false);
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
      const newDiaryData = await getUserDiary(user.email);

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
      const userPlantList = await getPlantList(userEmail);
      // 추후 수정
      const plantsTag: Plant[] = userPlantList.map(({ nickname }) => ({
        nickname,
        userEmail,
      }));

      setPlantTag(plantsTag);
    })();

    // const getPlantsFromFirestore = async () => {
    //   const plantRef = collection(db, 'plant');
    //   const q = query(plantRef, where('userEmail', '==', user?.email));
    //   const querySnapshot = await getDocs(q);
    //   const plants: Plant[] = querySnapshot.docs.map(
    //     doc => doc.data() as Plant,
    //   );
    //   setPlantTag(plants);
    // };
    // getPlantsFromFirestore();
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
