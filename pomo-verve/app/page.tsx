"use client";

import getPoints from "@/service/points";
import putPoints from "@/service/putPoints";
import Image from "next/image";
import { useEffect, useState } from "react";

interface UserData {
  id: string;
  usuario: string;
  pontos: number;
  tipo: string;
}

const mimos = [
  {
    id: 1,
    name: "Uma xícara de café",
    price: 30,
    icon: "/coffee.svg"
  },
  {
    id: 2,
    name: "Escutar música",
    price: 10,
    icon: "/headphones.svg"
  },
  {
    id: 3,
    name: "Alongamento",
    price: 5,
    icon: "/person-arms-spread.svg"
  },

]

export default function PointShop() {
  const [user, setUser] = useState<UserData | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    async function fetchUser() {
      try {
        const results = await getPoints();
        if (results && results.length > 0) {
          setUser(results[0]);
        }
      } catch (error: unknown) {
        console.log(error);
      }
    }
    fetchUser();
  }, []);

  async function handleBuyitem(cost: number) {
    if (!user) return;
    setMessage(null);

    if (user.pontos < cost) {
      setMessage(`Saldo insuficiente!`);
      return;
    }
    try {
      const novoSaldo = user.pontos - cost;
      await putPoints(novoSaldo);
      setMessage("Compra realizada com sucesso!")
      setUser((prev) => (prev ? { ...prev, pontos: novoSaldo } : null));
    } catch (error: unknown) {
      console.log(error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <header className="flex justify-between ">
        <div className="flex items-center gap-2">

          <svg className="w-[42px]" version="1.0" xmlns="http://www.w3.org/2000/svg"
            width="47.000000pt" height="50.000000pt" viewBox="0 0 47.000000 50.000000"
            preserveAspectRatio="xMidYMid meet">

            <g transform="translate(0.000000,50.000000) scale(0.100000,-0.100000)"
              fill="#000000" stroke="none">
              <path d="M12 478 c-7 -7 -12 -16 -12 -22 0 -14 104 -196 112 -196 4 0 16 17
26 37 l19 37 -35 60 c-55 96 -79 115 -110 84z"/>
              <path d="M275 468 c-14 -13 -66 -93 -115 -178 -71 -124 -87 -158 -79 -173 17
-30 40 -33 63 -6 12 13 56 86 99 162 72 126 81 138 104 135 52 -6 51 -29 -7
-130 -81 -141 -77 -136 -91 -105 -7 15 -15 27 -18 27 -3 0 -16 -18 -28 -40
l-21 -40 28 -30 c29 -31 58 -37 90 -20 25 13 170 269 170 299 0 37 -31 91 -61
106 -43 23 -103 19 -134 -7z"/>
              <path d="M30 61 c-25 -47 36 -83 64 -38 8 12 8 22 0 35 -16 25 -51 27 -64 3z" />
            </g>
          </svg>


          <h1 className="text-[18px] font-bold">Verve shop</h1>
        </div>
        <div className="flex items-center gap-2">
          Pontos PoMo: <span className="font-bold">{user?.pontos}</span>
        </div>
      </header>
      <main className="flex flex-col mt-10">
        <section id="mimos" className="">
          <h2 className="text-[20px]">Mimos rápidos (Até 50 pontos)</h2>
          <div className="flex gap-2 mt-5">
            {mimos.map((m) => (
              <div key={m.id} className="w-1/3 border-2 px-5  py-10 border-black rounded-2xl">
                <div className="flex gap-10 items-center">
                  <Image alt="" height={100} width={100} src={m.icon} />
                  <p className="text-2xl font-bold">{m.name}</p>
                </div>
                <div className="flex items-center justify-between mt-5">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-7" fill="#000000" viewBox="0 0 256 256"><path d="M184,89.57V84c0-25.08-37.83-44-88-44S8,58.92,8,84v40c0,20.89,26.25,37.49,64,42.46V172c0,25.08,37.83,44,88,44s88-18.92,88-44V132C248,111.3,222.58,94.68,184,89.57ZM232,132c0,13.22-30.79,28-72,28-3.73,0-7.43-.13-11.08-.37C170.49,151.77,184,139,184,124V105.74C213.87,110.19,232,122.27,232,132ZM72,150.25V126.46A183.74,183.74,0,0,0,96,128a183.74,183.74,0,0,0,24-1.54v23.79A163,163,0,0,1,96,152,163,163,0,0,1,72,150.25Zm96-40.32V124c0,8.39-12.41,17.4-32,22.87V123.5C148.91,120.37,159.84,115.71,168,109.93ZM96,56c41.21,0,72,14.78,72,28s-30.79,28-72,28S24,97.22,24,84,54.79,56,96,56ZM24,124V109.93c8.16,5.78,19.09,10.44,32,13.57v23.37C36.41,141.4,24,132.39,24,124Zm64,48v-4.17c2.63.1,5.29.17,8,.17,3.88,0,7.67-.13,11.39-.35A121.92,121.92,0,0,0,120,171.41v23.46C100.41,189.4,88,180.39,88,172Zm48,26.25V174.4a179.48,179.48,0,0,0,24,1.6,183.74,183.74,0,0,0,24-1.54v23.79a165.45,165.45,0,0,1-48,0Zm64-3.38V171.5c12.91-3.13,23.84-7.79,32-13.57V172C232,180.39,219.59,189.4,200,194.87Z"></path></svg>
                    <p>{m.price}</p>
                  </div>
                  <button onClick={() => handleBuyitem(m.price)} className="rounded-2xl bg-black text-white px-3 py-2 cursor-pointer">Resgatar</button>
                </div>
              </div>

            ))}

          </div>
        </section>
            {message && (
              <p>{message}</p>
            )}
      </main>

    </div>
  );
}
