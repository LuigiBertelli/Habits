import { ScrollView, View, Text, Alert } from 'react-native'
import { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import dayjs from 'dayjs'
import clsx from 'clsx'

import { BackButton } from '../components/BackButton'
import { ProgressBar } from '../components/ProgressBar'
import { CheckBox } from '../components/CheckBox'
import { api } from '../lib/axios'
import { Loading } from '../components/Loading'
import { generateProgressPercentage } from '../utils/generate-progres-percentage'
import { HabitsEmpty } from '../components/HabitsEmpty'

interface HabitProps {
    userId: string
}

interface HabitParams {
    date: string
}

interface DayInfoProps {
    completedHabits: string[],
    possibleHabits: {
        id: string,
        title: string,
        created_at: string
    }[]
}

export const Habit = ({ userId }: HabitProps) => {

    const [loading, setLoading] = useState(true);
    const [dayInfo, setDayInfo] = useState<DayInfoProps>();

    const route = useRoute();
    const { date } = route.params as HabitParams;

    const parsedDate = dayjs(date);
    const isDateInPast = parsedDate.endOf('day').isBefore(new Date());
    const dayOfWeek = parsedDate.format('dddd');
    const dayAndMonth = parsedDate.format('DD/MM');

    const progressPerc = generateProgressPercentage(dayInfo?.possibleHabits.length, dayInfo?.completedHabits.length);

    const fetchHabits = async() => {
        try {
            setLoading(true);
            const res = await api.get(`${userId}/day`, {
                params: {
                    date
                }
            });

            setDayInfo(res.data);
        } catch(err) {
            console.log(err);
            Alert.alert('Oops', 'Error loading day habits, try again later!')
        } finally {
            setLoading(false);
        }
    }

    const handleToggleHabit = async(habitId: string) => {
        try {
            const isHabitCompleted = dayInfo?.completedHabits.includes(habitId);
            let completedHabits: string[] = isHabitCompleted ? 
                dayInfo!.completedHabits.filter(habit => habit !== habitId) :
                [...dayInfo!.completedHabits, habitId];

            await api.patch(`${userId}/habits/${habitId}/toggle`);
            
            setDayInfo(prevState => ({
                possibleHabits: prevState!.possibleHabits,
                completedHabits
            }));
        } catch(err) {
            console.log(err);
            Alert.alert('Oops', 'Error setting habit, try again later!')
        }
    }

    useEffect(() => {
        fetchHabits();
    }, [])

    if(loading)
        return <Loading/>

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

                <ProgressBar progress={progressPerc} />

                <View className={clsx('mt-6', { 'opacity-50': isDateInPast })}>
                    {
                        dayInfo && dayInfo.possibleHabits?.length > 0 ?
                            dayInfo?.possibleHabits.map(habit => (
                                <CheckBox 
                                    key={habit.id}
                                    title={habit.title}
                                    checked={dayInfo?.completedHabits.includes(habit.id)} 
                                    onPress={e => handleToggleHabit(habit.id)}
                                    disabled={isDateInPast}/>
                            ))
                        :
                            <HabitsEmpty/>
                    }
                </View>

                {
                    isDateInPast && (
                        <Text className="text-white mt-10 text-center">
                            You cannot edit habits from past dates
                        </Text>
                    )
                }
            </ScrollView>
        </View>
    );
}