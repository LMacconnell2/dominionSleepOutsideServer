import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swaggerDesign.json" with {type:"json"};

const swaggerRouter:Router = Router();

swaggerRouter.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


export default swaggerRouter;