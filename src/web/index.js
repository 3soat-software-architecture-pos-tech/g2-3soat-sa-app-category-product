import swaggerUI from 'swagger-ui-express';
import swaggerFile from '../../swagger-output.json' assert { type: "json" };
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';

import bodyParser from "body-parser";

export default function routes(app, express){
  app.use(bodyParser.json());
  app.use('/category', categoryRoutes(express));
  app.use('/product', productRoutes(express));
	// v.1 manual payment
  // app.use('/payment', paymentRoutes(express));
	// v.2 automated payment

  //app.route("/").get((req, res) => res.status(200).send("Sistema de pedidos"));

  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));
}

