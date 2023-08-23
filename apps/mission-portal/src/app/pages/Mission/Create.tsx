import { Form, Input, Space, Button, Spin, Select, notification } from 'antd';
import { useEffect } from 'react';
import { getMissionAssets } from './Images';
import { MissionAssetType } from '@types';
import { getMapVideoOptions } from './Edit';
import { ReduxDispatchHelper } from '@react-helpers';

export const createMission = (fd: FormData, cb: () => void) => {
  new ReduxDispatchHelper(
    'mission->create',
    fd,
    (e: { message: string }) => {
      cb();
      return notification.success({ message: e.message });
    },
    (e: { details: { message: string } }) => {
      return notification.error({ message: e.details.message });
    },
  ).do();
};

export type MissionPayloadType = {
  title: string;
  code: string;
  duration: string;
  distance: string;
  description: string;
  map: string;
  video: string;
};

export const durationOption = [1, 2, 3, 4, 5].map((e: number) => ({
  label: e,
  value: e,
}));

export default function MissionCreate(props) {
  const [form] = Form.useForm();

  useEffect(() => {
    getMissionAssets([MissionAssetType.IMAGE, MissionAssetType.VIDEO]);
  }, []);

  const onFinish = (values: MissionPayloadType) => {
    const formData = new FormData();

    formData.append('title', values.title);
    formData.append('code', values.code);
    formData.append('duration', values.duration);
    formData.append('distance', values.distance);
    formData.append('description', values.description);
    formData.append('map_id', values.map || '');
    formData.append('video_id', values.video || '');

    createMission(formData, () => {
      form.resetFields();
      props.navigate("/missions")
    });
  };

  const { mapOptions, videoOptions } = getMapVideoOptions(
    props.reduxStates['mission->get-mission-assets-by-type']?.data.data,
  );

  return (
    <Form onFinish={onFinish} layout="vertical" form={form}>
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
          {
            len: 6,
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
        <Select options={durationOption} />
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
      <Form.Item label="Map" name="map">
        <Select options={[{ label: '', value: '' }, ...mapOptions]} />
      </Form.Item>
      <Form.Item label="Video" name="video">
        <Select options={[{ label: '', value: '' }, ...videoOptions]} />
      </Form.Item>
      <Space>
        <Spin spinning={false}>
          <Button htmlType="submit" type="primary">
            Create
          </Button>
        </Spin>
      </Space>
    </Form>
  );
}
