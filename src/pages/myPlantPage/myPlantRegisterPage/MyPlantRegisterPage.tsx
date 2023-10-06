import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { addUserPlant } from '@/api/userPlant';
import { existPlant } from '@/api/userDiary';
import { waterCodeMap } from '@/constants/dictionary';
import { showAlert } from '@/utils/dialog';
import { UserPlant } from '@/@types/plant.type';

import PageHeader from '@/components/pageHeader/PageHeader';
import MyPlantForm from '../MyPlantForm';

interface DictPlantInfo {
  name: string;
  image: string;
  waterCode: 'WC03' | 'WC02' | 'WC01';
}

const MyPlantRegisterPage = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const dictInfo: DictPlantInfo | null = useLocation().state;
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
      navigate('/myplant');
    } catch (error) {
      showAlert('error', '식물 등록에 실패하였습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  let plantInfo = undefined;

  if (dictInfo) {
    plantInfo = {
      plantName: dictInfo.name,
      imgUrl: dictInfo.image,
      frequency: waterCodeMap[dictInfo.waterCode],
    };
  }

  return (
    <div className="layout">
      <PageHeader exitBtn title="식물 등록" />
      <main>
        <MyPlantForm
          pageName="register"
          plantInfo={plantInfo}
          isLoading={isSaving}
          onSubmit={handleRegister}
        />
      </main>
    </div>
  );
};

export default MyPlantRegisterPage;
