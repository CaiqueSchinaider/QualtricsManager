import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../Pages/Home";
import CreateLinkLive from "../Components/Layout/CreateLinkLive";
import ProjectsQA from "../Components/Layout/ProjectsQA";
import Listscripts from "../Components/Layout/listscripts";


export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route  element={<HomePage/>} >
                    <Route path='/'  element={<CreateLinkLive/>} />
                    <Route path='/qa'  element={<ProjectsQA/>} />
                    <Route path='/scripts'  element={<Listscripts/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}