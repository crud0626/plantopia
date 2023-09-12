import { Timestamp } from 'firebase/firestore';

export interface InitialDiaryContent {
  userEmail: string;
  content: string;
  tags: string[];
  title: string;
  imgUrls: string[];
}
export interface DiaryContentTypes extends InitialDiaryContent {
  id: string;
  postedAt: InstanceType<typeof Timestamp>;
}
