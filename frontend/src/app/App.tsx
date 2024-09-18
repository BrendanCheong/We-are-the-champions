import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useHelloQuery } from "../features/hello/api/useHelloQuery";

function App() {
  const [count, setCount] = useState(0);
  const { data, isLoading, isError, error } = useHelloQuery();

  return (
    <>
      <div>
        <a
          className="flex flex-col justify-center"
          href="https://vitejs.dev"
          target="_blank"
        >
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a
          className="flex flex-col justify-center"
          href="https://react.dev"
          target="_blank"
        >
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + TailwindCSS</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/app/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {(error as Error).message}</p>}
      {data && <b className="pb-4">{data.message}</b>}
    </>
  );
}

export default App;
