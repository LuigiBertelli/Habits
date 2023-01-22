import { useEffect } from 'react';
import { View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import colors from 'tailwindcss/colors'
interface ProgressBarProps {
    progress?: number;
}

export const ProgressBar = ({ progress = 0 }: ProgressBarProps) => {
    const sharedProgress = useSharedValue(progress);
    const sharedColor = useSharedValue<string>(colors.zinc[900]);

    const style = useAnimatedStyle(() => {
        return {
            width: `${sharedProgress.value}%`,
            backgroundColor: sharedColor.value
        };
    });

    useEffect(() => {
        sharedProgress.value = withTiming(progress);
        
        if(progress > 0) {
            if(progress < 20)
                sharedColor.value = colors.violet[900];
            else if(progress < 40)
                sharedColor.value = colors.violet[800];
            else if(progress < 60)
                sharedColor.value = colors.violet[700]; 
            else if(progress < 80)
                sharedColor.value = colors.violet[600]; 
            else
                sharedColor.value = colors.violet[500]; 
        }

    }, [progress])

    return (
        <View className="w-full h-3 rounded-xl bg-zinc-700 mt-4">
            <Animated.View 
                className="h-3 max-w-full rounded-xl"
                style={style} />
        </View>
    );
}