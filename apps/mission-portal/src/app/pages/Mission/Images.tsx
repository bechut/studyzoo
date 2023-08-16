import { Drawer, Image, Space, Table } from 'antd';
import { useContext } from 'react';
import { MissionContext } from '.';
import { UploadMultiFile } from '@react-helpers';
import { MissionAssetType } from '@types';

export default function MissionImages() {
  const {
    images: {
      missionImagesVisible,
      setMissionImagesVisible,
      missionAssets,
      handleCreateMissionAssets,
    },
  } = useContext(MissionContext);

  const onClose = () => {
    setMissionImagesVisible(false);
  };

  return (
    <Drawer
      onClose={onClose}
      size="large"
      title="Mission Images"
      open={missionImagesVisible}
    >
      <Space direction="vertical">
        <UploadMultiFile
          accept="image/*"
          maxCount={3}
          uploadFn={handleCreateMissionAssets}
          assetType={MissionAssetType.IMAGE}
        />
        <Table
          rowKey={'id'}
          dataSource={missionAssets}
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
      </Space>
    </Drawer>
  );
}
