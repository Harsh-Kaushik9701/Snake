import { useEffect, useRef, useState } from "react";

const Game_Size=20;
const GAMEGRDID= Array.from({length :Game_Size}, () => new Array(Game_Size).fill(""));
const Initial_Snake=[[5,5]];
//const [score,setScore]=useRef(0);

const generatefood =()=>{
    const x =Math.floor(Math.random()*Game_Size);
    const y =Math.floor(Math.random()*Game_Size);
    return[x,y];

}

export default function Snakegame(){
    const [snakeBody, setSnakeBody] = useState(Initial_Snake);

    const directionRef=useRef([1,0]);

    const foodRef = useRef(generatefood());
   // console.log(foodRef);

    const isSnakeBodyDiv = (xy,yc) => {
        return snakeBody.some(([x,y]) => {
            return x===xy && y===yc;
        });
    };

    useEffect(() => {
       const intervalId= setInterval(() =>{
        
            setSnakeBody((prevSnakeBody) => {
                const newHead = [prevSnakeBody[0][0]+directionRef.current[0], prevSnakeBody[0][1]+directionRef.current[1]];
               
                if( newHead[0]<0 ||
                      newHead[0]>=Game_Size ||
                       newHead[1]<0 ||
                       newHead[1]>=Game_Size ||
                    prevSnakeBody.some (([x,y]) =>{
                        return newHead[0] === x && newHead[1] ===y;
                    })
                ){
                    directionRef.current=[1,0];
                    return Initial_Snake;
                    
                }
                const copySnakeBody = prevSnakeBody.map((arr) =>[...arr] );
                if (newHead[0]===foodRef.current[0] &&
                    newHead[1]===foodRef.current[1]
                )
                {
                    foodRef.current=generatefood();
                  //  setScore(score+1);
                }
                else{
                    copySnakeBody.pop();
                }
            
             
            copySnakeBody.unshift(newHead);
            return copySnakeBody;
        });
    },500);

    const handleDirection=(e)=>{
        const key=e.key;
        console.log(key);
        if(key==="ArrowUp" && directionRef.current[1] !== 1){
            directionRef.current=[0,-1];
        }
        else if(key==="ArrowDown" && directionRef.current[1] !== -1){
            directionRef.current=[0,1];
        } 
        else if(key==="ArrowLeft"&& directionRef.current[0] !== 1){
            directionRef.current=[-1,0];
        }
        else if(key==="ArrowRight"&& directionRef.current[0] !== -1){
            directionRef.current=[1,0];
        }
            
    };
    window.addEventListener("keydown",handleDirection);
    return()=>{
        clearInterval(intervalId);
        window.removeEventListener('keydown',handleDirection);
    };
    },[]);

    return (
        <>
        <div className="heading"><h1>Let's play the Snake Game</h1></div>
        <div className="score"><h1></h1></div>
    <div className="container">
        {GAMEGRDID.map((row,yc)=>{
            return row.map((cell,xc)=> {
                return (
                <div 
                    className={`cell   ${isSnakeBodyDiv(xc,yc) ? "snake":""}
             ${foodRef.current[0]=== xc && foodRef.current[1] ===yc?'food':"s"}`}
             ></div>
                );

        });
    })}
    </div></>
    );
    }