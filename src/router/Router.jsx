import { createContext, useContext, useState } from "react";
import { ROUTES } from "./routes.js";

const RouterContext = createContext(null);

export function RouterProvider({ children }) {
  const [route, setRoute] = useState(ROUTES.DASHBOARD);
  const [params, setParams] = useState({});

  const navigate = (nextRoute, nextParams = {}) => {
    setRoute(nextRoute);
    setParams(nextParams);
    window.scrollTo(0, 0);
  };

  return (
    <RouterContext.Provider value={{ route, params, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter muss innerhalb von RouterProvider verwendet werden.");
  return ctx;
}
