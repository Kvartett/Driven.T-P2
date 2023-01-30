import { prisma } from "@/config";
import { notFoundError, unauthorizedError } from "@/errors";
import { TicketPost } from "@/protocols";

type ticket = {
    id: number,
    ticketId: number,
    value: number,
    cardIssuer: string, //VISA | MASTERCARD
    cardLastDigits: string,
    createdAt: Date,
    updatedAt: Date,
  }

async function findPayment(ticketId: string, userId: number) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: Number(ticketId)
    }
  });

  const userEnrollment = await prisma.enrollment.findFirst({
    where: {
      id: ticket.enrollmentId,
      userId: userId
    }
  });

  if(!ticket) {
    throw unauthorizedError();
  }

  if(userEnrollment === null) {
    throw unauthorizedError();
  }

  const getPayments = await prisma.payment.findFirst({
    where: {
      ticketId: Number(ticketId)
    }
  });

  return getPayments as ticket;
}

type Payments = {
    id: number,
    ticketId: number,
    value: number,
    cardIssuer: string, // VISA | MASTERCARD
    cardLastDigits: string,
    createdAt: Date,
    updatedAt: Date,
  }

async function createNewPayment(userId: number, payments: TicketPost) {
  const ticketById = await prisma.ticket.findFirst({
    where: {
      id: payments.ticketId
    }
  });

  if (ticketById === null) {
    throw notFoundError();
  }

  const userEnrollment = await prisma.enrollment.findFirst({
    where: {
      userId: userId
    }
  });

  const ticket = await prisma.ticket.findFirst({
    where: {
      enrollmentId: userEnrollment.id
    }
  });

  const ticketValidation = await prisma.ticket.findFirst({
    where: {
      enrollmentId: userEnrollment.id
    }
  });

  if (ticketValidation === null) {
    throw unauthorizedError();
  }

  const findTicketType = await prisma.ticketType.findFirst({
    where: {
      id: ticket.ticketTypeId
    }
  });

  const cardLastDigits = payments.cardData.number.substring(payments.cardData.number.length - 4);

  const newTicket = await prisma.payment.create({
    data: {
      ticketId: Number(payments.ticketId),
      value: findTicketType.price,
      cardIssuer: payments.cardData.issuer,
      cardLastDigits: cardLastDigits
    }
  });

  const updateTicket = await prisma.ticket.update({
    where: {
      id: Number(payments.ticketId)
    },
    data: {
      status: "PAID"
    }
  });

  updateTicket;

  return newTicket as Payments;
}

const paymentsRepository = {
  findPayment,
  createNewPayment
};

export default paymentsRepository;
