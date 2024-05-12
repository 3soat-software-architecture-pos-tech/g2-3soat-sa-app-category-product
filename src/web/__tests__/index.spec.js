import express from "express";
//import bodyParser from "body-parser";
import routes from "../index.js";
import categoryRoutes from "../categoryRoutes.js";
import swaggerUI from 'swagger-ui-express';
import swaggerFile from '../../../swagger-output.json' assert { type: "json" };
import connectDatabaseMySql from '../../config/dbConnectMysql.js';


// Mocking the behavior of categoryRoutes
jest.mock("../categoryRoutes.js", () => jest.fn());
// Mocking swaggerUI
jest.mock('swagger-ui-express', () => {
  return jest.fn();
});
// Mocking swaggerFile
jest.mock('../../../swagger-output.json', () => {
  return { type: "json" };
});
describe("Routes", () => {
  let app;

  beforeEach(() => {
    app = express();
    jest.clearAllMocks();
  });

  /*it("should apply bodyParser.json() middleware to the Express app", () => {
    const mockUse = jest.spyOn(app, "use");
    routes(app, express);
    expect(mockUse).toHaveBeenCalledWith(bodyParser.json());
  });*/

  it("should apply categoryRoutes to '/category' route", () => {
    const mockCategoryRoutes = jest.fn();
    const mockApp = {
      use: jest.fn()
    };
    categoryRoutes.mockReturnValue(mockCategoryRoutes);

    // Pass the mock app object instead of express
  routes(mockApp, express);
  //routes(app, express);
  
  expect(categoryRoutes).toHaveBeenCalledWith(express);
  
  // Check if app.use is called with the expected arguments
  expect(mockApp.use).toHaveBeenCalledWith("/category", mockCategoryRoutes);
  
    /*expect(categoryRoutes).toHaveBeenCalledWith(express);
    expect(app.use).toHaveBeenCalledWith("/category", mockCategoryRoutes);*/
  });
});
