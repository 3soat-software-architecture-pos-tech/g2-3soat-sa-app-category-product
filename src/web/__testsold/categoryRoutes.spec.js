import categoryRoutes from '../../web/categoryRoutes.js';
import categoryController from '../../controllers/categoryController.js';
import express from 'express';
import supertest from 'supertest';
import bodyParser from "body-parser";
import app from '../../app.js';

jest.mock('../../controllers/categoryController.js');

describe('categoryRoutes', () => {
  let app;
  let route;
  let server;

  beforeEach(() => {
    const port = 3000;
    server = app.listen(port);
    app.use(bodyParser.json());
  });
  /*beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    route = express.Router();
    const port = 3000;
    server = app.listen(port);
    //app.use(express.json());
  });*/

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET / should call fetchAllCategory controller method', async () => {
    const mockFetchAllCategory = jest.fn();
    // router.route('/').get(controller.fetchAllCategory
    categoryController.mockReturnValue({ fetchAllCategory: mockFetchAllCategory });

    categoryRoutes(app);

    await supertest(app).route('/').get(categoryController().fetchAllCategory);

    expect(mockFetchAllCategory).toHaveBeenCalled();
  });

  it('Deve retornar uma lista de categorias', async () => {
    const resposta = await supertest(app)
      .get('/category')
      .set('Accept', 'application/json')
      //.expect('content-type', /json/)
      .expect(200);

    expect(resposta.body[0].email).toEqual();
  });

  // Write similar tests for the other routes (GET /:id, POST /, PUT /:id, DELETE /:id)
});
