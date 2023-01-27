import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EyeClosed, Eye } from 'phosphor-react'
import { initializeApp } from "firebase/app";

import { api } from '../lib/axios'
import { setCookie } from '../utils/cookies'

import { GoogleLoginButton } from './GoogleLoginButton'
import { FacebookLoginButton} from './FacebookLoginButton'


import logoImg from '../assets/logo.svg'
import colors from 'tailwindcss/colors'

import authJson from '../configs/firebaseAuth.json'
import { getAuth } from 'firebase/auth'

const firebaseConfig = authJson.auth;

export const LoginForm = () => {
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  const firebaseAuth = getAuth(firebaseApp);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async(e: FormEvent) => {
    e.preventDefault();
    
    try {
        const res = await api.get('login', {
            params: {
                email,
                password
            }
        });

        const { error, userId } = res.data;

        if(error)
            alert(error);
        else if(userId){
            setCookie('userId', userId, 3);
            setEmail('');
            setPassword('');
            navigate('/');
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

        <input 
            className="mb-6 w-full text-zinc-800 p-2"
            type="text" 
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
            value={email} />

        <div className="flex items-center w-full px-2 bg-white mb-6">
            <input
                className="flex-1 text-zinc-800 py-2 focus:outline-none"
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}
                value={password} /> 
                
            {
                showPassword ?
                    <Eye
                        className="cursor-pointer"
                        size={16}
                        color={colors.zinc[800]}
                        onClick={e => setShowPassword(false)} />
                :
                    <EyeClosed
                        className="cursor-pointer"
                        size={16}
                        color={colors.zinc[800]}
                        onClick={e => setShowPassword(true)} />
            }
        </div>

        <button 
            type="submit" 
            className="w-full mb-10 h-12 bg-green-500 rounded-md items-center px-2 font-semibold text-white text-center text-base leading-tight">
            Login
        </button>

        <hr className="w-full border-b-1 border-b-zinc-900 mb-8" />

        

        <GoogleLoginButton firebaseAuth={firebaseAuth} />
        <FacebookLoginButton firebaseAuth={firebaseAuth} />

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