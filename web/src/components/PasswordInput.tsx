import { useEffect, useState } from 'react'
import { EyeClosed, Eye } from 'phosphor-react'

import colors from 'tailwindcss/colors'
import clsx from 'clsx'
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
    register?: boolean,
    placeholder?: string,
    setPassword: (val: InputPasswordProps) => void,
    styles?: {
        container?: string,
        input?: string
        icon?: string
    }
}

export const PasswordInput = ({ password, register = false, placeholder = 'Password', setPassword, styles } : PasswordInputProps) => {
    const [secPassword, setSecPassword] = useState('');
    const [showSecPassword, setShowSecPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focus, setFocus] = useState(false);
    const [secFocus, setSecFocus] = useState(false);

    return (
        <>
            <div className="my-4 w-full">
                <div 
                    className={clsx(`flex items-center w-full pr-4 bg-zinc-800 ${styles?.container ?? ''}`, {
                        'ring-2 ring-violet-600 ring-offset-2 ring-offset-zinc-900': focus,
                        'ring-2 ring-red-600 ring-offset-2 ring-offset-zinc-900': password.errors.length > 0,
                        'ring-2 ring-green-600 ring-offset-2 ring-offset-zinc-900': password.success
                    })}
                    >
                    {register && (focus || secFocus) &&
                        <PasswordValidator
                            password={password}
                            secPassword={secPassword}
                            setPassword={setPassword}/>}
                    <input
                        className={`w-full p-4 bg-zinc-800 text-white placeholder:text-zinc-400 outline-none ${styles?.input ?? ''}`}
                        type={showPassword ? 'text' : 'password'} 
                        placeholder={placeholder}
                        onChange={e => setPassword({value: e.target.value})}
                        onFocus={e => {
                            setFocus(true);
                            setPassword({errors: [], success: false});
                        }}
                        onBlur={e => {
                            setFocus(false);

                            if(register && secPassword !== password.value)
                                setPassword({success: false, errors: ['password must be equal', ...password.errors]});

                            setPassword({success: password.errors.length === 0});
                        }}
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
            </div>
            {
                register && 
                <div className="w-full my-4">
                    <div 
                        className={clsx(`flex items-center w-full pr-4 bg-zinc-800 ${styles?.container ?? ''}`, {
                            'ring-2 ring-violet-600 ring-offset-2 ring-offset-zinc-900': secFocus,
                            'ring-2 ring-red-600 ring-offset-2 ring-offset-zinc-900': password.success,
                            'ring-2 ring-green-600 ring-offset-2 ring-offset-zinc-900': password.success
                        })}
                        >
                        <input
                            className={`w-full p-4 bg-zinc-800 text-white placeholder:text-zinc-400 outline-none ${styles?.input ?? ''}`}
                            type={showSecPassword ? 'text' : 'password'} 
                            placeholder={placeholder}
                            onChange={e => setSecPassword(e.target.value)}
                            onFocus={e => setSecFocus(true)}
                            onBlur={e => setSecFocus(false)}
                            value={secPassword} /> 
                            
                        {
                            showSecPassword ?
                                <Eye
                                    className={`cursor-pointer ${styles?.icon ?? ''}`}
                                    size={16}
                                    color={colors.zinc[400]}
                                    onClick={e => setShowSecPassword(false)} />
                            :
                                <EyeClosed
                                    className={`cursor-pointer ${styles?.icon ?? ''}`}
                                    size={16}
                                    color={colors.zinc[400]}
                                    onClick={e => setShowSecPassword(true)} />
                        }
                    </div>
                </div>
            }
        </>
        
    );
}