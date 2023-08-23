import {
  Button,
  Table,
  notification,
  Image,
  Row,
  Col,
  Space,
  Modal,
  Tooltip,
} from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { GG_LINK_FILE, TIME_FORMAT } from '@constants';
import {
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { ReduxDispatchHelper, VideoModal } from '@react-helpers';
import { Link } from 'react-router-dom';
import { IMission, IMissionAssets, MissionAssetType } from '@types';

export const deleteMission = (id: string, cb: () => void) => {
  new ReduxDispatchHelper(
    'mission->delete',
    { customUri: `/mission/${id}` },
    (e) => {
      cb();
      return notification.success({ message: e.message });
    },
    (e) => {
      return notification.error({ message: e.details.message });
    },
  ).do();
};

export const getMissions = () => {
  new ReduxDispatchHelper(
    'mission->get-all',
    {},
    () => {
      //
    },
    (e) => {
      console.log(e);
      return notification.error({ message: e.details.message });
    },
  ).do();
};

export default function MissionList(props) {
  const [visible, setVisible] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
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
      key: 'map',
      dataIndex: 'Assets',
      title: 'Map',
      render: (assets: IMissionAssets[]) => {
        const cloudId =
          assets.find(
            (asset: IMissionAssets) => asset.type === MissionAssetType.IMAGE,
          )?.Asset?.cloudId || '';
        return (
          cloudId && (
            <Image
              style={{ width: '50px' }}
              src={GG_LINK_FILE(cloudId, import.meta.env.VITE_GG_API_KEY)}
              alt="asset image"
            />
          )
        );
      },
    },
    {
      key: 'video',
      dataIndex: 'Assets',
      title: 'Video',
      render: (assets: IMissionAssets[]) => {
        const cloudId =
          assets.find(
            (asset: IMissionAssets) => asset.type === MissionAssetType.VIDEO,
          )?.Asset?.cloudId || '';
        return (
          cloudId && (
            <Button
              icon={<PlayCircleOutlined />}
              onClick={() => {
                setUrl(GG_LINK_FILE(cloudId, import.meta.env.VITE_GG_API_KEY));
                setVisible(true);
              }}
            />
          )
        );
      },
    },
    {
      key: 'action',
      dataIndex: 'action',
      title: 'Action',
      render: (a: any, b: IMission) => {
        return (
          <Space>
            <Link to={`/missions/${b.id}`}>
              <Tooltip title="Edit">
                <Button type="text" icon={<EditOutlined />} />
              </Tooltip>
            </Link>
            <Link to={`/missions/activities/${b.id}`}>
              <Tooltip title="Activities">
                <Button type="text" icon={<TrophyOutlined />} />
              </Tooltip>
            </Link>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  Modal.confirm({
                    title: 'Do you really want to delete this mission?',
                    onOk: () => {
                      deleteMission(b.id, () => {
                        getMissions();
                      });
                    },
                  });
                }}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    getMissions();
  }, []);

  return (
    <>
      <Row style={{ marginBottom: 10 }} justify={'space-between'}>
        <Col />
        <Col>
          <Link to="/missions/create">
            <Button type="primary">Create</Button>
          </Link>
        </Col>
      </Row>
      <Table
        scroll={{ x: 1000 }}
        loading={props.reduxStates['mission->get-all'].loading}
        rowKey={'id'}
        dataSource={props.reduxStates['mission->get-all'].data.data}
        columns={columns}
      />
      <VideoModal
        visible={visible}
        url={url}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </>
  );
}
