import { Plus } from 'phosphor-react'

import logoImg from '../assets/logo.svg'

export const Header = () => {
  return (
    <div className="w-full max-w-xl mx-auto flex items-center justify-between">
        <img src={logoImg} alt="Habits Logo" />
        <button 
        type="button"
        className="flex gap-3 items-center border border-violet-500 font-semibold rounded-lg px-6 py-4 hover:border-violet-300">
            <Plus size={20} className="text-violet-500"/>
            New Habit
        </button>
    </div>
  )
}