import { Link, useNavigate } from 'react-router-dom'
import { initializeApp } from 'firebase/app'
import { getAuth, User } from 'firebase/auth'
import { FormEvent, useEffect, useState } from 'react'
import PasswordChecklist from "react-password-checklist"

import { api } from '../lib/axios'
import { getCookie, setCookie } from '../utils/cookies'

import authJson from '../configs/firebaseAuth.json'

import { GoogleLoginButton } from '../components/GoogleLoginButton'
import { FacebookLoginButton} from '../components/FacebookLoginButton'
import { PasswordInput } from '../components/PasswordInput'
import logoImg from '../assets/logo.svg'
import { TextInput } from '../components/TextInput'

interface inputFormProps {
    errors: string[],
    success: boolean,
    value: string
}

const firebaseConfig = authJson.auth;


export const Signup = () => {
    // Initialize Firebase
    const firebaseApp = initializeApp(firebaseConfig);
    const firebaseAuth = getAuth(firebaseApp);

    const [userName, setUserName] = useState<inputFormProps>({value: '', errors: [], success: false});
    const [email, setEmail] = useState<inputFormProps>({value: '', errors: [], success: false});
    const [password, setPassword] = useState<inputFormProps>({value: '', errors: [], success: false});
    const navigate = useNavigate();

    const logIn = (userId: string) => {
        setCookie('userId', userId, 3);
        setUserName({value: '', success: true, errors: []});
        setEmail({value: '', success: true, errors: []});
        setPassword({value: '', success: true, errors: []});
        navigate('/');
    }

    const signInWithSocial = async(user: User, social: string) => {
        const id = user.providerData[0]?.uid;

        try{
            let res = await api.get(`login/${social}`, {
                params: {
                    id
                }
            });
        
            if(!res.data.userId)
                res =  await api.post(`signup/${social}`, {
                id,
                email: user.email,
                name: user.displayName
                });

            logIn(res.data.userId);
        } catch(err) {
            alert(`Sign in with ${social} failed`)
            console.log(err);
        }
    }

    const handleSubmit = async(e: FormEvent) => {
        e.preventDefault();

        try {
            if(userName.success && email.success && password.success){
                const result = await api.post('signup', {
                    name: userName.value,
                    email: email.value,
                    password: password.value
                });

                if('errors' in result.data) {
                    if(typeof result.data.errors === 'object'){
                        for(const [key, value] of Object.entries(result.data.errors)){
                            if(typeof value === 'string'){
                                switch(key) {
                                    case 'email': 
                                        setEmail(prevState => ({...prevState, success: false, errors: [value, ...prevState.errors]}));
                                        break;
                                    case 'name':
                                        setEmail(prevState => ({...prevState, success: false, errors: [value, ...prevState.errors]}));
                                        break;
                                    case 'password':
                                        setEmail(prevState => ({...prevState, success: false, errors: [value, ...prevState.errors]}));
                                        break;
                                }
                            }
                            alert(value);
                        }
                    }
                }
                
                if('userId' in result.data){
                    const notificationId = getCookie('notifications_id');
                    const userId : string = result.data.userId;
                    if(notificationId !== ''){
                        await api.patch('notifications/vinculate-user', {
                            notificationId,
                            userId
                        });
                    }

                    logIn(userId);
                }
            }
        } catch(err) {
            console.log(err);
        }
        
    }

    return (
      <div className="w-full max-w-5xl px-6 flex items-center justify-center">
            <div className="flex flex-wrap flex-col items-center w-[50%]">
                <Link className="mb-6 w--auto" to="/">
                    <img 
                        src={logoImg} 
                        alt="Habits Logo" />
                </Link>

                <GoogleLoginButton 
                firebaseAuth={firebaseAuth}
                loginMethod={signInWithSocial} />

                <FacebookLoginButton 
                    firebaseAuth={firebaseAuth}
                    loginMethod={signInWithSocial} />

                <hr className="w-full border-b-1 border-b-zinc-900 my-8" />

                <form   
                    className="w-full"
                    onSubmit={handleSubmit}>

                    <TextInput 
                        props={userName}
                        validation={() => {
                            let errors = [] as string[];
                            if(userName.value.trim() === '')
                                errors.push('name is required');
                            
                            setUserName(preventDefault => ({...preventDefault, success: errors.length === 0, errors}));
                        }}
                        setValue={(val) => setUserName(prevState => ({value: val.value ?? prevState.value, errors: val.errors ?? prevState.errors, success: val.success ?? prevState.success}))}
                        placeholder="Full Name" />

                    <TextInput 
                        props={email}
                        validation={() => {
                            let errors = [] as string[];

                            if(email.value.trim() === '')
                                errors.push('email is required');
                            
                            if(!email.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i))
                                errors.push('invalid email');

                            setEmail(preventDefault => ({...preventDefault, success: errors.length === 0,  errors}));
                        }}
                        setValue={(val) => setEmail(prevState => ({value: val.value ?? prevState.value, errors: val.errors ?? prevState.errors, success: val.success ?? prevState.success}))}
                        placeholder="Email" />

                    <PasswordInput 
                        styles={{
                            container: 'mb-9'
                        }}
                        register={true}
                        password={password}
                        setPassword={(val) => setPassword(prevState => ({value: val.value ?? prevState.value, errors: val.errors ?? prevState.errors, success: val.success ?? prevState.success}))}/>

                    <button 
                        type="submit" 
                        className="w-full mb-6 h-12 bg-green-500 rounded-md items-center px-2 font-semibold text-white text-center text-base leading-tight">
                        Sign Up
                    </button>
                </form>

                <div className="text-center mb-10">
                    <span className="text-zinc-400">
                        Do you already have an account? {' '}
                        <Link className="text-violet-500" to='/login'>
                            Sign in
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    )
  }