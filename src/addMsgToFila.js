/* eslint-disable linebreak-style */
//import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import AWS from 'aws-sdk';

// Set up AWS credentials and region if not already configured

AWS.config.update({
  region:  'us-east-1',
  accessKeyId:  process.env.AWS_CREDENTIALS_ACCESSKEY,
  secretAccessKey: process.env.AWS_CREDENTIALS_SECRETKEY,
  sessionToken:  process.env.AWS_CREDENTIALS_SESSIONTOKEN
});

// Crie um objeto SQS
const sqsClient = new AWS.SQS({ apiVersion: '2012-11-05' });
/*const paramsMsg = {
  MessageBody: 'Hello from Node.js!',
  QueueUrl: QUEUE_URL, // replace with your SQS queue URL
};
sendMessage(paramsMsg);*/
// Função para receber e processar mensagens continuamente
//const receiveMessages = async () => {
export default async function sendMessage (paramsMsgTo){
  sqsClient.sendMessage(paramsMsgTo, (err, data) => {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('Success', data.MessageId);
    }
  });
};
