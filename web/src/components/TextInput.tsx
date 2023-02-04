import clsx from "clsx"

interface InputTextProps {
    errors?: string[],
    success?: boolean,
    value?: string
}

interface TextInputProps{
    props:{
      value: string,
      errors: string[],
      success: boolean},
    validation?: () => void,
    placeholder: string,
    styles?: string, 
    setValue: (val: InputTextProps) => void
}

export const TextInput = ({props, validation, setValue, placeholder, styles} : TextInputProps) => {
  return (
    <div className="w-full my-4">
        <input
            className={clsx(`w-full p-4 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900  ${styles ?? ''}`, {
              'ring-2 ring-red-600 ring-offset-2 ring-offset-zinc-900': props.errors.length > 0,
              'ring-2 ring-green-600 ring-offset-2 ring-offset-zinc-900': props.success
            })}
            onChange={e => setValue({value: e.target.value})}
            onFocus={e => setValue({success: false, errors: []})}
            onBlur={e => {
              if(validation)
                validation();
            }}
            placeholder={placeholder}
            value={props.value}>
        </input>
        
        
        <div className="h-5">
            {
                props.errors.length > 0 &&
                    <span className="h-5 text-sm text-red-600">
                        {props.errors[0]}
                    </span>
            }
        </div>
        
    </div>
  )
}