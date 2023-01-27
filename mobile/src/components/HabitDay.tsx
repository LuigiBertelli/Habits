import { TouchableOpacity, Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import clsx from 'clsx'
import dayjs from 'dayjs'

import { generateProgressPercentage } from '../utils/generate-progres-percentage';

interface HabitDayProps {
    userId: string,
    date: Date,
    amount?: number,
    completed?: number,
}

const WEEK_DAYS = 7;
const SCREEN_Y_PADDING = (32 * 2) / 5;

export const DAY_MARGIN_BETWEEN = 8;
export const DAY_SIZE = (Dimensions.get('screen').width / WEEK_DAYS) - (SCREEN_Y_PADDING + 5)

export const HabitDay = ({userId, amount = 0, completed = 0, date}: HabitDayProps) => {
    const { navigate } = useNavigation();

    const progressPerc = generateProgressPercentage(amount, completed);
    
    const today = dayjs().startOf('day').toDate();
    const isCurrentDay = dayjs(date).isSame(today, 'day');

    return (
        <TouchableOpacity 
            activeOpacity={0.7}
            className={clsx('rounded-lg border-2 m-1',
                {
                    'bg-zinc-900 border-zinc-800': progressPerc === 0,
                    'bg-violet-900 border-violet-700': progressPerc > 0 && progressPerc < 20,
                    'bg-violet-800 border-violet-600': progressPerc >= 20 && progressPerc < 40,
                    'bg-violet-700 border-violet-500': progressPerc >= 40 && progressPerc < 60,
                    'bg-violet-600 border-violet-500': progressPerc >= 60 && progressPerc < 80,
                    'bg-violet-500 border-violet-400': progressPerc >= 80,
                    'border-white border-4': isCurrentDay
                })} 
            style={{width: DAY_SIZE, height: DAY_SIZE}}
            onPress={() => navigate('habit', {userId, date: date.toISOString()})} />
    )
}