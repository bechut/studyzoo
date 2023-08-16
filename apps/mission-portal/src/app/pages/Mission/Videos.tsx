import { Button, Drawer, Modal, Space, Table } from 'antd';
import { useContext, useState, useRef, useMemo } from 'react';
import { MissionContext } from '.';
import { UploadMultiFile } from '@react-helpers';
import { MissionAssetType } from '@types';
import { PlayCircleOutlined } from '@ant-design/icons';

export default function MissionVideos() {
  const [visible, setVisible] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('false');
  const videoRef: any = useRef();
  const {
    videos: {
      missionVideosVisible,
      setMissionVideosVisible,
      missionAssets,
      handleCreateMissionAssets,
      GG_API_KEY,
    },
  } = useContext(MissionContext);

  const onClose = () => {
    setMissionVideosVisible(false);
    setUrl('');
  };

  useMemo(() => {
    url && videoRef.current?.load();
  }, [url]);

  return (
    <Drawer
      onClose={onClose}
      size="large"
      title="Mission Videos"
      open={missionVideosVisible}
    >
      <Space direction="vertical">
        <UploadMultiFile
          accept="video/*"
          maxCount={3}
          uploadFn={handleCreateMissionAssets}
          assetType={MissionAssetType.VIDEO}
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
              key: 'thumbnail',
              dataIndex: 'cloudId',
              title: 'Thumbnail',
              render: (a: string, b: { cloudId?: string }) => {
                return (
                  <video
                    key={`https://www.googleapis.com/drive/v3/files/${a}?alt=media&key=${GG_API_KEY}`}
                    style={{ width: '100px', height: '100px' }}
                    controls={false}
                  >
                    <source
                      src={`https://www.googleapis.com/drive/v3/files/${a}?alt=media&key=${GG_API_KEY}`}
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
                      setVisible(true);
                      setUrl(
                        `https://www.googleapis.com/drive/v3/files/${a}?alt=media&key=${GG_API_KEY}`,
                      );
                    }}
                  />
                );
              },
            },
          ]}
        />
        <Modal
          footer={null}
          width="1000px"
          destroyOnClose
          open={visible}
          onCancel={() => setVisible(false)}
        >
          <video
            key={url}
            ref={videoRef}
            style={{ width: '100%', height: '450px' }}
            controls
            autoPlay
            loop
          >
            <source
              // src={"https://www.googleapis.com/drive/v3/files/1I4C3HVVnqx5v1yqkE-ykcG6ITEZxu_M3?alt=media&key=AIzaSyDjqi2toLCQFJM85F551OBdilvHWGzSu6k"}
              src={url}
              type="video/mp4"
            ></source>
          </video>
        </Modal>
      </Space>
    </Drawer>
  );
}
