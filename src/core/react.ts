import { useEffect, useRef, useState } from "react";
import { CONTEXT } from ".";
import { Context } from "./context";

export const useSubcontext = () => {
  const [subcontext] = useState<Context>(() => CONTEXT.subcontext());
  const subcontextRef = useRef<Context>(subcontext);

  useEffect(() => {
    return () => {
      CONTEXT.remove(subcontextRef!.current);
    };
  }, []);

  return subcontext;
};
