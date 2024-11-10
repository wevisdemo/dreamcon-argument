"use client";
import { useEffect, useState } from "react";
import { database, ref, onValue, set, push } from "../lib/firebase";
import { mockRooms } from "../data/room";
import MiniCard from "@/components/miniCard";
import MiniCardWrapper from "@/components/miniCardWrapper";
import Hero from "@/components/hero";
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
      <section id="hero" className="px-[24px] md:px-[160px] bg-[#BDE6FF] ">
        <Hero />
      </section>
      <section id="description" className="px-[24px] md:px-[160px]"></section>
      <section id="mini-card" className="px-[24px] md:px-[160px]">
        <MiniCardWrapper rooms={rooms} />
      </section>
    </div>
  );
}
