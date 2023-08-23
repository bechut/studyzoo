import { Image, Spin, Table, notification } from 'antd';
import { useEffect } from 'react';
import { ReduxDispatchHelper, UploadMultiFile } from '@react-helpers';
import { MissionAssetType } from '@types';

export const getMissionAssets = (types: MissionAssetType[]) => {
  new ReduxDispatchHelper(
    'mission->get-mission-assets-by-type',
    { types },
    () => {
      // setAssetWaiting(false);
    },
    (e) => {
      return notification.error({ message: e.details.message });
    },
  ).do();
};

export const uploadAssetEvent = () => {
  const eventSource = new EventSource(import.meta.env.VITE_MS_APP_EVENT_URL);
  eventSource.onmessage = ({ data }) => {
    getMissionAssets([JSON.parse(data).data.type]);
  };
};

export const createMissionAssets = (fd: FormData) => {
  new ReduxDispatchHelper(
    'mission->create-mission-assets',
    fd,
    (e) => {
      return notification.success({ message: e.message });
    },
    (e) => {
      return notification.error({ message: e.details.message });
    },
  ).do();
};

uploadAssetEvent();

export default function MissionImages(props) {
  useEffect(() => {
    getMissionAssets([MissionAssetType.IMAGE]);
  }, []);

  return (
    <>
      <Spin spinning={false}>
        <UploadMultiFile
          accept="image/*"
          maxCount={3}
          uploadFn={createMissionAssets}
          assetType={MissionAssetType.IMAGE}
        />
      </Spin>
      <Table
        loading={
          props.reduxStates['mission->get-mission-assets-by-type'].loading
        }
        rowKey={'id'}
        dataSource={
          props.reduxStates['mission->get-mission-assets-by-type']?.data?.data
        }
        columns={[
          {
            key: 'name',
            dataIndex: 'name',
            title: 'Name',
          },
          {
            key: 'type',
            dataIndex: 'type',
            title: 'Type',
          },
          {
            key: 'mission_used',
            dataIndex: '_count',
            title: 'Total mission used',
            render: (_count: { Missions: number }) => _count.Missions,
          },
          {
            key: 'cloudId',
            dataIndex: 'cloudId',
            title: 'Asset',
            render: (a: string) => {
              return (
                <Image
                  style={{ width: '50px' }}
                  src={`https://drive.google.com/uc?export=view&id=${a}`}
                  alt="asset image"
                />
              );
            },
          },
        ]}
      />
    </>
  );
}
