"use client"
import { useState } from "react";
import { Button } from "@mui/base";
import axios from "axios";
import { getDistance, handlePatrol } from "./utility";



export default function StartPatrol() {
    const [status, setStatus] = useState("Start");
    const [count, setCount] = useState(1);

    function handleClick(){
        handlePatrol(setState, setCount, count, status)
    }
    
    if ("NDEFReader" in window) {
        return (
          <>
            <div>
              <h1>NDEF activated</h1>
              <Button id={status} onClick={handleClick}>
                {status}
              </Button>
            </div>
          </>
        );
      } else {
        return (
          <>
            <div>
              <h1>NDEF reader not available.</h1>
            </div>
          </>
        );
      }
}