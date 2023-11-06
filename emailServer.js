// const express = require("express");
// const app = express();
// const nodemailer = require("nodemailer");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const SMTP_CONFIG = require("./smtp");
// const emailRouter = express.Router();
// const router = express.Router();
// emailRouter.use(cors());
// emailRouter.use(bodyParser.json());

// // Configure o transporte de e-mail (substitua com suas próprias credenciais)
// const transporter = nodemailer.createTransport({
//   host: SMTP_CONFIG.host,
//   port: SMTP_CONFIG.port,
//   secure: false,
//   auth: {
//     user: SMTP_CONFIG.user,
//     pass: SMTP_CONFIG.pass,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// Rota específica para enviar e-mails com HTML
// app.post("/send-email", async (req, res) => {
//   const { to, subject, html } = req.body;

//   const mailOptions = {
//     from: "vgtvprime@gmail.com", // Substitua pelo seu endereço de e-mail
//     to,
//     subject,
//     html,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log("E-mail enviado com sucesso:", info.response);
//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("Erro ao enviar o e-mail:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });
//  async function run() {
//    const mailSent = await transporter.sendMail({
//      html: "<p style={{color:'#455564'}}>TESTE</p>",
//      subject: "assunto",
//      from: 'vgtvprime@gmail.com',
//      to: ['victoriousbusines@gmail.com']
//    });
//    console.log(mailSent);
//  }

//  run();



//module.exports = emailRouter; // Exporte o roteador
