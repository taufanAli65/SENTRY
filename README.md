# SENTRY API

RESTful API for user authentication, item, scan, rack, and warehouse entry management, built with Node.js, Express, and MongoDB.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) instance
- `.env` file with required environment variables (see Setup)

## Setup

1. Install dependencies: `npm install`
2. Set environment variables in a `.env` file:
   ```
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=8000
   SALT_ROUNDS=10
   NODE_ENV=development
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   CLIENT_URL=http://localhost:3000
   ```
3. Start the server: `npm start`

## Endpoints

### Root

- `GET /`
  - Returns a development status message.

### Authentication

- `POST /auth/admin/register`
  - Registers a new admin or employee (Owner only).
  - **Body (form-data):** `email`, `name`, `role` (`admin` or `employee`), `photo` (image file)
  - **Response:** Success message (password sent via email).

- `POST /auth/login`
  - Logs in a user.
  - **Body:** `{ "email": string, "password": string }`
  - **Response:** JWT token (set as cookie) and user info.

- `POST /auth/forgot-password`
  - Sends password reset instructions to email.
  - **Body:** `{ "email": string }`

- `POST /auth/reset-password/:token`
  - Resets password using token.
  - **Body:** `{ "newPassword": string }`

- `PUT /auth/change-password`
  - Changes password for authenticated user.
  - **Body:** `{ "old_password": string, "new_password": string }`
  - **Headers:** Cookie with JWT token

- `POST /auth/logout`
  - Logs out the user (clears cookie).

### User Management (Owner only)

- `GET /owner/users`
  - List users (admin/employee) with pagination and search.
  - **Query:** `role`, `search`, `page`, `limit`

- `POST /owner/users/:id/suspend`
  - Suspend a user (admin/employee).

- `POST /owner/users/:id/unsuspend`
  - Unsuspend a user.

### Item Management

All endpoints require authentication.

- `GET /items`
  - Retrieves all items (paginated, searchable).
  - **Query:** `page`, `limit`, `search`

- `GET /items/:id`
  - Retrieves a single item by ID.

- `POST /items`
  - Creates a new item (Owner only).
  - **Body (form-data):** `name`, `weight`, `category`, `photo` (image file)

- `DELETE /items/:id`
  - Deletes an item (Owner only).

### Scan Management

All endpoints require authentication as Employee.

- `POST /scans`
  - Create a scan record (item added to shelf).
  - **Body:** `{ "code_item": string, "isOut"?: boolean }`

- `PUT /scans/:id`
  - Update a scan record (item taken from shelf).

### Rack Management

All endpoints require authentication.

- `POST /rack`
  - Creates a new rack entry (registers an item as added/removed).
  - **Body:** `{ "id_item": string, "isOut": boolean }`

### Warehouse Entry Management

All endpoints require authentication.

- `GET /warehouse/entry`
  - Retrieves all warehouse entry records (paginated).
  - **Query:** `page`, `limit`

- `GET /warehouse/entry/:id`
  - Retrieves a single warehouse entry by ID.

- `POST /warehouse/entry`
  - Creates a new warehouse entry record.
  - **Body:** `{ "id_user": string, "entry_time"?: string, "face_recognition": string }`

## Models

### User

- `email`: string, required, unique
- `name`: string, required
- `role`: string, one of `owner`, `admin`, `employee`
- `photoUrl`: string, required
- `password`: string, required (hashed)
- `suspended`: boolean

### Item

- `item_code`: string, required, unique
- `name`: string, required
- `weight`: number, required
- `category`: string, required
- `photo_url`: string, required

### Scan

- `stocked_by`: ObjectId (User), required
- `stocked_at`: Date, required
- `taken_by`: ObjectId (User), optional
- `taken_at`: Date, optional
- `id_item`: ObjectId (Item), required
- `isOut`: boolean, required
- `in_time`: Date (auto)
- `out_time`: Date (auto)

### Rack

- `item_code`: string, required
- `weight`: number, required
- `isOut`: boolean, required
- `time`: Date (auto)

### RackRealtime

- `weight`: number, required
- `time`: Date (auto)

### ItemStock

- `id_item`: ObjectId (Item), required
- `weight`: number, required
- `stock`: number, required

### WarehouseEntry

- `id_user`: ObjectId (User), required
- `entry_time`: Date, required (defaults to now)
- `face_recognition`: string, required (URL or path to face recognition image)

## Notes

- Passwords are sent via email on registration.
- JWT tokens are used for authentication (stored in cookies).
- All endpoints require authentication unless otherwise noted.
- MongoDB is required for data storage.
