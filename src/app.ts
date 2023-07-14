import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";
import httpStatus from "http-status";
import router from "./app/routers";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(cookieParser());

//parse
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

// app.get("/", async (req: Request, res: Response) => {
//   await userServices.createUser({
//     id: "555",
//     role: "seller",
//     password: "seller",
//   });
//   res.send("Hello, TypeScript and Express!");
// });

// Global Error Handler
app.use(globalErrorHandler);

// if API not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found !",
    errorMessage: [
      {
        path: req.originalUrl,
        message: "API not found !",
      },
    ],
  });
  next();
});

export default app;
