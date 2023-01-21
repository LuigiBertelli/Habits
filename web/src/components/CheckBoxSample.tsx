import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'phosphor-react'

import colors from 'tailwindcss/colors'

interface CheckboxSampleProps extends Checkbox.CheckboxProps {
  title: string,
  spanStyle: string
}

export const CheckboxSample = ({ title, spanStyle, onCheckedChange }: CheckboxSampleProps) => {
    return (
        <Checkbox.Root
              className="flex items-center gap-3 group"
              onCheckedChange={onCheckedChange}>

              <div 
                className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-400">
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