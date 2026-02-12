import { Router } from "express";
import productService from "../services/product.service.mts";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";
import { sanitize } from "../services/util.mts"
const router: Router = Router();

// GET /products/
router.get("/", async (req, res, next) => {
  try {

    const cleanQuery = sanitize(req.query)
    const products = await productService.getAllProducts(cleanQuery);
    
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// GET /products/:id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);

    // 1. Validate ID exists
    if (!id) {
      return next(new EntityNotFoundError({
        message: "Id required",
        code: "ERR_VALID",
        statusCode: 400,
      }));
    }

    // 2. Fetch the product
    const product = await productService.getProductById(id);

    // 3. Handle 404
    if (!product) {
      return next(new EntityNotFoundError({
        message: `Product ${id} Not Found`,
        code: "ERR_NF",
        statusCode: 404,
      }));
    }

    // 4. Success
    res.status(200).json(product);
    
  } catch (error) {
    // 5. Catch DB connection issues or malformed ObjectIds
    next(error);
  }
});

export default router; // Export the router to use it in the main file
