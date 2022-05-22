import { Router } from 'express';
import { CreateCategoryController } from "../modules/cars/useCases/createCategory/CreateCategoryController";
import  listCategoriesController from '../modules/cars/useCases/listCategories'

import multer from 'multer';
import { importCategoryController } from '../modules/cars/useCases/importCategory';

const categoriesRoutes = Router();

const upload = multer({
    dest: "./tmp",
});

const createCategory = new CreateCategoryController()

categoriesRoutes.post("/", createCategory.handle)

categoriesRoutes.get("/", (request, response)=>{
   return listCategoriesController().handle(request, response);
})

categoriesRoutes.post("/import", upload.single("file") ,(request, response)=>{
    return importCategoryController.handle(request, response);
})

export { categoriesRoutes };