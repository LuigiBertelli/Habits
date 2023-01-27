export declare global {
    namespace ReactNavigation {
        interface RootParamList {
            'home': {
                userId?: string
            },
            'signup': {
                userId?: string
            },
            'login': {
                userId?: string
            },
            'new-habit': {
                userId: string
            },
            'habit': {
                userId: string,
                date: string
            },
        }
    }
}