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

// 다이어리 데이터 가져오기
export const getUserDiary = async (userEmail: string) => {
  const diaryRef = collection(db, 'diary');
  const q = query(diaryRef, where('userEmail', '==', userEmail));

  const querySnapshot = await getDocs(q);
  const diaryData: DiaryProps[] = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<DiaryProps, 'id'>),
  }));

  return diaryData;
};

export const getSpeicifyDiary = async (docId: string) => {
  const diaryRef = doc(db, 'diary', docId);
  const docSnap = await getDoc(diaryRef);

  if (docSnap.exists()) {
    const result = docSnap.data() as DiaryProps;
    return result;
  }
};

// 등록한 식물이 있는지 확인, 필요한가?
export const existPlant = async (userEmail: string) => {
  const plantRef = collection(db, 'plant');
  const plantQuery = query(plantRef, where('userEmail', '==', userEmail));

  const snapshot = await getDocs(plantQuery);
  return snapshot.empty;
};

// 다이어리 저장
export const saveDiaryData = (diaryData: Omit<DiaryProps, 'id'>) => {
  const diaryRef = collection(db, 'diary');
  return addDoc(diaryRef, diaryData);
};

// 다이어리 수정
export const modifyDiaryData = (diaryData: DiaryProps) => {
  const { id, ...newData } = diaryData;
  const diaryRef = doc(db, 'diary', id);

  return updateDoc(diaryRef, newData);
};

// 다이어리 삭제
export const deleteDiary = (diaryId: string) => {
  return deleteDoc(doc(db, 'diary', diaryId));
};
