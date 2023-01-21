import { ScrollView, View, Text } from 'react-native'
import { useRoute } from '@react-navigation/native'
import dayjs from 'dayjs'

import { BackButton } from '../components/BackButton';
import { ProgressBar } from '../components/ProgressBar';
import { CheckBox } from '../components/CheckBox';

interface HabitParams {
    date: string
}

export const Habit = () => {
    const route = useRoute();
    const { date } = route.params as HabitParams;

    const parsedDate = dayjs(date);
    const dayOfWeek = parsedDate.format('dddd');
    const dayAndMonth = parsedDate.format('DD/MM')

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView>
                <BackButton />

                <Text className="mt-6 text-zinc-400 font-semibold text-base capitalize">
                    {dayOfWeek}
                </Text>

                <Text className=" text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>

                <ProgressBar progress={30} />

                <View className="mt-6">
                    <CheckBox 
                        title="Beber 2l"
                        checked={false} />
                    <CheckBox 
                        title="Exercicios"
                        checked={true} />
                </View>

            </ScrollView>
        </View>
    );
}