import { CodeToImg } from '@/components/codeToImg/CodeToImg';

const imgSrcs = {
  SUN_ON_ICON: '/assets/icons/sun_on.png',
  SUN_OFF_ICON: '/assets/icons/sun_off.png',
  WATER_ON_ICON: '/assets/icons/water_on.png',
  WATER_OFF_ICON: '/assets/icons/water_off.png',
};

const codeInfo = {
  HC: '',
  HC01: '~ 40%',
  HC02: '40 ~ 70%',
  HC03: '70% ~ 100%',
  RC: '',
  RC01: '초보자',
  RC02: '경험자',
  RC03: '전문가',
  TC: '',
  TC01: '10 ~ 15℃',
  TC02: '16 ~ 20℃',
  TC03: '21 ~ 25℃',
  TC04: '26 ~ 30℃',
  LC: '',
  LC01: CodeToImg([
    imgSrcs.SUN_ON_ICON,
    imgSrcs.SUN_OFF_ICON,
    imgSrcs.SUN_OFF_ICON,
  ]),
  LC02: CodeToImg([
    imgSrcs.SUN_ON_ICON,
    imgSrcs.SUN_ON_ICON,
    imgSrcs.SUN_OFF_ICON,
  ]),
  LC03: CodeToImg([
    imgSrcs.SUN_ON_ICON,
    imgSrcs.SUN_ON_ICON,
    imgSrcs.SUN_ON_ICON,
  ]),
  WC: '',
  WC01: CodeToImg([
    imgSrcs.WATER_ON_ICON,
    imgSrcs.WATER_ON_ICON,
    imgSrcs.WATER_ON_ICON,
  ]),
  WC02: CodeToImg([
    imgSrcs.WATER_ON_ICON,
    imgSrcs.WATER_ON_ICON,
    imgSrcs.WATER_OFF_ICON,
  ]),
  WC03: CodeToImg([
    imgSrcs.WATER_ON_ICON,
    imgSrcs.WATER_OFF_ICON,
    imgSrcs.WATER_OFF_ICON,
  ]),
};

const slideCategories = ['beginner', 'growWell', 'lessWater', 'dark'];

const waterCodeMap = {
  WC03: 14,
  WC02: 11,
  WC01: 7,
};

export { codeInfo, waterCodeMap, slideCategories };
