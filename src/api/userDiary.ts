import { db } from '@/firebaseApp';
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { DiaryContentTypes, InitialDiaryContent } from '@/@types/diary.type';

const getUserDiaryList = (userEmail: string) => {
  const ref = collection(db, 'diary');
  const q = query(
    ref,
    where('userEmail', '==', userEmail),
    orderBy('postedAt', 'desc'),
  );

  return getDocs(q).then(snapshot =>
    snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<DiaryContentTypes, 'id'>),
    })),
  );
};

const getUserDiary = async (diaryId: string) => {
  const ref = doc(db, 'diary', diaryId);
  const snapshot = await getDoc(ref);

  if (snapshot.exists()) {
    const result: DiaryContentTypes = {
      id: snapshot.id,
      ...(snapshot.data() as Omit<DiaryContentTypes, 'id'>),
    };

    return result;
  }
};

const existPlant = async (userEmail: string) => {
  const ref = collection(db, 'plant');
  const q = query(ref, where('userEmail', '==', userEmail));

  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

const saveDiary = (diaryData: InitialDiaryContent) => {
  const ref = collection(db, 'diary');
  const savedData: Omit<DiaryContentTypes, 'id'> = {
    ...diaryData,
    postedAt: Timestamp.fromDate(new Date()),
  };
  return addDoc(ref, savedData);
};

const updateDiary = (diaryData: DiaryContentTypes) => {
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
