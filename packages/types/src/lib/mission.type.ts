export interface IMissionAssets {
    Asset: IMissionAsset; id: string; type: MissionAssetType
}

export interface IMission {
    id: string;
    code: string;
    title: string;
    duration?: number;
    distance?: string;
    description: string;
    createdAt: Date;
    lastModified: Date;
    Assets: IMissionAssets[]
}

export interface IMissionAsset {
    id: string;
    name: string;
    cloudId: string;
    cloudLink: string;
    type: MissionAssetType;
    createdAt: Date;
    lastModified: Date;
}

export enum MissionAssetType {
    VIDEO = 'VIDEO',
    IMAGE = 'IMAGE'
}