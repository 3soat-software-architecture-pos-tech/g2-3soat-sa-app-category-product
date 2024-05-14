import productRepositoryMySqlDB from '../productRepositoryMySqlDB.js';
import connectDatabaseMySql from '../../../../../config/dbConnectMysql.js';
// Import any necessary mock dependencies

// Mocking the db dependency
jest.mock('../../../../../config/dbConnectMysql.js', () => ({
    beginTransaction: jest.fn(),
    query: jest.fn(),
    rollback: jest.fn(),
    commit: jest.fn(),
  }));
  
  describe('productRepositoryMySqlDB', () => {
    let repository;
  
    beforeEach(() => {
      // Initialize the repository
      repository = productRepositoryMySqlDB();
    });
  
    afterEach(() => {
      jest.clearAllMocks(); // Clear mocks after each test
    });
  
    describe('Add product RepositoryMySqlDB', () => {
      it('add function adds a product', async () => {
        const productEntity = {
          getProductName: jest.fn().mockReturnValue('Test product'),
          getCategory: jest.fn().mockReturnValue('1'),
          getQuantity: jest.fn().mockReturnValue('10'),
          getPrice: jest.fn().mockReturnValue('10.00'),
        };
    
        const mockInsertId = 123;
        const mockResult = { insertId: mockInsertId };
    
        // Mocking the behavior of db functions
        connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
        connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => callback(null, mockResult));
        connectDatabaseMySql.commit.mockImplementationOnce((callback) => callback());
    
        const result = await repository.add(productEntity);
    
        expect(result).toEqual({
          "Product added ": mockInsertId,
          "product ": 'Test product',
          "category": '1',
          "quantity": '10',
          "price": '10.00'
        });
      });

      it('add function adds a product begin error', async () => {
        const productEntity = {
          getProductName: jest.fn().mockReturnValue('Test product'),
          getCategory: jest.fn().mockReturnValue('1'),
          getQuantity: jest.fn().mockReturnValue('10'),
          getPrice: jest.fn().mockReturnValue('10.00'),
        };
      
        const beginError = new Error('Begin Error');
      
        // Mocking the behavior of db functions
        connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback(beginError));
      
        try {
          await repository.add(productEntity);
          // If add function doesn't throw an error, fail the test
          expect(true).toBe(false); // Fail the test if no error is thrown
        } catch (error) {
          expect(error).toBe(beginError); // Verify that the error thrown is the same as the one passed to reject()
        }
      });
    
      it('adds a product and performs a rollback if db.query encounters an error', async () => {
        const productEntity = {
          getProductName: jest.fn().mockReturnValue('Test product'),
          getCategory: jest.fn().mockReturnValue('1'),
          getQuantity: jest.fn().mockReturnValue('10'),
          getPrice: jest.fn().mockReturnValue('10.00'),
        };
      
        const queryError = new Error('Query Error');
      
        // Mocking the behavior of db functions
        connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
        connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => {
          callback(queryError);
        });
        connectDatabaseMySql.rollback.mockImplementationOnce((callback) => callback());
      
        try {
          await repository.add(productEntity);
          // If add function doesn't throw an error, fail the test
          expect(true).toBe(false); // Fail the test if no error is thrown
        } catch (error) {
          expect(error).toBe(queryError); // Verify that the error thrown is the same as the one passed to reject()
          expect(connectDatabaseMySql.rollback).toHaveBeenCalled(); // Ensure db.rollback was called
          expect(connectDatabaseMySql.rollback.mock.calls[0][0]).toBeInstanceOf(Function); // Ensure db.rollback was called with a callback function
        }
      });
      
      it('performs a rollback if db.commit encounters an error', async () => {
        const productEntity = {
            getProductName: jest.fn().mockReturnValue('Test product'),
            getCategory: jest.fn().mockReturnValue('1'),
            getQuantity: jest.fn().mockReturnValue('10'),
            getPrice: jest.fn().mockReturnValue('10.00'),
          };
        
      
        const commitError = new Error('Commit Error');
      
        // Mocking the behavior of db functions
        connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
        connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => callback(null, { insertId: 123 }));
        connectDatabaseMySql.commit.mockImplementationOnce((callback) => callback(commitError));
        connectDatabaseMySql.rollback.mockImplementationOnce((callback) => callback());
      
        try {
          await repository.add(productEntity);
          // If add function doesn't throw an error, fail the test
          expect(true).toBe(false); // Fail the test if no error is thrown
        } catch (error) {
          expect(error).toBe(commitError); // Verify that the error thrown is the same as the one passed to reject()
          expect(connectDatabaseMySql.rollback).toHaveBeenCalled(); // Ensure db.rollback was called
          expect(connectDatabaseMySql.rollback.mock.calls[0][0]).toBeInstanceOf(Function); // Ensure db.rollback was called with a callback function
        }
      });
    });

  describe('FindAll product RepositoryMySqlDB', () => {
    it('rejects with error when db.beginTransaction encounters an error', async () => {
      const beginError = new Error('Begin Error');
    
      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback(beginError));
    
      try {
        await repository.findAll(); // Call the function under test
        // If add function doesn't throw an error, fail the test
        expect(true).toBe(false); // Fail the test if no error is thrown
      } catch (error) {
        expect(error).toBe(beginError); // Verify that the error thrown is the same as the one passed to reject()
      }
    });
    
    it('performs a rollback if db.query encounters an error during findAll', async () => {
      const queryError = new Error('Query Error');
    
      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
      connectDatabaseMySql.query.mockImplementationOnce((query, callback) => {
        callback(queryError);
      });
      connectDatabaseMySql.rollback.mockImplementationOnce((callback) => callback());
    
      try {
        await repository.findAll(); // Call the function under test
        // If findAll function doesn't throw an error, fail the test
        expect(true).toBe(false); // Fail the test if no error is thrown
      } catch (error) {
        expect(error).toBe(queryError); // Verify that the error thrown is the same as the one passed to reject()
        expect(connectDatabaseMySql.rollback).toHaveBeenCalled(); // Ensure db.rollback was called
        expect(connectDatabaseMySql.rollback.mock.calls[0][0]).toBeInstanceOf(Function); // Ensure db.rollback was called with a callback function
      }
    });
    
    it('performs a rollback if db.query encounters an error during commit findAll', async () => {
      const queryError = new Error('Query Error');
      const commitError = new Error('Commit Error');
    
      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
      connectDatabaseMySql.query.mockImplementationOnce((query, callback) => {
        callback();
      });
      connectDatabaseMySql.rollback.mockImplementationOnce((callback) => callback());
    
      // Ensure that db.rollback is called if commitError exists
      connectDatabaseMySql.commit.mockImplementationOnce((callback) => {
        callback(commitError);
      });
    
      try {
        await repository.findAll(); // Call the function under test
        // If findAll function doesn't throw an error, fail the test
        expect(true).toBe(false); // Fail the test if no error is thrown
      } catch (error) {
        //expect(error).toBe(queryError); // Verify that the error thrown is the same as the one passed to reject()
        expect(connectDatabaseMySql.rollback).toHaveBeenCalled(); // Ensure db.rollback was called
        expect(connectDatabaseMySql.rollback.mock.calls[0][0]).toBeInstanceOf(Function); // Ensure db.rollback was called with a callback function
      }
    }); 
    it('resolves with result if db.query succeeds during findAll', async () => {
      const mockResult = [{ id: 1, productName: 'product 1' }, { id: 2, productName: 'product 2' }];
    
      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
      connectDatabaseMySql.query.mockImplementationOnce((query, callback) => {
        callback(null, mockResult);
      });
      connectDatabaseMySql.commit.mockImplementationOnce((callback) => {
        callback();
      });
    
      const result = await repository.findAll(); // Call the function under test
    
      expect(result).toEqual(mockResult); // Ensure resolve was called with the expected result
    });  
    
  });

  describe('FindById product RepositoryMySqlDB', () => {
    it('rejects with error when db.beginTransaction encounters an error in findById', async () => {
      const beginError = new Error('Begin Error');
    
      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback(beginError));
    
      try {
        await repository.findById(123); // Call the function under test
        // If findById function doesn't throw an error, fail the test
        expect(true).toBe(false); // Fail the test if no error is thrown
      } catch (error) {
        expect(error).toBe(beginError); // Verify that the error thrown is the same as the one passed to reject()
      }
    });
    it('performs a rollback if db.query encounters an error during findById', async () => {
      const queryError = new Error('Query Error');
      const id = 123; // Example id
    
      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
      connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => {
        callback(queryError);
      });
      connectDatabaseMySql.rollback.mockImplementationOnce((callback) => callback());
    
      try {
        await repository.findById(id); // Call the function under test
        // If findById function doesn't throw an error, fail the test
        expect(true).toBe(false); // Fail the test if no error is thrown
      } catch (error) {
        expect(error).toBe(queryError); // Verify that the error thrown is the same as the one passed to reject()
        expect(connectDatabaseMySql.rollback).toHaveBeenCalled(); // Ensure db.rollback was called
        expect(connectDatabaseMySql.rollback.mock.calls[0][0]).toBeInstanceOf(Function); // Ensure db.rollback was called with a callback function
      }
    });
    it('performs a rollback if db.commit encounters an error during findById', async () => {
      const commitError = new Error('Commit Error');
      const id = 123; // Example id
    
      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
      connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => callback());
      connectDatabaseMySql.rollback.mockImplementationOnce((callback) => callback());
      connectDatabaseMySql.commit.mockImplementationOnce((callback) => {
        callback(commitError);
      });
      
    
      try {
        await repository.findById(id); // Call the function under test
        // If findById function doesn't throw an error, fail the test
        expect(true).toBe(false); // Fail the test if no error is thrown
      } catch (error) {
        expect(error).toBe(commitError); // Verify that the error thrown is the same as the one passed to reject()
        expect(connectDatabaseMySql.rollback).toHaveBeenCalled(); // Ensure db.rollback was called
        expect(connectDatabaseMySql.rollback.mock.calls[0][0]).toBeInstanceOf(Function); // Ensure db.rollback was called with a callback function
      }
    });
    it('resolves with result if db.query succeeds during findById', async () => {
      const id = 123; // Example id
      const mockResult = { id: id, productName: 'product 1' }; // Example result
    
      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
      connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => {
        callback(null, mockResult);
      });
      connectDatabaseMySql.commit.mockImplementationOnce((callback) => {callback()});
    
      const result = await repository.findById(id); // Call the function under test
    
      expect(result).toEqual(mockResult); // Ensure resolve was called with the expected result
    });
  });
  describe('DeleteById product RepositoryMySqlDB', () => {
    it('rejects with error when db.beginTransaction encounters an error in deleteById', async () => {
      const beginError = new Error('Begin Error');
      const id = 123; // Example id
    
      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback(beginError));
    
      try {
        await repository.deleteById(id); // Call the function under test
        // If deleteById function doesn't throw an error, fail the test
        expect(true).toBe(false); // Fail the test if no error is thrown
      } catch (error) {
        expect(error).toBe(beginError); // Verify that the error thrown is the same as the one passed to reject()
      }
    });
    it('performs a rollback if db.query encounters an error during deleteById', async () => {
      const queryError = new Error('Query Error');
      const id = 123; // Example id
    
      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
      connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => {
        callback(queryError);
      });
      connectDatabaseMySql.rollback.mockImplementationOnce((callback) => callback());
    
      try {
        await repository.deleteById(id); // Call the function under test
        // If deleteById function doesn't throw an error, fail the test
        expect(true).toBe(false); // Fail the test if no error is thrown
      } catch (error) {
        expect(error).toBe(queryError); // Verify that the error thrown is the same as the one passed to reject()
        expect(connectDatabaseMySql.rollback).toHaveBeenCalled(); // Ensure db.rollback was called
        expect(connectDatabaseMySql.rollback.mock.calls[0][0]).toBeInstanceOf(Function); // Ensure db.rollback was called with a callback function
      }
    });
    it('performs a rollback if db.commit encounters an error during deleteById', async () => {
      const commitError = new Error('Commit Error');
      const id = 123; // Example id
    
      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
      connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => {callback()});
      connectDatabaseMySql.commit.mockImplementationOnce((callback) => {
        callback(commitError);
      });
      connectDatabaseMySql.rollback.mockImplementationOnce((callback) => callback());
    
      try {
        await repository.deleteById(id); // Call the function under test
        // If deleteById function doesn't throw an error, fail the test
        expect(true).toBe(false); // Fail the test if no error is thrown
      } catch (error) {
        expect(error).toBe(commitError); // Verify that the error thrown is the same as the one passed to reject()
        expect(connectDatabaseMySql.rollback).toHaveBeenCalled(); // Ensure db.rollback was called
        expect(connectDatabaseMySql.rollback.mock.calls[0][0]).toBeInstanceOf(Function); // Ensure db.rollback was called with a callback function
      }
    });
    it('resolves with "product not found" message when no rows are affected during an update operation', async () => {
      const id = 123; // Example id
      const mockResult = { affectedRows: 0 }; // Simulating no rows affected
      const expectedMessage = 'Product not found';
    
      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
      connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => {
        callback(null, mockResult);
      });
      connectDatabaseMySql.commit.mockImplementationOnce((callback) => {callback()});

      const result = await repository.deleteById(id, { /* update data */ }); // Call the function under test
    
      expect(result.retorno).toEqual(expectedMessage); // Ensure resolve was called with the expected message
      expect(result.rowAffected).toEqual(0); // Ensure rowUpdate is correctly set to 0
    });
    it('resolves with the query result', async () => {
      // Mocking the query result
      const id = 123; // Example id
      const mockResult = { affectedRows: 1 }
    
      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
      connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => {
        callback(null, mockResult);
      });
      connectDatabaseMySql.commit.mockImplementationOnce((callback) => {callback()});
    
      // Call the function under test
      const result = await repository.deleteById(id); // Replace "yourFunction" with the actual function name
    
      // Assert that the function resolves with the expected result
      expect(result).toEqual(mockResult);
    }); 
  });

  describe('DeleteById product RepositoryMySqlDB', () => {
    it('rejects with error when db.beginTransaction encounters an error in updateById', async () => {
      const beginError = new Error('Begin Error');
      const id = 123; // Example id
      const productEntity = { /* Example product entity */ };
    
      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback(beginError));
    
      try {
        await repository.updateById(id, productEntity); // Call the function under test
        // If updateById function doesn't throw an error, fail the test
        expect(true).toBe(false); // Fail the test if no error is thrown
      } catch (error) {
        expect(error).toBe(beginError); // Verify that the error thrown is the same as the one passed to reject()
      }
    });

    it('performs a rollback if db.query encounters an error during updateById', async () => {
      const id = 123; // Example id
      const productEntity = {  
        getProductName: jest.fn().mockReturnValue('Test product'),
          getCategory: jest.fn().mockReturnValue('1'),
          getQuantity: jest.fn().mockReturnValue('10'),
          getPrice: jest.fn().mockReturnValue('10.00'), 
      };
      const queryError = new Error('Query Error');
    
      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
      connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => {
        callback(queryError);
      });
      connectDatabaseMySql.rollback.mockImplementationOnce((callback) => callback());
    
      try {
        await repository.updateById(id, productEntity); // Call the function under test
        // If updateById function doesn't throw an error, fail the test
        expect(true).toBe(false); // Fail the test if no error is thrown
      } catch (error) {
        expect(error).toBe(queryError); // Verify that the error thrown is the same as the one passed to reject()
        expect(connectDatabaseMySql.rollback).toHaveBeenCalled(); // Ensure db.rollback was called
        expect(connectDatabaseMySql.rollback.mock.calls[0][0]).toBeInstanceOf(Function); // Ensure db.rollback was called with a callback function
      }
    });
    it('performs a rollback if db.commit encounters an error during updateById', async () => {
      const id = 123; // Example id
      const productEntity = {  
        getProductName: jest.fn().mockReturnValue('Test product'),
        getCategory: jest.fn().mockReturnValue('1'),
        getQuantity: jest.fn().mockReturnValue('10'),
        getPrice: jest.fn().mockReturnValue('10.00'), 
      };
      const commitError = new Error('Commit Error');
    
      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
      connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => {callback()});
      connectDatabaseMySql.commit.mockImplementationOnce((callback) => {
        callback(commitError);
      });
      connectDatabaseMySql.rollback.mockImplementationOnce((callback) => callback());
    
      try {
        await repository.updateById(id, productEntity); // Call the function under test
        // If updateById function doesn't throw an error, fail the test
        expect(true).toBe(false); // Fail the test if no error is thrown
      } catch (error) {
        expect(error).toBe(commitError); // Verify that the error thrown is the same as the one passed to reject()
        expect(connectDatabaseMySql.rollback).toHaveBeenCalled(); // Ensure db.rollback was called
        expect(connectDatabaseMySql.rollback.mock.calls[0][0]).toBeInstanceOf(Function); // Ensure db.rollback was called with a callback function
      }
    });

    it('resolves with appropriate message based on affected rows after update', async () => {
      const id = 123; // Example id
      const productEntity = { 
        getProductName: jest.fn().mockReturnValue('Test product'),
        getCategory: jest.fn().mockReturnValue('1'),
        getQuantity: jest.fn().mockReturnValue('10'),
        getPrice: jest.fn().mockReturnValue('10.00'),
      };
      const mockResult = { affectedRows: 0 }; // Simulating one row affected
    
      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
      connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => {
        callback(null, mockResult);
      });
      connectDatabaseMySql.commit.mockImplementationOnce((callback) => {callback()});
    
      // Call the function under test
      const result = await repository.updateById(id, productEntity);
    
      // Assert that the function resolves with the expected message
      expect(result.retorno).toEqual('Product not found');
      expect(result.rowUpdate).toEqual(0); // Ensure rowUpdate is correctly set to 1
    });
    it('resolves with an object containing response, rowUpdate, product, and Description after a successful update', async () => {
      const id = 123; // Example id
      const productEntity = {
        getProductName: jest.fn().mockReturnValue('Test product'),
        getCategory: jest.fn().mockReturnValue('1'),
        getQuantity: jest.fn().mockReturnValue('10'),
        getPrice: jest.fn().mockReturnValue('10.00'), 
      };
      const nameProduct = 'Test product';
      const category = '1';
      const mockResult = { affectedRows: 1 }; // Simulating one row affected
    
      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
      connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => {
        callback(null, mockResult);
      });
      connectDatabaseMySql.commit.mockImplementationOnce((callback) => {callback()});
    
      // Call the function under test
      const result = await repository.updateById(id, productEntity);
    
      // Assert that the function resolves with the expected object
      expect(result.response).toEqual('Product updated');
      expect(result.rowUpdate).toEqual(1); // Ensure rowUpdate is correctly set to 1
      expect(result.product).toEqual(nameProduct); // Ensure product is correctly set
      expect(result.category).toEqual(category); // Ensure Description is correctly set
    });
    
    

  });

  });