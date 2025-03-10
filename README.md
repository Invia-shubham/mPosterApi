# mposter

A simple poster app built with Node.js, Express, and MongoDB.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/mposter.git
    ```

2. Navigate to the project folder:
    ```bash
    cd mposter
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

## Usage

1. Set up environment variables by creating a `.env` file:
    ```env
    MONGO_URI=mongodb://localhost:27017/mposter
    JWT_SECRET=your_jwt_secret_key
    ```

2. Start the server:
    ```bash
    npm start
    ```

3. Visit `http://localhost:3000` in your browser.

## Dependencies

- **bcryptjs**: Password hashing.
- **express**: Web framework for Node.js.
- **jsonwebtoken**: For secure authentication.
- **mongoose**: MongoDB object modeling.
- **multer**: Middleware for file uploads.
- **swagger-jsdoc**: Swagger API documentation generation.
- **swagger-ui-express**: Swagger UI integration for Express.

## License

Licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
