import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

function App() {
  const { language, type, videoName } = useParams();
  const location = useLocation();
  const [video,setVideo] = useState(null)
  const getVideo = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
    setVideo(data);
  };
  useEffect(() => {
    // Construa a URL da API com base nos parâmetros da rota
    const apiUrl = `http://localhost:5173/api/${language}/${type}/${videoName}`;
    getVideo(apiUrl)
    // // Faça uma solicitação à sua API e mostre a resposta no console
    // fetch(apiUrl)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log('Resposta da API para', data);
    //   })
    //   .catch((error) => {
    //     console.error('Erro ao buscar dados da API:', error);
    //   });
  }, [language, type, videoName, location]);

  return (
    <div>
      <h2>Informações do Vídeo</h2>
    </div>
  );
}

export default App;
