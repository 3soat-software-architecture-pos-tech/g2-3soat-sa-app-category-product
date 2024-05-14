
import createProduct from "../../use_cases/product/add.js";
import productGateway from "../../application/productGateway.js";
import deleteById from "../../use_cases/product/deleteById.js";
import updateProductById from "../../use_cases/product/updateById.js";
import findProductById from "../../use_cases/product/findById.js"
import getAllProducts from "../../use_cases/product/getAll.js";
import product from "../../entities/Product.js";

jest.mock("../../application/productGateway.js");
jest.mock("../../entities/product.js");

describe("Use Case product", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Add - should return an error message if Product Name, Category, Quantity and Price fields cannot be empty", async () => {
    const errorMessage = "Product Name, Category, Quantity and Price fields cannot be empty";

    // Test empty productName
    const result = await createProduct("", "Description", new Date(), new Date());
    expect(result).toBe(errorMessage);

    // Test empty description
    const result2 = await createProduct("product", "", new Date(), new Date());
    expect(result2).toBe(errorMessage);
  });

  it("Add -should call productGateway().add with the correct parameters", async () => {
    const productName = "Test product";
    const category = "1";
    const quantity = "1";
    const price = "10.00";
    const createdAt = new Date();
    const updatedAt = new Date();
    
    const mockProduct = { /* mock product object */ };

    // Mock product creation
    product.mockReturnValue(mockProduct);

    // Mock productGateway.add method
    const mockAdd = jest.fn();
    productGateway.mockReturnValue({ add: mockAdd });

    // Call createProduct
    createProduct(productName, category, quantity, price, createdAt, updatedAt);

    // Verify product creation was called with correct parameters
    expect(product).toHaveBeenCalledWith(productName, category, quantity, price, createdAt, updatedAt);
    
    // Verify productGateway.add was called with the mock product object
    expect(mockAdd).toHaveBeenCalledWith(mockProduct);
  });
  it("Update - should return an error message if productName or description is empty", async () => {
    const errorMessage = "Product Name, Category, Quantity and Price fields are mandatory";

    // Test empty productName
    const result = await updateProductById("1","", "Description", new Date());
    expect(result).toBe(errorMessage);

    // Test empty category
    const result2 = await updateProductById(1,"product", "", new Date());
    expect(result2).toBe(errorMessage);
  });

  it("Update -should call productGateway().add with the correct parameters", async () => {
    const id = 1;
    const productName = "Test product";
    const category = "1";
    const price = "10.00";
    const quantity = "10";
    const updatedAt = new Date();
    
    const mockProduct = { productName, category,price, quantity, updatedAt };

    // Mock product creation
    product.mockReturnValue(mockProduct);

    // Mock productGateway.add method
    const mockUpdate = jest.fn();
    productGateway.mockReturnValue({ updateById: mockUpdate });

    // Call updateProductById
    updateProductById(id, productName, category,price, quantity, updatedAt);

    // Verify product creation was called with correct parameters
    expect(product).toHaveBeenCalledWith(productName, category,price, quantity, updatedAt);
    
    // Verify productGateway.add was called with the mock product object
    expect(productGateway().updateById).toHaveBeenCalledWith(id, mockProduct);
  });
  it("should call deleteById with the id", () => {
    const id = 1;
    
    const mockProduct = { /* mock product object */ };


    //productGateway.mockReturnValue({ deleteById: mockAdd });
    // Mock productGateway.add method
    const mockDelete = jest.fn();
    productGateway.mockReturnValue({ deleteById: mockDelete });

    deleteById(id);
    expect(productGateway().deleteById).toHaveBeenCalledWith(id);
  });

  it("should call find with the id", () => {
    const id = 1;
    
    const mockProduct = { /* mock product object */ };
    //productGateway.mockReturnValue({ deleteById: mockAdd });
    // Mock productGateway.add method
    const mockFindById = jest.fn();
    productGateway.mockReturnValue({ findById: mockFindById });

    findProductById(id);
    expect(productGateway().findById).toHaveBeenCalledWith(id);
  });

  it("should call get all categories", () => {
    const id = 1;
    
    const mockProduct = { /* mock product object */ };
    //productGateway.mockReturnValue({ deleteById: mockAdd });
    // Mock productGateway.add method
    const mockFindAll = jest.fn();
    productGateway.mockReturnValue({ findAll: mockFindAll });

    getAllProducts();
    expect(productGateway().findAll).toHaveBeenCalledWith();
  });

});
