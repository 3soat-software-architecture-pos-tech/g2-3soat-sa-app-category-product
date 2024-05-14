import request from 'supertest';
import {
  describe, expect, it, jest,
} from '@jest/globals';
import app from '../../app.js';
// Import and configure dotenv
import dotenv from 'dotenv';
dotenv.config();
//import "dotenv";
//import "../../config/dbConnectMysql.js"

let server;

/*beforeAll((done) => {
  //server = app.listen(3000);
  //const port = process.env.PORT || 3000;
  server = app.listen(3000, (err) => {
    if (err) return done(err);
    done();
  });
});*/

beforeEach(() => {
  const port = 3000;
  server = app.listen(port);
});

afterEach(() => {
  server.close();
});
/*afterAll((done) => {
  //server.close();
  server.close((err) => {
    if (err) return done(err);
    done();
  });
});*/


describe('GET em /categorias', () => {
  console.log(process.env.DB_USER);
  
  it('Deve retornar uma lista de categorias', async () => {
    const resposta = await request(app)
      .get('/category')
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      //.expect(200);
    console.log(resposta.body);
    expect(resposta.text).toEqual('{"message":"Sistema de pedidos"}');
  });
});
/*
let idResposta;
describe('POST em /editoras', () => {
  it('Deve adicionar uma nova editora', async () => {
    const resposta = await request(app)
      .post('/editoras')
      .send({
        nome: 'CDC',
        cidade: 'Sao Paulo',
        email: 's@s.com',
      })
      .expect(201);

    idResposta = resposta.body.content.id;
  });
  it('Deve nao adicionar nada ao passar o body vazio', async () => {
    await request(app)
      .post('/editoras')
      .send({})
      .expect(400);
  });
});

describe('GET em /editoras/id', () => {
  it('Deve retornar recurso selecionado', async () => {
    await request(app)
      .get(`/editoras/${idResposta}`)
      .expect(200);
  });
});

describe('PUT em /editoras/id', () => {
  test.each([
    ['nome', { nome: 'Casa do Codigo' }],
    ['cidade', { cidade: 'SP' }],
    ['email', { email: 'cdc@cdc.com' }],
  ])('Deve alterar o campo %s', async (chave, param) => {
    const requisicao = { request };
    const spy = jest.spyOn(requisicao, 'request');
    await requisicao.request(app)
      .put(`/editoras/${idResposta}`)
      .send(param)
      .expect(204);

    expect(spy).toHaveBeenCalled();
  });
});

describe('DELETE em /editoras/id', () => {
  it('Deletar o recurso adcionado', async () => {
    await request(app)
      .delete(`/editoras/${idResposta}`)
      .expect(200);
  });
});*/