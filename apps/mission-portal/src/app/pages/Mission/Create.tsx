import {
  Drawer,
  Form,
  Input,
  Space,
  Button,
  TimePicker,
  Upload,
  Spin,
} from 'antd';
import React, { useContext, useMemo } from 'react';
import { MissionContext } from '.';
import { UploadOutlined } from '@ant-design/icons';

export default function CreateMission() {
  const {
    create: {
      createVisible,
      setCreateVisible,
      handleCreateMissions,
      createLoading,
      createMissionForm
    },
  } = useContext(MissionContext);

  const onClose = () => {
    setCreateVisible(false);
  };

  const onFinish = (values: any) => {
    const formData = new FormData();

    formData.append('title', values.title);
    formData.append('code', values.code);
    formData.append('duration', values.duration.get('hour'));
    formData.append('distance', values.distance);
    formData.append('description', values.description);
    formData.append('map_file', values.map.file.originFileObj);
    formData.append('video_file', values.video.file.originFileObj);

    handleCreateMissions(formData);
  };

  return (
    <Drawer
      onClose={onClose}
      title="Create Mission"
      size="large"
      open={createVisible}
    >
      <Form onFinish={onFinish} layout="vertical" form={createMissionForm}>
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Code"
          name="code"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Distance"
          name="distance"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Duration"
          name="duration"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <TimePicker format="HH" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Map"
          name="map"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Upload accept="image/*" maxCount={1}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          label="Video"
          name="video"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Upload accept="video/*" maxCount={1}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <Space>
          <Spin spinning={createLoading}>
            <Button htmlType="submit" type="primary">
              Create
            </Button>
          </Spin>
        </Space>
      </Form>
    </Drawer>
  );
}
