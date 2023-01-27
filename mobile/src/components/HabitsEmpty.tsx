import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native'

interface HabitsEmptyProps {
    userId: string
}

export const HabitsEmpty = ({ userId } : HabitsEmptyProps) => {
    const { navigate } = useNavigation();
    return (
        <Text className="text-zinc-400 text-base">
            You don't have any habit registered on this day of week. {' '}
            <Text
                className="text-violet-400 text-base underline active:text-violet-500"
                onPress={() => navigate('new-habit', {userId})}>
                    Start creating a new one!
            </Text>
        </Text>
    );
}