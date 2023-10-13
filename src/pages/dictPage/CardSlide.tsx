import { Children } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { CategoryNames, PlantType } from '@/@types/dictionary.type';
import paths from '@/constants/routePath';

import styles from './cardSlide.module.scss';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import PLANT1_ICON from '@/assets/icons/dict/plant1.png';
import PLANT2_ICON from '@/assets/icons/dict/plant2.png';
import WATER_ICON from '@/assets/icons/dict/water2.png';
import MOON_ICON from '@/assets/icons/dict/moon.png';

interface CardContentTypes {
  type: 'large' | 'small';
  category: CategoryNames;
  plants: PlantType[];
}

const targetClassName = {
  beginner: styles.img_wrapper_white,
  growWell: styles.img_wrapper_navy,
  lessWater: styles.img_wrapper_blue,
  dark: styles.img_wrapper_gray,
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
    <div className={styles.container}>
      <div className={styles.title_wrapper}>
        <div className={targetClassName[category]}>
          <img src={icon} className={styles.plant_icon} alt="search icon" />
        </div>
        <span>{title}</span>
      </div>
      <Swiper
        slidesPerView={type === 'large' ? 2 : 3}
        spaceBetween={type === 'large' ? 14 : 13}
        navigation={true}
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
        className={styles.plants_container}
      >
        {Children.toArray(
          plants.map(plant => (
            <SwiperSlide className={styles.plant_wrapper}>
              <Link
                to={`${paths.dictDetail}?plantName=${plant.name}`}
                state={plant}
              >
                <img
                  className={
                    category === 'beginner' ? styles.img_two : styles.img_three
                  }
                  src={plant.imageUrl}
                  alt="plant"
                />
                <div className={styles.name_wrapper}>
                  <p
                    className={
                      category === 'beginner'
                        ? styles.english_name_two
                        : styles.english_name_three
                    }
                  >
                    {plant.scientificName}
                  </p>
                  <p
                    className={
                      category === 'beginner'
                        ? styles.korean_name_two
                        : styles.korean_name_three
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
