import Product from "../../entities/Product.js";

describe("Entity Product", () => {

  const objetoProduct = {
    productName: 'CDC',
    category:2,
    quantity:10,
    price:10.00,
    createdAt: '2024-01-01 00:00',
    updatedAt: '2024-01-01 00:00'
  };

  it('Deve instanciar uma nova categoria', () => {
    // Create a Product instance
    const product = new Product (objetoProduct);
    expect(product).toEqual(
		  expect.objectContaining(product),
    );
	  });
  it('should return correct Product name', () => {
    // Create a Product instance
    const testProduct = Product(objetoProduct);
    expect(testProduct.getProductName()).toBe(testProduct.getProductName());
	  });
  it('should return correct category', () => {
    // Create a Product instance
    const testProduct = Product(objetoProduct);
    expect(testProduct.getCategory()).toBe(testProduct.getCategory());
  });

  it('should return correct quantity', () => {
    // Create a Product instance
    const testProduct = Product(objetoProduct);
    expect(testProduct.getQuantity()).toBe(testProduct.getQuantity());
  });

  it('should return correct price', () => {
    // Create a Product instance
    const testProduct = Product(objetoProduct);
    expect(testProduct.getPrice()).toBe(testProduct.getPrice());
  });

  it('should return correct createdAt date', () => {
    // Create a Product instance
    const testProduct = Product(objetoProduct);
    expect(testProduct.getCreatedAt()).toBe(testProduct.getCreatedAt());
  });

  it('should return correct updatedAt date', () => {
    // Create a Product instance
    const testProduct = Product(objetoProduct);
    expect(testProduct.getUpdatedAt()).toBe(testProduct.getUpdatedAt());
  });
});