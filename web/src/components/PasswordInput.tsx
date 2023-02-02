import { useState } from 'react'
import { EyeClosed, Eye, X, Info } from 'phosphor-react'

import colors from 'tailwindcss/colors'
import clsx from 'clsx'
import * as Popover from '@radix-ui/react-popover'
import ReactPasswordChecklist from 'react-password-checklist'
import { PasswordValidator } from './PasswordValidator'

interface InputPasswordProps {
    errors?: string[],
    success?: boolean,
    value?: string
}

interface PasswordInputProps {
    password: {
        value: string,
        errors: string[],
        success: boolean,}
    secPassword?: string,
    placeholder?: string, 
    info: boolean,
    setPassword: (val: InputPasswordProps) => void,
    styles?: {
        container?: string,
        input?: string
        icon?: string
    }
}

export const PasswordInput = ({ password, secPassword, info, placeholder = 'Password', setPassword, styles } : PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [focus, setFocus] = useState(false);

    return (
        <div className="my-3 w-full">
            <div 
                className={clsx(`flex items-center w-full pr-4 bg-zinc-800 ${styles?.container ?? ''}`, {
                    'ring-2 ring-violet-600 ring-offset-2 ring-offset-zinc-900': focus,
                    'ring-2 ring-red-600 ring-offset-2 ring-offset-zinc-900': password.errors.length > 0,
                    'ring-2 ring-green-600 ring-offset-2 ring-offset-zinc-900': password.success
                })}
                >
                {
                    info && (
                        (secPassword && <PasswordValidator 
                            secPassword={secPassword}
                            password={password}
                            setPassword={setPassword}/>) || 
                        (<PasswordValidator 
                            password={password}
                            setPassword={setPassword}/>)
                    )
                    
                }
                <input
                    className={`w-full p-4 bg-zinc-800 text-white placeholder:text-zinc-400 outline-none ${styles?.input ?? ''}`}
                    type={showPassword ? 'text' : 'password'} 
                    placeholder={placeholder}
                    onChange={e => setPassword({value: e.target.value})}
                    onFocus={e => {
                        setFocus(true);
                        setPassword({errors: [], success: false});
                    }}
                    onBlur={e => setFocus(false)}
                    value={password.value} /> 
                    
                {
                    showPassword ?
                        <Eye
                            className={`cursor-pointer ${styles?.icon ?? ''}`}
                            size={16}
                            color={colors.zinc[400]}
                            onClick={e => setShowPassword(false)} />
                    :
                        <EyeClosed
                            className={`cursor-pointer ${styles?.icon ?? ''}`}
                            size={16}
                            color={colors.zinc[400]}
                            onClick={e => setShowPassword(true)} />
                }
            </div>
            <div className="h-5">
                {
                    password.errors.length > 0 &&
                        <span className="h-5 text-sm text-red-600">
                            {password.errors[0]}
                        </span>
                }
            </div>
        </div>
    );
}