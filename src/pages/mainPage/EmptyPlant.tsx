import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks';
import MAIN_PLANT from '@/assets/images/plants/main_plant.png';
import EDIT_ICON from '@/assets/images/icons/my_plant_detail_edit_icon.png';

const EmptyPlant = () => {
  const user = useAuth();

  return (
    <div className="inner">
      <div className="main_plant">
        <div className="inner_circle">
          <img src={MAIN_PLANT} alt="plant" />
        </div>
      </div>
      <p className="welcome_text">
        <strong>{user?.displayName || '회원'}</strong>님, 플랜토피아와 함께
        슬기로운 식집사 생활을 시작하세요!
      </p>
      <Link to="/myplant/register" className="register_btn">
        <img src={EDIT_ICON} alt="edit" />
        <p>내 식물 등록하기</p>
      </Link>
    </div>
  );
};

export default EmptyPlant;
