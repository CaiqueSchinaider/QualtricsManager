import { useState } from "react";
import Button from "../Misc/Button";
import Input from "../Misc/Input";

import { useCredentials } from "../../Hooks/Credentials";
import toast from "react-hot-toast";

type LoginPopUpProps = {
    signalLogin: () => void
    signalback: () => void
}

type apiUsers = {
    token:number
    signal: boolean
    log: string
}

export default function LoginPopUp({signalLogin, signalback}: LoginPopUpProps) {


    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
     const {setCredentials} = useCredentials()

    

    async function handleLogin() {
        if (username == '' || password == '') {
              toast.dismissAll()
             toast.error("Preencha todos os campos")
             return
        }

        let response = await fetch('https://qualtricsmanager.onrender.com/api/users', {
           method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: username, password: password})
        })
      
        let data: apiUsers = await response.json()
        if (data.signal) {
            signalLogin()
            setCredentials({
                username: username,
                token: data.token             
            })
             toast.dismissAll()
             toast.success(data.log)
        } else { 
            toast.dismissAll()
             toast.error(data.log)
        }
    }

    return (
        <section className="backdrop-blur-3xl w-screen h-screen fixed top-0 z-999 flex justify-center items-center">
            <div className="bg-schin-black border-schin-gray-strong border-2 rounded-4xl w-full max-w-200 min-w-100 h-full max-h-120 min-h-80 flex justify-center items-center flex-col">
                <div className=" w-100 h-5/10 flex items-center flex-col gap-5">
                    <Input size="large" label="Username" InputConfig={{onChange: (e) => setUsername(e.target.value)}} />
                    <Input size="large" label="Password" InputConfig={{type: 'password', onChange: (e) => setPassword(e.target.value)}}  />
                </div>
                <div className="w-100 h-3/10 flex flex-row items-center justify-center gap-5">
                    <Button size="small" text="Entrar" onChildClick={() => handleLogin()}/>
                    <Button size="small" text="Voltar" onChildClick={() => signalback()}/>
                    
                </div>
            </div>
        </section>
    )
}