import usecaseCreate from '../use_cases/product/add.js'
import useCasegetAll from '../use_cases/product/getAll.js'
import useCasefindById from '../use_cases/product/findById.js';
import useCaseDelete from '../use_cases/product/deleteById.js'
import useCaseUpdateById from '../use_cases/product/updateById.js';

export default function productController() {

  const addNewProduct = async (req, res, next) => {
    try{
      const { productName, category, quantity, price } = req.body;

      await usecaseCreate(
        productName,
        category,
        quantity,
        price,
        Date(),
        Date()
      ).then((product) => {
        res.status(201).json(product);
      });//.catch((error) => res.status(400).json(error.message));
      //; res.status(201).json(category);
    }catch(error){
      res.status(400).json(error.message);
      next(error);
    }
    /*.then((product) => res.json(product))
    .catch((error) => res.json(next(`${error.message} - Product creation failed`)));*/
    /*.then((product) => {
			return res.json('Product created successfully');
		})
		.catch((error) => res.json(`${error.message} - Product creation failed`));*/
  };

  const fetchProductById = async (req, res, next) => {
    try{
      await useCasefindById(req.params.id).then((product) => {

        if (!product || product.length === 0) {
          res.status(400).json('No product found');
        }else{
          res.status(200).json(product);
        }

      });}catch(error){
      res.status(400).json(error.message);
      next(error);
    }
  };

  const fetchAllProduct = async (req, res, next) => {
    try{
      await useCasegetAll()
        .then((category) => {
          if (!category) {
            res.status(400).json(`No product found`);
          }
          res.status(200).json(category);
        })}catch(error){
      res.status(400).json(error.message);
      next(error);
    }
  };

  const deleteProductById = async (req, res, next) => {
    try{
      await useCaseDelete(req.params.id)
        .then((message) => {
          const resultado = message.rowUpdate;
          if (resultado === 0) {
            res.status(400).json('No product found');
          }else{
            res.status(200).json('Product deleted');
          }
        })
      /*.then((message) => {
      // Send response
      res.status(204).json(message);
  })*/
      //.catch(next); // Pass any errors to the error handling middleware
      //.catch((error) => res.status(400).json(next(`${error.message} - Category delete failed`)));
    }catch(error){
      res.status(400).json(error.message);
      next(error);
    }
    /*.then(() => res.json('Product sucessfully deleted!'))
      .catch((error) => next(error));*/
  };

  const updateProductById = async (req, res, next) => {
    try{
      const {productName, category, quantity, price} = req.body;

      //console.log('controller update by id->',dbRepository);
      await useCaseUpdateById(
        req.params.id,
        productName,
        category,
        quantity,
        price,
        Date()
      )
        .then((message) => {
          const resultado = message.rowUpdate;
          if (resultado === 0) {
            res.status(400).json('No product found');
          }else{
            res.status(200).json('Product Updated');
          }
        });}catch(error){
      res.status(400).json(error.message);
      next(error);
    }

  };
  //console.log('Controller final',dbRepository);
  return {
    addNewProduct,
    fetchAllProduct,
    fetchProductById,
    updateProductById,
    deleteProductById
  };
}