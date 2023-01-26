import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import googleLogoSVG from '../assets/GoogleLogo.svg'

export const GoogleLoginButton = () => {
    // const provider = new GoogleAuthProvider();
    // provider.setCustomParameters({
    //     'login_hint': 'user@example.com'
    //   });
    // const auth = getAuth();
    
    // const handleGoogleLogin = () => {
    //     signInWithPopup(auth, provider)
    //         .then((result) => {
    //             // This gives you a Google Access Token. You can use it to access the Google API.
    //             const credential = GoogleAuthProvider.credentialFromResult(result);
    //             const token = credential?.accessToken;
    //             // The signed-in user info.
    //             const user = result.user;
    //             // ...
    //         }).catch((error) => {
    //             // Handle Errors here.
    //             const errorCode = error.code;
    //             const errorMessage = error.message;
    //             // The email of the user's account used.
    //             const email = error.customData.email;
    //             // The AuthCredential type that was used.
    //             const credential = GoogleAuthProvider.credentialFromError(error);
    //             // ...
    //         });
    // }

    return (
        <button
            className="w-full h-12 my-3 px-4 items-center rounded-md bg-white text-zinc-600 font-semibold text-base leading-tight flex gap-3"
           >
                <img src={googleLogoSVG} alt="Google logo"/>
                <span>
                    Continue with Google
                </span>
        </button>
    );

}