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
      url: "https://mposterapi.onrender.com", 
      description: "Render development server",
    },
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

      UserBanner: {
        type: "object",
        properties: {
          BannerCode: {
            type: "integer",
            description: "A unique identifier for the banner.",
            example: 123,
          },
          UserId: {
            type: "object",
            description:
              "The user object who created the banner, excluding the password.",
            properties: {
              _id: {
                type: "string",
                description: "The unique identifier for the user.",
                example: "67ce550b6998a912d9f49f75",
              },
              Name: {
                type: "string",
                description: "The name of the user.",
                example: "John Doe",
              },
              EmailId: {
                type: "string",
                description: "The email ID of the user.",
                example: "sl@yopmail.com",
              },
              MobileNumber: {
                type: "string",
                description: "The mobile number of the user.",
                example: "9315732328",
              },
              PartyId: {
                type: "integer",
                description: "The party ID the user belongs to.",
                example: 1,
              },
              role: {
                type: "string",
                description: "The role of the user.",
                example: "user",
              },
              createdAt: {
                type: "string",
                format: "date-time",
                description: "The date when the user was created.",
                example: "2025-03-10T02:57:15.545Z",
              },
              updatedAt: {
                type: "string",
                format: "date-time",
                description: "The date when the user was last updated.",
                example: "2025-03-10T02:57:15.545Z",
              },
            },
            example: {
              _id: "67ce550b6998a912d9f49f75",
              Name: "John Doe",
              EmailId: "sl@yopmail.com",
              MobileNumber: "9315732328",
              PartyId: 1,
              role: "user",
              createdAt: "2025-03-10T02:57:15.545Z",
              updatedAt: "2025-03-10T02:57:15.545Z",
            },
          },
          Title: {
            type: "string",
            description: "The title of the banner.",
            example: "Summer Sale",
          },
          Description: {
            type: "string",
            description: "The description of the banner.",
            example: "Huge discounts on summer items!",
          },
        },
      },

      PartyList: {
        type: "object",
        properties: {
          PId: {
            type: "integer",
            description: "A unique identifier for the party.",
            example: 1,
          },
          PartyLogoUrl: {
            type: "string",
            description: "The URL of the party's logo.",
            example: "https://example.com/logo.png",
          },
          Title: {
            type: "string",
            description: "The title of the party.",
            example: "Green Party",
          },
          Description: {
            type: "string",
            description: "A brief description of the party.",
            example: "A progressive party advocating for environmental change.",
          },
          PartyColor: {
            type: "string",
            description:
              "The color associated with the party (e.g., hex color code or name).",
            example: "#4CAF50",
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
