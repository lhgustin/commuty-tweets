import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import type { OpenAPIObjectConfig } from '@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator.js'
import type { Application } from 'express'
import swaggerUi, { type JsonObject } from 'swagger-ui-express'

/**
 * - https://github.com/swagger-api/swagger-ui
 * - https://github.com/asteasolutions/zod-to-openapi
 */

export const registry = new OpenAPIRegistry()
export const initialConfig: JsonObject = {
    openapi: '3.0.0',
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local development server',
        },
    ],
    info: {
        title: 'Commuty API',
        version: '1.0.0',
        description: 'API documentation for Commuty assignement',
    },
    // tags: [
    //     {
    //         name: 'Search',
    //         description: 'Search operations for tweets and criteria'
    //     },
    // paths: {
    //   // FIXME add API paths here
    // },
    // components: {
    //   schemas: {}
    // }
}

export const generateSwagger = (app: Application) => {
    // Function to allow to do it at the end of api definition file, so that each route is visited and imported before this function is called
    const builder = new OpenApiGeneratorV3(registry.definitions)
    // FIXME weird cast to avoid type error
    const document = builder.generateDocument(initialConfig as OpenAPIObjectConfig)
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(document))
}
