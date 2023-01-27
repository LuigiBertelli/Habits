import { useState, useCallback } from 'react'
import { View, ScrollView, TouchableOpacity, TextInput, Text, Alert } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Feather } from '@expo/vector-icons'

import LogoSVG from '../assets/logo.svg'
import { api } from '../lib/axios'
import { GoogleLoginButton } from '../components/GoogleLoginButton'
import { FacebookLoginButton } from '../components/FacebookLoginButton'

interface LoginParams {
    userId?: string
}

export const Login = () => {
    const { navigate } = useNavigation();
    const route = useRoute();
    const routeParams = route.params as LoginParams;

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useFocusEffect(useCallback(() =>{
        console.log(JSON.stringify(routeParams));
        if(routeParams?.userId)
            navigate('home', {userId: routeParams.userId});
    },[]))

    const handleSubmitLogin = async() => {
        try {
            const res = await api.get('login', {
                params: {
                    email,
                    password
                }
            });

            const {error, userId} = res.data;

            if(error)
                Alert.alert('Error', error);
            else if(userId) {
                await AsyncStorage.setItem('userId', userId);
                
                setEmail('');
                setPassword('');
                setShowPassword(false);
                navigate('home', {userId});
                
            }
        } catch(err) {
            Alert.alert('Oops', 'Server response failed about your login, try again!');
        }
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                contentContainerStyle={{paddingBottom: 100}}
                showsVerticalScrollIndicator={false}>
                <View className="w-full h-[50%] flex-col items-center mt-24 p-4">
                    <LogoSVG/>

                    <TextInput 
                        className="w-full bg-white text-zinc-700 mt-12 p-2 text-base leading-tight"
                        placeholder="Email"
                        onChangeText={setEmail}
                        value={email} />

                    <View className="w-full flex-row flex-nowrap items-center mt-6 bg-white text-zinc-700" >
                        <TextInput 
                            className="flex-1 p-2 bg-white text-base leading-tight" 
                            placeholder="Password"
                            secureTextEntry={!showPassword}
                            onChangeText={setPassword}
                            value={password} />

                        <TouchableOpacity
                            className="pr-2 transition-all"
                            activeOpacity={0.7}
                            onPress={() => setShowPassword(!showPassword)}>
                            <Feather 
                                name={showPassword ? 'eye' : 'eye-off'}
                                size={16}/>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        className="w-full rounded-md bg-green-500 mt-6 h-12 justify-center"
                        activeOpacity={0.7}
                        onPress={handleSubmitLogin}>
                        <Text
                            className="text-white text-center">
                            Login
                        </Text>
                    </TouchableOpacity>

                    <View className="w-full h-0 border-b-2 border-b-zinc-500 my-12" />

                    <GoogleLoginButton />
                    <FacebookLoginButton />

                    <Text className="text-zinc-400 text-base">
                        Don't you have an account? {' '}
                        <Text
                        className="text-violet-400 text-base underline active:text-violet-500"
                        onPress={() => navigate('signup', {})}>
                        Sign up
                        </Text>
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}