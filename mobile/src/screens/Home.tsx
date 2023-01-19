import { View, Text, ScrollView } from 'react-native'

import { generateDatesFromYearBeginning } from '../utils/dates-from-year-beginning'

import { DAY_SIZE, HabitDay } from '../components/HabitDay'
import { Header } from '../components/Header'

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const daysFromYearStart = generateDatesFromYearBeginning()
const minimunSummaryDatesSize = 5 * 7 // 5 weeks
const amountOfDaysToFill = minimunSummaryDatesSize - daysFromYearStart.length



export const Home = () => {
    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <Header/>
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
                        daysFromYearStart.map(date => <HabitDay key={date.toISOString()} />)
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
        </View>
    )
}