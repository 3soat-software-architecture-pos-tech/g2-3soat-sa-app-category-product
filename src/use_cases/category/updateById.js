import category from "../../entities/Category.js";
import categoryGateway from "../../application/categoryGateway.js";

//const gateway = categoryGateway();

export default function updateCategoryById(
    id,
    categoryName,
    description,
    updatedAt
) {
    
  // validate
  if (!categoryName || !description) {
    return Promise.resolve('Category name and Description fields are mandatory');
  }
  const updatedCategory = category(
    categoryName,
    description,
    updatedAt
  );

  return  categoryGateway().updateById(id, updatedCategory);

}
