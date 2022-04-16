# task-manager-api

### A NodeJS task manager application REST API. This project is part of The Complete Node.js Developer Course (3rd Edition) by Andrew Mead on Udemy.

### Features:
1. Welcome and Goodbye emails with SendGrid email client.
2. MongoDB database with a mongoose schema for every collection in the database.
3. Authentication and Token generation with JWT library.
4. Files upload with multer library.
5. Passwords encryption with bcryptjs library.
6. Seperated routers for application models.
7. Unit testing with Jest and Supertest libraries.
8. Image processing with Sharp library.

### Tools:
  - NodeJS
  - NPM
  - Express
  - ES6/ES7
  - Asynchronous programming
  - MongoDB
  - Mongoose
  - JWT Authentication
  - File and image uploads
  - Email sending
  - REST API Design
  - Code testing

### API Endpoints:
  - Add task: `[POST] /tasks` _authentication required_
  - Get tasks: `[GET] /tasks` _authentication required_
  - Read a task: `[GET] /tasks/:id` _authentication required_
  - Update a task: `[PATCH] /tasks/:id` _authentication required_
  - Delete a task: `[DELETE] /tasks/:id` _authentication required_
  - Add user: `[POST] /users`
  - Login user: `[POST] /users/login`
  - Logout user: `[POST] /users/logout` _authentication required_
  - Logout user from all sessions: `[POST] /users/logoutAll` _authentication required_
  - Read user profile: `[GET] /users/me` _authentication required_
  - Get a user: `[GET] /users/:id` _authentication required_
  - Update profile: `[PATCH] /users/me` _authentication required_
  - Delete profile: `[DELETE] /users/me` _authentication required_
  - Upload user avatar: `[POST] /users/me/avatar` _authentication required_
  - Delete avatar: `[DELETE] /users/me/avatar` _authentication required_
  - Read user avatar: `[GET] /users/:id/avatar`
