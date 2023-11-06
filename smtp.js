const dotenv = require("dotenv"); // Importe a biblioteca dotenv

dotenv.config(); // Carregue as variáveis de ambiente do arquivo .env
module.exports ={
    host:process.env.HOST,
    port:process.env.PORT,
    user:process.env.EMAIL,
    pass:process.env.EMAIL_KEY
}