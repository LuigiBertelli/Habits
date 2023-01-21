import { View, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native'
import { useState } from 'react'

import { BackButton } from '../components/BackButton'
import { CheckBox } from '../components/CheckBox'

import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors'

const avaiableWeekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const NewHabit = () => {
    const [weekDays, setWeekDays] = useState<number[]>([]);

    const handleToggleWeekDay = (weekDay: number) => (
        weekDays.includes(weekDay) ? 
            setWeekDays(prevState => prevState.filter(x => x !== weekDay)) : 
            setWeekDays(prevState => [...prevState, weekDay]));  

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 100}}>
                <BackButton />
                <Text className="mt-6 text-white font-extrabold text-3xl">
                    New habit
                </Text>

                <Text className="mt-6 text-white font-semibold text-base">
                    What's your willingness?
                </Text>

                <TextInput 
                    className="h-12 pl-4 rounded-lg mt-3 bg-zinc-800 text-whit focus:border-2 focus:border-green-600" 
                    placeholder="i.e: Exercises, Sleep well, etc..."
                    placeholderTextColor={colors.zinc[400]}/>
                
                <Text className="mt-6 text-white font-semibold text-base mb-2">
                    How often?
                </Text>
                
                {
                    avaiableWeekDays.map((weekDay, idx) => (
                        
                        <CheckBox 
                            key={weekDay} 
                            title={weekDay} 
                            checked={weekDays.includes(idx)}
                            onPress={() => handleToggleWeekDay(idx)}/>))
                }

                <TouchableOpacity
                    activeOpacity={0.7}
                    className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6">
                    <Feather 
                        name="check"
                        size={20}
                        color={colors.white}/>

                    <Text className="font-semibold text-base text-white">
                        Save
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}