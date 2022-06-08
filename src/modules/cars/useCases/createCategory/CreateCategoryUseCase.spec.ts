import { AppError } from "../../../../errors/AppError";
import { CategoriesRepositoryInMemory } from "../../repositories/in-memory/CategoriesRepositoryInMemory";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase"

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe("Create Category", () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMemory
    );
  });

    test("Should be able to create a new category", async()=>{
        const category = {
            name: "any_name",
            description: "Any Description"
        }
        await createCategoryUseCase.execute({
            name: category.name,
            description: category.description
        });

        const categoryCreated = await categoriesRepositoryInMemory.findByName("any_name")
        
        expect(categoryCreated).toHaveProperty("id");
    })

    test("Should not be able to create a new category with name exists", async()=>{
      expect(async()=> {
        const category = {
          name: "any_name",
          description: "Any Description"
        }
        await createCategoryUseCase.execute({
            name: category.name,
            description: category.description
        });

        await createCategoryUseCase.execute({
          name: category.name,
          description: category.description
        });
      }).rejects.toBeInstanceOf(AppError);

     
  })
})