import { PlantType } from '@/@types/dictionary.type';

const getRandomIndex = (max: number, min?: number) => {
  if (min !== undefined) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  return Math.floor(Math.random() * max);
};

const shuffleArray = (array: PlantType[]) => {
  return array.sort(() => Math.random() - 0.5);
};

export { getRandomIndex, shuffleArray };
