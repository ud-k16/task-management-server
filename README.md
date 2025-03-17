## Server code for task management

## Authentication
#### Signup method [creates new user,stores data to db]
#### Login method [login the user,send them access token,refresh token,stores refresh token to refertokens collection in db]
#### access-token [if access token expires user can get new one with refresh token,
#### but when refresh token expires logout the user from device,user need to sign in again]
#### Tasks routes are allowed only with valid access token , which is checked with middleware

## Task
#### Get All,update one, add one, delete one
## Mongo DB used

## API Endpoints:
### Authentication (JWT-based)
#### POST /auth/signup → Register a new user
#### POST /auth/login → Authenticate user and return JWT
#### Task Management (Protected Routes - Requires JWT)
#### POST /tasks → Create a new task
#### GET /tasks → Get all tasks for the logged-in user
#### GET /tasks/:id → Get a specific task
#### PUT /tasks/:id → Update a task
#### DELETE /tasks/:id → Delete a task
### Tech Stack:
#### Express.js for backend
#### MongoDB  for database
#### bcrypt.js for password hashing
#### jsonwebtoken (JWT) for authentication
#### CORS & Express JSON Middleware for request handling
