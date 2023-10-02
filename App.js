require('dotenv/config');
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
 const port = 3000;
 const user = process.env.STREAMTAPE_USER;
const key = process.env.STREAMTAPE_KEY;
// const port = process.env.PORT || 3000;
app.use(cors());
// Função para obter os dados da URL
async function obterDados() {
    try {
     
      const url = `https://api.streamtape.com/file/listfolder?login=${user}&key=${key}`;
  
      const response = await axios.get(url);
      return response.data.result;
    } catch (error) {
      throw error;
    }
  }

// Rota para acessar a lista de vídeos
app.get('/videos', async (req, res) => {
  try {
    const data = await obterDados();
    const videoList = data.files.map((video) => ({
      name: video.name,
      linkid: video.linkid,
    }));
    res.json(videoList);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

// Rota para redirecionar com base no nome do vídeo fornecido
app.get('/videos/:videoName', async (req, res) => {
  try {
    const data = await obterDados();
    const requestedVideoName = req.params.videoName;

    const video = data.files.find((video) => video.name === requestedVideoName);

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
// app.listen(port, () => {
//     console.log(`Servidor rodando em https://vgtvprime.eu5.org:${port}`);
//   });
