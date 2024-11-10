"use client";
import { useEffect, useState } from "react";
import { database, ref, onValue, set, push } from "../lib/firebase";
import { mockRooms } from "../data/room";
import MiniCard from "@/components/miniCard";
import MiniCardWrapper from "@/components/miniCardWrapper";
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

  const rooms = mockRooms; // TODO: change this to real data

  return (
    <div className="flex flex-col">
      <section id="mini-card" className="px-[24px] md:px-[160px]">
        <MiniCardWrapper rooms={rooms} />
      </section>
    </div>
  );
}
