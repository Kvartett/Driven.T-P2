import { TicketPost } from "@/protocols";
import paymentsService from "@/services/payments-service.ts";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getUserPayment(req: Request, res: Response) {
  try {
    const { ticketId } = req.query;
    const userId = res.locals.userId;

    if (!ticketId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const findPayments = await paymentsService.findPayment(ticketId.toString(), userId);

    return res.status(httpStatus.OK).send(findPayments);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
  
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.status(httpStatus.NOT_FOUND).send(error);
  }
}

export async function createNewPayment(req: Request, res: Response) {
  const payments = req.body as TicketPost;
    
  try {
    const userId = res.locals.userId;

    const newPayment = await paymentsService.createNewPayment(userId, payments);

    return res.status(httpStatus.OK).send(newPayment);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.status(httpStatus.NOT_FOUND).send(error);
  }
}
