/* eslint-disable linebreak-style */
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
//import productController from "../src/controllers/productController.js";
import sendMessage from "./addMsgToFila.js";
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

// Configure receiveMessage command parameters
const params = {
  QueueUrl: process.env.AWS_QUEUE_URL_RESERVA_PRODUTO,
  //MaxNumberOfMessages: 10 // Maximum number of messages to retrieve
  MaxNumberOfMessages: 1, // máximo de 1 mensagem por vez
  VisibilityTimeout: 10, // tempo para processar a mensagem (em segundos)
  WaitTimeSeconds: 3, // tempo de espera para novas mensagens (em segundos)
};

// Função para receber e processar mensagens continuamente
//const receiveMessages = async () => {
export default async function receiveMessages (){
  while (true) {
    try {
      const data = await sqsClient.receiveMessage({
        QueueUrl: process.env.AWS_QUEUE_URL_RESERVA_PRODUTO,
        MaxNumberOfMessages: 1,
        VisibilityTimeout: 10,
        WaitTimeSeconds: 3,
      }).promise();

      if (data.Messages) {
        // Processar cada mensagem recebida
        for (const message of data.Messages) {
          console.log('Mensagem recebida:', message.Body);
          // Processar a mensagem conforme necessário
          let produtos_solicitados = [];

          JSON.parse(message.Body).productIds.forEach(produto => {
            //add produto solicitado, qtd e estoque status (1) tem (2)
            let consultaPromise =consultaProduto(produto.id, produto.qtd).then(retorno => {
              console.log('Resultado da consulta:', retorno);

              // Aqui você pode continuar com o uso de 'retorno'
              return {
                idproduto: retorno.idproduto,
                qtd: retorno.quantity,
                temEstoque: retorno.temEstoque
              };
            })
              .catch(error => {
                console.error('Erro ao consultar o produto:', error);
                // Tratar erros caso ocorram
                return {
                  idproduto: produto.id, // ou outro valor padrão
                  qtd: produto.qtd,
                  temEstoque: 0 // ou outro valor que indique erro/falta de estoque
                };
              });
            // Adicionar a Promise ao array de Promises
            produtos_solicitados.push(consultaPromise);
          });
          //console.log('Mensagem para array: ',produtos_solicitados);
          // Aguardar a conclusão de todas as Promises com Promise.all
          Promise.all(produtos_solicitados)
            .then(resultados => {
              // resultados é um array com os objetos retornados por cada consulta
              //console.log('Array preenchido:', resultados);
              const encontrouSemEstoque = resultados.some(produto => produto.temEstoque === 0);

              if (encontrouSemEstoque) {
                console.log('Existem produtos sem estoque.');
                //POSTA NA FILA DE SEM ESTOQUE DO SERVICO DE ORDER DA BRUNA
                //ID DA REQUEST E STATUS
                const paramsMsgSemEstoque = {
                  MessageBody: JSON.stringify({
                    idorder: JSON.parse(message.Body).idorder,
                    obs: 'Um ou mais produtos sem estoque'
                  }),
                  QueueUrl: process.env.AWS_QUEUE_URL_SEM_ESTOQUE_PRODUTO,
                  MessageGroupId:'1',
                  MessageDeduplicationId: JSON.parse(message.Body).idorder
                };
                sendMessage(paramsMsgSemEstoque);

              } else {
                console.log('Todos os produtos têm estoque.');
                resultados.forEach(produtos => {
                  updateEstoque(produtos.idproduto, produtos.qtd);
                });
                //POSTA NA FILA DE PRODUTOS RESERVADOS COM SUCESSO
                const paramsMsgSemEstoque = {
                  MessageBody: JSON.stringify({
                    idorder: JSON.parse(message.Body).idorder,
                    obs: 'Produtos reservados com sucesso'
                  }),
                  QueueUrl: process.env.AWS_QUEUE_URL_PRODUTOS_RESERVADOS,
                  MessageGroupId:'1',
                  MessageDeduplicationId: JSON.parse(message.Body).idorder
                };
                sendMessage(paramsMsgSemEstoque);

              }
              console.log('fim consultas!!!');
              // Aqui você pode continuar com outras operações após todas as consultas
            })
            .catch(error => {
              console.error('Erro ao processar consultas de produtos para reserva:', error);
              // Tratar erros caso ocorram durante Promise.all
            });
          // Deletar a mensagem da fila
          await sqsClient.deleteMessage({
            QueueUrl: process.env.AWS_QUEUE_URL_RESERVA_PRODUTO,
            ReceiptHandle: message.ReceiptHandle,
          }).promise();
          console.log('Mensagem processada e deletada de produtos para reserva.');

        }
      } else {
        console.log('Nenhuma mensagem disponível na fila de produtos para reserva.');
      }
    } catch (err) {
      console.error('Erro ao receber ou deletar mensagem de produtos para reserva:', err);
    }
  }
};

// Function to delete a message from the queue
export async function deleteMessage(receiptHandle) {
  try {
    const deleteParams = {
      QueueUrl: process.env.AWS_QUEUE_URL_RESERVA_PRODUTO,
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
  //Define the base URL of your API
  const baseURL ='http://localhost:3000/product/'+idproduto;
  // Function to fetch product by ID

  try {
    //const response = await axios.get(`${baseURL}/${idproduto}`);
    const response = await axios.get(`${baseURL}`);
    let product = (response.data);
    console.log(product);
    //console.log(`Product ID: ${product.id}, Product Name: ${product.productName}, Quantity: ${product.quantity}`);
    console.log('solicitada:',qtd_solicitada)
    if(product[0].quantity > qtd_solicitada){
    //if(product[0].quantity > qtd_solicitada){
      console.log(idproduto +': tem estoque');
      //ATUALIZA STATUS
      const putData = {
        productName: product[0].productName,
        category: product[0].category_id,
        quantity: product[0].quantity - qtd_solicitada,
        price: product[0].price
      };
      console.log('update data', putData);
      //---ATUALIZA ESTOQUE API
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

    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up the request:', error.message);
      //throw new Error('Failed to send request');
      resultado=0;
    }
  }
  return resultado;
}

export async function consultaProduto(idproduto, qtd_solicitada) {
  //let resultado = 0;
  //Define the base URL of your API
  const baseURL ='http://localhost:3000/product/'+idproduto;
  let putData={};
  // Function to fetch product by ID
  try {
    //const response = await axios.get(`${baseURL}/${idproduto}`);
    const response = await axios.get(`${baseURL}`);
    let product = (response.data);
    //console.log(product);
    //console.log(`Product ID: ${product.id}, Product Name: ${product.productName}, Quantity: ${product.quantity}`);
    if(product[0].quantity > qtd_solicitada){
      //console.log(idproduto +': tem estoque');
      //ATUALIZA STATUS
      putData = {
        idproduto: idproduto,
        //quantity: product[0].quantity - qtd_solicitada,
        quantity: qtd_solicitada,
        temEstoque:1
      };
      //console.log( 'put data',putData);
    }
    else{
      console.log(idproduto +': não tem estoque');
      putData = {
        idproduto: idproduto,
        quantity: product[0].quantity,
        temEstoque:0
      };
      //console.log(putData);
    }
  } catch (error) {
    if (error.response) {
      console.log(idproduto +': Não encontrado');
      putData = {
        idproduto: idproduto,
        quantity: 0,
        temEstoque:0
      };
      //resultado=0;
    }
    else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up the request:', error.message);
      putData = {
        idproduto: idproduto,
        quantity: 0,
        temEstoque:0
      };
      //throw new Error('Failed to send request');
    }
  }
  return putData;
}