import { TouchableOpacity, TouchableOpacityProps, View, Text } from 'react-native'
import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors'

interface CheckBoxProps extends TouchableOpacityProps {
    title: string,
    checked: boolean
}

export const CheckBox = ({ title, checked = false, ...props }: CheckBoxProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row gap-3 items-center justify-start mb-3"
            onPress={props.onPress}>
                {
                    checked ? 
                        <View className="h-8 w-8 bg-green-500 rounded-lg items-center justify-center">
                            <Feather 
                                name="check"
                                size={20}
                                color={colors.white}/>
                        </View>
                    :
                        <View className="h-8 w-8 bg-zinc-900 rounded-lg"/>
                }

                <Text className="text-white text-base">
                    {title}
                </Text>
        </TouchableOpacity>);
}