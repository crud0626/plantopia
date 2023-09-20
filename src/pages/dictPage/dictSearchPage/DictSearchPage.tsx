import { useState, useEffect, Children } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { koreanRe } from '@/constants/regEx';
import { getPlantSearchResults } from '@/api/dictionary';
import { showAlert } from '@/utils/dialog';
import { PlantType } from '@/@types/dictionary.type';

import './dictSearchPage.scss';
import Progress from '@/components/progress/Progress';
import HeaderBefore from '@/components/headerBefore/HeaderBefore';

import SEARCH_ICON from '@/assets/images/icons/dict_search.png';

const EmptyResult = () => {
  return (
    <div className="no_search">
      <p>검색 결과가 없습니다.</p>
      <div className="notice">
        👷‍♂️ 식물도감에 없는 식물의 등록 기능을 준비중입니다.
        <a href="https://forms.gle/g4AjkNKqVDP48Xnc7" target="_blank">
          내가 찾는 식물이 없다면, 식물 등록 요청하기
        </a>
      </div>
    </div>
  );
};

const DictSearchPage = () => {
  const locationState: { inputValue: string } | null = useLocation().state;
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
    const fieldName = koreanRe.test(value) ? 'name' : 'scientificName';
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
    <div className="search_container layout">
      <HeaderBefore title="검색 결과" />
      <main className="inner">
        <section className="search_wrapper">
          <form onSubmit={handleSubmit}>
            <div className="input_wrapper">
              <input
                value={searchValue}
                placeholder="식물 이름으로 검색하기"
                onChange={({ target }) => setSearchValue(target.value)}
              />
              <button type="submit">
                <img src={SEARCH_ICON} className="search_img" alt="search" />
              </button>
            </div>
          </form>
        </section>
        <section className="plant_container">
          {results.length ? (
            Children.toArray(
              results.map(plant => (
                <Link to={`/dict/detail?plantName=${plant.name}`} state={plant}>
                  <div className="plant_wrapper">
                    <img src={plant.imageUrl} alt="plant" />
                    <div className="name_wrapper">
                      <h3 className="korean_name">{plant.name}</h3>
                      <h3 className="english_name">{plant.scientificName}</h3>
                    </div>
                  </div>
                  <hr />
                </Link>
              )),
            )
          ) : searchValue ? (
            <EmptyResult />
          ) : (
            <div className="search_notice">
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
    </div>
  );
};

export default DictSearchPage;
