import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Home } from '../screens/Home'
import { NewHabit } from '../screens/NewHabit'
import { Habit } from '../screens/Habit'

const { Navigator, Screen } = createNativeStackNavigator();

export const AppRoutes = () => {

    return (
        <Navigator screenOptions={{ headerShown: false}}>
            <Screen name="home" component={Home} />
            <Screen name="habit" component={Habit} />
            <Screen name="new-habit" component={NewHabit} />
        </Navigator>
    );
}