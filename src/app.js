import express from "express";
import routes from "./web/index.js";
//import sendMessage from "./addMsgToFila.js";
import receiveMessages from "./filaMsgReservaProdutos.js";
import receiveMessagesDevolvidos from "./filaMsgDevolucao.js";

//const nonce = crypto.randomBytes(16).toString('base64');
//console.log('Generated nonce:', nonce);

const app = express();
// Middleware para gerar nonce (ou você pode gerar isso de outra maneira)
/*app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64'); // Exemplo de geração de nonce
  next();
});

// Configuração do Helmet com CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      scriptSrc: [`'self'`, (req, res) => `'nonce-${res.locals.nonce}'`, "https://trusted-scripts.com"],
      styleSrc: [`'self'`, (req, res) => `'nonce-${res.locals.nonce}'`, "https://trusted-styles.com"],
      imgSrc: ["'self'", "https://trusted-images.com"],
      fontSrc: ["'self'", "https://trusted-fonts.com"],
      connectSrc: ["'self'", "https://api.trusted.com"],
      frameSrc: ["'self'", "https://trusted-frames.com"],
      frameAncestors: ["'self'"],
      formAction: ["'self'"],
    },
  },
}));*/
//app.use(helmet());
app.use(express.json());

routes(app, express);


// SQS processo de recebimento de mensagens
receiveMessages();
receiveMessagesDevolvidos();
//Send Message
/*const paramsMsgReservaProdutos = {
  //MessageBody: 'Hello from Node.js!',
  MessageBody: JSON.stringify({
    idorder: '98',
    obs: 'Pedido novo',
    productIds: [{
      id:1,
      qtd:3
    }, {
      id:2,
      qtd:101
    }]
  }),
  QueueUrl: process.env.AWS_QUEUE_URL_RESERVA_PRODUTO, // replace with your SQS queue URL
  MessageGroupId:'1',
  MessageDeduplicationId:'11'
};
sendMessage(paramsMsgReservaProdutos);

const paramsMsgDevolveProdutos = {
  //MessageBody: 'Hello from Node.js!',
  MessageBody: JSON.stringify({
    idorder: '55',
    obs: 'Pedido recusado por pgto',
    productIds: [{
      id:1,
      qtd:5
    }, {
      id:2,
      qtd:2
    }]
  }),
  QueueUrl: process.env.AWS_QUEUE_URL_DEVOLVE_RESERVA_PRODUTO, // replace with your SQS queue URL
  MessageGroupId:'1',
  MessageDeduplicationId:'1'
};
sendMessage(paramsMsgDevolveProdutos);*/

export default app;