"use client";
import { useEffect, useState } from "react";
import { database, ref, onValue, set, push } from "../lib/firebase";
import { mockRooms } from "../data/room";
import MiniCard from "@/components/miniCard";
import MiniCardWrapper from "@/components/miniCardWrapper";
import Hero from "@/components/hero";
import Description from "@/components/description";
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
      <section id="hero" className="px-[24px] md:px-[160px] bg-[#BDE6FF]">
        <Hero />
      </section>
      <div className="bg-[#BDE6FF] h-[40px] flex items-end">
        <div className="bg-[url('/ellipse.svg')] bg-repeat w-full h-[16px]" />
      </div>

      <section
        id="description"
        className="px-[24px] md:px-[160px] py-[32px] md:py-[64px] bg-[#D2FED6]"
      >
        <Description />
      </section>
      <section
        id="mini-card"
        className="px-[24px] md:px-[160px]  py-[32px] md:py-[64px]"
      >
        <MiniCardWrapper rooms={rooms} />
      </section>
      <div className="bg-[#FFFFFF] h-[40px] flex relative">
        <div className="bg-[url('/ellipse-2.svg')] bg-repeat w-full h-[16px] absolute top-[-2px]" />
      </div>
    </div>
  );
}
