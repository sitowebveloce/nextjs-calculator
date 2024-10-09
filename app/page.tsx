"use client";
import Big from "big.js";
import {useEffect, useRef, useState } from "react";

type State = {
  total: string | null;
  next: string | null;
  operation: string | null;
};

// INITIAL VALUES
const initialVals: State = {
  total: null,
  next: null,
  operation: null,
};

export default function Calculator() {

  const [state, setState] = useState<State>(initialVals);
  const [fSize, setFSize] = useState(34);
  const display = state.next || state.total || "0";
  console.log(state);

 const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const fontSizeFunc = ()=>{

        if(!textRef.current)return
        
        textRef.current.style.fontSize = `${fSize}px`;

        if(textRef.current.scrollWidth > textRef.current.clientWidth && fSize > 4){
          setFSize(fSize - 2);
          textRef.current.style.fontSize = `${fSize}px`;
        } 
        // console.log(fSize)
      }
      fontSizeFunc();
  }, [display, fSize]);


  // CHECK IF IS NUMBER
  const isNumber = (value: string): boolean =>{
    return /[0-9]+/.test(value);
  };

  const calculate = (state: State) : string=>{
    const total = Big(state.total ?? "0");
    const next = Big(state.next ?? "0");
    switch(state.operation){
      case "+":
        return total.plus(next).toString();
      case "-":
        return total.minus(next).toString();
      case "x":
        return total.times(next).toString();
      case "/":
        if(next.toString() === "0"){
         alert("Can't divide by 0");
          return "0";
        }else{
          return total.div(next).toString();
        }
      default:
        return "0";
    }
  }

  const newStateFunc = (state: State, value: string) : State => {
    // CASE AC
    if(value === "ac"){
      return initialVals;
    }
    // CASE IS NUMBER
    if(isNumber(value)){
      if(state.next){
       const nextVal = state.next === "0" ? value : state.next + value;
        return {...state, next: nextVal};
      }else{
        return {...state, next: value};
      }
    }

    // CASE =
    if(value === "="){
      if(state.next && state.operation){
        return {...state, total: calculate(state), next:calculate(state), operation: null};
      }else{
        return state;
      }
    }

    // CASE NEGATIVE
    if(value === "+/-"){
      if(state.next){
        return {...state, next: Big(state.next).times(-1).toString()};
      }else if(state.total){
        return {...state, total: Big(state.total).times(-1).toString()};
      }else{
        return state;
      }
    }

    // CASE DOT
    if(value === "."){
      if(!state.next){
        return {...state, next: '0' + value};
      }
      if(state.next){
        if(state.next.includes(".")){
          return state;
        }
        return {...state, next: state.next + value};
      }
    }

    // PERCENTAGE
    if(value === "%"){
      if(state.next){
        return {...state, next: Big(state.next).div(100).toString()};
      }
      if(state.total){
        return {...state, total: Big(state.total).div(100).toString()};
      }
    }

    // EXISTING OPERATION
    if(state.operation){
      return{
        total : calculate(state),
        next: null,
        operation: value
      }
    }

    // CASE OPERATOR
    return {
      total : state.next,
      next: null,
      operation: value,
    }
  };

  // HANDLE CLICK
  const handleClick = (value: string) => {
    const newState = newStateFunc(state, value);
    setState(newState);
  };

  // HANDLE COPY
  const handleCopy = () => {
    navigator.clipboard.writeText(display);
    alert("Valore copiato.");
  };

  // RETURN
  return (
    <div className="flex flex-col items-center justify-items-center h-auto p-8 font-[family-name:var(--font-geist-sans)]  text-white">

      <div className="grid grid-cols-4 text-sm text-center gap-4 p-3 border border-orange-300 rounded-md">
        <div ref={textRef} className="cursor-pointer px-2 py-3 border border-orange-100 rounded-sm shadow-sm hover:border-orange-400 duration-300 col-span-4 flex items-center w-[210px] overflow-y-hidden overflow-x-auto" onClick={handleCopy}>{display}</div>
        <div
          className="cursor-pointer p-2 border border-orange-100 rounded-sm shadow-smhover:border-orange-400 duration-300 col-span-1"
          onClick={() => handleClick("ac")}
        >
          AC
        </div>
        <div  className="cursor-pointer p-2 border border-orange-100 rounded-sm shadow-sm hover:border-orange-400 duration-300 col-span-1"
          onClick={() => handleClick("+/-")}>+/-</div>
        <div
          className="cursor-pointer p-2 border border-orange-100 rounded-sm shadow-sm hover:border-orange-400 duration-300"
          onClick={() => handleClick("%")}
        >
          %
        </div>
        <div
          className={`cursor-pointer p-2 border border-orange-300 shadow-sm hover:border-orange-600 duration-300  w-9 h-9 flex justify-center items-center rounded-full ${state.operation === "+" ? "bg-orange-600" : "bg-transparent"}`}
          onClick={() => handleClick("+")}
        >
          +
        </div>
        <div
          className="cursor-pointer p-2 border border-orange-100 rounded-sm shadow-sm hover:border-orange-400 duration-300"
          onClick={() => handleClick("1")}
        >
          1
        </div>
        <div
          className="cursor-pointer p-2 border border-orange-100 rounded-sm shadow-sm hover:border-orange-400 duration-300"
          onClick={() => handleClick("2")}
        >
          2
        </div>
        <div
          className="cursor-pointer p-2 border border-orange-100 rounded-sm shadow-sm hover:border-orange-400 duration-300"
          onClick={() => handleClick("3")}
        >
          3
        </div>
        <div
          className={`cursor-pointer p-2 border border-orange-300 shadow-sm hover:border-orange-600 duration-300  w-9 h-9 flex justify-center items-center rounded-full ${state.operation === "/" ? "bg-orange-600" : "bg-transparent"}`}
          onClick={() => handleClick("/")}
        >
          /
        </div>
        <div
          className="cursor-pointer p-2 border border-orange-100 rounded-sm shadow-sm hover:border-orange-400 duration-300"
          onClick={() => handleClick("4")}
        >
          4
        </div>
        <div
          className="cursor-pointer p-2 border border-orange-100 rounded-sm shadow-sm hover:border-orange-400 duration-300"
          onClick={() => handleClick("5")}
        >
          5
        </div>
        <div
          className="cursor-pointer p-2 border border-orange-100 rounded-sm shadow-sm hover:border-orange-400 duration-300"
          onClick={() => handleClick("6")}
        >
          6
        </div>
        <div
          className={`cursor-pointer p-2 border border-orange-300 shadow-sm hover:border-orange-600 duration-300  w-9 h-9 flex justify-center items-center rounded-full ${state.operation === "x" ? "bg-orange-600" : "bg-transparent"}`}
          onClick={() => handleClick("x")}
        >
          X
        </div>
        <div
          className="cursor-pointer p-2 border border-orange-100 rounded-sm shadow-sm hover:border-orange-400 duration-300"
          onClick={() => handleClick("7")}
        >
          7
        </div>
        <div
          className="cursor-pointer p-2 border border-orange-100 rounded-sm shadow-sm hover:border-orange-400 duration-300"
          onClick={() => handleClick("8")}
        >
          8
        </div>
        <div
          className="cursor-pointer p-2 border border-orange-100 rounded-sm shadow-sm hover:border-orange-400 duration-300"
          onClick={() => handleClick("9")}
        >
          9
        </div>
        <div
          className={`cursor-pointer p-2 border border-orange-300 shadow-sm hover:border-orange-600 duration-300  w-9 h-9 flex justify-center items-center rounded-full ${state.operation === "-" ? "bg-orange-600" : "bg-transparent"}`}
          onClick={() => handleClick("-")}
        >
          -
        </div>
        <div
          className="cursor-pointer p-2 border border-orange-100 rounded-sm shadow-sm hover:border-orange-400 duration-300"
          onClick={() => handleClick("0")}
        >
          0
        </div>

        <div
          className="cursor-pointer p-2 border border-orange-100 rounded-sm shadow-sm hover:border-orange-400 duration-300"
          onClick={() => handleClick(".")}
        >
          .
        </div>
      
        {/* <div
          className="p-2 duration-300"
        ></div> */}
       <div
          className="cursor-pointer flex justify-center items-center border border-orange-300 rounded-lg shadow-sm hover:border-orange-600 duration-300 col-span-2"
          onClick={() => handleClick("=")}
        >
          =
        </div>
      </div>
    </div>
  );
}
