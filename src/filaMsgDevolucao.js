/* eslint-disable linebreak-style */
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import AWS from 'aws-sdk';
import axios from 'axios';

// Set up AWS credentials and region if not already configured

AWS.config.update({
  region:  'us-east-1',
  accessKeyId:  process.env.AWS_CREDENTIALS_ACCESSKEY,
  secretAccessKey: process.env.AWS_CREDENTIALS_SECRETKEY,
  sessionToken:  process.env.AWS_CREDENTIALS_SESSIONTOKEN
});

// Create SQS client
//const sqsClient = new SQSClient({ region: process.env.AWS_CREDENTIALS_REGION });

// Crie um objeto SQS
const sqsClient = new AWS.SQS({ apiVersion: '2012-11-05' });


// Função para receber e processar mensagens continuamente
//const receiveMessages = async () => {
export default async function receiveMessagesDevolvidos (){
  while (true) {
    try {
      const data = await sqsClient.receiveMessage({
        QueueUrl: process.env.AWS_QUEUE_URL_DEVOLVE_RESERVA_PRODUTO,
        MaxNumberOfMessages: 1,
        VisibilityTimeout: 10,
        WaitTimeSeconds: 3,
      }).promise();

      if (data.Messages) {
        // Processar cada mensagem recebida
        for (const message of data.Messages) {
          console.log('Mensagem recebida:', message.Body);
          // Processar a mensagem conforme necessário

          JSON.parse(message.Body).productIds.forEach(produto => {
            //add produto solicitado, qtd e estoque status (1) tem (2)
            //produto.id, produto.qtd
            updateEstoque(produto.id, produto.qtd);
          });
          //console.log('Mensagem para array: ',produtos_solicitados);

          // Deletar a mensagem da fila
          await sqsClient.deleteMessage({
            QueueUrl: process.env.AWS_QUEUE_URL_DEVOLVE_RESERVA_PRODUTO,
            ReceiptHandle: message.ReceiptHandle,
          }).promise();
          console.log('Mensagem processada e deletada de produtos devolvidos.');
        }
      } else {
        console.log('Nenhuma mensagem disponível na fila de produtos devolvidos.');
      }
    } catch (err) {
      console.error('Erro ao receber ou deletar mensagem de produtos devolvidos:', err);
    }
  }
};

// Function to delete a message from the queue
export async function deleteMessage(receiptHandle) {
  try {
    const deleteParams = {
      QueueUrl: process.env.AWS_QUEUE_URL_DEVOLVE_RESERVA_PRODUTO,
      ReceiptHandle: receiptHandle
    };
    const deleteCommand = new DeleteMessageCommand(deleteParams);
    await sqsClient.send(deleteCommand);
    console.log("Message deleted successfully");
    receiveMessagesDevolvidos();
  } catch (err) {
    console.error("Error deleting message:", err);
  }
}

export async function updateEstoque(idproduto, qtd_solicitada) {
  let resultado = 0;
  //Define the base URL of your API
  const baseURL ='http://localhost:3000/product/'+idproduto;
  // Function to fetch product by ID

  try {
    //const response = await axios.get(`${baseURL}/${idproduto}`);
    const response = await axios.get(`${baseURL}`);
    let product = (response.data);
    console.log(product);
    //console.log(`Product ID: ${product.id}, Product Name: ${product.productName}, Quantity: ${product.quantity}`);
    console.log('Quantidade a devolver:',qtd_solicitada)

    //ATUALIZA  ESTOQUE
    const putData = {
      productName: product[0].productName,
      category: product[0].category_id,
      quantity: product[0].quantity + qtd_solicitada,
      price: product[0].price
    };
    console.log('update data', putData);
    //---ATUALIZA ESTOQUE API
    await axios.put(baseURL, putData)
      .then(response => {
        console.log('Product Request Successful:', response.data);
        // Handle response data as needed
        resultado =1;
      })
      .catch(error => {
        console.error('Product Request Error:', error.message);
        resultado=0;
        // Handle error
      });

  } catch (error) {
    if (error.response) {
      console.log('Produto ID:'+idproduto +': não encontrado');
      resultado=0;
    }
    else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up the request:', error.message);
      //throw new Error('Failed to send request');
      resultado=0;
    }
  }
  return resultado;
}