import { Timestamp } from 'firebase/firestore';
export interface DiaryContentTypes {
  id: string;
  userEmail: string;
  content: string;
  postedAt: InstanceType<typeof Timestamp>;
  tags: string[];
  title: string;
  imgUrls: string[];
}
