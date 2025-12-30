import{
    FileUser, 
    Timer, 
    Linkedin,
    Github, 
    Film, 
    Sun,
    Moon,  
} from "lucide-react";

import Tooltip from "./Tooltip";
export const Taskbar = ({theme}: {theme: "dark" | "light"}) => {
    return(
        <div
        className={`flex w-fit max-w-sm sm:max-w-md lg:w-fit fixed items-center gap-2 bottom-2 p-2 py-2 lg:py-1 rounded-xl justify-between px-3 lg:p-2${
            theme === "dark" ? "shadow-xl" : "shadow-sm"
        } mx-2 lg:mx-0 z-50 ${
            theme === "dark"
            ? "border border-gray-700 bg-gray-950"
            : "border border-gray-300 bg-white"
        }`}
        > 
        {/*Icons section - larger touch target in mobile */}
        <div className="flex gap-3 lg:gap-2 w-full justify-center">
        <Tooltip text="Media Player">
                <button 
                onClick={() => {
                    window.dispatchEvent(new CustomEvent("openMedia"));
                }}
                className={
                    "border rounded-lg p-1 " +
                    (theme === "dark"
                    ? "border-gray-700 bg-gray-900"
                    : "border-gray-300 bg-white")
                }
                >
                    <Film
                    className="w-7 h-7 object-contain"
                    color={theme==="dark"? "white" : "black"}/>
                </button>
        </Tooltip>

        <Tooltip text="Pomodoro Timer">
                <button 
                onClick={() => {
                    window.dispatchEvent(new CustomEvent("openTimer"));
                }}
                className={
                    "border rounded-lg p-1 " +
                    (theme === "dark"
                    ? "border-gray-700 bg-gray-900"
                    : "border-gray-300 bg-white")
                }
                >
                    <Timer
                    className="w-7 h-7 object-contain"
                    color={theme==="dark"? "white" : "black"}/>
                </button>
        </Tooltip>

        <Tooltip text="Github">
                <a
                href="https://github.com/nayena"
                target="_blanck"
                rel="noopener noreferrer"
                className={
                    "border rounded-lg p-1 " +
                    (theme === "dark"
                    ? "border-gray-700 bg-gray-900"
                    : "border-gray-300 bg-white")
                }
                >
                    <Github
                    className="w-7 h-7 object-contain"
                    color={theme==="dark"? "white" : "black"}/>
                </a>
        </Tooltip>

        <Tooltip text="LinkedIn">
                <a
                href="https://www.linkedin.com/in/nayeli-naranjo/"
                target="_blanck"
                rel="noopener noreferrer"
                className={
                    "border rounded-lg p-1 " +
                    (theme === "dark"
                    ? "border-gray-700 bg-gray-900"
                    : "border-gray-300 bg-white")
                }
                >
                    <Linkedin
                    className="w-7 h-7 object-contain"
                    color={theme==="dark"? "white" : "black"}/>
                </a>
        </Tooltip>

        <Tooltip text="Resume">
            <button 
                onClick={() => {
                    window.dispatchEvent(new CustomEvent("openResume"));
                }}
                className={
                    "border rounded-lg p-1 " +
                    (theme === "dark"
                    ? "border-gray-700 bg-gray-900"
                    : "border-gray-300 bg-white")
                }
                >
                    <FileUser
                    className="w-7 h-7 object-contain"
                    color={theme==="dark"? "white" : "black"}/>
                </button>
        </Tooltip>
        <div className="border border-gray-300 rounded-full"/>
        <Tooltip text={theme === "dark" ? "Light Mode" : "Dark Mode"}>
                <button 
                onClick={() => {
                    window.dispatchEvent(new CustomEvent("toggleTheme"));
                }}
                className={
                    "border rounded-lg p-1 " +
                    (theme === "dark"
                    ? "border-gray-700"
                    : "border-gray-300")
                }
                >
                {theme === "dark"?(
                <Sun
                className="w-7 h-7 object-contain"
                color={theme === "dark"? "white": "black"}
                />
            ):(
               <Moon className="w-7 h-7 object-contain" color="black" /> 
                )}
                </button>
        </Tooltip>
        </div>
        </div>
    );
};