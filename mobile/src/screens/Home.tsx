import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native'
import { useState, useCallback } from 'react'
import { useRoute } from '@react-navigation/native'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import dayjs from 'dayjs'

import { generateDatesFromYearBeginning } from '../utils/dates-from-year-beginning'
import { api } from '../lib/axios'

import { DAY_SIZE, HabitDay } from '../components/HabitDay'
import { Header } from '../components/Header'
import { Loading } from '../components/Loading'
import { UserNotLoggedIn } from '../components/UserNotLoggedIn'

interface HomeParams {
    userId?: string
}

export declare type Summary = {
    id: string;
    date: string,
    amount: number,
    completed: number
}[];

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const daysFromYearStart = generateDatesFromYearBeginning();
const yearStartOffset = dayjs(daysFromYearStart[0]).get('day');
const minimunSummaryDatesSize = (5 * 7) - yearStartOffset; // 5 weeks
const amountOfDaysToFill = minimunSummaryDatesSize - daysFromYearStart.length;



export const Home = () => {
    const route = useRoute();
    const routeParams = route.params as HomeParams;
    
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<Summary>([]);
    const [userId, setUserId] = useState('');

    const fetchData = async (user: string) => {
        try {
            setLoading(true);
            const res = await api.get(`${user}/summary`);
            setSummary(res.data);
        } catch(error) {
            Alert.alert('Oops', 'We cannot find your habit summary, try again later!');
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useFocusEffect(useCallback(() => {
        if(routeParams?.userId){
            setUserId(routeParams.userId);
            fetchData(routeParams.userId);
        }
    }, [routeParams]))

    if(loading)
        return <Loading/>

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <Header
                userId={userId}/>
            {
                userId ?
                    <>
                        <View className="flex-row mt-6 mb-2">
                            {
                                weekDays.map((day, idx) => (
                                    <Text 
                                        key={idx}
                                        className="text-zinc-400 text-xl font-bold text-center mx-1"
                                        style={{width: DAY_SIZE}}>
                                        {day}
                                    </Text>
                                ))
                            }
                        </View>

                        <ScrollView
                            contentContainerStyle={{paddingBottom: 100}}
                            showsVerticalScrollIndicator={false}>
                            <View className="flex-row flex-wrap">
                                
                                {
                                    yearStartOffset > 0 && 
                                    Array
                                        .from({length: yearStartOffset})
                                        .map((_, idx) => (
                                            <View 
                                                key={idx}
                                                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40" 
                                                style={{width: DAY_SIZE, height: DAY_SIZE}}/>)
                                        )
                                }
                                
                                {
                                    daysFromYearStart.map(date => {
                                        const dayWithHabits = summary.find(day => {
                                            return dayjs(date).isSame(day.date, 'day');
                                        })

                                        return (
                                            <HabitDay 
                                                key={date.toISOString()} 
                                                userId={userId}
                                                date={date}
                                                amount={dayWithHabits?.amount}
                                                completed={dayWithHabits?.completed}
                                                />
                                        )
                                    })
                                }

                                {
                                    amountOfDaysToFill > 0 && 
                                    Array
                                        .from({length: amountOfDaysToFill})
                                        .map((_, idx) => (
                                            <View 
                                                key={idx}
                                                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40" 
                                                style={{width: DAY_SIZE, height: DAY_SIZE}}/>)
                                        )
                                }
                            </View>
                        </ScrollView>
                    </>
                :
                    <UserNotLoggedIn />
            }
            <TouchableOpacity className="h-12 bg-white"  onPress={() => {
                AsyncStorage.clear();
                setUserId('');
            }}/>
        </View>
    )
}