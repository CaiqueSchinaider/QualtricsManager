import type { ReactNode } from "react";



interface TitleProps {
    size: 'small' | 'medium' | 'large' | 'extra large';
    className?: string;
    children: ReactNode;
    
}

export default function Title(props: TitleProps) {

    return (
        <h1 className={`${props.size === 'small' ? 'text-lg' :  props.size === 'medium' ? 'text-xl' : props.size === 'large' ? 'text-3xl': 'text-5xl'} ${props.className} font-protest `}>
            {props.children}
        </h1>
    )
}