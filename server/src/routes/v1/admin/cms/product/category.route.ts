import { Router } from "express";
import { categoryController } from "../../../../../controllers/v1/admin/cms/product/category.controller";
import { authenticate } from "../../../../../middlewares/passport.config";
import { validate } from "../../../../../middlewares/validate";
import {
  createCategorySchema,
  deleteCategorySchema,
  getCategoriesSchema,
  updateCategorySchema,
} from "../../../../../validations/v1/admin/cms/product/category.validation";

const router = Router();

router.use(authenticate);

router.get("/", validate(getCategoriesSchema), categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", validate(createCategorySchema), categoryController.createCategory);
router.patch("/:categoryId", validate(updateCategorySchema), categoryController.updateCategory);
router.delete("/:categoryId", validate(deleteCategorySchema), categoryController.deleteCategory);

export default router;
