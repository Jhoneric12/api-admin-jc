import { Router } from "express";
import { unitController } from "../../../../../controllers/v1/admin/cms/product/unit.controller";
import {
  createUnitSchema,
  deleteUnitSchema,
  getUnitsSchema,
  updateUnitSchema,
} from "../../../../../validations/v1/admin/cms/product/unit.validation";
import { validate } from "../../../../../middlewares/validate";
import { authenticate } from "../../../../../middlewares/passport.config";

const router = Router();

router.use(authenticate);

router.get("/", validate(getUnitsSchema), unitController.getUnits);
router.get("/:id", unitController.getUnitById);
router.post("/", validate(createUnitSchema), unitController.createUnit);
router.patch("/:unitId", validate(updateUnitSchema), unitController.updateUnit);
router.delete("/:unitId", validate(deleteUnitSchema), unitController.deleteUnit);

export default router;
