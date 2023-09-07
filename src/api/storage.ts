import { storage } from '@/firebaseApp';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const path = {
  profile: 'profile_images',
  plant: 'myplant_imgs',
  diary: 'diary_images',
};

export const uploadImg = (file: File, type: keyof typeof path) => {
  const imgPath = path[type];
  const imgRef = ref(storage, `${imgPath}/${file.name}`);

  return uploadBytes(imgRef, file).then(snapshot => {
    return getDownloadURL(snapshot.ref);
  });
};
