'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlant } from '@/@types/plant.type';
import paths from '@/constants/routePath';

import styles from './myPlantList.module.scss';
import BOOKMARK_TRUE from '/assets/icons/bookmark.png';
import BOOKMARK_FALSE from '/assets/icons/bookmark_empty.png';
import EDIT_ICON from '/assets/icons/edit_gray.png';

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
  const router = useRouter();
  const sortedPlants = useMemo(() => userPlants.sort(compare), [userPlants]);

  const handleEditData = (clickedPlant: UserPlant) => {
    router.push(`${paths.myplantEdit}/${clickedPlant.id}`);
  };

  return (
    <div className={styles.container}>
      {sortedPlants.map(plant => (
        <Link
          key={plant.id}
          to={`${paths.myplant}/${plant.id}`}
          className={styles.list_box}
        >
          <div className={styles.main_data}>
            <span>
              <img
                className="subplant_img"
                src={plant.imgUrl}
                alt="subPlantImg"
              />
            </span>
            <p className={styles.nickname}>{plant.nickname}</p>
          </div>
          <div className={styles.btn_wrapper}>
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
        </Link>
      ))}
    </div>
  );
};

export default MainPagePlantList;
