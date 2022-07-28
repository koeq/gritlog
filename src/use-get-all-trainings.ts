import { useEffect } from "react";

const getAllTrainings = async () => {
  const trainingUrl = import.meta.env.VITE_TRAINING_URL;
  const credentials: {
    credentials: RequestCredentials;
  } = {
    credentials: "include",
  };
  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_GATEWAY_API_KEY,
    },
    method: "GET",
    ...credentials,
  };

  const res = await fetch(trainingUrl, requestOptions);
  const data = await res.json();

  console.log(data);
};

export const useGetAllTrainings = () => {
  useEffect(() => {
    getAllTrainings();
  }, []);
};
