import { Children } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { CategoryNames, PlantType } from '@/@types/dictionary.type';

import './cardSlide.scss';
import PLANT1_ICON from '@/assets/images/icons/dict_plant1.png';
import PLANT2_ICON from '@/assets/images/icons/dict_plant2.png';
import WATER_ICON from '@/assets/images/icons/dict_water2.png';
import MOON_ICON from '@/assets/images/icons/dict_moon.png';

interface CardContentTypes {
  type: 'large' | 'small';
  category: CategoryNames;
  plants: PlantType[];
}

const targetClassName = {
  beginner: 'img_wrapper_white',
  growWell: 'img_wrapper_navy',
  lessWater: 'img_wrapper_blue',
  dark: 'img_wrapper_gray',
};

const slideContents: {
  [key in CategoryNames]: {
    icon: string;
    title: string;
  };
} = {
  beginner: {
    icon: PLANT1_ICON,
    title: '식린이를 위한 추천 식물!',
  },
  growWell: {
    icon: PLANT2_ICON,
    title: '쑥쑥 자라는 식물만 모았어요.',
  },
  lessWater: {
    icon: WATER_ICON,
    title: '물을 조금만 줘도 잘 자라요.',
  },
  dark: { icon: MOON_ICON, title: '어두운 집에서도 OK!' },
};

const CardSlide = ({ type, category, plants }: CardContentTypes) => {
  const { icon, title } = slideContents[category];

  return (
    <div className="recommend_container">
      <div className="title_wrapper">
        <div className={targetClassName[category]}>
          <img src={icon} className="plant_icon" alt="search icon" />
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
                  alt="plant"
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
