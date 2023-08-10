import { Drawer, Form, Input, Space, Button } from 'antd';
import React, { useContext, useMemo } from 'react';
import { MissionContext } from '.';

export default function EditMission() {
  const [form] = Form.useForm();
  const {
    edit: { mission, editVisible, setEditVisible },
  } = useContext(MissionContext);

  useMemo(() => {
    if (editVisible) {
      form.setFieldsValue({ ...mission });
    }
  }, [form, mission, editVisible]);

  const onClose = () => {
    setEditVisible(false);
  };

  return (
    <Drawer
      onClose={onClose}
      title="Edit Mission"
      size="large"
      open={editVisible}
    >
      <Form layout="vertical" form={form}>
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
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea />
        </Form.Item>
        <Space>
          <Button type="primary">Save</Button>
        </Space>
      </Form>
    </Drawer>
  );
}
