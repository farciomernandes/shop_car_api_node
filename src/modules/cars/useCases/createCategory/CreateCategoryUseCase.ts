import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';


interface IRequest{
    name: string;
    description: string;
}

class CreateCategoryUseCase{
    constructor(private categoriesRepository: ICategoriesRepository){

    }
    
    execute({ name, description}: IRequest){

    const categoriesRepository = this.categoriesRepository;

    const categoryAlreadyExists = categoriesRepository.findByName(name);

    if(categoryAlreadyExists){
        throw new Error(`Category already exists`);
    }

    this.categoriesRepository.create({ name, description });
    }

}

export { CreateCategoryUseCase };