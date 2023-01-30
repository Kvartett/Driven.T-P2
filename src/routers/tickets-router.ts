import { Router } from "express";
import { getAllTypeTickets, userTicket, createTicket } from "@/controllers";
import { authenticateToken } from "@/middlewares";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getAllTypeTickets)
  .get("/", userTicket)
  .post("/", createTicket);
export { ticketsRouter };
