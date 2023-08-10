import { ReduxDispatchHelper, RootState } from '@react-helpers';
import {
  Button,
  Space,
  Table,
  Typography,
  FloatButton,
  notification,
  Form,
} from 'antd';
import React, { useMemo, useState, createContext } from 'react';
import moment from 'moment';
import { TIME_FORMAT } from '@constants';
import {
  EditOutlined,
  FolderAddOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import EditMission from './Edit';
import CreateMission from './Create';
import { useSelector } from 'react-redux';

export const MissionContext = createContext({});

export default function Mission() {
  const state = useSelector((state: RootState) => state);
  const [missions, setMissions] = useState([]);
  const [mission, setMission] = useState([]);
  const [editVisible, setEditVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [createMissionForm] = Form.useForm();

  const handleGetMissions = () => {
    new ReduxDispatchHelper(
      'mission->get-all',
      {},
      (e: any) => {
        setMissions(e.data);
      },
      (e: any) => {
        console.log(e);
        notification.error(e.message)
      },
    ).do();
  };

  const handleCreateMissions = (payload: FormData) => {
    new ReduxDispatchHelper(
      'mission->create',
      payload,
      (e: any) => {
        handleGetMissions();
        setCreateVisible(false);
        createMissionForm.resetFields();
      },
      (e: any) => {
        notification.success(e.message);
      },
    ).do();
  };

  useMemo(() => {
    handleGetMissions();
  }, []);

  const onOpenEditMissionForm = (mission: any) => {
    setEditVisible(true);
    setMission(mission);
  };

  const onOpenCreateMissionForm = () => {
    setCreateVisible(true);
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
            createMissionForm
          },
        }}
      >
        <EditMission />
        <CreateMission />
      </MissionContext.Provider>
    </>
  );
}
