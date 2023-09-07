import { UserPlant } from '@/@types/plant.type';
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

/**
 * 이 함수는 유저의 이메일을 받아 유저가 가진 식물 정보를 프로미스 배열 값으로 리턴합니다.
 * @param {string} userEmail useAuth로 받은 유저의 이메일
 * @returns {Promise[]} 유저의 식물 정보 프로미스 배열 값
 */
export const getPlantList = async (userEmail: string): Promise<UserPlant[]> => {
  const plantsRef = collection(db, 'plant');
  const q = query(plantsRef, where('userEmail', '==', userEmail));

  const querySnapshot = await getDocs(q);
  const plantList: UserPlant[] = querySnapshot.docs.map(doc => {
    return {
      id: doc.id,
      ...(doc.data() as Omit<UserPlant, 'id'>),
    };
  });

  return plantList;
};

export const getPlant = async (docId: string) => {
  const plantRef = doc(db, 'plant', docId);
  const docSnap = await getDoc(plantRef);

  if (docSnap.exists()) {
    const plantInfo = docSnap.data() as UserPlant;
    return plantInfo;
  }
};

// ID만 필수, 그 외는 Partial
export const updatePlantInfo = (plant: Partial<UserPlant>) => {
  if (!plant?.id) return;

  const { id, ...newData } = plant;
  const plantRef = doc(db, 'plant', id);

  return updateDoc(plantRef, newData);
};

export const createPlant = (newPlant: Omit<UserPlant, 'id'>) => {
  return addDoc(collection(db, 'plant'), newPlant);
};

export const removePlant = (plantId: string) => {
  const plantRef = doc(db, 'plant', plantId);
  return deleteDoc(plantRef);
};
