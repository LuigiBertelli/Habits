import * as Popover from '@radix-ui/react-popover'
import clsx from 'clsx'
import dayjs from 'dayjs'

import { CheckboxSample } from './CheckBoxSample'
import { ProgressBar } from './ProgressBar'

interface HabitProps {
    date: Date,
    amount?: number,
    completed?: number

}

export const HabitDay = ({date, amount = 0, completed= 0}: HabitProps) => {
  
  const completedPerc = amount > 0 ?  Math.round((completed / amount) * 100) : 0;  
  
  const parsedDate = dayjs(date);
  const dayAndMonth = parsedDate.format('DD/MM');
  const weekDay = parsedDate.format('dddd');

  return (
    <Popover.Root>
      <Popover.Trigger 
        className={clsx('w-10 h-10 text-white rounded m-2', {
          'bg-zinc-900 border-zinc-600': completedPerc === 0,
          'bg-violet-900 border-violet-700': completedPerc > 0  && completedPerc < 20,
          'bg-violet-800 border-violet-600': completedPerc >= 20 && completedPerc < 40,
          'bg-violet-700 border-violet-500': completedPerc >= 40 && completedPerc < 60,
          'bg-violet-600 border-violet-500': completedPerc >= 60 && completedPerc < 80,
          'bg-violet-500 border-violet-400': completedPerc >= 80,
        })}/>
      <Popover.Portal>
        <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col">
          <span className="font-semibold text-zinc-400 capitalize">{weekDay}</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">{dayAndMonth}</span>

          <ProgressBar progress={completedPerc} />

          <div className="mt-6 flex flex-col gap-3">
            <CheckboxSample title="Exercises" spanStyle="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400" />
          </div>

          <Popover.Arrow className="fill-zinc-900" height={8} width={16} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}