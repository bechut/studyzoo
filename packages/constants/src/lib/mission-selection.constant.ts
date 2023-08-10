export const WITH_ACTIVITIES = {
    Activities: {
        select: {
            id: true,
            title: true,
            mapImage: true,
            mapImageUrl: true,
            description: true,
            for: true,
            createdAt: true,
            lastModified: true,
        }
    },
}

export const WITH_BADGES = {
    Badges: {
        select: {
            id: true,
            title: true,
            badgeImage: true,
            badgeImageUrl: true,
            description: true,
            createdAt: true,
            lastModified: true,
        }
    },
}

export const MISSION_SELECTION = {
    id: true,
    code: true,
    title: true,
    video: true,
    videoUrl: true,
    mapImage: true,
    mapImageUrl: true,
    duration: true,
    distance: true,
    description: true,
    createdAt: true,
    lastModified: true,
}