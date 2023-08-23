import { MissionAssetType } from '@types';

export const MissionAssetDummy = {
    id: '',
    name: '',
    cloudId: '',
    cloudLink: '',
    type: MissionAssetType.IMAGE,
    description: '',
    createdAt: new Date(),
    lastModified: new Date(),

};

export const MissionDummy = {
    id: '',
    code: '',
    title: '',
    duration: 0,
    distance: '',
    description: '',
    createdAt: new Date(),
    lastModified: new Date(),
    Assets: [
        {
            id: '',
            Asset: MissionAssetDummy
        }
    ]
}
