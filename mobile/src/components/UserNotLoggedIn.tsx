import { View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export const UserNotLoggedIn = () => {
    const { navigate } = useNavigation();

    return (
        <View className="h-[50%] w-full items-center justify-center">
            <Text className="text-zinc-400 text-base">
                Don't have an account yet? {' '}
                <Text
                    className="text-violet-400 text-base underline active:text-violet-500"
                    onPress={() => navigate('signup')}>
                    Sign up with us.
                </Text>
            </Text>
        </View>
    )
}