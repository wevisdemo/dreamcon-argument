"use client";
import { useEffect, useState } from "react";
import { database, ref, onValue, set, push } from "../lib/firebase";
export default function Home() {
  const [data, setData] = useState<Room[]>([]);
  useEffect(() => {
    const dataRef = ref(database, "rooms/");
    onValue(dataRef, (snapshot) => {
      const dbValue = snapshot.val();
      console.log(dbValue);
      setData(dbValue);
    });
  }, []);

  const onclick = async () => {
    const dataRef = ref(database, "rooms/");
    await push(dataRef, { data: "test" });
  };
  return (
    <div className="">
      <h1 className="wv-h1 ">Hello world</h1>
      <button onClick={onclick}>click</button>
    </div>
  );
}
