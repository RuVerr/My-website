import { MutableRefObject } from "react";

export function setRefs<T>(
  el: T | null,
  arrayRefs?: React.MutableRefObject<T[]>,
  singleRef?: React.MutableRefObject<T | null>
) {
  if (!el) return;
  if (arrayRefs) {
    if (!arrayRefs.current) arrayRefs.current = [];
    if (!arrayRefs.current.includes(el)) arrayRefs.current.push(el);
  }
  singleRef ? (singleRef.current = el) : null;
}
