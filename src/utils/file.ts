import fs from "fs";

export const deleFile = async(filename: string) =>{
    try {
        await fs.promises.stat(filename);
    } catch (error) {
        return;
    }
    await fs.promises.unlink(filename);
}