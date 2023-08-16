export interface IMission {
    id: string;
    code: string;
    title: string;
    video?: string;
    videoUrl?: string;
    mapImag?: string;
    mapImageUrl?: string;
    duration?: number;
    distance?: string;
    description: string;
    createdAt: Date;
    lastModified: Date;
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