import express from "express";
import routes from "./web/index.js";
import sendMessage from "./addMsgToFila.js";
import receiveMessages from "./listaMsgFila.js";

const app = express();
app.use(express.json());

routes(app, express);


// SQS processo de recebimento de mensagens
receiveMessages();

//Send Message
const paramsMsg = {
  //MessageBody: 'Hello from Node.js!',
  MessageBody: JSON.stringify({
    idorder: '99',
    obs: 'pedido novo',
    productIds: [{
      id:1,
      qtd:2
    }, {
      id:2,
      qtd:103
    }]
  }),
  QueueUrl: process.env.AWS_QUEUE_URL, // replace with your SQS queue URL
  MessageGroupId:'1',
  MessageDeduplicationId:'3'
};
sendMessage(paramsMsg);

export default app;