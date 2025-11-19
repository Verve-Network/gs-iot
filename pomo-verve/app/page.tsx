"use client";

import getPoints from "@/service/points";
import putPoints from "@/service/putPoints";
import { useEffect, useState } from "react";

interface UserData {
  id: string;
  usuario: string;
  pontos: number;
  tipo: string;
}

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
    <div>
      <h2>Points shop</h2>
      <div>
        <p>Quantidade de pontos: {user?.pontos}</p>
        <p>Nome do usuário: {user?.usuario}</p>
      </div>

      <div>
        <h2>Cosméticos:</h2>
        <div className="flex gap-2">
          <p>Chocolate: 5 pontos</p>
          <button
            onClick={() => handleBuyitem(5)}
            className="cursor-pointer"
            type="button"
          >
            Comprar
          </button>
        </div>
        <div>
            <p>{message}</p>
        </div>
      </div>
    </div>
  );
}
