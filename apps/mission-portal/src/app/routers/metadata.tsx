import Homepage from '../pages/Homepage';
import MissionCreate from '../pages/Mission/Create';
import MissionEdit from '../pages/Mission/Edit';
import MissionImages from '../pages/Mission/Images';
import MissionList from '../pages/Mission/List';
import MissionVideos from '../pages/Mission/Videos';
import { MissionActivities } from '../pages/MissionActivities/List';
import { withAuthLayout } from './auth-layout';

const missionRoutes = [
  {
    path: '/missions',
    element: withAuthLayout(<MissionList />),
  },
  {
    path: '/missions/images',
    element: withAuthLayout(<MissionImages />),
  },
  {
    path: '/missions/videos',
    element: withAuthLayout(<MissionVideos />),
  },
  {
    path: '/missions/create',
    element: withAuthLayout(<MissionCreate />),
  },
  {
    path: '/missions/:id',
    element: withAuthLayout(<MissionEdit />),
  },
  {
    path: '/missions/activities/:id',
    element: withAuthLayout(<MissionActivities />),
  },
];

export const metadata = [
  {
    path: '/',
    element: withAuthLayout(<Homepage />),
  },
  ...missionRoutes,
];
