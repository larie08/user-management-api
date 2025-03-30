# 🚀 User Management API

## 📌 Project Overview
This project is a REST API built with Node.js and TypeScript for managing users. It provides full CRUD (Create, Read, Update, Delete) functionality using Express.js and TypeORM, with MySQL as the database. The API is structured to allow seamless integration and expansion.

## 🛠 Technologies Used
- Backend: Node.js with TypeScript 🟢
- ORM: TypeORM for database interactions 🗂
- Database: MySQL 🛢
- API Framework: Express.js ⚡

## 👥 Features and Responsibilities
- 👩‍💻 Calderon, Marianne Mae: Implements user creation functionality.
- 👩‍💻 de Luna, Maria Alexa: Implements user deletion functionality.
- 👩‍💻 Cornelio, Cedric: Implements user listing and retrieval functionality.
- 👩‍💻 Rubi, Larie Jane: Manages the main branch and ensures integration.

## 🔧 Setup Instructions

### Prerequisites
- Node.js
- Express.js
- MySQL server
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/larie08/user-management-api
   cd user-management-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=root
   DB_NAME=user_management_api
   ```

4. Configure the database:
   Make sure your MySQL server is running, then update the `ormconfig.json` file with your credentials if needed.

5. Start the server:
   ```bash
   npm run dev
   ```
   The server will be running at http://localhost:4000.

## 🧪 Testing with Thunder Client

Thunder Client is a lightweight REST API client extension for VS Code that we recommend for testing this API.

1. Install Thunder Client extension in VS Code:
   - Open VS Code and navigate to Extensions (Ctrl+Shift+X)
   - Search for "Thunder Client" and install it

2. Set up your requests in Thunder Client:
   - Open Thunder Client from the VS Code activity bar
   - Create a new collection for "User Management API"
   - Add requests for each endpoint

3. Example requests:

   **Get All Users:**
   - Method: GET
   - URL: http://localhost:4000/api/users

   **Get User by ID:**
   - Method: GET
   - URL: http://localhost:4000/api/users/1

   **Create User:**
   - Method: POST
   - URL: http://localhost:4000/api/users
   - Body (JSON):
     ```json
     {
       "firstName": "Test",
       "lastName": "User",
       "email": "test@example.com",
       "password": "password123",
       "role": "user"
     }
     ```
     
   **Delete User:**
   - Method: DELETE
   - URL: http://localhost:3000/api/users/1

4. You can save these requests in a collection and run them as needed to test the API functionality.
