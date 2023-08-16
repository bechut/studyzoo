import { ReduxDispatchHelper, RootState } from '@react-helpers';
import {
  Button,
  Space,
  Table,
  Typography,
  FloatButton,
  notification,
  Form,
  FormInstance,
} from 'antd';
import React, {
  useMemo,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from 'react';
import moment from 'moment';
import { TIME_FORMAT } from '@constants';
import {
  EditOutlined,
  FolderAddOutlined,
  CustomerServiceOutlined,
  CloudUploadOutlined,
  VideoCameraAddOutlined,
} from '@ant-design/icons';
import EditMission from './Edit';
import CreateMission from './Create';
import { useSelector } from 'react-redux';
import { IMission, IMissionAsset, MissionAssetType } from '@types';
import MissionImages from './Images';
import MissionVideos from './Videos';

interface CurrentUserContextType {
  edit: {
    mission?: IMission;
    editVisible?: boolean;
    setEditVisible?: Dispatch<SetStateAction<boolean>>;
  };
  create: {
    createVisible?: boolean;
    setCreateVisible?: Dispatch<SetStateAction<boolean>>;
    handleCreateMissions?: (formData: FormData) => void;
    createLoading?: boolean;
    createMissionForm?: FormInstance;
  };
  images: {
    missionImagesVisible?: boolean;
    setMissionImagesVisible?: Dispatch<SetStateAction<boolean>>;
    missionAssets?: IMissionAsset[];
    handleCreateMissionAssets?: (fd: FormData) => void;
  };
  videos: {
    missionVideosVisible?: boolean;
    setMissionVideosVisible?: Dispatch<SetStateAction<boolean>>;
    missionAssets?: IMissionAsset[];
    handleCreateMissionAssets?: (fd: FormData) => void;
    GG_API_KEY: any;
  };
}

export const MissionContext = createContext<CurrentUserContextType>({
  edit: {},
  create: {},
  images: {},
});

export default function Mission() {
  const state = useSelector((state: RootState) => state);
  const [missions, setMissions] = useState<IMission[]>([]);
  const [mission, setMission] = useState<IMission>();
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [createVisible, setCreateVisible] = useState<boolean>(false);
  const [missionImagesVisible, setMissionImagesVisible] =
    useState<boolean>(false);
  const [missionVideosVisible, setMissionVideosVisible] =
    useState<boolean>(false);
  const [createMissionForm] = Form.useForm();

  console.log(state);

  const handleGetMissions = () => {
    new ReduxDispatchHelper(
      'mission->get-all',
      {},
      (e: any) => {
        setMissions(e.data);
      },
      (e: any) => {
        notification.error(e.message);
      },
    ).do();
  };

  const handleCreateMissions = (payload: FormData) => {
    new ReduxDispatchHelper(
      'mission->create',
      payload,
      () => {
        handleGetMissions();
        setCreateVisible(false);
        createMissionForm.resetFields();
      },
      () => {
        return notification.error(e.message);
      },
    ).do();
  };

  const handleGetMissionAssets = (type: MissionAssetType) => {
    new ReduxDispatchHelper(
      'mission->get-mission-assets-by-type',
      { type },
      (e: any) => {},
      (e: any) => {
        return notification.error({ message: e.message });
      },
    ).do();
  };

  const handleCreateMissionAssets = (fd: FormData) => {
    new ReduxDispatchHelper(
      'mission->create-mission-assets',
      fd,
      (e: any) => {},
      (e: any) => {
        return notification.error({ message: e.message });
      },
    ).do();
  };

  const uploadAssetEvent = () => {
    const eventSource = new EventSource(import.meta.env.VITE_MS_APP_EVENT_URL);
    eventSource.onmessage = ({ data }) => {
      handleGetMissionAssets(JSON.parse(data).data.type);
    };
  };

  useMemo(() => {
    handleGetMissions();
    uploadAssetEvent();
  }, []);

  const onOpenEditMissionForm = (mission: IMission) => {
    setEditVisible(true);
    setMission(mission);
  };

  const onOpenCreateMissionForm = () => {
    setCreateVisible(true);
  };

  const onOpenMissionVideosForm = () => {
    setMissionVideosVisible(true);
    handleGetMissionAssets(MissionAssetType.VIDEO);
  };

  const onOpenMissionImagesForm = () => {
    setMissionImagesVisible(true);
    handleGetMissionAssets(MissionAssetType.IMAGE);
  };

  const columns = [
    {
      key: 'title',
      dataIndex: 'title',
      title: 'Title',
    },
    {
      key: 'code',
      dataIndex: 'code',
      title: 'Code',
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: 'Description',
    },
    {
      key: 'createdAt',
      dataIndex: 'createdAt',
      title: 'Created at',
      render: (createdAt: string) => moment(createdAt).format(TIME_FORMAT),
    },
    {
      key: 'lastModified',
      dataIndex: 'lastModified',
      title: 'Last modified',
      render: (lastModified: string) =>
        lastModified && moment(lastModified).format(TIME_FORMAT),
    },
    {
      key: 'action',
      dataIndex: 'action',
      title: 'Action',
      render: (a: any, b: any) => {
        return (
          <Space>
            <Button
              onClick={() => onOpenEditMissionForm(b)}
              type="text"
              icon={<EditOutlined />}
            />
          </Space>
        );
      },
    },
  ];

  console.log(import.meta.env)

  return (
    <>
      <Typography.Title>Missions</Typography.Title>
      <Table rowKey={'id'} dataSource={missions} columns={columns} />
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: 24 }}
        icon={<CustomerServiceOutlined />}
      >
        <FloatButton
          tooltip={<span>Add mission</span>}
          icon={<FolderAddOutlined />}
          onClick={onOpenCreateMissionForm}
        />
        <FloatButton
          tooltip={<span>Upload mission image</span>}
          icon={<CloudUploadOutlined />}
          onClick={onOpenMissionImagesForm}
        />
        <FloatButton
          tooltip={<span>Upload mission video</span>}
          icon={<VideoCameraAddOutlined />}
          onClick={onOpenMissionVideosForm}
        />
      </FloatButton.Group>
      <MissionContext.Provider
        value={{
          edit: {
            mission,
            editVisible,
            setEditVisible,
          },
          create: {
            createVisible,
            setCreateVisible,
            handleCreateMissions,
            createLoading: state['mission->create'].loading,
            createMissionForm,
          },
          images: {
            missionImagesVisible,
            setMissionImagesVisible,
            missionAssets:
              state['mission->get-mission-assets-by-type'].data?.data,
            handleCreateMissionAssets,
          },
          videos: {
            missionVideosVisible,
            setMissionVideosVisible,
            missionAssets:
              state['mission->get-mission-assets-by-type'].data?.data,
            handleCreateMissionAssets,
            GG_API_KEY: import.meta.env.VITE_GG_API_KEY
          },
        }}
      >
        <EditMission />
        <CreateMission />
        <MissionImages />
        <MissionVideos />
      </MissionContext.Provider>
    </>
  );
}
