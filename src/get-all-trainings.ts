import { useEffect, useRef } from "react";

export const getAllTrainings = async () => {
  const trainingUrl = import.meta.env.VITE_TRAINING_URL;

  const requestOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_GATEWAY_API_KEY,
    },
    method: "GET",
    credentials: "include",
  };

  const res = await fetch(trainingUrl, requestOptions);
  const data = await res.json();

  console.log(data);
};