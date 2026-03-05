interface fetchDataWithControllerProp<T> {
  fetchApi: string;
  setData: React.Dispatch<React.SetStateAction<T>>;
}

export function fetchDataWithController<T>({ fetchApi, setData }: fetchDataWithControllerProp<T>) {
  const controller = new AbortController();
  fetch(fetchApi, { signal: controller.signal })
    .then((res) => res.json())
    .then((data) => setData(data))
    .catch((err) => {
      if (err.name !== "AbortError") console.error(err);
    });

  return () => controller.abort();
}
