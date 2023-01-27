import { View, Text, ScrollView } from 'react-native'
import { useCallback } from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'

interface SignupParams {
  userId?: string
}

export const Signup = () => {
    const { navigate }= useNavigation();
    const route = useRoute();
    const routeParams = route.params as SignupParams;

    useFocusEffect(useCallback(() =>{
            if(routeParams?.userId)
                navigate('home', {userId: routeParams.userId});
    },[]))

    return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView>
        <Text className="text-zinc-400 text-base">
          Do you already have an account? {' '}
          <Text
            className="text-violet-400 text-base underline active:text-violet-500"
            onPress={() => navigate('login', {})}>
            Sign in
          </Text>
        </Text>
      </ScrollView>
    </View>
  )
}