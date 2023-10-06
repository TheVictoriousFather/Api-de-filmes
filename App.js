require('dotenv/config');
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;
const user = process.env.STREAMTAPE_USER;
const key = process.env.STREAMTAPE_KEY;

app.use(cors());

// Função para obter os dados da URL
async function obterDados(folder) {
  try {
    const url = `https://api.streamtape.com/file/listfolder?login=${user}&key=${key}&folder=${folder}`;
    const response = await axios.get(url);
    return response.data.result;
  } catch (error) {
    throw error;
  }
}

// Rota para acessar a lista de filmes
app.get('/movies', async (req, res) => {
  try {
    const data = await obterDados('b901TtK4ROU');
    const movieList = data.files.map((movie) => ({
      name: movie.name,
      linkid: movie.linkid,
    }));
    res.json(movieList);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados de filmes' });
  }
});

// Rota para acessar a lista de séries
app.get('/series', async (req, res) => {
  try {
    const data = await obterDados('UsY8ZNeSecM'); // Substitua 'series-folder-id' pelo ID da pasta de séries
    const seriesList = data.files.map((series) => ({
      name: series.name,
      linkid: series.linkid,
    }));
    res.json(seriesList);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados de séries' });
  }
});

// Rota para redirecionar com base no nome do vídeo fornecido
app.get('/:type/:videoName', async (req, res) => {
  try {
    const { type, videoName } = req.params;
    const folderId = type === 'movies' ? 'b901TtK4ROU' : 'UsY8ZNeSecM'; // Substitua 'series-folder-id' pelo ID da pasta de séries
    const data = await obterDados(folderId);
    const video = data.files.find((video) => video.name === videoName);

    if (video) {
      const modifiedURL = `https://streamtape.com/e/${video.linkid}${req.url}`;
      res.redirect(modifiedURL);
    } else {
      res.status(404).json({ error: 'Vídeo não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
