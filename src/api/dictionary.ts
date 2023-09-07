import { orderDirection, targetQuery } from '@/constants/dictionary';
import { db } from '@/firebaseApp';
import {
  collection,
  endAt,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
  where,
} from 'firebase/firestore';
import { PlantType } from '@/@types/dictionary.type';
import { getRandomIndex } from '@/utils/arrayUtil';

export const getPlantInfo = async (plantName: string) => {
  const plantRef = collection(db, 'dictionary');
  const q = query(plantRef, where('name', '==', plantName));

  const querySnapshot = await getDocs(q);
  const result = querySnapshot.docs.map(doc => doc.data() as PlantType);

  return result;
};

export const getPlantSearchResults = (fieldName: string, keyword: string) => {
  const dictRef = collection(db, 'dictionary');
  const q = query(
    dictRef,
    orderBy(fieldName),
    startAt(`${keyword}`),
    endAt(`${keyword}\uf8ff`),
  );

  return getDocs(q).then(snapshot =>
    snapshot.docs.map(doc => {
      return doc.data() as PlantType;
    }),
  );
};

export const getPlantInfoList = (target: keyof typeof targetQuery) => {
  const dictRef = collection(db, 'dictionary');
  const q = query(
    dictRef,
    where(targetQuery[target][0], '==', targetQuery[target][1]),
    orderBy(
      Object.values(targetQuery)[getRandomIndex(4)][0],
      orderDirection[getRandomIndex(2)],
    ),
    limit(8),
  );

  return getDocs(q).then(snapshot =>
    snapshot.docs.map(doc => {
      return doc.data() as PlantType;
    }),
  );
};
