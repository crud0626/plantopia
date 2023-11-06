'use client';

import { useState, useEffect, Children } from 'react';
import Link from 'next/link';
import { koreanPattern } from '@/constants/regex';
import { getPlantSearchResults } from '@/api/dictionary';
import { showAlert } from '@/utils/dialog';
import { PlantType } from '@/@types/dictionary.type';
import paths from '@/constants/routePath';
import styles from './page.module.scss';
import Progress from '@/components/progress/Progress';
import PageHeader from '@/components/pageHeader/PageHeader';

import SEARCH_ICON from '/assets/icons/search.png';

const EmptyResult = () => {
  return (
    <div className={styles.no_search}>
      <p>검색 결과가 없습니다.</p>
      <div className={styles.notice}>
        👷‍♂️ 식물도감에 없는 식물의 등록 기능을 준비중입니다.
        <a href="https://forms.gle/g4AjkNKqVDP48Xnc7" target="_blank">
          내가 찾는 식물이 없다면, 식물 등록 요청하기
        </a>
      </div>
    </div>
  );
};

const DictSearchPage = () => {
  /* 임시 */
  const locationState: { inputValue: string } | null = { inputValue: 'aa' };
  const [searchValue, setSearchValue] = useState(
    locationState?.inputValue || '',
  );
  const [results, setResults] = useState<PlantType[]>([]); // results
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchValue) {
      getDouments(searchValue);
    }
  };

  const getDouments = async (value: string) => {
    const fieldName = koreanPattern.test(value) ? 'name' : 'scientificName';
    const plantName = value.replace(value[0], value[0].toUpperCase());

    try {
      setIsLoading(true);

      const plantList = await getPlantSearchResults(fieldName, plantName);
      setResults(plantList);
    } catch (error) {
      showAlert('error', '검색 도중 에러가 발생하였습니다!');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (locationState) {
      getDouments(locationState.inputValue);
    }
  }, [locationState]);

  return (
    <>
      <PageHeader title="검색 결과" />
      <main className={`${styles.container} inner`}>
        <section className={styles.search_wrapper}>
          <form onSubmit={handleSubmit}>
            <div className={styles.input_wrapper}>
              <input
                value={searchValue}
                placeholder="식물 이름으로 검색하기"
                onChange={({ target }) => setSearchValue(target.value)}
              />
              <button type="submit">
                <img
                  src={SEARCH_ICON}
                  className={styles.search_img}
                  alt="search"
                />
              </button>
            </div>
          </form>
        </section>
        <section className={styles.plant_container}>
          {results.length ? (
            Children.toArray(
              results.map(plant => (
                <Link href={`${paths.dictDetail}?plantName=${plant.name}`}>
                  <div className={styles.plant_wrapper}>
                    <img src={plant.imageUrl} alt="plant" />
                    <div className={styles.name_wrapper}>
                      <h3 className={styles.korean_name}>{plant.name}</h3>
                      <h3 className={styles.english_name}>
                        {plant.scientificName}
                      </h3>
                    </div>
                  </div>
                  <hr />
                </Link>
              )),
            )
          ) : searchValue ? (
            <EmptyResult />
          ) : (
            <div className={styles.search_notice}>
              <strong>🌱 식물 검색 TIP </strong>
              <p>
                식물 이름의 첫번째 글자부터 입력하여
                <br />내 식물을 검색해보세요.
              </p>
              <span>
                <br /> (ex. 몬스테라 : 몬 / 산세베리아 : 산세)
              </span>
            </div>
          )}
        </section>
      </main>
      {isLoading && <Progress />}
    </>
  );
};

export default DictSearchPage;
