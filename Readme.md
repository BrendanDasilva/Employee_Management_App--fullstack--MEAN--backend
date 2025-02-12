# Employee Management System - GraphQL API

## 📌 Overview

This is a **Full Stack Development II** assignment implementing an **Employee Management System** backend using:

- **Node.js**
- **Express.js**
- **GraphQL**
- **MongoDB (Mongoose ORM)**
- **Multer (for file uploads)**
- **JWT Authentication**
- **Express Validator (for input validation)**

The API allows **user authentication**, **employee management**, and **image uploads** for employee records.

---

## 📂 Project Structure

```
COMP3133_backend/
│️— models/              # Mongoose schemas
│   ├️— User.js
│   └️— Employee.js
│️— schemas/             # GraphQL type definitions
│   ├️— userSchema.js
│   └️— employeeSchema.js
│️— resolvers/           # GraphQL resolvers
│   ├️— userResolver.js
│   └️— employeeResolver.js
│️— config/
│   └️— db.js            # MongoDB connection
│️— middlewares/
│   └️— upload.js        # Multer file upload setup
│️— uploads/             # Stores uploaded images (Git ignored)
│️— postman-tests/       # Postman collections (API tests)
│   ├️— users_collection.json
│   ├️— employees_collection.json
│️— .env                 # Environment variables (Git ignored)
│️— server.js            # Express & Apollo GraphQL setup
│️— package.json         # Project dependencies
│️— README.md            # Project documentation
```

---

## ⚙️ **Setup Instructions**

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/BrendanDasilva/Employee-Management-System.git
cd Employee-Management-System
```

### **2️⃣ Install Dependencies**

```sh
npm install
```

### **3️⃣ Configure Environment Variables**

Create a `.env` file in the root directory and add the following:

```plaintext
PORT=4000
MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster0.mongodb.net/your_database?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
```

Replace placeholders with your actual **MongoDB credentials** and **JWT secret**.

### **4️⃣ Start the Server**

```sh
npm start
```

The GraphQL API will be available at:

```
http://localhost:4000/graphql
```

---

## 🚀 **GraphQL API Usage**

### **🔑 Authentication**

- ## `signup(username, email, password)`: Register a new user.
  - Username must be 3-25 characters, contain only letters and numbers, and is stored in lowercase.
  - Email must be valid and unique.
  - Password must be at least 6 characters long and contain at least one number.
  - If a username or email is already in use, an error is returned.
- `login(username, password)`: Authenticate user and get a JWT token.

### **🧍 Employee Management**

- `addEmployee(first_name, last_name, email, gender, designation, salary, date_of_joining, department, employee_photo)`: Create an employee record.
- `getAllEmployees`: Retrieve all employees.
- `getEmployeeByEID(id)`: Get employee details by ID.
- `updateEmployee(id, data)`: Update an employee.
- `deleteEmployee(id)`: Remove an employee.

---

## 📸 **Uploading Employee Photos**

1. **Upload an image via Postman:**

   - `POST http://localhost:4000/upload`
   - Select **"form-data"** → Key: `employee_photo` (Type: File)
   - Upload an image.
   - Response:
     ```json
     { "filePath": "uploads/employees/your-image.jpg" }
     ```

2. **Store the image path when adding an employee:**
   ```graphql
   mutation {
     addEmployee(
       first_name: "John"
       last_name: "Doe"
       email: "johndoe@example.com"
       gender: "Male"
       designation: "Software Engineer"
       salary: 5000
       date_of_joining: "2024-01-10"
       department: "IT"
       employee_photo: "uploads/employees/johndoe.jpg"
     ) {
       id
       first_name
       last_name
       email
     }
   }
   ```

---

## 🛠 **Postman API Testing**

- Import the **Postman collection** (if available).
- Use **GraphQL queries/mutations** to test.
- Check **uploaded images** in `uploads/employees/`.

---

## 🛠 **API Error Handling**

- If a user tries to signup with an existing username or email, an error is returned.
- Password validation requires at least one number—otherwise, an error is thrown.
- If a user provides an invalid username or password during login, the system returns a generic error to prevent security leaks.
- Employee email must be unique—if an email already exists in the employee collection, an error is returned.
- Employee salary must be at least 1,000, but not more than 1,000,000-otherwise, an error is returned.

---

## 🛠 **Tech Stack**

- **Backend**: Node.js, Express.js, Apollo GraphQL
- **Database**: MongoDB (Atlas) & Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator & Mongoose Validators
- **File Uploads**: Multer

---

## ✅ **To-Do / Future Enhancements**

- ✅ Add file validation for images.
- ✅ Implement error handling for failed requests.
- ⏳ Add pagination for employee listings.
- ⏳ Implement frontend (React/Next.js).

---

## 👨‍💻 **Author**

**Brendan Dasilva**  
COMP3133 - Full Stack Development II  
Winter 2025

---

🚀 **Now You're Ready to Run & Test the API!** 🚀

```

```
