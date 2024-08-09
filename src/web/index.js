import swaggerUI from 'swagger-ui-express';
import swaggerFile from '../../swagger-output.json' assert { type: "json" };
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import helmet, {hidePoweredBy} from 'helmet';
import bodyParser from "body-parser";
import crypto from 'crypto';

export default function routes(app, express){
  app.use(hidePoweredBy());
  app.use(bodyParser.json());
// Middleware para gerar nonce
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
});
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true, // Utiliza políticas padrão do Helmet
      directives: {
        //defaultSrc: ["'none'"],
        defaultSrc: ["'self'"], // Permite conteúdo somente da própria origem
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`, "https://trusted-scripts.com"],
        styleSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`, "https://trusted-styles.com"],
        //scriptSrc: ["'self'", "https://*.trusted-scripts.com"],
        //styleSrc: ["'self'", "https://*.trusted-styles.com"],
        imgSrc: ["'self'", "https://trusted-images.com"],
        fontSrc: ["'self'", "https://trusted-fonts.com"],
        connectSrc: ["'self'", "https://api.trusted.com"],
        frameSrc: ["'self'", "https://trusted-frames.com"],
        //frameAncestors: ["'self'"], // Specify sources allowed to frame your content
        frameAncestors: ["'none'"], // Impede que sua página seja incorporada em um iframe
        //formAction: ["'self'"],    // Specify sources allowed to submit forms
        defaultSrc: ["'none'"], // Setting default policy
        scriptSrc: ["'self'"], // Allow scripts from the same origin
        imgSrc: ["'self'", "https://example.com"], // Allow images from same origin and example.com
        styleSrc: ["'self'", "https://example.com"], // Allow styles from same origin and example.com
      },
    },
    // Outras configurações do helmet
  xssFilter: true,
  noSniff: true,
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000, // 1 ano
    includeSubDomains: true,
    preload: true,
  },
  }))
  

  app.use('/category', categoryRoutes(express));
  app.use('/product', productRoutes(express));
	// v.1 manual payment
  // app.use('/payment', paymentRoutes(express));
	// v.2 automated payment

  //app.route("/").get((req, res) => res.status(200).send("Sistema de pedidos"));
  /*app.route("/").get((req, res) => {
    res.status(200).json({ message: "Sistema de pedidos" });});*/
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));
  app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
  });
}

