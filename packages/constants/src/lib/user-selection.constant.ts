

export const USER_SELECTION = {
    id: true,
    email: true,
    status: true,
    password: true,
    createdAt: true,
    updatedAt: true,
    Profile: {
        select: {
            id: true,
            first_name: true,
            last_name: true,
            gender: true,
            age: true,
            bio: true,
        }
    },
}

export const WITH_PLAYER = {
    Players: {
        select: {
            id: true,
            Profile: USER_SELECTION.Profile
        }
    }
}