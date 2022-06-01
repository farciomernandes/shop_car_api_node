import "reflect-metadata";
import "express-async-errors";

import express from 'express';
import swaggerUI from 'swagger-ui-express';
import { Request, Response } from "express";

import "./database";

import "./shared/container";

import swaggerFile from "./swagger.json";


import { router } from './routes';
import { AppError } from "./errors/AppError";


const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.use(router);

app.use((err: Error, request: Request, response: Response) => {
    if(err instanceof AppError) {
        return response.status(err.statusCode).json({
            message: err.message
        });
    }

    return response.status(500).json({
        status: "error",
        message: `Internal server error - ${err.message}`,
    })
});

app.listen(3333);