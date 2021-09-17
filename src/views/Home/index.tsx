import React, { useState, useEffect } from "react";

import { StyleSheet, View, FlatList } from "react-native";
import { Input, Button, IconButton, Icon } from "native-base";
import ListaPersonagens from "../../components/list";
import { AntDesign } from "@expo/vector-icons";

import apiService from "../../services/api";

const Home: React.FC = () => {
  const [personagens, setPersonagens] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroFavorito, setFiltroFavorito] = useState(false);

  useEffect(() => {
    getPersonagens();
  }, [filtroNome]);

  const getPersonagens = async () => {
    let result = [];

    const filtro = {};

    if (filtroNome?.length && filtroNome !== "") {
      filtro.nome = filtroNome;
    }

    const value = await apiService.listar(filtro, pagina);

    if (value?.results?.length > 0) {
      result = !filtroNome.length ? [...personagens] : [];
      value.results.forEach((personagem) => result.push(personagem));

      setPagina(pagina + 1);

      return setPersonagens(result);
    }
  };

  const mostrarFavoritos = async () => {
    if (!filtroFavorito) {
      const value = await apiService.listar({ favoritos: !filtroFavorito });

      let favoritados;

      if (value?.length > 0) {
        favoritados = value.map((personagem) => personagem);
      } else {
        favoritados = [value];
      }

      setPersonagens(favoritados);
    } else {
      await getPersonagens();
    }

    setFiltroFavorito(!filtroFavorito);
  };

  return (
    <View style={styles.container}>
      <Input
        borderRadius={10}
        style={styles.input}
        placeholder="Buscando algum personagem?"
        placeholderTextColor="#DBD6D0"
        value={filtroNome}
        onChangeText={(text) => setFiltroNome(text)}
        w="100%"
        borderWidth={2}
        borderColor="#DBD6D0"
        _light={{
          placeholderTextColor: "blueGray.400",
        }}
        _dark={{
          placeholderTextColor: "blueGray.50",
        }}
      />
      {/* <Button onPress={() => mostrarFavoritos()} style={styles.button}>
        { filtroFavorito ? 'Mostrar Todos' : 'Mostrar Favoritos' }
      </Button>  */}
      <IconButton
        style={styles.button}
        icon={<Icon size="md" as={<AntDesign name="heart" />} color="red" />}
        onPress={() => mostrarFavoritos()}
      >
        {filtroFavorito ? "" : ""}
      </IconButton>
      <FlatList
        style={styles.flatlist}
        data={personagens}
        renderItem={({ item }) => <ListaPersonagens data={item} />}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={!filtroFavorito ? getPersonagens : false}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    marginTop: 5,
  },
  flatlist: {
    padding: 1,
  },
  button: {
    backgroundColor: "#DBD6D0",
  },
});

export default Home;
