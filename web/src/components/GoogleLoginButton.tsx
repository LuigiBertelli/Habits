import { signInWithPopup, GoogleAuthProvider, Auth, User } from 'firebase/auth'

import googleLogoSVG from '../assets/GoogleLogo.svg'
import { api } from '../lib/axios';

interface GoogleLoginButtonProps {
    firebaseAuth: Auth,
    loginMethod: (user: User, social: string) => void
}

export const GoogleLoginButton = ({ firebaseAuth, loginMethod } : GoogleLoginButtonProps) => {
    
    const provider = new GoogleAuthProvider();
    
    const handleGoogleLogin = () => {
        signInWithPopup(firebaseAuth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                // The signed-in user info.
                const user = result.user;
                
                loginMethod(user, 'Google');
            }).catch((error) => {
                // Handle Errors here.
                console.log("zfdsfasd");
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }

    return (
        <button
            type="button"
            className="w-full h-12 my-3 px-2 flex gap-3 items-center rounded-md bg-white text-zinc-600 font-semibold text-base leading-tight"
            onClick={handleGoogleLogin}
            >
                <img src={googleLogoSVG} alt="Google logo"/>
                <span>
                    Continue with Google
                </span>
        </button>
    );

}