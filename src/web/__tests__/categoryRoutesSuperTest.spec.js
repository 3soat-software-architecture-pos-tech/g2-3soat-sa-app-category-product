import express from 'express';
import supertest from 'supertest';
import categoryRoutes from '../categoryRoutes.js';
import categoryController from '../../controllers/categoryController.js';

// Mock categoryController
jest.mock('../controllers/categoryController.js', () => {
  return jest.fn(() => ({
    fetchAllCategory: jest.fn(),
    fetchCategoryById: jest.fn(),
    addNewCategory: jest.fn(),
    updateCategoryById: jest.fn(),
    deleteCategoryById: jest.fn(),
  }));
});

// Mock express Router
const mockRouter = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  route: jest.fn(() => mockRouter),
};

jest.mock('express', () => {
  return {
    Router: jest.fn(() => mockRouter),
  };
});

describe('Category Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should define GET endpoint to list all categories', async () => {
    categoryRoutes(express);
    expect(mockRouter.get).toHaveBeenCalledWith('/', expect.any(Function));
  });

  it('should define GET endpoint to get category by ID', async () => {
    categoryRoutes(express);
    expect(mockRouter.get).toHaveBeenCalledWith('/:id', expect.any(Function));
  });

  it('should define POST endpoint to add category', async () => {
    categoryRoutes(express);
    expect(mockRouter.post).toHaveBeenCalledWith('/', expect.any(Function));
  });

  it('should define PUT endpoint to update category by ID', async () => {
    categoryRoutes(express);
    expect(mockRouter.put).toHaveBeenCalledWith('/:id', expect.any(Function));
  });

  it('should define DELETE endpoint to delete category by ID', async () => {
    categoryRoutes(express);
    expect(mockRouter.delete).toHaveBeenCalledWith('/:id', expect.any(Function));
  });

  // You can add more detailed tests for each endpoint if needed
});
