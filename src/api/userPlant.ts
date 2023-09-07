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

interface UpdatePlantArgs extends Partial<UserPlant> {
  id: string;
}

const getUserPlantList = (userEmail: string): Promise<UserPlant[]> => {
  const ref = collection(db, 'plant');
  const q = query(ref, where('userEmail', '==', userEmail));

  return getDocs(q).then(snapshot =>
    snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<UserPlant, 'id'>),
    })),
  );
};

const getUserPlant = async (plantId: string) => {
  const plantRef = doc(db, 'plant', plantId);
  const docSnap = await getDoc(plantRef);

  if (docSnap.exists()) {
    const plantInfo = docSnap.data() as UserPlant;
    return plantInfo;
  }
};

const updateUserPlant = (plant: UpdatePlantArgs) => {
  const { id, ...plantData } = plant;
  const ref = doc(db, 'plant', id);

  return updateDoc(ref, plantData);
};

const addUserPlant = (addedPlant: Omit<UserPlant, 'id'>) => {
  return addDoc(collection(db, 'plant'), addedPlant);
};

const deleteUserPlant = (plantId: string) => {
  const plantRef = doc(db, 'plant', plantId);
  return deleteDoc(plantRef);
};

export {
  getUserPlantList,
  getUserPlant,
  updateUserPlant,
  addUserPlant,
  deleteUserPlant,
};
