export const deleteTraining = async (
  id: number,
  logout: () => void
): Promise<void> => {
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

    const res = await fetch(url, requestOptions);

    if (res.status === 401) {
      logout();
    }
  } catch (err) {
    console.log(err);
  }
};
