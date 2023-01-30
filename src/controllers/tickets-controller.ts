import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import ticketsService from "@/services/tickets-service";

export async function getAllTypeTickets(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketTypes = await ticketsService.getTicketTypes();

    return res.status(httpStatus.OK).send(ticketTypes);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function userTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = res.locals.userId;

    const tickets = await ticketsService.findUserTicket(userId);

    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = res.locals.userId;

    if(req.body.ticketTypeId === undefined) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const newTicket = await ticketsService.addNewTicket(userId, req.body.ticketTypeId);

    return res.status(httpStatus.CREATED).send(newTicket);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
