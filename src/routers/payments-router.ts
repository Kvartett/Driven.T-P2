import { Router } from "express";
import { getUserPayment, createNewPayment } from "@/controllers";
import { authenticateToken } from "@/middlewares";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getUserPayment)
  .post("/process", createNewPayment );
export { paymentsRouter };
