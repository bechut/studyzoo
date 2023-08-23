import { Form, Input, Space, Button, Select, notification, Spin } from 'antd';
import { useEffect } from 'react';
import { MissionPayloadType, durationOption } from './Create';
import { ReduxDispatchHelper } from '@react-helpers';
import {
  IMission,
  IMissionAsset,
  MissionAssetType,
} from '@types';
import { getMissionAssets } from './Images';

export const getMissionById = (id: string, cb: (data: any) => void) => {
  new ReduxDispatchHelper(
    'mission->get-by-id',
    { customUri: `mission/${id}` },
    (mission: { data: IMission }) => {
      cb(mission.data);
    },
    (e) => {
      return notification.error({ message: e.details.message });
    },
  ).do();
};

export const updateMission = (fd: FormData) => {
  new ReduxDispatchHelper(
    'mission->update',
    fd,
    (e) => {
      return notification.success({ message: e.message });
    },
    (e) => {
      return notification.error({ message: e.details.message });
    },
  ).do();
};

export const getMapVideoOptions = (
  missionAssets: IMissionAsset[],
): {
  mapOptions: { label: string; value: string }[];
  videoOptions: { label: string; value: string }[];
} => {
  if (missionAssets) {
    const mapOptions = missionAssets
      .filter((asset: IMissionAsset) => asset.type === MissionAssetType.IMAGE)
      .map((asset: IMissionAsset) => ({ label: asset.name, value: asset.id }));

    const videoOptions = missionAssets
      .filter((asset: IMissionAsset) => asset.type === MissionAssetType.VIDEO)
      .map((asset: IMissionAsset) => ({ label: asset.name, value: asset.id }));

    return { mapOptions, videoOptions };
  }
  return {
    mapOptions: [{ label: '', value: '' }],
    videoOptions: [{ label: '', value: '' }],
  };
};

export default function MissionEdit(props) {
  const [form] = Form.useForm();

  const loadMissionDoneCb = (data: IMission) => {
    form.setFieldsValue({
      ...data,
      video: data.Assets.find(
        (assets: { type: MissionAssetType }) =>
          assets.type === MissionAssetType.VIDEO,
      )?.Asset?.id,
      map: data.Assets.find(
        (assets: { type: MissionAssetType }) =>
          assets.type === MissionAssetType.IMAGE,
      )?.Asset?.id,
    });
  };

  useEffect(() => {
    getMissionById(props.params.id, loadMissionDoneCb);
    getMissionAssets([MissionAssetType.IMAGE, MissionAssetType.VIDEO]);
  }, []);

  const onFinish = (values: MissionPayloadType & { mission_id: string }) => {
    const formData = new FormData();
    formData.append(
      'mission_id',
      props.reduxStates['mission->get-by-id'].data.data.id,
    );
    formData.append('title', values.title);
    formData.append('code', values.code);
    formData.append('duration', values.duration);
    formData.append('distance', values.distance);
    formData.append('description', values.description);
    formData.append('map_id', values.map || '');
    formData.append('video_id', values.video || '');
    updateMission(formData);
  };

  const { mapOptions, videoOptions } = getMapVideoOptions(
    props.reduxStates['mission->get-mission-assets-by-type']?.data.data,
  );

  return (
    <Spin spinning={props.reduxStates['mission->get-by-id'].loading}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item label="Title" name="title">
          <Input />
        </Form.Item>
        <Form.Item label="Code" name="code">
          <Input />
        </Form.Item>
        <Form.Item label="Distance" name="distance">
          <Input />
        </Form.Item>
        <Form.Item label="Duration" name="duration">
          <Select options={durationOption} />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Map" name="map">
          <Select options={[{ label: '', value: '' }, ...mapOptions]} />
        </Form.Item>
        <Form.Item label="Video" name="video">
          <Select options={[{ label: '', value: '' }, ...videoOptions]} />
        </Form.Item>
        <Space>
          <Button
            loading={props.reduxStates['mission->update'].loading}
            htmlType="submit"
            type="primary"
          >
            Save
          </Button>
        </Space>
      </Form>
    </Spin>
  );
}
