"use client"

import { useCallback, useState } from "react";
import type { Info } from "@my-project/common/db";

export default function Info({ value: initialValue }: { value: number }) {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(initialValue);

  const doIncrease = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/increase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: Info = await res.json();
      setValue(data.value);
    } finally {
      setLoading(false);
    }
  }, []);

  const doReset = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: Info = await res.json();
      setValue(data.value);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div>
      <p>Value: { value }</p>
      <button onClick={ doIncrease } disabled={ loading }>Increase</button>
      <button onClick={ doReset } disabled={ loading }>Reset</button>
    </div>
  );
}
