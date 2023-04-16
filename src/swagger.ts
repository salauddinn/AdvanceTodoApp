import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc, { Options } from "swagger-jsdoc";

const options: Options = {
    definition: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        openapi: "3.0.0",
        info: {
            title: "Node.js API with Swagger",
            version: "1.0.0",
            description:
                "This is a simple TODO  CRUD API application made with Express and documented with Swagger",
            contact: {
                name: "Salauddin",
                email: "salauddi.iiitn@gmail.com",
            },
        },
      
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development server",
            },
            {
                url: "http://cutshort.salauddinn.in/",
                description: "Prod server",
            },
        ],
    },

    apis: ["src/api/comment/CommentRouter.ts","src/api/todo/TodoRouter.ts","src/api/post/PostRouter.ts","src/api/user/UserRouter.ts"], 
    
    
};


const specs = swaggerJsdoc(options);

export default (app: express.Application) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
