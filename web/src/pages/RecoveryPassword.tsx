import { FormEvent, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'

import { PasswordInput } from '../components/PasswordInput'
import { api } from '../lib/axios'

export const RecoveryPassword = () => {
    const params = useParams();
    const navigate = useNavigate();

    const { userId, hash } = params;

    const [password, setPassword] = useState('');
    const [secPassword, setSecPassword] = useState('');

    const handleSubmitRecovery = async(e: FormEvent) => {
        e.preventDefault();

        try {
            if(password && secPassword) {
                const res = await api.patch('recovery-password', {
                    userId,
                    hash,
                    newPassword: password
                })
                
                const {error} = res.data;

                if(error){
                    alert(error);
                }
                else {
                    setPassword('');
                    setSecPassword('');
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
                    password={password}
                    setPassword={setPassword}/>
                <PasswordInput 
                    password={secPassword}
                    setPassword={setSecPassword}/>

                <button 
                    type="submit">
                    Continue
                </button>
            </form>
        </div>
    )
}