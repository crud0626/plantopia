import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getUserPlant, updateUserPlant } from '@/api/userPlant';
import { showAlert } from '@/utils/dialog';
import { UserPlant } from '@/@types/plant.type';
import paths from '@/constants/routePath';

import PageHeader from '@/components/pageHeader/PageHeader';
import Progress from '@/components/progress/Progress';
import MyPlantForm from '@/components/myPlantForm/MyPlantForm';
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

      showAlert('success', '식물 정보를 수정하였습니다!');
      navigate(paths.myplant);
    } catch (error) {
      showAlert('error', '식물 수정에 실패하였습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!userPlant) return;

      try {
        if (!docId) throw new Error();

        const plantInfo = await getUserPlant(docId);

        if (!plantInfo) throw new Error();

        setUserPlant(plantInfo);
      } catch (error) {
        showAlert('error', '식물 정보를 가져올 수 없습니다.');
        navigate(paths.myplant);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <PageHeader exitBtn title="식물 수정" />
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
    </>
  );
};

export default MyPlantEditPage;
