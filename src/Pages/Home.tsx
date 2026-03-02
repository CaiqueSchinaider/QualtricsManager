import { Outlet } from "react-router-dom";
import NavBar from "../Components/Layout/NavBar";

export default function HomePage() {

    return (
        <main className="bg-schin-black w-screen h-screen flex flex-row">
            <NavBar/>
            <div className=" w-15/20 h-full">
                
            <Outlet/>
            </div>
        </main>
    )
} 