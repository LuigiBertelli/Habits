import { FormEvent, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'

import { PasswordInput } from '../components/PasswordInput'
import { api } from '../lib/axios'

interface inputFormProps {
    errors: string[],
    success: boolean,
    value: string
}

export const RecoveryPassword = () => {
    const params = useParams();
    const navigate = useNavigate();

    const { userId, hash } = params;

    const [passwordInput, setPasswordInput] = useState<inputFormProps>({value: '', errors: [], success: false});
    const [secPasswordInput, setSecPasswordInput] = useState<inputFormProps>({value: '', errors: [], success: false});

    const handleSubmitRecovery = async(e: FormEvent) => {
        e.preventDefault();

        try {
            if(passwordInput.errors?.length === 0 && secPasswordInput.errors?.length === 0) {
                const res = await api.patch('recovery-password', {
                    userId,
                    hash,
                    newPassword: passwordInput
                })
                
                const {error} = res.data;

                if(error){
                    alert(error);
                }
                else {
                    setPasswordInput({value: '', errors: [], success: true});
                    setSecPasswordInput({value: '', errors: [], success: true});
                    navigate('/login');
                }
            } else 
                alert('The password are not equal');
        } catch(err) {
            alert('Error recoverying your password, try again later!');
            console.log(err);
        }
        
    }

    return (
        <div>
            <form onSubmit={handleSubmitRecovery}>
                <PasswordInput
                    password={passwordInput}
                    info={true}
                    setPassword={(val) => setPasswordInput(prevState => ({value: val.value ?? prevState.value, errors: val.errors ?? prevState.errors, success: val.success ?? prevState.success}))}/>
                <PasswordInput 
                    info={false}
                    password={secPasswordInput}
                    setPassword={(val) => setSecPasswordInput(prevState => ({value: val.value ?? prevState.value, errors: val.errors ?? prevState.errors, success: val.success ?? prevState.success}))}/>

                <button 
                    type="submit">
                    Continue
                </button>
            </form>
        </div>
    )
}