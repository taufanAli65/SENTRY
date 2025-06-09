# SENTRY API

This is a RESTful API for user authentication and item management, built with Node.js, Express, and MongoDB.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) instance (local or cloud)
- A `.env` file with required environment variables (see Setup section)

## Setup

1. Install dependencies:  
   `npm install`

2. Set environment variables in a `.env` file:
   ```
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3000
   SALT_ROUNDS=10
   NODE_ENV=development
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

3. Start the server:  
   `npm start`

## Endpoints

### Root

- `GET /`  
  Returns a development status message.

### Authentication

- `POST /auth/admin/register`  
  Registers a new user (admin/employee).  
  **Body:** `{ "email": string, "name": string, "photoUrl": string, "role": "admin"|"employee" }`

- `POST /auth/login`  
  Logs in a user.  
  **Body:** `{ "email": string, "password": string }`  
  **Response:** JWT token

- `POST /auth/forgot-password`  
  Sends password reset instructions to email.  
  **Body:** `{ "email": string }`

- `POST /auth/reset-password/:token`  
  Resets password using token.  
  **Body:** `{ "newPassword": string }`

- `PUT /auth/change-password`  
  Changes password for authenticated user.  
  **Body:** `{ "old_password": string, "new_password": string }`  
  **Headers:** `Authorization: Bearer <token>`

### Item Management

All item endpoints require authentication via JWT.

- `GET /item/`  
  Retrieves all items.

- `GET /item/:id`  
  Retrieves a single item by ID.

- `POST /item/`  
  Creates a new item.  
  **Body:** `{ "name": string, "weight": number }`  
  **Role:** Owner

- `PUT /item/:id`  
  Updates an item.  
  **Body:** `{ "name": string, "weight": number }`  
  **Role:** Admin

- `DELETE /item/:id`  
  Deletes an item.  
  **Role:** Admin

### Scan Management

- `POST /scan/`  
  Create a scan record (item added to shelf).  
  **Body:** `{ "id_user": string, "id_item": string, "isOut"?: boolean }`  
  **Role:** Employee

- `PUT /scan/:id`  
  Update a scan record (item taken from shelf).  
  **Role:** Employee

## Models

### User

- `email`: string, required, unique
- `name`: string, required
- `role`: string, one of `owner`, `admin`, `employee`
- `photoUrl`: string, required
- `password`: string, required (hashed)

### Item

- `name`: string, required
- `weight`: number, required

### Scan

- `id_user`: ObjectId (User), required
- `id_item`: ObjectId (Item), required
- `in_time`: Date (auto)
- `out_time`: Date (auto)
- `isOut`: boolean

## Notes

- Passwords are returned in registration responses for development only. Remove this in production.
- JWT tokens are used for authentication.
- MongoDB is required for data storage.