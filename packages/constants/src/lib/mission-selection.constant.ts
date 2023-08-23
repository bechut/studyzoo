export const WITH_ACTIVITIES = {
    Activities: {
        select: {
            id: true,
            title: true,
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

export const WITH_ASSETS = {
    Assets: {
        select: {
            id: true,
            type: true,
            Asset: {
                select: {
                    id: true,
                    name: true,
                    cloudId: true,
                    cloudLink: true,
                    type: true,
                    createdAt: true,
                    lastModified: true,
                }
            }
        }
    },
}

export const MISSION_SELECTION = {
    id: true,
    code: true,
    title: true,
    duration: true,
    distance: true,
    description: true,
    createdAt: true,
    lastModified: true,
}