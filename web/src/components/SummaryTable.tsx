import { generateDatesFromYearBeginning } from "../utils/dates-from-year-beginning";
import { HabitDay } from "./HabitDay";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const summaryDates = generateDatesFromYearBeginning();

const minSummaryDatesSize = 18 * 7 // 18 weeks

const amountOfDaysToFill = minSummaryDatesSize - summaryDates.length

export const SummaryTable = () => {
    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                {
                    weekDays.map((day, idx)=> (<div key={`${day}-${idx}`} className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center">{day}</div>))
                }
            </div>

            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {
                    summaryDates.map(date => (
                        <HabitDay 
                            key={date.toString()} 
                            amount={5} 
                            completed={Math.round(Math.random() * 5)}/>))
                }
                {
                    amountOfDaysToFill > 0 && Array.from({length: amountOfDaysToFill}).map((_, idx) => (
                        <div key={idx} className="bg-zinc-900 w-10 h-10 text-white rounded m-2 opacity-40 cursor-not-allowed" /> 
                    ))
                }
            </div>
        </div>
    );
}