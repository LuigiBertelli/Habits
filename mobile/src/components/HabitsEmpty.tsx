import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native'

export const HabitsEmpty = () => {
    const { navigate } = useNavigation();
    return (
        <Text className="text-zinc-400 text-base">
            You don't have any habit registered on this day of week. {' '}
            <Text
                className="text-violet-400 text-base underline active:text-violet-500"
                onPress={() => navigate('new-habit')}>
                    Start creating a new one!
            </Text>
        </Text>
    );
}