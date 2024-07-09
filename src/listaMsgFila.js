/* eslint-disable linebreak-style */
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import productController from "../src/controllers/productController.js";
import AWS from 'aws-sdk';
import axios from 'axios';
import { response } from "express";


const QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/009086566538/teste_fila.fifo';
// Set up AWS credentials and region if not already configured

AWS.config.update({
  region:  'us-east-1',
  accessKeyId:  process.env.AWS_CREDENTIALS_ACCESSKEY,
  secretAccessKey: process.env.AWS_CREDENTIALS_SECRETKEY,
  sessionToken:  process.env.AWS_CREDENTIALS_SESSIONTOKEN
});

/*AWS.config.update({
    accessKeyId: process.env.AWS_CREDENTIALS_ACCESSKEY,
    secretAccessKey: process.env.AWS_CREDENTIALS_SECRETKEY,
    //region: process.env.AWS_CREDENTIALS_REGION,
    sessionToken: process.env.AWS_CREDENTIALS_SESSIONTOKEN
});*/


// Create SQS client
//const sqsClient = new SQSClient({ region: process.env.AWS_CREDENTIALS_REGION });

// Crie um objeto SQS
const sqsClient = new AWS.SQS({ apiVersion: '2012-11-05' });

// Configure receiveMessage command parameters
const params = {
  QueueUrl: QUEUE_URL,
  //MaxNumberOfMessages: 10 // Maximum number of messages to retrieve
  MaxNumberOfMessages: 1, // máximo de 1 mensagem por vez
  VisibilityTimeout: 10, // tempo para processar a mensagem (em segundos)
  WaitTimeSeconds: 3, // tempo de espera para novas mensagens (em segundos)
};

/*export default async function receiveMessages() {
  try {
    const data = await sqsClient.send(new ReceiveMessageCommand(params));

    if (data.Messages) {
      data.Messages.forEach(message => {
        const orderToUpdate = message?.Body?.external_reference;

        if (orderToUpdate) {
          //updateStatusById(orderToUpdate, 'payment_received')
          console.log(orderToUpdate);
          console.log("leitura");
          deleteMessage(message);
          receiveMessages();
        }
      });
    } else {
      console.log("No messages available");
      //---receiveMessages();
    }
  } catch (err) {
    console.error("Error receiving messages:", err);
  }
}*/

/*export default async function receiveMessages () {
  try {
    const data = await sqsClient.receiveMessage({
      QueueUrl: QUEUE_URL,
      MaxNumberOfMessages: 1, // máximo de 1 mensagem por vez
      VisibilityTimeout: 10, // tempo para processar a mensagem (em segundos)
      WaitTimeSeconds: 3, // tempo de espera para novas mensagens (em segundos)
    }).promise();

    if (!data.Messages) {
      console.log('Nenhuma mensagem disponível na fila.');
      return;
    }

    // Processar a mensagem
    const message = data.Messages[0];
    console.log('Mensagem recebida:', message);

    // Aqui você processaria a mensagem conforme necessário

    // Deletar a mensagem da fila
    await sqsClient.deleteMessage({
      QueueUrl: QUEUE_URL,
      ReceiptHandle: message.ReceiptHandle,
    }).promise();

    console.log('Mensagem deletada com sucesso.');
  } catch (err) {
    console.error('Erro ao receber ou deletar mensagem:', err);
  }
};*/

// Função para receber e processar mensagens continuamente
//const receiveMessages = async () => {
export default async function receiveMessages (){
  while (true) {
    try {
      const data = await sqsClient.receiveMessage({
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 1,
        VisibilityTimeout: 10,
        WaitTimeSeconds: 3,
      }).promise();

      if (data.Messages) {
        // Processar cada mensagem recebida
        for (const message of data.Messages) {
          console.log('Mensagem recebida:', message.Body);
          // Processar a mensagem conforme necessário
          //updateEstoque();
          // Using forEach method
          //console.log(message.Body);
          JSON.parse(message.Body).productIds.forEach(produto => {
            console.log('resultado:' + updateEstoque(produto.id, produto.qtd));
          });

          // Deletar a mensagem da fila
          await sqsClient.deleteMessage({
            QueueUrl: QUEUE_URL,
            ReceiptHandle: message.ReceiptHandle,
          }).promise();

          console.log('Mensagem processada e deletada.');
        }
      } else {
        console.log('Nenhuma mensagem disponível na fila.');
      }
    } catch (err) {
      console.error('Erro ao receber ou deletar mensagem:', err);
    }
  }
};

// Function to delete a message from the queue
export async function deleteMessage(receiptHandle) {
  try {
    const deleteParams = {
      QueueUrl: QUEUE_URL,
      ReceiptHandle: receiptHandle
    };
    const deleteCommand = new DeleteMessageCommand(deleteParams);
    await sqsClient.send(deleteCommand);
    console.log("Message deleted successfully");
    receiveMessages();
  } catch (err) {
    console.error("Error deleting message:", err);
  }
}

export async function updateEstoque(idproduto, qtd_solicitada) {
  let resultado = 0;
  /*productController().fetchProductById(idproduto)
    .then(product => {
      console.log('Product:', product);
    })
    .catch(error => {
      console.error('Error fetching product:', error.message);
    });*/

  //Define the base URL of your API
  const baseURL_ = 'http://localhost:3000/api/products'; // Replace with your actual API base URL
  const baseURL ='http://localhost:3000/product/'+idproduto;
  // Function to fetch product by ID

  try {
    //const response = await axios.get(`${baseURL}/${idproduto}`);
    const response = await axios.get(`${baseURL}`);
    let product = (response.data);
    console.log(product);
    //console.log(`Product ID: ${product.id}, Product Name: ${product.productName}, Quantity: ${product.quantity}`);
    if(product[0].quantity > qtd_solicitada){
      console.log(idproduto +': tem estoque');
      //ATUALIZA STATUS
      const putData = {
        productName: product[0].productName,
        category: product[0].category_id,
        quantity: product[0].quantity - qtd_solicitada,
        price: product[0].price
      };
      console.log(putData);
      await axios.put(baseURL, putData)
        .then(response => {
          console.log('PUT Request Successful:', response.data);
          // Handle response data as needed
          resultado =1;
        })
        .catch(error => {
          console.error('PUT Request Error:', error.message);
          resultado=0;
          // Handle error
        });
    }
    else{
      console.log(idproduto +': não tem estoque');
      resultado=0;
    }
  } catch (error) {
    if (error.response) {
      console.log(idproduto +': Não encontrado');
      resultado=0;
      //console.log(error.response);
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      //console.error('Request failed with status code:', error.response.status);
      //throw new Error(error.response.data.error || 'Something went wrong');
    } /*else if (error.request) {
      // The request was made but no response was received
      console.error('Request made but no response received:', error.request);
      throw new Error('No response received from server');
    }*/ else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up the request:', error.message);
      //throw new Error('Failed to send request');
      resultado=0;
    }
  }
  return resultado;
}