export const deleteTraining = async (id: number) => {
  try {
    const trainingUrl = import.meta.env.VITE_TRAINING_URL;
    const queryParams = new URLSearchParams(`id=${id}`);
    const url = `${trainingUrl}?${queryParams}`;

    const requestOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_GATEWAY_API_KEY,
      },
      method: "DELETE",
      credentials: "include",
    };

    // TO DO: handle the outcome of the response i.e. status code
    // this is necessary for all calls to the api gateway
    await fetch(url, requestOptions);
  } catch (err) {
    console.log(err);
  }
};
