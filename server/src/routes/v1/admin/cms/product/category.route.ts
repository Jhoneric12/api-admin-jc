import { Router } from "express";
import { categoryController } from "../../../../../controllers/v1/admin/cms/product/category.controller";
import {
  createCategorySchema,
  deleteCategorySchema,
  updateCategorySchema,
} from "../../../../../validations/v1/admin/cms/product/category.validation";
import { validate } from "../../../../../middlewares/validate";
import { authenticate } from "../../../../../middlewares/passport.config";

const router = Router();

router.use(authenticate);

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", validate(createCategorySchema), categoryController.createCategory);
router.patch("/:categoryId", validate(updateCategorySchema), categoryController.updateCategory);
router.delete("/:categoryId", validate(deleteCategorySchema), categoryController.deleteCategory);

export default router;
