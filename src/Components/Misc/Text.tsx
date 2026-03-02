import type { ReactNode } from "react";



interface TextProps {
    size: 'small' | 'medium' | 'large' | 'extra large';
    className?: string;
    children: ReactNode;
    
}

export default function Text(props: TextProps) {

    return (
        <p className={`${props.size === 'small' ? 'text-sm' :  props.size === 'medium' ? 'text-md' :  props.size === 'large' ?  'text-xl' : 'text-2xl'} ${props.className} font-poppins `}>
            {props.children}
        </p>
    )
}