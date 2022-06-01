import { inject, injectable } from "tsyringe";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AppError } from "../../../../errors/AppError";

interface IRequest{
    email: string;
    password: string;
}

interface IResponse{
    user: {
        name: string;
        email: string;
    },
    token: string;
}

@injectable()
class AuthenticateUserUseCase{
    constructor(
        @inject("UsersRepository") 
        private usersRepository: IUsersRepository
    ){}
    async execute({ email, password}: IRequest): Promise<IResponse>{
        const user = await this.usersRepository.findByEmail(email);

        if(!user){
            throw new AppError("Email or password incorrect!");
        }

        const passwordMatch = await compare(password, user.password);
        console.log('saca original: ', password);
        console.log('saca o salvo: ', user.password);

        console.log('saca o resultado: ', passwordMatch);

        if(!passwordMatch){
            throw new AppError("Email or password incorrect!");
        }

        const token = sign({}, "72b302bf297a228a75730123efef7c41",{
            subject: user.id,
            expiresIn: "1d"
        });

        const tokenReturn: IResponse = {
            token,
            user: {
                name: user.name,
                email: user.email
            }
        }
        return tokenReturn;

    }
}

export { AuthenticateUserUseCase };