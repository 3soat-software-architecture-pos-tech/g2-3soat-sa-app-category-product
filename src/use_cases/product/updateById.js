import product from "../../entities/Product.js";
import productGateway from "../../application/productGateway.js";

export default function updateById(
  id,
  productName,
  category,
  quantity,
  price,
  updatedAt
) {

  // validate
  if (!productName || !category || !quantity || !price) {
    //throw new Error('Name and CPF fields are mandatory');
    return Promise.resolve('Product Name, Category, Quantity and Price fields are mandatory');
  }
  const updatedProduct = product(
    productName,
    category,
    quantity,
    price,
    updatedAt
  );

  return productGateway().updateById(id, updatedProduct);
}
