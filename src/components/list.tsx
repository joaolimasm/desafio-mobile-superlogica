import {
  Box,
  VStack,
  Divider,
  Image,
  Button,
  Modal,
  Center,
} from "native-base";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, AsyncStorage } from "react-native";

import apiService from "../services/api";

export default function List({ data }) {
  const [showModal, setShowModal] = useState(false);

  const [favorito, setFavorito] = useState(false);

  const [nome, setNome] = useState("");
  const [sexo, setSexo] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [origem, setOrigem] = useState("");
  const [qtdEpisodios, setQtdEpisodios] = useState(0);
  const [especie, setEspecie] = useState("");
  const [status, setStatus] = useState("");

  const myCards: any[] = [];

  useEffect(() => {
    const verificaFavorito = async () => {
      let dados = await AsyncStorage.getItem("favoritos");

      let status;

      if (!dados) {
        status = false;
      } else {
        dados = JSON.parse(dados);

        status = dados?.includes(data.id) ? true : false;
      }

      setFavorito(status);
    };

    verificaFavorito();
  }, []);

  const getDetalhes = async (codigo) => {
    const { data } = await apiService.detalhar(codigo);

    setNome(data.name);
    setSexo(data.gender);
    setLocalizacao(data.location.name);
    setOrigem(data.origin.name);
    setEspecie(data.species);
    setStatus(data.status);
    setQtdEpisodios(data.episode.length);

    setShowModal(true);
  };

  const favoritar = async (codigo) => {
    let dados = await AsyncStorage.getItem("favoritos");

    if (!dados) {
      await AsyncStorage.setItem("favoritos", JSON.stringify([codigo]));
      setFavorito(true);
      return;
    }

    dados = JSON.parse(dados);

    if (dados?.includes(codigo)) {
      const novos = [];

      dados.forEach((dado) => (dado !== codigo ? novos.push(dado) : false));
      await AsyncStorage.setItem("favoritos", JSON.stringify(novos));
      setFavorito(false);
    } else {
      dados.push(codigo);
      await AsyncStorage.setItem("favoritos", JSON.stringify(dados));
      setFavorito(true);
    }
  };

  if (data) {
    myCards.push(
      <Box border={0} borderRadius="sm">
        <VStack space={4} divider={<Divider />}>
          {/* <Box px={4} pt={1}>
            <Text style={styles.name}>{data.name}</Text>
          </Box> */}
          <Box px={4}>
            {/* <Image
              style={styles.perfil}
              source={{
                uri: data.image,
              }}
              alt={data.name}
              size={"sm"}
            /> */}
            <Text style={styles.name}>{data.name}</Text>
              </Box>
              <Box px={4}>
            <Center>
              <Image
                resizeMode="cover"
                style={styles.image}
                source={{
                  uri: data.image,
                }}
                alt={data.name}
                size={"2xl"}
              />
            </Center>
          </Box>
          <Box px={12} pb={4}>
            <Button onPress={() => getDetalhes(data.id)}>Detalhar</Button>
          </Box>
        </VStack>
      </Box>
    );
  }

  return (
    <View style={styles.list}>
      {myCards.length ? (
        myCards
      ) : (
        <View
          style={{
            flex: 1,
            borderRadius: 10,
            margin: 5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text> Não foram encontrados personagens</Text>
        </View>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>{nome}</Modal.Header>
          <Modal.Body>
            <Image
              source={{
                uri: data.image,
              }}
              alt={data.name}
              size={"xl"}
            />
            <Text style={styles.modal}>Sexo: {sexo}</Text>
            <Text style={styles.modal}>Nº de Episodios: {qtdEpisodios}</Text>
            <Text style={styles.modal}>Local: {localizacao}</Text>
            <Text style={styles.modal}>Origem: {origem}</Text>
            <Text style={styles.modal}>Espécie: {especie}</Text>
            <Text style={styles.modal}>Status: {status}</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button onPress={() => favoritar(data.id)}>
              {!favorito ? "Favoritar" : "Desfavoritar"}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 10,
    backgroundColor: "#DBD6D0",
  },
  logo: {
    height: 80,
  },
  name: {
    color: "#756951",
    fontSize: 20,
    fontWeight: "bold",
  },
  modal: {
    color: "#756951",
    fontSize: 16,
    paddingTop: 4,
  },
  image: {
    height: 400,
    alignItems: "center",
    width: "100%",
  },
  // perfil: {
  //   width: 60,
  //   height: 60,
  //   borderRadius: 25,
  //   marginBottom: 10,
  //   flexDirection: "row",
  // },
});
