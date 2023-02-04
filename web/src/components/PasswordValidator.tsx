import clsx from 'clsx'
import { Info } from 'phosphor-react'
import { useState } from 'react'
import ReactPasswordChecklist from 'react-password-checklist'

interface InputPasswordProps {
    errors?: string[],
    success?: boolean,
    value?: string
}

interface PasswordValidatorProps {
    password: {
        value: string,
        errors: string[],
        success: boolean
    },
    setPassword: (val: InputPasswordProps) => void,
    secPassword: string
}

export const PasswordValidator = ({password, setPassword, secPassword} : PasswordValidatorProps) => {
    const [focus, setFocus] = useState(false);

    return (
        <div 
            className="relative transition"
            
            onMouseOver={e => setTimeout(() => setFocus(true), 300)}
            onMouseOut={e => setTimeout(() => setFocus(false), 300)}>
            <div className="pl-2"> 
                <Info size={20} className="text-violet-500"/>
            </div>
            <div
                className={clsx('absolute top-2 left-2', {
                    'hidden': !focus,
                })}>
                <div className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-background">
                    <ReactPasswordChecklist
                        rules={["minLength","specialChar","number","capital", "match"]}
                        minLength={5}
                        value={password.value}
                        valueAgain={secPassword}
                        onChange={(isValid) => {
                            if(isValid)
                                setPassword({success: true, errors: []});
                            else
                                setPassword({success: false, errors: ['']});
                            
                        }}
                    />
                    
                </div>
            </div>
        </div>
    )
}