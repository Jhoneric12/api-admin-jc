import { Router } from "express";
import { productController } from "../../../../../controllers/v1/admin/cms/product/product.controller";
import { authenticate } from "../../../../../middlewares/passport.config";
import { validate } from "../../../../../middlewares/validate";
import { upload } from "../../../../../middlewares/upload";
import { createProductSchema } from "../../../../../validations/v1/admin/cms/product/product.validation";
import path from "path";

const router = Router();

const uploadOptions = () => {
  return {
    filePath: () => path.join("uploads", "products"),
  };
};

router.use(authenticate);

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.post(
  "/",
  upload(uploadOptions()).single("image"),
  validate(createProductSchema),
  productController.createProduct,
);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
