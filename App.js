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
    // https://api.mixdrop.co/folderlist?email=vgtvprime@gmail.com&key=uoY2kqYmen9Uo7ZWn&page=1
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
app.get('/dub/movies', async (req, res) => {
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
app.get('/leg/movies', async (req, res) => {
  try {
    const data = await obterDados('TdZrQswgadk');
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
 app.get('/dub/series', async (req, res) => {
   try {
     const data = await obterDados('ApmHPLfoEdU'); // Substitua 'series-folder-id' pelo ID da pasta de séries
     const seriesList = data.folders.map((series) => ({
       name: series.name,
       id: series.id,
     }));
     res.json(seriesList);
   } catch (error) {
     res.status(500).json({ error: 'Erro ao buscar dados de séries' });
   }
 });
 app.get('/leg/series', async (req, res) => {
  try {
    const data = await obterDados('Q19KsHcVRvg'); // Substitua 'series-folder-id' pelo ID da pasta de séries
    const seriesList = data.folders.map((series) => ({
      name: series.name,
      id: series.id,
    }));
    res.json(seriesList);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados de séries' });
  }
});

app.get('/dub/series/:seriesName/:season/:episode', async (req, res) => {
  try {
    const { seriesName, season, episode } = req.params;
    const seriesData = await obterDados('ApmHPLfoEdU'); // Substitua 'series-folder-id' pelo ID da pasta de séries
    const series = seriesData.folders.find((series) => series.name === seriesName);

    if (series) {
      const seriesFolderId = series.id;
      const seasonData = await obterDados(seriesFolderId);
      const seasonFolder = seasonData.folders.find((folder) => folder.name === season);

      if (seasonFolder) {
        const episodeData = await obterDados(seasonFolder.id);
        const episodeInfo = episodeData.files.find((ep) => ep.name === episode);

        if (episodeInfo) {
          const modifiedURL = `https://streamtape.com/e/${episodeInfo.linkid}`;
          res.redirect(modifiedURL);
        } else {
          res.status(404).json({ error: 'Episódio não encontrado' });
        }
      } else {
        res.status(404).json({ error: 'Temporada não encontrada' });
      }
    } else {
      res.status(404).json({ error: 'Série não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

app.get('/leg/series/:seriesName/:season/:episode', async (req, res) => {
  try {
    const { seriesName, season, episode } = req.params;
    const seriesData = await obterDados('Q19KsHcVRvg'); // Substitua 'series-folder-id' pelo ID da pasta de séries
    const series = seriesData.folders.find((series) => series.name === seriesName);

    if (series) {
      const seriesFolderId = series.id;
      const seasonData = await obterDados(seriesFolderId);
      const seasonFolder = seasonData.folders.find((folder) => folder.name === season);

      if (seasonFolder) {
        const episodeData = await obterDados(seasonFolder.id);
        const episodeInfo = episodeData.files.find((ep) => ep.name === episode);

        if (episodeInfo) {
          const modifiedURL = `https://streamtape.com/e/${episodeInfo.linkid}`;
          res.redirect(modifiedURL);
        } else {
          res.status(404).json({ error: 'Episódio não encontrado' });
        }
      } else {
        res.status(404).json({ error: 'Temporada não encontrada' });
      }
    } else {
      res.status(404).json({ error: 'Série não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});


// Rota para redirecionar com base no nome do vídeo fornecido
app.get('/:language/:type/:videoName', async (req, res) => {
  try {
    const { language, type, videoName } = req.params;
    const isDublado = language === 'dub'; // Verifica se o idioma é dublado
    const folderId = isDublado
      ? type === 'movies'
        ? 'b901TtK4ROU'
        : 'ApmHPLfoEdU'
      : type === 'movies'
      ? 'TdZrQswgadk'
      : 'Q19KsHcVRvg'; // Substitua pelos IDs corretos das pastas

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
