import { Check } from "phosphor-react"

export const NewHabitForm = () => {
    return (
    <form className="w-full flex flex-col mt-6">
        <label htmlFor="title" className="font-semibold leading-tight">
            What is your willingness
        </label>
        <input 
            type="text" 
            id="title" 
            className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
            placeholder="i.e: Exercises, Sleep well, etc..." 
            autoFocus/>

        <label htmlFor="" className="font-semibold leading-tight mt-6">How often?</label>
        
        

        <button 
            type="submit" 
            className="mt-6 rounded-lg p-4 flex items-center  justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500">
            <Check size="20" weight="bold"/>
            Save
        </button>
    </form>)
}