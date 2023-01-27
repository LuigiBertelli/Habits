import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useState, useEffect } from  'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { Home } from '../screens/Home'
import { NewHabit } from '../screens/NewHabit'
import { Habit } from '../screens/Habit'
import { Signup } from '../screens/Signup'
import { Login } from '../screens/Login'

const { Navigator, Screen } = createNativeStackNavigator();

export const AppRoutes = () => {
    const [userId, setUserId] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('userId')
            .then(res => {
                if(res)
                    setUserId(res);
                
            })
            .catch(err => console.log(err));  
    }, [])

    return (
        <Navigator screenOptions={{ headerShown: false}}>
            {
                userId ? 
                    <>
                        <Screen name="home" component={Home} initialParams={{userId: userId}}/>
                        <Screen name="login" component={Login} initialParams={{userId: userId}}/>
                    </>
                :
                    <>
                        <Screen name="login" component={Login}/>
                        <Screen name="home" component={Home}/>
                    </>
            }
            
            <Screen name="signup" component={Signup} initialParams={{userId: userId}}/>
            <Screen name="habit" component={Habit} initialParams={{userId: userId}}/>
            <Screen name="new-habit" component={NewHabit} initialParams={{userId: userId}}/>
        </Navigator>
    );
}