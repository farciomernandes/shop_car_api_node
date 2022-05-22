import fs from 'fs';
import { parse } from 'csv-parse';
import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';
import { inject, injectable } from 'tsyringe';

interface ImportCategory {
    name: string;
    description: string;
}


@injectable()
class ImportCategoryUseCase {

    constructor(
        @inject("CategoriesRepository")
        private categoriesRepository: ICategoriesRepository){}


    async loadCategories(file: Express.Multer.File): Promise<ImportCategory[]>{

        return new Promise((resolve, reject)=>{
        
            const categories: ImportCategory[] = []; 
            const stream = fs.createReadStream(file.path);
            const parseFile = parse();

            // .pipe le por partes e envia para um outro método
            stream.pipe(parseFile);

            //Percorre cada linha e transforma em array de string
            parseFile.on("data", async(line)=>{
                const [ name, description ] = line;
                categories.push({ 
                    name, 
                    description 
                });
            })
            .on("end", ()=>{
                //Apaga arquivo após ler e salvar os dados!
                fs.promises.unlink(file.path);
                resolve(categories);
            }).on("error", (err)=>{
                reject(err);
            } )

        });
    }

    async execute(file: Express.Multer.File): Promise<void> {
        const categories = await this.loadCategories(file);
        
        categories.map(async (category)=>{
            const { name, description } = category;

            const existsCategory = await this.categoriesRepository.findByName(name);

            if(!existsCategory){
                await this.categoriesRepository.create({
                    name,
                    description,
                });
            }
        })
      
    }
}

export { ImportCategoryUseCase };