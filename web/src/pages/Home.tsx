import { Header } from '../components/Header'
import { SummaryTable } from '../components/SummaryTable'

export const Home = () => {
    return (
        <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
            <Header/>
            <SummaryTable/>
        </div>
    );
}