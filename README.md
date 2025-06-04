# SENTRY API

This is a RESTful API for user authentication and item management.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) instance (local or cloud)
- A `.env` file with required environment variables (see Setup section)

## Endpoints

### Root

- `GET /`
  - Returns a development status message.

### Authentication

- `POST /auth/register`
  - Registers a new user.
  - **Body:** `{ "email": string, "name": string, "photoUrl": string }`
  - **Response:** User info and generated password (for development only).

- `POST /auth/login`
  - Logs in a user.
  - **Body:** `{ "email": string, "password": string }`
  - **Response:** JWT token if credentials are valid.

### Item Management

All item endpoints require authentication via JWT.

- `GET /item/`
  - Retrieves all items.
  - **Headers:** `Authorization: Bearer <token>`
  - **Response:** Array of items.

- `GET /item/:id`
  - Retrieves a single item by ID.
  - **Headers:** `Authorization: Bearer <token>`
  - **Response:** Item object.

- `POST /item/`
  - Creates a new item.
  - **Headers:** `Authorization: Bearer <token>`
  - **Body:** `{ "name": string, "weight": number }`
  - **Response:** Created item object.

## User Model

- `email`: string, required, unique
- `name`: string, required
- `role`: string, one of `owner`, `admin`, `employee`
- `photoUrl`: string, required
- `password`: string, required (hashed)

## Item Model

- `name`: string, required
- `weight`: number, required

## Setup

1. Install dependencies:  
   `npm install`

2. Set environment variables in a `.env` file:
   ```
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3000
   SALT_ROUNDS=10
   ```

3. Start the server:  
   `npm start`

## Notes

- Passwords are returned in registration responses for development only. Remove this in production.
- JWT tokens are used for authentication.
- MongoDB is required for data storage.

