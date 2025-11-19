import api from "./api";


export default async function putPoints(novoSaldo: number) {
    const data = {
        pontos: novoSaldo,
    }
    try {     
        const response = await api.put(`https://691d0f6cd58e64bf0d34dfd3.mockapi.io/api/pontos/1`, data);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar cursos:", error);
        throw error;
    }
}