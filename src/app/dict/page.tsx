'use client';

import { useState, Children, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { getPlantInfoList } from '@/api/dictionary';
import { CategoryNames, PlantType } from '@/@types/dictionary.type';
import { showAlert } from '@/utils/dialog';
import paths from '@/constants/routePath';
import CardSlide from './CardSlide';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import Progress from '@/components/progress/Progress';

import styles from './page.module.scss';

type CardsDataTypes = {
  [key in CategoryNames]: PlantType[];
};

const DictPage = () => {
  const user = useAuth();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [cardsData, setCardsData] = useState<CardsDataTypes>({
    beginner: [],
    growWell: [],
    lessWater: [],
    dark: [],
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(paths.dictSearch);
  };

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        const plantsInfo = await getPlantInfoList();
        setCardsData(plantsInfo);
      } catch (error) {
        showAlert('error', '식물 목록을 가져오던 도중 에러가 발생했습니다!');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const categories = Object.keys(cardsData) as Array<keyof typeof cardsData>;

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.wrapper}>
        <h2 className={styles.title}>
          <span>{user?.displayName || '회원'}</span>님, 어떤 식물을 찾고있나요?
        </h2>
        <section className={styles.search_wrapper}>
          <form onSubmit={handleSubmit}>
            <div className={styles.input_wrapper}>
              <input
                name="input"
                placeholder="식물 이름으로 검색하기"
                value={searchValue}
                onChange={({ target: { value } }) => setSearchValue(value)}
              />
              <button>
                <img
                  src="/assets/icons/search.png"
                  className={styles.search_img}
                  alt="search"
                />
              </button>
            </div>
          </form>
        </section>
        {Children.toArray(
          categories.map((name, i) => (
            <CardSlide
              type={i === 0 ? 'large' : 'small'}
              category={name}
              plants={cardsData[name]}
            />
          )),
        )}
      </main>
      <Footer />
      {isLoading && <Progress />}
    </div>
  );
};

export default DictPage;
