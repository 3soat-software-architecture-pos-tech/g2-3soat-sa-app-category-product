import productGateway from "../../application/productGateway.js";

export default function deleteById(id) {
      return productGateway().deleteById(id);
  }