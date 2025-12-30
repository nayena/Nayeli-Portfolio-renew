import React, {useState, useEffect} from "react";

interface TooltipProps{
    children: React.ReactNode; 
    text: String;
}
const Tooltip: React.FC<TooltipProps> = ({children, text}) => {
    const [isHovered , setIsHovered] = useState(false);
    //Auto-hide tooltip on mobile after a delay 
    useEffect(() => {
        if(isHovered){
            const timer = setTimeout(() =>{
                setIsHovered(false);
            }, 3000); // hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [isHovered]) ; 
    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    const handleMouseLeave = () => {
        setIsHovered(false);

    };
    const handleTouchStart = () => {
        setIsHovered(true);
    };
    const handleTouchEnd = () => {
        setTimeout(() => setIsHovered(false), 2000);     
    };

    useEffect(() => {
        const handleClickOutside = () => {
            setIsHovered(false); 
        };
        if (isHovered){
            document.addEventListener("click", handleClickOutside);
            document.addEventListener("touchStart", handleClickOutside);
        }
        return() => {
            document.removeEventListener("click", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside); 
        };
    }, [isHovered]);
    return (
        <div
        className ="relative flex items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        >
        {children}
        {isHovered && (
            <div className="absolute bottom-full mb-2 w-auto text-xs  text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap z-10">
                {text}
            </div>
        )}
        </div>
    );
};

export default Tooltip; 