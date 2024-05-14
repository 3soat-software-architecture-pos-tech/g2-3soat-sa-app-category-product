import categoryRepositoryMySqlDB from '../categoryRepositoryMySqlDB.js';
import connectDatabaseMySql from '../../../../../config/dbConnectMysql.js';
// Import any necessary mock dependencies

// Mocking the db dependency
jest.mock('../../../../../config/dbConnectMysql.js', () => ({
  beginTransaction: jest.fn(),
  query: jest.fn(),
  rollback: jest.fn(),
  commit: jest.fn(),
}));

describe('categoryRepositoryMySqlDB', () => {
  let repository;

  beforeEach(() => {
    // Initialize the repository
    repository = categoryRepositoryMySqlDB();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('Add category RepositoryMySqlDB', () => {
    it('add function adds a category', async () => {
      const categoryEntity = {
        getCategoryName: jest.fn().mockReturnValue('Test Category'),
        getDescription: jest.fn().mockReturnValue('Test Description'),
      };

      const mockInsertId = 123;
      const mockResult = { insertId: mockInsertId };

      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
      connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => callback(null, mockResult));
      connectDatabaseMySql.commit.mockImplementationOnce((callback) => callback());

      const result = await repository.add(categoryEntity);

      expect(result).toEqual({
        "Category added ": mockInsertId,
        "Category ": 'Test Category',
        "Description": 'Test Description'
      });
    });

    it('add function adds a category begin error', async () => {
      const categoryEntity = {
        getCategoryName: jest.fn().mockReturnValue('Test Category'),
        getDescription: jest.fn().mockReturnValue('Test Description'),
      };

      const beginError = new Error('Begin Error');

      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback(beginError));

      try {
        await repository.add(categoryEntity);
        // If add function doesn't throw an error, fail the test
        expect(true).toBe(false); // Fail the test if no error is thrown
      } catch (error) {
        expect(error).toBe(beginError); // Verify that the error thrown is the same as the one passed to reject()
      }
    });

    it('adds a category and performs a rollback if db.query encounters an error', async () => {
      const categoryEntity = {
        getCategoryName: jest.fn().mockReturnValue('Test Category'),
        getDescription: jest.fn().mockReturnValue('Test Description'),
      };

      const queryError = new Error('Query Error');

      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
      connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => {
        callback(queryError);
      });
      connectDatabaseMySql.rollback.mockImplementationOnce((callback) => callback());

      try {
        await repository.add(categoryEntity);
        // If add function doesn't throw an error, fail the test
        expect(true).toBe(false); // Fail the test if no error is thrown
      } catch (error) {
        expect(error).toBe(queryError); // Verify that the error thrown is the same as the one passed to reject()
        expect(connectDatabaseMySql.rollback).toHaveBeenCalled(); // Ensure db.rollback was called
        expect(connectDatabaseMySql.rollback.mock.calls[0][0]).toBeInstanceOf(Function); // Ensure db.rollback was called with a callback function
      }
    });

    it('performs a rollback if db.commit encounters an error', async () => {
      const categoryEntity = {
        getCategoryName: jest.fn().mockReturnValue('Test Category'),
        getDescription: jest.fn().mockReturnValue('Test Description'),
      };

      const commitError = new Error('Commit Error');

      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
      connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => callback(null, { insertId: 123 }));
      connectDatabaseMySql.commit.mockImplementationOnce((callback) => callback(commitError));
      connectDatabaseMySql.rollback.mockImplementationOnce((callback) => callback());

      try {
        await repository.add(categoryEntity);
        // If add function doesn't throw an error, fail the test
        expect(true).toBe(false); // Fail the test if no error is thrown
      } catch (error) {
        expect(error).toBe(commitError); // Verify that the error thrown is the same as the one passed to reject()
        expect(connectDatabaseMySql.rollback).toHaveBeenCalled(); // Ensure db.rollback was called
        expect(connectDatabaseMySql.rollback.mock.calls[0][0]).toBeInstanceOf(Function); // Ensure db.rollback was called with a callback function
      }
    });
  });

  describe('FindAll category RepositoryMySqlDB', () => {
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
      const mockResult = [{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }];

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

  describe('FindById category RepositoryMySqlDB', () => {
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
      const mockResult = { id: id, name: 'Category 1' }; // Example result

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
  describe('DeleteById category RepositoryMySqlDB', () => {
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
    it('resolves with "Category not found" message when no rows are affected during an update operation', async () => {
      const id = 123; // Example id
      const mockResult = { affectedRows: 0 }; // Simulating no rows affected
      const expectedMessage = 'Category not found';

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

  describe('DeleteById category RepositoryMySqlDB', () => {
    it('rejects with error when db.beginTransaction encounters an error in updateById', async () => {
      const beginError = new Error('Begin Error');
      const id = 123; // Example id
      const categoryEntity = { /* Example category entity */ };

      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback(beginError));

      try {
        await repository.updateById(id, categoryEntity); // Call the function under test
        // If updateById function doesn't throw an error, fail the test
        expect(true).toBe(false); // Fail the test if no error is thrown
      } catch (error) {
        expect(error).toBe(beginError); // Verify that the error thrown is the same as the one passed to reject()
      }
    });

    it('performs a rollback if db.query encounters an error during updateById', async () => {
      const id = 123; // Example id
      const categoryEntity = {
        getCategoryName: jest.fn().mockReturnValue('Test Category'),
        getDescription: jest.fn().mockReturnValue('Test Description'),
      };
      const queryError = new Error('Query Error');

      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
      connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => {
        callback(queryError);
      });
      connectDatabaseMySql.rollback.mockImplementationOnce((callback) => callback());

      try {
        await repository.updateById(id, categoryEntity); // Call the function under test
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
      const categoryEntity = {
        getCategoryName: jest.fn().mockReturnValue('Test Category'),
        getDescription: jest.fn().mockReturnValue('Test Description'),
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
        await repository.updateById(id, categoryEntity); // Call the function under test
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
      const categoryEntity = {
        getCategoryName: jest.fn().mockReturnValue('Test Category'),
        getDescription: jest.fn().mockReturnValue('Test Description'),
      };
      const mockResult = { affectedRows: 0 }; // Simulating one row affected

      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
      connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => {
        callback(null, mockResult);
      });
      connectDatabaseMySql.commit.mockImplementationOnce((callback) => {callback()});

      // Call the function under test
      const result = await repository.updateById(id, categoryEntity);

      // Assert that the function resolves with the expected message
      expect(result.retorno).toEqual('Category not found');
      expect(result.rowUpdate).toEqual(0); // Ensure rowUpdate is correctly set to 1
    });
    it('resolves with an object containing response, rowUpdate, Category, and Description after a successful update', async () => {
      const id = 123; // Example id
      const categoryEntity = {
        getCategoryName: jest.fn().mockReturnValue('Test Category'),
        getDescription: jest.fn().mockReturnValue('Test Description'),
      };
      const nameCategory = 'Test Category';
      const description = 'Test Description';
      const mockResult = { affectedRows: 1 }; // Simulating one row affected

      // Mocking the behavior of db functions
      connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
      connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => {
        callback(null, mockResult);
      });
      connectDatabaseMySql.commit.mockImplementationOnce((callback) => {callback()});

      // Call the function under test
      const result = await repository.updateById(id, categoryEntity);

      // Assert that the function resolves with the expected object
      expect(result.response).toEqual('Category updated');
      expect(result.rowUpdate).toEqual(1); // Ensure rowUpdate is correctly set to 1
      expect(result.Category).toEqual(nameCategory); // Ensure Category is correctly set
      expect(result.Description).toEqual(description); // Ensure Description is correctly set
    });



  });

});