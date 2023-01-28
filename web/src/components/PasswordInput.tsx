import { useState } from 'react'
import { EyeClosed, Eye } from 'phosphor-react'

import colors from 'tailwindcss/colors'


interface PasswordInputProps {
    password: string,
    setPassword: (val: string) => void
    styles?: {
        container?: string,
        input?: string
        icon?: string
    }
}

export const PasswordInput = ({ password, setPassword, styles } : PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={`flex items-center w-full px-2 bg-white mb-6 ${styles?.container ?? ''}`}>
            <input
                className={`flex-1 text-zinc-800 py-2 focus:outline-none ${styles?.input ?? ''}`}
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}
                value={password} /> 
                
            {
                showPassword ?
                    <Eye
                        className={`cursor-pointer ${styles?.icon ?? ''}`}
                        size={16}
                        color={colors.zinc[800]}
                        onClick={e => setShowPassword(false)} />
                :
                    <EyeClosed
                        className={`cursor-pointer ${styles?.icon ?? ''}`}
                        size={16}
                        color={colors.zinc[800]}
                        onClick={e => setShowPassword(true)} />
            }
        </div>
    );
}