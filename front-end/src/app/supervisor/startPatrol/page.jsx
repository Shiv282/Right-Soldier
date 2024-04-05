"use client";
import { useState } from "react";
import { Button } from "@mui/base";
import axios from "axios";
import { getDistance, handlePatrol } from "./utility";

export default function StartPatrol() {
  const [status, setStatus] = useState("Start");
  const [count, setCount] = useState(1);
  const [title, setTitle] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  function handleClick() {
    handlePatrol(setCount, setTitle, setLat, setLon, setStatus, count, status);
  }

  if (typeof window !== 'undefined' && "NDEFReader" in window) {
    return (
      <>
        <div className="text-center">
          <h1>NDEF activated</h1>
          <div className="mt-10">
            <Button id={status} onClick={handleClick}>
              {status}
            </Button>
            <div id="iframe">
              <iframe
                className="mx-10 my-10"
                src="https://lottie.host/embed/2376c839-0b53-4dbf-9953-283e1da752bc/vMw85QtgbV.json"
              ></iframe>
            </div>
            <div>
              <p>{title}</p>
              <p>{lat}</p>
              <p>{lon}</p>
            </div>
          </div>
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
