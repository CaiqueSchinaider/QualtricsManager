import Text from "./Text";


interface InputProps {
    size: 'small' | 'medium' | 'large' | 'extra large';
    label?: string
    InputConfig: React.InputHTMLAttributes<HTMLInputElement>
    className?: string;
}

export default function Input(props: InputProps) {

    return (
        <label className={`text-schin-gray-light  flex flex-col ${props.className}`}>
            <Text size="large" className="pb-1 pl-2">
            {props.label}
            </Text>
        <input  {...props.InputConfig} type="text" className={`pl-5 ${props.size === 'small' ? 'w-30' : props.size === 'medium' ?  'w-60' : props.size === 'large' ? 'w-100' : 'w-150' } border-schin-gray-strong border rounded-2xl h-15 shadow-lg shadow-[#000]`}/>
        </label>
    )
    
}