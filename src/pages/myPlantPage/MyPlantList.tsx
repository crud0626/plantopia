import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlant } from '@/@types/plant.type';

import './myPlantList.scss';
import BOOKMARK_TRUE from '@/assets/images/icons/main_plant_true_icon.png';
import BOOKMARK_FALSE from '@/assets/images/icons/main_plant_false_icon.png';
import EDIT_ICON from '@/assets/images/icons/my_plants_edit_icon.png';

interface MainPagePlantListProps {
  userPlants: UserPlant[];
  changeMainPlant: (nextMainPlant: UserPlant) => Promise<void>;
}

const compare = (a: UserPlant, b: UserPlant): number => {
  if (a.isMain === b.isMain) {
    return 0;
  } else if (a.isMain) {
    return -1;
  } else {
    return 1;
  }
};

const MainPagePlantList = ({
  userPlants,
  changeMainPlant,
}: MainPagePlantListProps) => {
  const navigate = useNavigate();
  const sortedPlants = useMemo(() => userPlants.sort(compare), [userPlants]);

  const handleEditData = (clickedPlant: UserPlant) => {
    navigate(`/myplant/edit/${clickedPlant.id}`, {
      state: clickedPlant,
    });
  };

  return (
    <div className="subplant_container">
      {sortedPlants.map(plant => (
        <Link
          key={plant.id}
          to={`/myplant/${plant.id}`}
          className="subplant_list_box_link"
        >
          <div className="subplant_list_box">
            <div className="subplant_main_data">
              <span>
                <img
                  className="subplant_img"
                  src={plant.imgUrl}
                  alt="subPlantImg"
                />
              </span>
              <p className="subplant_name">{plant.nickname}</p>
            </div>
            <div className="main_check_and_edit">
              <button
                onClick={e => {
                  e.preventDefault();
                  changeMainPlant(plant);
                }}
              >
                <img
                  className="main_tag_img"
                  src={plant.isMain ? BOOKMARK_TRUE : BOOKMARK_FALSE}
                  alt="set mainplant"
                />
              </button>
              <button
                onClick={e => {
                  e.preventDefault();
                  handleEditData(plant);
                }}
              >
                <img
                  className="edit_button_img"
                  src={EDIT_ICON}
                  alt="edit plant"
                />
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MainPagePlantList;
