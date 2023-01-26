import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Header } from '../components/Header'
import { SummaryTable } from '../components/SummaryTable'
import { getCookie } from '../utils/cookies'

export const Home = () => {
    const [userId, setUserId] = useState(getCookie('userId'));

    useEffect(() => {
        const cookieUserId = getCookie('userId');
        setUserId(cookieUserId);
    }, [])

    return (
        <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
            <Header userId={userId}/>
            {
                userId ?
                    <SummaryTable
                        userId={userId}/>
                :
                    <div className="text-center h-[17.5rem]">
                        <span>
                            Don't have an account yet? {' '}
                            <Link className="text-violet-500" to='/signin'>
                                Sign in with us.
                            </Link>
                        </span>
                    </div>
            }
        </div>
    );
}