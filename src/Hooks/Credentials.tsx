import { useContext } from "react"
import { CredentialsContext } from "../Contexts/CredentialsContext"

export const useCredentials = () => {
    const contextCredentials = useContext(CredentialsContext)
    if (!contextCredentials ) {
        throw new Error("useCredentials precisa estar dentro do Provider");
    }
    return contextCredentials
}