import fs from 'fs';
import { parse } from 'csv-parse';
import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';

interface ImportCategory {
    name: string;
    description: string;
}

class ImportCategoryUseCase {

    constructor(private categoriesRepository: ICategoriesRepository){}


    loadCategories(file: Express.Multer.File): Promise<ImportCategory[]>{

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

            const existsCategory = this.categoriesRepository.findByName(name);

            if(!existsCategory){
                this.categoriesRepository.create({
                    name,
                    description,

                });
            }
        })
      
    }
}

export { ImportCategoryUseCase };