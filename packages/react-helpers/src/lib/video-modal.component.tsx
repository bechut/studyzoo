import { Modal } from 'antd';

export function VideoModal(props) {
  return (
    <Modal
      footer={null}
      width="1000px"
      destroyOnClose
      open={props.visible}
      onCancel={props.onCancel}
    >
      <video
        key={props.url}
        style={{ width: '100%', height: '450px' }}
        controls
        autoPlay
        loop
      >
        <source src={props.url} type="video/mp4"></source>
      </video>
    </Modal>
  );
}
