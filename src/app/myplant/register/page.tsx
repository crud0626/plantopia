'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks';
import { addUserPlant } from '@/api/userPlant';
import { existPlant } from '@/api/userDiary';
import { getPlantInfo } from '@/api/dictionary';
import { waterCodeMap } from '@/constants/dictionary';
import { showAlert } from '@/utils/dialog';
import { UserPlant } from '@/@types/plant.type';

import PageHeader from '@/components/pageHeader/PageHeader';
import MyPlantForm from '@/components/myPlantForm/MyPlantForm';

interface DictPlantInfo {
  plantName: string;
  imgUrl: string;
  frequency: number;
}

const MyPlantRegisterPage = () => {
  const user = useAuth();
  const router = useRouter();
  const plantName = useSearchParams().get('plantName');

  const [dictInfo, setDictInfo] = useState<DictPlantInfo>();
  const [isSaving, setIsSaving] = useState(false);

  const handleRegister = async (
    plantInfo: Omit<UserPlant, 'id' | 'isMain' | 'userEmail'>,
  ) => {
    if (!user?.email) return;

    try {
      setIsSaving(true);

      const hasPlants = await existPlant(user.email);
      await addUserPlant({
        ...plantInfo,
        isMain: !hasPlants,
        userEmail: user.email,
      });

      showAlert('success', '새 식물 등록에 성공하였습니다');
      router.push('/myplant');
    } catch (error) {
      showAlert('error', '식물 등록에 실패하였습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!plantName) return;

      try {
        const [plantInfo] = await getPlantInfo(plantName);

        setDictInfo({
          plantName: plantInfo.name,
          imgUrl: plantInfo.imageUrl,
          frequency: waterCodeMap[plantInfo.waterCode],
        });
      } catch (error) {
        showAlert('error', '찾을 수 없는 식물입니다.');
      }
    })();
  }, []);

  return (
    <>
      <PageHeader exitBtn title="식물 등록" />
      <main>
        <MyPlantForm
          pageName="register"
          plantInfo={dictInfo || {}}
          isLoading={isSaving}
          onSubmit={handleRegister}
        />
      </main>
    </>
  );
};

export default MyPlantRegisterPage;
