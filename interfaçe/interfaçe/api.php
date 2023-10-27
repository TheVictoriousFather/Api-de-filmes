<?php
require('dotenv/config');

// Definição das variáveis
$user = getenv('STREAMTAPE_USER');
$key = getenv('STREAMTAPE_KEY');

// Configuração do CORS (pode ser configurado no servidor web)
header('Access-Control-Allow-Origin: *'); // Permitindo acesso a todos
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
// Função para obter os dados da URL
function obterDados($folder) {
    global $user, $key;
    try {
        // URL da API
        $url = "https://api.streamtape.com/file/listfolder?login=$user&key=$key&folder=$folder";
        
        // Realizar a solicitação HTTP
        $response = file_get_contents($url);
        return json_decode($response, true);
    } catch (Exception $error) {
        throw $error;
    }
}

// Rotas

// Rota para acessar a lista de filmes
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/movies') {
    try {
        $data = obterDados('b901TtK4ROU');
        $movieList = array_map(function($movie) {
            return [
                'name' => $movie['name'],
                'linkid' => $movie['linkid']
            ];
        }, $data['files']);
        header('Content-Type: application/json');
        echo json_encode($movieList);
    } catch (Exception $error) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao buscar dados de filmes']);
    }
}

// Rotas para séries e episódios
// Implemente de maneira semelhante às rotas de filmes
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/dub/series') {
    try {
        $data = obterDados('ApmHPLfoEdU'); // Substitua pelo ID da pasta de séries desejada
        $seriesList = array_map(function($series) {
            return [
                'name' => $series['name'],
                'id' => $series['id']
            ];
        }, $data['folders']);
        header('Content-Type: application/json');
        echo json_encode($seriesList);
    } catch (Exception $error) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao buscar dados de séries']);
    }
}

// Rota para acessar a lista de séries legendadas
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/leg/series') {
    try {
        $data = obterDados('Q19KsHcVRvg'); // Substitua pelo ID da pasta de séries legendadas desejada
        $seriesList = array_map(function($series) {
            return [
                'name' => $series['name'],
                'id' => $series['id']
            ];
        }, $data['folders']);
        header('Content-Type: application/json');
        echo json_encode($seriesList);
    } catch (Exception $error) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao buscar dados de séries']);
    }
}

// Rota para acessar episódios de séries dubladas
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $path = explode('/', trim($_SERVER['REQUEST_URI'], '/'));

    if (count($path) === 5 && $path[0] === 'dub' && $path[2] === 'series') {
        list($language, $type, $seriesName, $season, $episode) = $path;

        $folderId = 'ApmHPLfoEdU'; // Substitua pelo ID da pasta de séries dubladas
        try {
            $seriesData = obterDados($folderId);
            $series = null;

            foreach ($seriesData['folders'] as $item) {
                if ($item['name'] === $seriesName) {
                    $series = $item;
                    break;
                }
            }

            if ($series) {
                $seriesFolderId = $series['id'];
                $seasonData = obterDados($seriesFolderId);
                $seasonFolder = null;

                foreach ($seasonData['folders'] as $item) {
                    if ($item['name'] === $season) {
                        $seasonFolder = $item;
                        break;
                    }
                }

                if ($seasonFolder) {
                    $episodeData = obterDados($seasonFolder['id']);
                    $episodeInfo = null;

                    foreach ($episodeData['files'] as $item) {
                        if ($item['name'] === $episode) {
                            $episodeInfo = $item;
                            break;
                        }
                    }

                    if ($episodeInfo) {
                        $modifiedURL = "https://streamtape.com/e/{$episodeInfo['linkid']}/{$_SERVER['REQUEST_URI']}";
                        header("Location: $modifiedURL");
                    } else {
                        http_response_code(404);
                        echo json_encode(['error' => 'Episódio não encontrado']);
                    }
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Temporada não encontrada']);
                }
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Série não encontrada']);
            }
        } catch (Exception $error) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao buscar dados']);
        }
    }
}
// Rota para redirecionar com base no nome do vídeo fornecido
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $path = explode('/', trim($_SERVER['REQUEST_URI'], '/'));

    if (count($path) === 3) {
        list($language, $type, $videoName) = $path;

        $isDublado = $language === 'dub';
        $folderId = $isDublado ? ($type === 'movies' ? 'b901TtK4ROU' : 'ApmHPLfoEdU') : ($type === 'movies' ? 'TdZrQswgadk' : 'Q19KsHcVRvg');

        try {
            $data = obterDados($folderId);
            $video = null;
            
            foreach ($data['files'] as $item) {
                if ($item['name'] === $videoName) {
                    $video = $item;
                    break;
                }
            }
            
            if ($video) {
                $modifiedURL = "https://streamtape.com/e/{$video['linkid']}/{$_SERVER['REQUEST_URI']}";
                header("Location: $modifiedURL");
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Vídeo não encontrado']);
            }
        } catch (Exception $error) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao buscar dados']);
        }
    }
}
?>
