import categoryGateway from '../categoryGateway.js';
import categoryRepositoryMySqlDB from '../../db/database/mySql/repositories/categoryRepositoryMySqlDB.js';
//import connectDatabaseMySql from '../../config/dbConnectMysql.js';

//jest.mock('../../db/database/mySql/repositories/categoryRepositoryMySqlDB.js');
/*jest.mock('../../config/dbConnectMysql.js', () => ({
    beginTransaction: jest.fn(),
    query: jest.fn(),
    rollback: jest.fn(),
    commit: jest.fn(),
  }));
describe('categoryGateway', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls categoryRepositoryMySqlDB.findById with correct id', () => {
    const id = 123;
    const mockFindByIdResult = { id: 123, name: 'Category 1' };

    //connectDatabaseMySql.beginTransaction.mockImplementationOnce((callback) => callback());
    categoryRepositoryMySqlDB().findById.mockResolvedValue(mockFindByIdResult);

    const result = categoryGateway().findById(id);

    expect(categoryRepositoryMySqlDB().findById).toHaveBeenCalledWith(id);
    expect(result).resolves.toEqual(mockFindByIdResult);
  });

  it('calls categoryRepositoryMySqlDB.add with correct category', () => {
    const category = { name: 'New Category' };
    const mockAddResult = { id: 123 };
    categoryRepositoryMySqlDB().add.mockResolvedValue(mockAddResult);

    const result = categoryGateway().add(category);

    expect(categoryRepositoryMySqlDB().add).toHaveBeenCalledWith(category);
    expect(result).resolves.toEqual(mockAddResult);
  });

  // Similarly, write tests for findAll, updateById, and deleteById methods
});
*/
//import categoryRepositoryMySqlDB from "../../db/database/mySql/repositories/categoryRepositoryMySqlDB.js";
//import categoryGateway from "../categoryGateway.js";

jest.mock("../../db/database/mySql/repositories/categoryRepositoryMySqlDB.js", () => ({
	__esModule: true,
	default: jest.fn().mockReturnValue({
		findById: jest.fn(),
		add: jest.fn(),
		findAll: jest.fn(),
		updateById: jest.fn(),
		deleteById: jest.fn(),
		updateStatusById: jest.fn(),
	}),
}));

const id = 1;
const status = { id: 1, statusName: "pending", description: "description" };

describe("Category Gateway", () => {
	let gateway;
	const database = categoryRepositoryMySqlDB();

	beforeEach(() => {
		gateway = categoryGateway();
	});

	it('findById', () => {
		gateway.findById(id);

		expect(database.findById).toHaveBeenCalledTimes(1);
		expect(database.findById).toHaveBeenCalledWith(id);
	})

	it('add', () => {
		gateway.add(status);

		expect(database.add).toHaveBeenCalledTimes(1);
		expect(database.add).toHaveBeenCalledWith(status);
	})

	it('findAll', () => {
		gateway.findAll(id);

		expect(database.findAll).toHaveBeenCalledTimes(1);
	})

	it('updateById', () => {
		gateway.updateById(id, status);

		expect(database.updateById).toHaveBeenCalledTimes(1);
		expect(database.updateById).toHaveBeenCalledWith(id, status);
	})

	it('deleteById', () => {
		gateway.deleteById(id);

		expect(database.deleteById).toHaveBeenCalledTimes(1);
		expect(database.deleteById).toHaveBeenCalledWith(id);
	})
});