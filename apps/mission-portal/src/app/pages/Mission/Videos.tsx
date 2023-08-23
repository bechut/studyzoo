import { Button, Table } from 'antd';
import { useEffect, useState } from 'react';
import {
  createMissionAssets,
  getMissionAssets,
  uploadAssetEvent,
} from './Images';
import { MissionAssetType } from '@types';
import { UploadMultiFile } from '@react-helpers';
import { GG_LINK_FILE } from '@constants';
import { PlayCircleOutlined } from '@ant-design/icons';
import { VideoModal } from '@react-helpers';

uploadAssetEvent();

export default function MissionVideos(props) {
  const [visible, setVisible] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
  useEffect(() => {
    getMissionAssets([MissionAssetType.VIDEO]);
  }, []);

  return (
    <>
      {/* <Spin spinning={assetWaiting}> */}
      <UploadMultiFile
        accept="video/*"
        maxCount={3}
        uploadFn={createMissionAssets}
        assetType={MissionAssetType.VIDEO}
      />
      {/* </Spin> */}

      <VideoModal
        visible={visible}
        url={url}
        onCancel={() => {
          setVisible(false);
        }}
      />

      <Table
        loading={
          props.reduxStates['mission->get-mission-assets-by-type'].loading
        }
        rowKey={'id'}
        dataSource={
          props.reduxStates['mission->get-mission-assets-by-type'].data.data
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
            key: 'thumbnail',
            dataIndex: 'cloudId',
            title: 'Thumbnail',
            render: (a: string, b: { cloudId?: string }) => {
              return (
                <video
                  key={GG_LINK_FILE(a, import.meta.env.VITE_GG_API_KEY)}
                  style={{ width: '100px', height: '100px' }}
                  controls={false}
                >
                  <source
                    src={GG_LINK_FILE(a, import.meta.env.VITE_GG_API_KEY)}
                    type="video/mp4"
                  ></source>
                </video>
              );
            },
          },
          {
            key: 'cloudId',
            dataIndex: 'cloudId',
            title: 'Asset',
            render: (a: string, b: { cloudId?: string }) => {
              return (
                <Button
                  icon={<PlayCircleOutlined />}
                  onClick={() => {
                    setUrl(GG_LINK_FILE(a, import.meta.env.VITE_GG_API_KEY));
                    setVisible(true);
                  }}
                />
              );
            },
          },
        ]}
      />
    </>
  );
}
