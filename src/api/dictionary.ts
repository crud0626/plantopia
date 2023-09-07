import { PlantType } from '@/@types/dictionary.type';
import { db } from '@/firebaseApp';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const getPlantInfo = async (plantName: string) => {
  const plantRef = collection(db, 'dictionary');
  const q = query(plantRef, where('name', '==', plantName));

  const querySnapshot = await getDocs(q);
  const result = querySnapshot.docs.map(doc => doc.data() as PlantType);

  return result;
};
