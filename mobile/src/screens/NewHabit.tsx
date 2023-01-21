import { View, ScrollView, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useState } from 'react'

import { BackButton } from '../components/BackButton'
import { CheckBox } from '../components/CheckBox'

import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors'
import { api } from '../lib/axios'

const avaiableWeekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const NewHabit = () => {
    const [weekDays, setWeekDays] = useState<number[]>([]);
    const [title, setTitle] = useState('');

    const handleToggleWeekDay = (weekDay: number) => (
        weekDays.includes(weekDay) ? 
            setWeekDays(prevState => prevState.filter(x => x !== weekDay)) : 
            setWeekDays(prevState => [...prevState, weekDay]));

    const handleCreateNewHabit = async() => {
        try {
            if(!title.trim()  || weekDays.length === 0)
                Alert.alert('New habit', 'Please, type the title and chose the days.');

            await api.post('habit', {
                title: title.trim(),
                weekDays
            });

            
            setTitle('');
            setWeekDays([]);
            Alert.alert('New habit', 'New habit created succesfully!');
        } catch(error) {
            Alert.alert('Oops', 'Error trying to create a new habit, try again later.');
            console.log(error);
        }
    }

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
                    placeholderTextColor={colors.zinc[400]}
                    onChangeText={setTitle}
                    value={title}/>
                
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