import product from "../../entities/Product.js";
import productGateway from "../../application/productGateway.js";

export default function createProduct(
    productName,
    category,
    quantity,
    price,
    createdAt,
    updatedAt
){
    if (!productName || !category || !quantity || !price) {
     return Promise.resolve(`Product Name, Category, Quantity and Price fields cannot be empty`);
    } 

    return productGateway().add(product(productName, category, quantity, price, createdAt, updatedAt));
		
}