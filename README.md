# TaskFlow

TaskFlow is a full-stack productivity application built with the MERN stack (MongoDB, Express, React, Node.js).  
It provides secure authentication, task management functionality and a structured API layer designed for scalability and maintainability.

## Overview

TaskFlow allows users to:

- Register and authenticate securely using JWT
- Create, update, and delete tasks (full CRUD functionality)
- Access protected routes based on authentication state
- Interact with a RESTful API backend
- Store and retrieve data from a cloud-hosted MongoDB database

The project follows a clean separation between frontend and backend layers, making it suitable for further extension and production deployment.

---

## Tech Stack

**Frontend**
- React
- JavaScript / JSX
- Axios
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

---

## Project Structure

Application/
├── server/ # Backend (Node.js + Express)
└── mern-client/ # Frontend (React)

---

## Installation & Setup

### 1. Backend (Server)

Navigate to the server directory:

```bash
cd Application/server
```
Create an environment configuration file:
```bash
cp .env.example .env
```
Update the .env file with the required environment variables (e.g., MongoDB connection string, JWT secret, port).

Install dependencies:
```bash
npm install
```
Start the development server:

```bash
npm run dev
```
2. Frontend (Client)
Navigate to the client directory:
```bash
cd Application/mern-client
```
Install dependencies:

```bash
npm install
```
Start the development client:

```bash
npm run dev
```
Development Notes
Ensure the backend server is running before starting the frontend.

Verify that the MongoDB connection string in the .env file is valid.

The frontend communicates with the backend via REST APIs.

Future Improvements
Migration to TypeScript for stronger type safety

Role-based access control

Pagination and filtering improvements

Deployment via Docker or cloud infrastructure

