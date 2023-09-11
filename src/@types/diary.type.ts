import { Timestamp } from 'firebase/firestore';

/* 다이어리 공통 */
export interface DiaryContentTypes {
  id: string;
  userEmail: string;
  content: string;
  postedAt: InstanceType<typeof Timestamp>;
  tags: string[];
  title: string;
  imgUrls: string[];
}

export interface Plant {
  nickname: string;
  userEmail: string;
}
