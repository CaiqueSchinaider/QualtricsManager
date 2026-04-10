import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../Pages/Home";
import CreateLinkLive from "../Components/Layout/CreateLinkLive";
import ProjectsQA from "../Components/Layout/ProjectsQA";
import Listscripts from "../Components/Layout/Listscripts";
import ImageFormat from "../Components/Layout/ImageFormat";
import CopyingStructures from "../Components/Layout/CopyingStructures";
import CredentialsProvider from "../Contexts/CredentialsContext";



export default function AppRouter() {
    return (
        <CredentialsProvider>
        <BrowserRouter>
            <Routes>
                <Route  element={<HomePage/>} >
                    <Route path='/'  element={<CreateLinkLive/>} />
                    <Route path='/qa'  element={<ProjectsQA/>} />
                    <Route path='/scripts'  element={<Listscripts/>} />
                    <Route path='/imageformat'  element={<ImageFormat/>} />
                    <Route path='/layouts'  element={<CopyingStructures/>} />
                </Route>
            </Routes>
        </BrowserRouter>
        </CredentialsProvider>
    )
}