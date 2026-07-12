# TaskFlow API

A secure, premium task and project management REST API built with Express, PostgreSQL, and JWT. This repository features a clean modular codebase with token authentication, database connection pooling, error handling middleware, and integration testing.

## 🚀 Technology Stack
- **Framework**: Express.js (Node.js)
- **Database**: PostgreSQL (Raw SQL queries with connection pooling)
- **Authentication**: JSON Web Tokens (JWT) + password encryption (Bcryptjs)
- **Testing**: Jest + Supertest
- **Documentation**: Embedded Interactive HTML / CSS docs UI

---

## 🛠️ Installation & Setup

1. **Clone & Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Database Connection**
   Make sure you have PostgreSQL running. Create a new database (e.g. `taskflow`) and copy the environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `DATABASE_URL` variable in `.env` to match your local PostgreSQL configuration:
   ```env
   DATABASE_URL=postgres://your_postgres_username:your_password@localhost:5432/taskflow
   ```

3. **Run Schemas & Migrations**
   Compile and run the database tables:
   ```bash
   npm run migrate
   ```

4. **Seed Sandbox Test Data (Optional)**
   Populate test users, projects and task cards:
   ```bash
   npm run seed
   ```

5. **Start Dev Server**
   ```bash
   npm run dev
   ```

6. **View Interactive API Playground**
   Open your browser and navigate to `http://localhost:5000`. Here you can log in, register, and test the endpoints directly!

---

## 🧪 Testing
Run integration tests using Jest:
```bash
npm test
```
