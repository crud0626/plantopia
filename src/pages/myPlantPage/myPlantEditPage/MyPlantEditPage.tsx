import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getUserPlant, updateUserPlant } from '@/api/userPlant';
import { errorNoti, successNoti } from '@/utils/alarmUtil';
import { UserPlant } from '@/@types/plant.type';

import './myPlantEditPage.scss';
import HeaderBefore from '@/components/headerBefore/HeaderBefore';
import Progress from '@/components/progress/Progress';
import MyPlantForm from '../MyPlantForm';
import { useAuth } from '@/hooks';

const MyPlantEditPage = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const { docId } = useParams();
  const targetPlant: UserPlant | null = useLocation().state;
  const [isLoading, setIsLoading] = useState(true);
  const [userPlant, setUserPlant] = useState<UserPlant | null>(targetPlant);

  const handleUpdate = async (
    plantInfo: Omit<UserPlant, 'id' | 'isMain' | 'userEmail'>,
  ) => {
    if (!userPlant || !user?.email) return;

    try {
      setIsLoading(true);

      const { id, isMain } = userPlant;
      await updateUserPlant({
        ...plantInfo,
        id,
        isMain,
        userEmail: user.email,
      });

      successNoti('식물 정보를 수정하였습니다!');
      navigate('/myplant');
    } catch (error) {
      errorNoti('식물 수정에 실패하였습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!docId || userPlant) {
        setIsLoading(false);
        return;
      }

      try {
        const plantInfo = await getUserPlant(docId);

        if (!plantInfo) {
          errorNoti('존재하지 않는 식물 정보입니다.');
          navigate('/myplant');
          return;
        }

        setUserPlant(plantInfo);
      } catch (error) {
        errorNoti('식물 정보를 가져올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="layout">
      <HeaderBefore ex title="식물 수정" />
      <main>
        {userPlant && (
          <MyPlantForm
            pageName="edit"
            plantInfo={userPlant}
            isLoading={isLoading}
            onSubmit={handleUpdate}
          />
        )}
      </main>
      {isLoading && <Progress />}
    </div>
  );
};

export default MyPlantEditPage;
