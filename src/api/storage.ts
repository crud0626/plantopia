import { storage } from '@/firebaseApp';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

const path = {
  profile: 'profile_images',
  plant: 'myplant_imgs',
  diary: 'diary_images',
};

const filterFileName = (src: string) => {
  const urlParts = src.split('/');
  const fileName = urlParts[urlParts.length - 1].split('?')[0];
  return decodeURIComponent(fileName);
};

export const uploadImg = (file: File, type: keyof typeof path) => {
  const imgPath = path[type];
  const imgRef = ref(storage, `${imgPath}/${file.name}`);

  return uploadBytes(imgRef, file).then(snapshot => {
    return getDownloadURL(snapshot.ref);
  });
};

export const deleteImg = (src: string) => {
  const fileName = filterFileName(src);
  const imgRef = ref(storage, fileName);
  return deleteObject(imgRef);
};
