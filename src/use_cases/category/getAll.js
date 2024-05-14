import categoryGateway from "../../application/categoryGateway.js";

export default function getAllCategories() {
  return categoryGateway().findAll();
}