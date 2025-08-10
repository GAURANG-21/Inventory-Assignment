# **Inventory Management API**

Welcome to the **Inventory Management API**!  
A secure, scalable backend built with **Node.js**, **Express**, **Prisma**, and **PostgreSQL**, supporting user authentication, product management with pagination, and admin user controls.

---

## **Project Overview**

This backend application manages product inventory for small businesses like local shops. It exposes REST APIs for managing users and products. The core features include:

- New User Registration  
- User Authentication (Login)  
- Product Addition  
- Product Quantity Updates  
- Get Products and Their Quantities
- 
---

## **Table of Contents**

- [Prerequisites](#prerequisites)  
- [Setup & Installation](#setup--installation)  
- [Environment Variables](#environment-variables)  
- [Database Initialization](#database-initialization)  
- [Running the Server](#running-the-server)  
- [API Documentation](#api-documentation)  
- [API Routes Overview](#api-routes-overview)  
- [Authorization](#authorization)  
- [Additional Info](#additional-info)  
- [Troubleshooting](#troubleshooting)  
- [Contact & Contribution](#contact--contribution)

---

## **Prerequisites**

Make sure these tools are installed on your machine:

- **Node.js** (v16 or later recommended)  
- **npm** (comes with Node.js)  
- **Git** (for cloning the repository)

---

## **Setup & Installation**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/GAURANG-21/Inventory-Assignment.git
   cd Inventory-Assignment
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a .env file in the root directory with the following variables:**

   ```env
   PORT=YOUR-PORT-NUMBER
   DATABASE_URL=YOUR-DB-URL
   ACCESS_TOKEN_SECRET=YOUR-ACCESS-TOKEN-SECRET
   ACCESS_TOKEN_EXPIRY=YOUR-ACCESS-TOKEN-EXPIRY
   REFRESH_TOKEN_SECRET=YOUR-REFRESH-TOKEN-SECRET
   REFRESH_TOKEN_EXPIRY=YOUR-REFRESH-TOKEN-EXPIRY
   SALTS=NUMBER-OF-SALTS/ROUNDS
   FRONTEND_URL=YOUR-FRONTEND-URL
   ```

   Replace placeholders with your actual credentials and secrets.

## **Database Initialization**

1. Set up your PostgreSQL database and obtain the DATABASE_URL from Prisma.

2. Run Prisma migrations to create the database schema:

   ```bash
   npx prisma migrate deploy
   ```

3. (Optional) Generate the Prisma client:

   ```bash
   npx prisma generate
   ```

## **Running the Server**

**Development Mode (with auto reload):**

```bash
npm run dev
```

**Production Mode:**

```bash
npm start
```

The server will be accessible at:
http://localhost:<PORT> (default: 3030)

## **API Documentation**

Interactive API docs are available at:

**GET /docs**

The OpenAPI (Swagger) spec file is located at:

```bash
node_output/swagger.yaml
```

You can also view or edit the Swagger file online using:
[Swagger Editor](https://editor.swagger.io/)

## **API Routes Overview**

### Authentication
| Method | Endpoint | Description | Protected? |
|--------|----------|-------------|------------|
| POST | `/register` | Register a new user | No |
| POST | `/login` | User login & receive JWTs | No |
| POST | `/refresh-token` | Refresh access token | No |

### Product Management
| Method | Endpoint | Description | Protected? |
|--------|----------|-------------|------------|
| GET | `/products` | Get paginated list of products | No |
| POST | `/products` | Add a new product | Yes |
| PUT | `/products/:id/quantity` | Update product quantity | Yes |

### Admin User Management
| Method | Endpoint | Description | Protected? (Admin) |
|--------|----------|-------------|-------------------|
| GET | `/getUsers` | Get all users | Yes |
| POST | `/createUser` | Create user by admin | Yes |
| PUT | `/editUser/:id` | Edit user details by admin | Yes |
| DELETE | `/deleteUser/:id` | Delete a user by admin | Yes |

## **Authorization**

Protected routes require a valid JWT access token sent in the Authorization header as:
`Bearer <access_token>`

Access tokens expire; use `/refresh-token` to obtain new access tokens via refresh tokens stored securely in HttpOnly cookies.

## **Additional Info**

- **Logging:** Uses morgan and chalk for colorful API request logs.

- **CORS:** Configured to accept requests only from the frontend URL defined in .env.

- **Validation:** Request data validated using custom middlewares for security and correctness.

## **Troubleshooting**

- **Database connection errors:** Confirm DATABASE_URL is correct and your database is accessible.

- **Port conflicts:** Change PORT in .env if the default port is in use.

- **JWT issues:** Ensure secrets (ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET) are strong, random strings.

- **API request failures:** Make sure the frontend URL matches the one in .env for CORS policy.

## **Contact & Contribution**

Created and maintained by **Gaurang Agarwal**

For issues or contributions, please open an issue or pull request on GitHub:
https://github.com/GAURANG-21/Inventory-Assignment

Thank you for using the Inventory Management API!
Feel free to explore the Swagger docs and build amazing inventory applications! 🚀
