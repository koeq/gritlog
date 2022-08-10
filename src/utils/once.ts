import { useEffect, useRef, useState } from "react";

export const usefetchOnce = <T>(effect: () => Promise<T>) => {
  const [data, setData] = useState<T>();
  const fetched = useRef(false);

  useEffect(() => {
    const fetch = async () => {
      setData(await effect());
    };

    if (!fetched.current) {
      fetch();
      fetched.current = true;
    }
  }, [fetched]);

  return data;
};
