import productGateway from "../../application/productGateway.js";

export default function getAllProducts() {
  return productGateway().findAll();
}