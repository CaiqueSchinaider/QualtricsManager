import { createContext, useState, type ReactNode } from "react";


type Credentials = {
    username: string;
    token: number;
}

type CredentialsContextType = {
  credentials: Credentials | undefined
  setCredentials: (value: Credentials) => void;
};

type ContextProps = {
    children: ReactNode
}
export const CredentialsContext = createContext<CredentialsContextType | null>(null)

export default function CredentialsProvider({children}: ContextProps) {
    const [credentials, setCredentials] = useState<Credentials>()

    return (  
            <CredentialsContext.Provider value={{credentials, setCredentials}}>
                {children}
            </CredentialsContext.Provider>
        )


}