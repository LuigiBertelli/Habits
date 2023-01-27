import { TouchableOpacity, Text, Alert } from 'react-native'
import { useEffect, useState } from 'react'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

import FacebookSVG from '../assets/FacebookLogo.svg'

export const FacebookLoginButton = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged((user) => {
            setUser(user)
            if (initializing) setInitializing(false);
        });
        return subscriber; // unsubscribe on unmount
    }, []);

    const handleFacebookButtonPress = async() => {
        try {
             // Attempt login with permissions
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

            if (result.isCancelled) {
                throw 'User cancelled the login process';
            }

            // Once signed in, get the users AccesToken
            const data = await AccessToken.getCurrentAccessToken();

            if (!data) {
                throw 'Something went wrong obtaining access token';
            }

            // Create a Firebase credential with the AccessToken
            const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

            // Sign-in the user with the credential
            return auth().signInWithCredential(facebookCredential);
          } catch (err) {
            console.log(err);
          }
      }

    if(initializing) return null;

    return (
        <TouchableOpacity
            className="w-full h-12 my-6 px-2 rounded-md bg-facebook flex-row flex-nowrap items-start gap-3"
            activeOpacity={0.7}
            onPress={handleFacebookButtonPress}
            >
            <FacebookSVG />
            <Text className="text-white font-semibold text-base leading-tight">
                Continue with Facebook
            </Text>
        </TouchableOpacity>
    );
}