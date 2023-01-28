import { TouchableOpacity, Text } from 'react-native'
import { useState, useEffect } from 'react'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'

import GoogleSVG from '../assets/GoogleLogo.svg'
import authJson from '../configs/firebaseAuth.json'

interface GoogleLoginButtonProps {
    loginMethod: (UserCredential: FirebaseAuthTypes.UserCredential, social: string) => void
}

GoogleSignin.configure({
    webClientId: authJson.google.webClientId,
  });


export const GoogleLoginButton = ({ loginMethod } : GoogleLoginButtonProps) => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged((user) => {
            setUser(user)
            if (initializing) setInitializing(false);
        });
        return subscriber; // unsubscribe on unmount
    }, []);


    const handleGoogleButtonPress = async() => {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();
      
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
        // Sign-in the user with the credential
        auth().signInWithCredential(googleCredential)
            .then(user => loginMethod(user, 'Google'))
            .catch(err => console.log(err));
      }

    return (
        <TouchableOpacity
            className="w-full h-12 my-6 px-2 rounded-md bg-white flex-row flex-nowrap items-start gap-3"
            activeOpacity={0.7}
            onPress={handleGoogleButtonPress}
            >
            <GoogleSVG />
            <Text className="text-zinc-600 font-semibold text-base leading-tight">
                Continue with google
            </Text>
        </TouchableOpacity>
    );
}