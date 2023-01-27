import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { generateDatesFromYearBeginning } from "../utils/dates-from-year-beginning";
import { HabitDay } from "./HabitDay";
import { api } from "../lib/axios";

interface SummaryParams {
    userId: string
}

type Summary = {
    id: string,
    date: string,
    amount: number,
    completed: number
}[];

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const summaryDates = generateDatesFromYearBeginning();
const yearStartOffset = dayjs(summaryDates[0]).get('day');
const minSummaryDatesSize = (14 * 7) - yearStartOffset;// 18 weeks
const amountOfDaysToFill = minSummaryDatesSize - summaryDates.length;

export const SummaryTable = ({ userId } : SummaryParams) => {
    const [summary, setSummary] = useState<Summary>([]);

    useEffect(() => {
        api
            .get(`${userId}/summary`)
            .then(res => setSummary(res.data))
            .catch(ex => console.log(ex.message));

    }, [])

    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3 pb-6">
                {
                    weekDays.map((day, idx)=> (<div key={`${day}-${idx}`} className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center">{day}</div>))
                }
            </div>

            <div className="grid grid-rows-7 grid-flow-col gap-3 overflow-x-scroll scrollbar- scrollbar-thin scrollbar-thumb-violet-900 scrollbar-track-violet-200 pb-6">
                
                {
                    yearStartOffset > 0 && Array.from({length: yearStartOffset}).map((_, idx) => (
                        <div key={idx} className="bg-zinc-900 w-10 h-10 text-white rounded m-2 opacity-40 cursor-not-allowed" /> 
                    ))
                }

                {
                    summary.length > 0 && summaryDates.map(date => {
                        
                        const dayInSummary = summary.find(day => {
                            return dayjs(date).isSame(day.date, 'day');
                        });

                        return (
                            <HabitDay 
                                key={date.toString()} 
                                userId={userId}
                                date={date}
                                defaultAmount={dayInSummary?.amount} 
                                defaultCompleted={dayInSummary?.completed}
                            />
                        );
                    })
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