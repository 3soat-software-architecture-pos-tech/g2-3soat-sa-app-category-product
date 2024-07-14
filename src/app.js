import express from "express";
import routes from "./web/index.js";
import sendMessage from "./addMsgToFila.js";
import receiveMessages from "./filaMsgReservaProdutos.js";
import receiveMessagesDevolvidos from "./filaMsgDevolucao.js";

const app = express();
app.use(express.json());

routes(app, express);


// SQS processo de recebimento de mensagens
receiveMessages();
receiveMessagesDevolvidos();
//Send Message
const paramsMsgReservaProdutos = {
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
sendMessage(paramsMsgDevolveProdutos);

export default app;