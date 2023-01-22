import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import { api } from '../lib/axios'

import { CheckboxSample } from './CheckBoxSample'

interface HabitsListProps {
  date: Date,
  onCompletedChange: (amount: number, completed: number) => void
}

interface HabitsInfo{
  possibleHabits: {
    id: string,
    title: string,
    created_at: string
  }[],
  completedHabits: string[]
};

export const HabitsList = ({date, onCompletedChange}: HabitsListProps) => {
    const [dayHabitsInfo, setDayHabitsInfo] = useState<HabitsInfo>();

    const isDateInPast = dayjs(date).endOf('day').isBefore(new Date());

    useEffect(() => {
      api.get('day', {
        params: {
          date: date.toISOString()
        }
      })
      .then(res => setDayHabitsInfo(res.data))
      .catch(err => {
        console.log(err);
        alert('Error getting the day habits,try again later!');
      });
    }, [])

    const handleToggleHabit = async (habitId: string) => {
      const isHabitCompleted = dayHabitsInfo?.completedHabits.includes(habitId);
      let completedHabits: string[] = [];

      await api.patch(`habits/${habitId}/toggle`)
        .then(() => {
          if(isHabitCompleted)
            completedHabits = dayHabitsInfo!.completedHabits.filter(habit => habit !== habitId)
          else
            completedHabits = [...dayHabitsInfo!.completedHabits, habitId];

          setDayHabitsInfo(prevState => ({
            possibleHabits: prevState!.possibleHabits,
            completedHabits
          }));

          onCompletedChange(dayHabitsInfo?.possibleHabits.length ?? 0 ,completedHabits.length);
        })
        .catch(err => {
          console.log(err);
          alert('Error getting the day habits,try again later!');
        });
    }

    return (
        
          <div className="mt-6 flex flex-col gap-3">
            {
              dayHabitsInfo?.possibleHabits.map(habit => (
                <CheckboxSample 
                  key={habit.id} 
                  title={habit.title} 
                  spanStyle="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400"
                  onCheckedChange={e => handleToggleHabit(habit.id)}
                  checked={dayHabitsInfo?.completedHabits.includes(habit.id)}
                  disabled={isDateInPast} />
              ))
            }
          </div>

    );
}