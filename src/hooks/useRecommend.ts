import { getPlantInfoList } from '@/api/dictionary';
import { useState, useEffect } from 'react';
import { PlantType } from '@/@types/dictionary.type';
import { targetQuery } from '@/constants/dictionary';
import { shuffleArray } from '@/utils/arrayUtil';

interface UseRecommendProps {
  target: keyof typeof targetQuery;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const useRecommend = ({ target, setIsLoading }: UseRecommendProps) => {
  const [plant, setPlant] = useState<PlantType[]>([]);

  useEffect(() => {
    (async () => {
      const plantsInfo = await getPlantInfoList(target);
      setPlant(shuffleArray(plantsInfo));

      if (target === 'dark') {
        setIsLoading(false);
      }
    })();
  }, []);

  return { plant };
};

export default useRecommend;
