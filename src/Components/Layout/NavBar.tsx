import { useLocation, useNavigate } from "react-router-dom";
import Button from "../Misc/Button";
import Title from "../Misc/Title";

export default function NavBar() {
    let navigate = useNavigate() 
    let location = useLocation()
    let currentLocation = location.pathname
    
    function downloadBase() {
    const link = document.createElement("a");
    link.href = "/BASE-SURVEY.qsf";
    link.download = "BASE-SURVEY.qsf"; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    };

    return (
        <main className="bg-schin-blac w-5/20 h-full pt-20  border-r-2 border-schin-gray-medium relative select-none">
            <div className=" w-full h-30 flex justify-center items-center ">
           <img src="title.png" />
            </div>
            <div className="b h-100 w-full mt-15 flex flex-col justify-start items-center gap-5">
                <Button text="Criar Link LIVE" size="large" onChildClick={() => navigate('/')}  contrastStyle activate={currentLocation === '/'}/>
                <Button text="Testes QA" size="large" onChildClick={() => navigate('/qa')} contrastStyle activate={currentLocation === '/qa'}/>
                <Button text="Scripts" size="large" onChildClick={() => navigate('/scripts')} contrastStyle activate={currentLocation === '/scripts'}/>
                <Button  text="Baixar Base Survey" size="medium" className="bottom-5 absolute"  onChildClick={() => downloadBase()} contrastStyle activate={currentLocation === '/settings'}/>
              
            </div>
        </main>
    )
}
