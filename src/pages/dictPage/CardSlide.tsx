import { Children } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { targetClassName } from '@/constants/dictionary';
import { CategoryNames, PlantType } from '@/@types/dictionary.type';
import './cardSlide.scss';

interface CardContentTypes {
  type: 'large' | 'small';
  icon: string;
  title: string;
  category: CategoryNames;
  plants: PlantType[];
}

const CardSlide = ({
  type,
  icon,
  title,
  category,
  plants,
}: CardContentTypes) => {
  return (
    <div className="recommend_container">
      <div className="title_wrapper">
        <div className={targetClassName[category]}>
          <img className="plant_icon" src={icon} alt="search icon" />
        </div>
        <span>{title}</span>
      </div>
      <Swiper
        slidesPerView={type === 'large' ? 2 : 3}
        spaceBetween={type === 'large' ? 14 : 13}
        navigation={true}
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
        className="plants_container"
      >
        {Children.toArray(
          plants.map(plant => (
            <SwiperSlide className="plant_wrapper">
              <Link to={`/dict/detail?plantName=${plant.name}`} state={plant}>
                <img
                  className={category === 'beginner' ? 'img_two' : 'img_three'}
                  src={plant.imageUrl}
                  alt="plant image"
                />
                <div className="name_wrapper">
                  <p
                    className={
                      category === 'beginner'
                        ? 'english_name_two'
                        : 'english_name_three'
                    }
                  >
                    {plant.scientificName}
                  </p>
                  <p
                    className={
                      category === 'beginner'
                        ? 'korean_name_two'
                        : 'korean_name_three'
                    }
                  >
                    {plant.name}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          )),
        )}
      </Swiper>
    </div>
  );
};

export default CardSlide;
