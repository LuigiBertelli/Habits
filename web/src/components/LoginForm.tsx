import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { initializeApp } from 'firebase/app'
import { getAuth, User } from 'firebase/auth'

import { api } from '../lib/axios'
import { setCookie } from '../utils/cookies'

import { GoogleLoginButton } from './GoogleLoginButton'
import { FacebookLoginButton} from './FacebookLoginButton'


import logoImg from '../assets/logo.svg'

import authJson from '../configs/firebaseAuth.json'

import { PasswordInput } from './PasswordInput';
import { TextInput } from './TextInput'

interface inputFormProps {
    errors: string[],
    success: boolean,
    value: string
}

const firebaseConfig = authJson.auth;


export const LoginForm = () => {
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  const firebaseAuth = getAuth(firebaseApp);

  const [emailInput, setEmailInput] = useState<inputFormProps>({value: '', errors: [], success: true});
  const [passwordInput, setPasswordInput] = useState<inputFormProps>({value: '', errors: [], success: true});
  const navigate = useNavigate();

  const logIn = (userId: string) => {
    setCookie('userId', userId, 3);
    setEmailInput({value: '', errors:[], success: false});
    setPasswordInput({value: '', errors:[], success: false});
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
        const res = await api.get('login', {
            params: {
                email: emailInput.value,
                password: passwordInput.value
            }
        });

        const { error, userId } = res.data;

        if(error)
            alert(error);
        else if(userId){
            logIn(userId);
        }
        
    } catch(err) {
        console.log(err);
        alert('Error trying to login, try again later!');
    }
    
  }

  return (
    <form
        className="flex flex-wrap flex-col items-center w-[50%]"
        onSubmit={handleSubmit}>

        
        <Link className="mb-14 w--auto" to="/">
            <img 
                src={logoImg} 
                alt="Habits Logo" />
        </Link>

        <TextInput
            placeholder="Email"
            props={emailInput}
            setValue={(val) => setEmailInput(prevState => ({value: val.value ?? prevState.value, errors: val.errors ?? prevState.errors, success: val.success ?? prevState.success}))}
             />

        <PasswordInput 
            info={false}
            styles={{container: 'mb-8'}}
            password={passwordInput}
            setPassword={(val) => setPasswordInput(prevState => ({value: val.value ?? prevState.value, errors: val.errors ?? prevState.errors, success: val.success ?? prevState.success}))}/>

        <button 
            type="submit" 
            className="w-full mb-10 h-12 bg-green-500 rounded-md items-center px-2 font-semibold text-white text-center text-base leading-tight">
            Login
        </button>

        <hr className="w-full border-b-1 border-b-zinc-900 mb-8" />

        

        <GoogleLoginButton 
            firebaseAuth={firebaseAuth}
            loginMethod={signInWithSocial} />
        <FacebookLoginButton 
            firebaseAuth={firebaseAuth}
            loginMethod={signInWithSocial} />

        <div className="mt-6 text-zinc-400 text-base">
            Don't you have an account? {' '}
            <Link to='/signup'>
                <span
                    className="text-violet-400 text-base underline active:text-violet-500"
                    >
                    Sign up
                </span>
            </Link>
        </div>
    </form>
  )
}