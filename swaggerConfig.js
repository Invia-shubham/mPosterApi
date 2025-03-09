const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "mPoster",
    version: "1.0.0",
    description: "This is the API documentation for the mPoster application", // Updated app name
  },
  servers: [
    {
      url: "http://localhost:3000", // Local server URL for development
      description: "Local development server",
    },
  ],
  components: {
    schemas: {
      UserMaster: {
        type: "object",
        properties: {
          Name: {
            type: "string",
            description: "The user's full name.",
            example: "John Doe",
          },
          EmailId: {
            type: "string",
            description: "The user's email address.",
            example: "johndoe@example.com",
          },
          Pwd: {
            type: "string",
            description: "The user's password (hashed in the backend).",
            example: "supersecretpassword123",
          },
          MobileNumber: {
            type: "string",
            description: "The user's mobile number.",
            example: "+123456789",
          },
          role: {
            type: "string",
            description: "The user's role (user or admin).",
            example: "user",
          },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: "Unauthorized access, user not logged in",
      },
      NotFound: {
        description: "Resource not found",
      },
      InternalServerError: {
        description: "Internal server error",
      },
      BadRequest: {
        description: "Invalid request or missing parameters",
      },
    },
    parameters: {
      emailParam: {
        name: "EmailId",
        in: "query",
        required: true,
        description: "The email address of the user",
        schema: {
          type: "string",
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"], // Only include routes in the apis array
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
