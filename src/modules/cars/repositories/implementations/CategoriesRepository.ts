import { Category } from "../../model/Category";
import { ICategoriesRepository, ICreateCategoryDTO } from '../ICategoriesRepository';

class CategoriesRepository implements ICategoriesRepository {
    private categories: Category[];

    private static INSTACE: CategoriesRepository;

    private constructor(){
        this.categories = [];
    }

    public static getInstance(): CategoriesRepository {
        if(!CategoriesRepository.INSTACE){
            CategoriesRepository.INSTACE = new CategoriesRepository();
        }

        return CategoriesRepository.INSTACE;
    }

    create({ name, description }: ICreateCategoryDTO): void{
        const category: Category = new Category();
    
        //economiza o category.name = name;
        Object.assign(category, {
            name,
            description,
            created_at: new Date(),
        });
        
    
        this.categories.push(category);
    }

    list(){
        return this.categories;
    }

    findByName(name: string){
        const category = this.categories.find(category => category.name === name);
        return category;
    }
}

export { CategoriesRepository };