import { Router } from "express";
import categoriesController from "./controllers/categories.controller";
import userController from "./controllers/user.controller";

const router = Router();

router.get("/", (_request, response) => {
  const { name, version } = require("../package.json");
  return response.json({
    name,
    version,
  });
});

//Category
router.post("/categories", categoriesController.create);
router.get("/categories", categoriesController.findAll);
router.get("/categories/:id", categoriesController.findById);
router.put("/categories/:id", categoriesController.update);
router.delete("/categories/:id", categoriesController.delete);

//User
router.post("/user", userController.create);
router.get("/user", userController.findAll);
router.get("/user/:id", userController.findById);
router.put("/user/:id", userController.update);
router.delete("/user/:id", userController.delete);


export { router };
