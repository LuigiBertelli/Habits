import { Check } from 'phosphor-react'
import { FormEvent, useState } from 'react'


import { api } from '../lib/axios'
import { CheckboxSample } from './CheckBoxSample'

const avaiableWeekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const NewHabitForm = () => {
    const [title, setTitle] = useState('');
    const [weekDays, setWeekDays] = useState<number[]>([]);

    const handleToggleWeekDays = (weekDay: number) => {
        if(weekDays.includes(weekDay))
            setWeekDays(prevState => prevState.filter(x => x !== weekDay));
        else
            setWeekDays(prevState => [...prevState, weekDay]);
    }

    const createNewHabit = async(e : FormEvent) => {
        e.preventDefault();

        if(!title.trim || weekDays.length === 0)
            return;

        await api
            .post('habit', {
                title: title.trim(),
                weekDays
            })
            .catch(ex => {
                alert('Error creating new habit, try again later.');
                console.log(ex);
            });

            
        setTitle('');
        setWeekDays([]);
        alert('New habit created succesfully!');
    }

    return (
        <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
            
            <label htmlFor="title" className="font-semibold leading-tight">
                What's your willingness?
            </label>
            <input 
                type="text" 
                id="title" 
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
                placeholder="i.e: Exercises, Sleep well, etc..." 
                autoFocus
                value={title}
                onChange={e => setTitle(e.target.value)}/>

            <label htmlFor="" className="font-semibold leading-tight mt-6">How often?</label>
            
            <div className="w-full grid grid-cols-2 gap-4 mt-3">
                {
                    avaiableWeekDays.map((weekDay, idx) => (
                        <CheckboxSample 
                            key={weekDay} 
                            title={weekDay} 
                            spanStyle="text-white leading-tight" 
                            checked={weekDays.includes(idx)}
                            onCheckedChange={e => handleToggleWeekDays(idx)} />))
                }
            </div>

            <button 
                type="submit" 
                className="mt-6 rounded-lg p-4 flex items-center  justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500">
                <Check size="20" weight="bold"/>
                Save
            </button>
        </form>
    );
}