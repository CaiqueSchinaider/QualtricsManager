import { useState } from "react";
import Button from "../Misc/Button";
import Input from "../Misc/Input";

type LoginPopUpProps = {
    signalLogin: () => void
    signalback: () => void
}

export default function LoginPopUp({signalLogin, signalback}: LoginPopUpProps) {


    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')


    async function handleLogin() {
        if (username == '') return;
        if (password == '') return;

        let response = await fetch('http://localhost:8080/api/users',{
           method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: username, password: password})
        })
        let signal = await response.json()
        if (signal.signal) {
            signalLogin()
        } else {
             console.log('error')
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