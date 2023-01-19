import * as Popover from '@radix-ui/react-popover';
import { ProgressBar } from './ProgressBar';
import clsx from 'clsx'
interface HabitProps {
    amount: number,
    completed: number

}

export const HabitDay = (props: HabitProps) => {
  
  const completedPerc = Math.round((props.completed / props.amount) * 100)  

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
          <span className="font-semibold text-zinc-400">Wednesday</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">18/01</span>

          <ProgressBar progress={completedPerc} />

          <div></div>

          <Popover.Arrow className="fill-zinc-900" height={8} width={16} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}