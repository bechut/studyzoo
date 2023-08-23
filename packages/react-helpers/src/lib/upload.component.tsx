import React from 'react';
import { Button, Upload, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { MissionAssetType } from '@types';

type UploadMultiFileType = {
  accept: string;
  maxCount: number;
  uploadFn: (fd: FormData) => void;
  assetType: MissionAssetType;
};

export function UploadMultiFile({
  accept,
  maxCount,
  uploadFn,
  assetType,
}: UploadMultiFileType) {
  const [filesList, setFileList] = useState<any>([]);

  const onUpload = () => {
    const formData = new FormData();

    formData.append('type', assetType);

    filesList.forEach(async (file: { originFileObj: File }) => {
      formData.append('files', file.originFileObj);
    });

    uploadFn(formData);
    setFileList([]);
  };

  return (
    <Space direction="vertical">
      <Upload
        fileList={filesList}
        onChange={({ file, fileList }) => setFileList(fileList)}
        accept={accept}
        maxCount={maxCount}
      >
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
      <Button onClick={onUpload} disabled={!filesList.length} type="primary">
        Upload
      </Button>
    </Space>
  );
}
