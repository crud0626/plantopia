import { db } from '@/firebaseApp';
import {
  OrderByDirection,
  collection,
  endAt,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
  where,
} from 'firebase/firestore';

import {
  CategoryNames,
  PlantCodeName,
  PlantType,
} from '@/@types/dictionary.type';
import { getRandomIndex, shuffleArray } from '@/utils/array';

export const getPlantSearchResults = (fieldName: string, keyword: string) => {
  const ref = collection(db, 'dictionary');
  const q = query(
    ref,
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

export const getPlantInfo = (plantName: string) => {
  const ref = collection(db, 'dictionary');
  const q = query(ref, where('name', '==', plantName));

  return getDocs(q).then(snapshot =>
    snapshot.docs.map(doc => doc.data() as PlantType),
  );
};

/* 식물 도감의 슬라이드 데이터 */
const orderDirection: OrderByDirection[] = ['asc', 'desc'];

const targetQuery: {
  [key in CategoryNames]: {
    key: PlantCodeName;
    value: string;
  };
} = {
  beginner: { key: 'recommendCode', value: 'RC01' },
  growWell: { key: 'growCode', value: 'GC01' },
  lessWater: { key: 'waterCode', value: 'WC03' },
  dark: { key: 'lightCode', value: 'LC01' },
};

const plantCodes: PlantCodeName[] = [
  'recommendCode',
  'growCode',
  'waterCode',
  'lightCode',
];

const generateQuery = (name: CategoryNames) => {
  const ref = collection(db, 'dictionary');
  return query(
    ref,
    where(targetQuery[name].key, '==', targetQuery[name].value),
    orderBy(
      plantCodes[getRandomIndex(plantCodes.length)],
      orderDirection[getRandomIndex(orderDirection.length)],
    ),
    limit(8),
  );
};

export const getPlantInfoList = async () => {
  const keys: CategoryNames[] = ['beginner', 'growWell', 'lessWater', 'dark'];
  const result: { [key in CategoryNames]: PlantType[] } = {
    beginner: [],
    growWell: [],
    lessWater: [],
    dark: [],
  };

  for await (const category of keys) {
    const q = generateQuery(category);
    const plantsData = await getDocs(q).then(snapshot =>
      snapshot.docs.map(doc => doc.data() as PlantType),
    );

    result[category] = shuffleArray(plantsData);
  }

  return result;
};
