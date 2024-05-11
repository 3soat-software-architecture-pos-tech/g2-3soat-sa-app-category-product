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
  
    // Write similar tests for other functions (findAll, findById, updateById, deleteById)
  });