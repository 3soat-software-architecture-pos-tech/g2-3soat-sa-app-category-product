import productGateway from "../../application/productGateway.js";

export default function findById(id) {
  return productGateway().findById(id);
}
