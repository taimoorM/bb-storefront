"use client";

import { useEffect } from "react";

export default function Test() {
  const call = async () => {
    const data = await fetch("/api/init", {
      credentials: "include",
    });
    console.log(data);
  };
  useEffect(() => {
    call();
  }, []);

  return <div>hello</div>;
}
