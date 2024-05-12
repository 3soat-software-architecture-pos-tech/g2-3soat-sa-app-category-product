import routes from '../../web/index.js'; // Assuming this is the file containing the routes function
import categoryRoutes from '../categoryRoutes.js';
import productRoutes from '../productRoutes.js';
import swaggerUI from 'swagger-ui-express';
//import swaggerFile from '../../swagger-output.json';
import express from 'express';

jest.mock('../categoryRoutes');
jest.mock('../productRoutes');
jest.mock('swagger-ui-express');

describe('routes', () => {
  let app;

  beforeEach(() => {
    app = express();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set up category and product routes', () => {
    routes(app, express);

    expect(categoryRoutes).toHaveBeenCalledWith(express);
    expect(productRoutes).toHaveBeenCalledWith(express);
    expect(app.use).toHaveBeenCalledWith('/category', expect.any(Function));
    expect(app.use).toHaveBeenCalledWith('/product', expect.any(Function));
  });

  /*it('should set up Swagger documentation', () => {
    routes(app, express);

    expect(swaggerUI.serve).toHaveBeenCalled();
    expect(swaggerUI.setup).toHaveBeenCalledWith(swaggerFile);
    expect(app.use).toHaveBeenCalledWith('/docs', expect.any(Function), expect.any(Function));
  });*/
});
