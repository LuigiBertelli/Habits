import { getAuth, signInWithPopup, FacebookAuthProvider } from 'firebase/auth'
import facebookLogoSVG from '../assets/FacebookLogo.svg'

export const FacebookLoginButton = () => {
    // const provider = new FacebookAuthProvider();
    // provider.setCustomParameters({
    //     'display': 'popup'
    // });

    // const auth = getAuth();
    
    // const handleFacebookLogin = () => {
    //     signInWithPopup(auth, provider)
    //         .then((result) => {
    //             // The signed-in user info.
    //             const user = result.user;

    //             // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    //             const credential = FacebookAuthProvider.credentialFromResult(result);
    //             const accessToken = credential?.accessToken;

    //             // ...
    //         })
    //         .catch((error) => {
    //             // Handle Errors here.
    //             const errorCode = error.code;
    //             const errorMessage = error.message;
    //             // The email of the user's account used.
    //             const email = error.customData.email;
    //             // The AuthCredential type that was used.
    //             const credential = FacebookAuthProvider.credentialFromError(error);

    //             // ...
    //         });
    // }

    return (
        <button 
            className="w-full h-12 my-3 px-4 items-center rounded-md bg-facebook font-semibold text-base leading-tight flex gap-3"
            >
                <img src={facebookLogoSVG} alt="Facebook logo"/>
                <span>
                    Continue with Facebook
                </span>
        </button>
    );
}