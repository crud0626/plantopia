import { storage } from '@/firebaseApp';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const updateUserProfileImg = (file: File) => {
  const profileRef = ref(storage, `profile_images/${file.name}`);

  return uploadBytes(profileRef, file).then(snapshot => {
    console.log(snapshot);
    return getDownloadURL(snapshot.ref);
  });
};

export const uploadPlantImg = (file: File) => {
  const plantImgRef = ref(storage, `myplant_imgs/${file.name}`);

  return uploadBytes(plantImgRef, file).then(snapshot => {
    return getDownloadURL(snapshot.ref);
  });
};
