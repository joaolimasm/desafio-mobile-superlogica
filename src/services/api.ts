import axios from "axios";
import { AsyncStorage } from 'react-native';

const baseApi = axios.create({
  baseURL: "https://rickandmortyapi.com/api",
});

const listar = async (filtros = {}, pagina: number = 0) => {
  const filtro = { page: pagina };

  if (filtros.nome) {
    filtro.page = 1;
    filtro.name = filtros.nome;
  }

  let favoritos = "";

  if (filtros.favoritos) {
    let dados = await AsyncStorage.getItem('favoritos');

    if (dados) {
      dados = JSON.parse(dados);
      favoritos = dados.join(',');
      delete filtro.page;
    }
  }

  const response = await axios({
    method: "get",
    url:"https://rickandmortyapi.com/api/character/" + favoritos,
    params: filtro
  }).catch(() => {
    return { data: null }
  });

  return response?.data;
};

const detalhar = async (codigo: number) => {
  if (!codigo) {
    throw Error("Código do personagem não informado");
  }

  const resultado = await baseApi.get(`/character/${codigo}`, {});
  return resultado;
};

export default {
  listar,
  detalhar,
};
