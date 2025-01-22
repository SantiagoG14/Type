import { useState } from "react";


export function useSavedState<T>(key: string, initial: T) {
  const [state, setState] = useState(() => getInitialValue());

  function setValue(value: T): void {
    setState(value);
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getInitialValue(): T {
    const savedValue = localStorage.getItem(key);

    if (!savedValue) return initial;

    return JSON.parse(savedValue) as T;
  }

  return [state, setValue] as const;
}
