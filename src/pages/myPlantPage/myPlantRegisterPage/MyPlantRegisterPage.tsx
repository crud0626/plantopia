import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { addUserPlant } from '@/api/userPlant';
import { existPlant } from '@/api/userDiary';
import { waterCodeMap } from '@/constants/dictionary';
import { errorNoti, successNoti } from '@/utils/alarmUtil';
import { UserPlant } from '@/@types/plant.type';

import HeaderBefore from '@/components/headerBefore/HeaderBefore';
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

      successNoti('새 식물 등록에 성공하였습니다');
      navigate('/myplant');
    } catch (error) {
      errorNoti('식물 등록에 실패하였습니다.');
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
      <HeaderBefore ex title="식물 등록" />
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
