import productController from '../productController.js';
import useCaseCreate from '../../use_cases/product/add.js';
import useCasegetAll from '../../use_cases/product/getAll.js';
import useCaseFindById from '../../use_cases/product/findById.js';
import useCasedelete from '../../use_cases/product/deleteById.js';
//import useCaseUpdateById from '../../use_cases/product/updateById.js';
import useCaseUpdateById from '../../use_cases/product/updateById.js'

// Mocking use case functions
jest.mock('../../use_cases/product/add.js');
jest.mock('../../use_cases/product/getAll.js');
jest.mock('../../use_cases/product/findById.js');
jest.mock('../../use_cases/product/deleteById.js');
jest.mock('../../use_cases/product/updateById.js');

// Mock the product module
jest.mock('../../entities/product', () => {
  return jest.fn(() => ({
    getProductName: jest.fn(),
    getCategory: jest.fn(),
    getPrice: jest.fn(),
    getQuantity: jest.fn(),
    getCreatedAt: jest.fn(),
    getUpdatedAt: jest.fn()
  }));
});
describe('product Controller', () => {
  // Mock request, response, and next function

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Add new product', () => {
    it('should handle error during product creation', async () => {
      // Mock request body
      const req = {
        body: {
          category: 'Invalid product', // This could trigger an error in your use case
          Product: '1'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(), // Mocking res.status to return itself for chaining
        json: jest.fn()
      };
      const next = jest.fn();
      // Mock useCaseCreate function to throw an error
      const errorMessage = 'Product creation failed';

      useCaseCreate.mockRejectedValueOnce(new Error(errorMessage));
      // Call controller function
      await productController().addNewProduct(req, res, next);

      // Assertions
      expect(useCaseCreate).toHaveBeenCalledTimes(1);

      expect(res.status).toHaveBeenCalledWith(400);

      expect(res.json).toHaveBeenCalledWith(errorMessage);
      //expect(next).not.toHaveBeenCalled();
    });

    it('should add a new product successfully', async () => {
      const req = { body: { category: '0Test product', Product: '1' } };

      const next = jest.fn();
      const objetoProduct = {
        category: '1',
        Product: 'Sao Paulo',
        createdAt: '2024-01-01 00:00',
        updatedAt: '2024-01-01 00:00',
      };
        //const categorydata = new product(objetoProduct);
      const res = { status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };

      useCaseCreate.mockResolvedValueOnce(objetoProduct);

      await productController().addNewProduct(req, res, next);
      expect(useCaseCreate).toHaveBeenCalledTimes(1);
      //expect(aa).toHaveBeenCalledWith(new product({objetoProduct}));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(objetoProduct);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle pending product creation', async () => {
      // Mock request body
      const req = {
        body: {
          category: '', // This could trigger an error in your use case
          Product: 'Test Product'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(), // Mocking res.status to return itself for chaining
        json: jest.fn()
      };
      const next = jest.fn();
      // Mock useCaseCreate function to throw an error
      const errorMessage = 'product creation failed';

      useCaseCreate.mockRejectedValueOnce(new Error(errorMessage));
      // Call controller function
      await productController().addNewProduct(req, res, next);

      // Assertions
      expect(useCaseCreate).toHaveBeenCalledTimes(1);

      expect(res.status).toHaveBeenCalledWith(400);

      expect(res.json).toHaveBeenCalledWith(errorMessage);
      //expect(next).not.toHaveBeenCalled();
    });

  });

  describe('Update product', () => {

    it('should handle error during update product', async () => {
    // Mock request body
      const req = {
        params:{
          id:1,
        },
        body: {
          category: 'Test product', // This could trigger an error in your use case
          Product: '1'
        },

      };
      const res = {
        status: jest.fn().mockReturnThis(), // Mocking res.status to return itself for chaining
        json: jest.fn()
      };
      const next = jest.fn();
      // Mock useCaseCreate function to throw an error
      const errorMessage = 'Product update failed';
      useCaseUpdateById.mockRejectedValueOnce(new Error(errorMessage));
      // Call controller function
      await productController().updateProductById(req, res, next);

      // Assertions
      expect(useCaseUpdateById).toHaveBeenCalledTimes(1);

      expect(res.status).toHaveBeenCalledWith(400);

      expect(res.json).toHaveBeenCalledWith(errorMessage);
    //expect(next).not.toHaveBeenCalled();
    });

    // Test case for updateProductById
    it('updateProductById should update a product by ID', async () => {
      const req = { params: { id: '1' }, body: { category: 'Updated product', Product: 'Updated Product' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
      const next = jest.fn();
      const objetoProduct = {
        id: '1',
        category: 'CDC',
        Product: '1',
        createdAt: '2024-01-01 00:00',
        updatedAt: '2024-01-01 00:00',
      };
      useCaseUpdateById.mockResolvedValueOnce(objetoProduct);
      await productController().updateProductById(req, res, next);
      expect(useCaseUpdateById).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith('Product Updated'); // expect.any(Object)Assuming you're returning a success message
    });

    // Test case for updateProductById
    it('should return product not found', async () => {
      const req = { params: { id: '1' }, body: { category: 'Updated product', Product: 'Updated Product' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
      const next = jest.fn();
      const objetoProduct = {
        id: '2',
        category: 'CDC',
        Product: '1',
        createdAt: '2024-01-01 00:00',
        updatedAt: '2024-01-01 00:00',
      };
      useCaseUpdateById.mockResolvedValueOnce({ rowUpdate: 0 });
      await productController().updateProductById(req, res, next);
      expect(useCaseUpdateById).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith('No product found'); // expect.any(Object)Assuming you're returning a success message
    });
  });

  describe('Delete product', () => {

    it('should handle error during delete product', async () => {
      // Mock request body
      const req = {
        params:{
          id:1,
        },
        body: {
          category: 'Test product', // This could trigger an error in your use case
          Product: '1'
        },

      };
      const res = {
        status: jest.fn().mockReturnThis(), // Mocking res.status to return itself for chaining
        json: jest.fn()
      };
      const next = jest.fn();
      // Mock useCaseCreate function to throw an error
      const errorMessage = 'Product delete failed';
      useCasedelete.mockRejectedValueOnce(new Error(errorMessage));
      // Call controller function
      await productController().deleteProductById(req, res, next);

      // Assertions
      expect(useCasedelete).toHaveBeenCalledTimes(1);

      expect(res.status).toHaveBeenCalledWith(400);

      expect(res.json).toHaveBeenCalledWith(errorMessage);
      //expect(next).not.toHaveBeenCalled();
    });

    // Test case for updateProductById
    it('should delete a product by ID', async () => {
      const req = { params: { id: '1' }, body: { category: 'Delete product', Product: '1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
      const next = jest.fn();
      const objetoProduct = {
        id: '1',
        category: 'CDC',
        Product: '1',
        createdAt: '2024-01-01 00:00',
        updatedAt: '2024-01-01 00:00',
      };
      useCasedelete.mockResolvedValueOnce(objetoProduct);
      await productController().deleteProductById(req, res, next);
      expect(useCasedelete).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith('Product deleted'); // expect.any(Object)Assuming you're returning a success message
    });

    // Test case for updateProductById
    it('should return product not found', async () => {
      const req = { params: { id: '1' }, body: { product: 'Delete product', category: '1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
      const next = jest.fn();
      const objetoProduct = {
        id: '2',
        productName: 'CDC',
        Product: '1',
        createdAt: '2024-01-01 00:00',
        updatedAt: '2024-01-01 00:00',
      };
      useCasedelete.mockResolvedValueOnce({ rowUpdate: 0 });
      await productController().deleteProductById(req, res, next);
      expect(useCasedelete).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith('No product found'); // expect.any(Object)Assuming you're returning a success message
    });
  });

  describe('Find product by ID', () => {

    it('should handle error during find product', async () => {
      // Mock request body
      const req = {
        params:{
          id:1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(), // Mocking res.status to return itself for chaining
        json: jest.fn()
      };
      const next = jest.fn();
      // Mock useCaseCreate function to throw an error
      const errorMessage = 'product Find failed';
      useCaseFindById.mockRejectedValueOnce(new Error(errorMessage));
      // Call controller function
      await productController().fetchProductById(req, res, next);

      // Assertions
      expect(useCaseFindById).toHaveBeenCalledTimes(1);

      expect(res.status).toHaveBeenCalledWith(400);

      expect(res.json).toHaveBeenCalledWith(errorMessage);
      //expect(next).not.toHaveBeenCalled();
    });

    // Test case for findCategoryById
    it('should find a product by ID', async () => {
      const req = { params: { id: '1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
      const next = jest.fn();
      const objetoProduct = {
        id: '1',
        category: 'CDC',
        Product: 'Sao Paulo',
        createdAt: '2024-01-01 00:00',
        updatedAt: '2024-01-01 00:00',
      };
      useCaseFindById.mockResolvedValueOnce(objetoProduct);
      await productController().fetchProductById(req, res, next);
      expect(useCaseFindById).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(objetoProduct); // expect.any(Object)Assuming you're returning a success message
    });

    // Test case for findCategoryById
    it('should return product not found', async () => {
      const req = { params: { id: '1' }};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
      const next = jest.fn();
      const objetoProduct = null;
      useCaseFindById.mockResolvedValueOnce(objetoProduct);
      await productController().fetchProductById(req, res, next);
      expect(useCaseFindById).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith('No product found'); // expect.any(Object)Assuming you're returning a success message
    });
  });
  describe('Find All product', () => {
    it('should handle error during getAll product', async () => {
      // Mock request body
      const req = {
        params:{
          id:1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(), // Mocking res.status to return itself for chaining
        json: jest.fn()
      };
      const next = jest.fn();
      // Mock useCaseCreate function to throw an error
      const errorMessage = 'product get all failed';
      useCasegetAll.mockRejectedValueOnce(new Error(errorMessage));
      // Call controller function
      await productController().fetchAllProduct(req, res, next);

      // Assertions
      expect(useCasegetAll).toHaveBeenCalledTimes(1);

      expect(res.status).toHaveBeenCalledWith(400);

      expect(res.json).toHaveBeenCalledWith(errorMessage);
      //expect(next).not.toHaveBeenCalled();
    });
    //Test case for get All
    it('fetchAllCategory should fetch all categories', async () => {
      const req = {};
      const next = jest.fn();
      const objetoProduct = [{
        category: 'CDC',
        Product: 'Sao Paulo',
        createdAt: '2024-01-01 00:00',
        updatedAt: '2024-01-01 00:00',
      },{category: 'CDC',
        Product: 'Sao Paulo',
        createdAt: '2024-01-01 00:00',
        updatedAt: '2024-01-01 00:00',
      }];
      //const categorydata = new product(objetoProduct);
      const res = { status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      useCasegetAll.mockResolvedValueOnce(objetoProduct);
      await productController().fetchAllProduct(req, res, next);
      expect(useCasegetAll).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array)); // Assuming you're returning an array of categories
    });
    //Test case for get All
    it('should return product not found get All', async () => {
      const req = { params: { id: '1' }};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
      const next = jest.fn();
      const objetoProduct = null;
      useCasegetAll.mockResolvedValueOnce(objetoProduct);
      await productController().fetchAllProduct(req, res, next);
      expect(useCasegetAll).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith('No product found'); // expect.any(Object)Assuming you're returning a success message
    });
  });
});
