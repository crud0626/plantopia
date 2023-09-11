import { db } from '@/firebaseApp';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { DiaryProps } from '@/@types/diary.type';

const getUserDiaryList = (userEmail: string) => {
  const ref = collection(db, 'diary');
  const q = query(ref, where('userEmail', '==', userEmail));

  return getDocs(q).then(snapshot =>
    snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<DiaryProps, 'id'>),
    })),
  );
};

const getUserDiary = async (diaryId: string) => {
  const ref = doc(db, 'diary', diaryId);
  const snapshot = await getDoc(ref);

  if (snapshot.exists()) {
    const result = snapshot.data() as DiaryProps;
    return result;
  }
};

/* 필요한지 확인하고 필요없다면 추후 삭제하기 */
const existPlant = async (userEmail: string) => {
  const ref = collection(db, 'plant');
  const q = query(ref, where('userEmail', '==', userEmail));

  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

const saveDiary = (diaryData: Omit<DiaryProps, 'id'>) => {
  const ref = collection(db, 'diary');
  return addDoc(ref, diaryData);
};

const updateDiary = (diaryData: DiaryProps) => {
  const { id, ...newData } = diaryData;
  const diaryRef = doc(db, 'diary', id);

  return updateDoc(diaryRef, newData);
};

const deleteDiary = (diaryId: string) => {
  return deleteDoc(doc(db, 'diary', diaryId));
};

export {
  getUserDiaryList,
  getUserDiary,
  existPlant,
  saveDiary,
  updateDiary,
  deleteDiary,
};
