//index.ts
import "reflect-metadata";
import express, { Request, Response } from 'express';
import { AppDataSource, ensureDbExists } from "./_helpers/db"
import  userRouter  from './routes/user';
import dotenv from "dotenv";
import { errorHandler } from './_middleware/error-handler'

const app = express();
const PORT = 4000;
dotenv.config();

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//db initilization
ensureDbExists()
  .then(() => AppDataSource.initialize())
  .then(() => console.log("Database connected"))
  .catch(error => console.log("Database error:", error));


// Routes
app.use('/users', userRouter);

// Catch 404 errors and forward to error handler
app.use((req, res, next) => {
  next("Not Found");
});

// Global error handler (must be last!)
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});