import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'phosphor-react'

import colors from 'tailwindcss/colors'

interface CheckboxSampleProps extends Checkbox.CheckboxProps {
  title: string,
  spanStyle: string
}

export const CheckboxSample = ({ title, spanStyle, ...rest }: CheckboxSampleProps) => {
    return (
        <Checkbox.Root
              className="flex items-center gap-3 transition-colors group focus:outline-none disabled:cursor-not-allowed"
              {...rest}>

              <div 
                className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-400 group-focus:outline-none group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background">
                <Checkbox.Indicator>
                  <Check
                    size={20}
                    color={colors.white}
                    />
                </Checkbox.Indicator>
              </div>

              <span className={spanStyle}>
                {title}
              </span>
            </Checkbox.Root>
    );
} 