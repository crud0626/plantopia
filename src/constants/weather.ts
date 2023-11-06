interface WeatherContentType {
  imgSrc: string;
  title: string;
  description: string;
}

/*
 * 날씨 코드 200 ~ 800까지 (400대 코드는 정의되어있지 않은 코드)
 */
export const weatherContents: { [code: string]: WeatherContentType } = {
  200: {
    imgSrc: '/assets/images/weather/thunder.png',
    title: '천둥번개',
    description: '식물과 함께라면 하나도 무섭지 않아!',
  },
  300: {
    imgSrc: '/assets/images/weather/rain.png',
    title: '한때 비',
    description: '식물이 좋아하는 빗물을 받아보세요',
  },
  500: {
    imgSrc: '/assets/images/weather/shower.png',
    title: '비',
    description: '습도에 유의하여 식물을 돌봐주세요',
  },
  600: {
    imgSrc: '/assets/images/weather/snow.png',
    title: '눈',
    description: '추위에 약한 식물을 실내로 옮겨주세요',
  },
  700: {
    imgSrc: '/assets/images/weather/fog.png',
    title: '안개',
    description: '오늘 내 식물은 얼만큼 자라났나요?',
  },
  800: {
    imgSrc: '/assets/images/weather/sun.png',
    title: '맑음',
    description: '햇빛을 좋아하는 식물을 창가에 두세요!',
  },
  801: {
    imgSrc: '/assets/images/weather/sun_cloud.png',
    title: '구름 조금',
    description: '식물도감에서 다양한 식물을 만나봐요~',
  },
  802: {
    imgSrc: '/assets/images/weather/sun_cloud.png',
    title: '구름 조금',
    description: '식물도감에서 다양한 식물을 만나봐요~',
  },
  803: {
    imgSrc: '/assets/images/weather/cloud.png',
    title: '흐림',
    description: '흐린 날씨지만 식물과 함께 힐링해요♥',
  },
  804: {
    imgSrc: '/assets/images/weather/cloud.png',
    title: '흐림',
    description: '흐린 날씨지만 식물과 함께 힐링해요',
  },
};
