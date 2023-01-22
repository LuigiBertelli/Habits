import * as Popover from '@radix-ui/react-popover'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useState } from 'react'

import { HabitsList } from './HabitsList'
import { ProgressBar } from './ProgressBar'

interface HabitProps {
    date: Date,
    defaultAmount?: number,
    defaultCompleted?: number

}

export const HabitDay = ({date, defaultAmount = 0, defaultCompleted = 0}: HabitProps) => {
  const [completed, setCompleted] = useState(defaultCompleted);
  const [amount, setAmount] = useState(defaultAmount);

  const completedPerc = amount > 0 ?  Math.round((completed / amount) * 100) : 0;  
  
  const parsedDate = dayjs(date);
  const dayAndMonth = parsedDate.format('DD/MM');
  const weekDay = parsedDate.format('dddd');

  const hadleCompletedChange = (total: number, comp: number) => {
    setCompleted(comp);
    setAmount(total);
  }

  return (
    <Popover.Root>
      <Popover.Trigger 
        className={clsx('w-10 h-10 transition-colors text-white rounded m-2 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-background', {
          'bg-zinc-900 border-zinc-600': completedPerc === 0,
          'bg-violet-900 border-violet-700': completedPerc > 0  && completedPerc < 20,
          'bg-violet-800 border-violet-600': completedPerc >= 20 && completedPerc < 40,
          'bg-violet-700 border-violet-500': completedPerc >= 40 && completedPerc < 60,
          'bg-violet-600 border-violet-500': completedPerc >= 60 && completedPerc < 80,
          'bg-violet-500 border-violet-400': completedPerc >= 80,
        })}/>
      <Popover.Portal>
        <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-background">
          <span className="font-semibold text-zinc-400 capitalize">{weekDay}</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">{dayAndMonth}</span>

          <ProgressBar progress={completedPerc} />

          <HabitsList 
            date={date} 
            onCompletedChange={hadleCompletedChange}/>

          <Popover.Arrow className="fill-zinc-900" height={8} width={16} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}