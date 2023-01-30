import { prisma } from "@/config";

async function getTicketTypes() {
  return prisma.ticketType.findMany();
}

async function findUserTicket(userId: number) {
  const userEnrollment = await prisma.enrollment.findMany({
    where: {
      userId: userId
    }
  });

  if(userEnrollment[0] === undefined) {
    throw Error("NoContent!");
  }

  const userTickets = await prisma.ticket.findMany({
    where: {
      enrollmentId: userEnrollment[0].id
    },
    include: {
      TicketType: true
    }
  });

  if(userTickets[0] === undefined) {
    throw Error("NoContent!");
  }

  return userTickets[0];
}

type ticket = {
    id: number,
    status: string, //RESERVED | PAID
    ticketTypeId: number,
    enrollmentId: number,
    TicketType: {
        id: number,
        name: string,
        price: number,
        isRemote: boolean,
        includesHotel: boolean,
        createdAt: Date,
        updatedAt: Date,
    },
    createdAt: Date,
    updatedAt: Date,
};

async function addNewTicket(userId: number, ticketTypeId: number) {
  const userEnrollment = await prisma.enrollment.findFirst({
    where: {
      userId: userId
    }
  });

  if(userEnrollment === undefined) {
    throw Error("NoContent!");
  }

  const ticketType = await prisma.ticketType.findUnique({
    where: {
      id: ticketTypeId
    }
  });

  const addTicket = await prisma.ticket.create({
    data: {
      ticketTypeId: ticketTypeId,
      enrollmentId: userEnrollment.id,
      status: "RESERVED"
    }
  });

  const body = {
    id: addTicket.id,
    status: addTicket.status,
    ticketTypeId: ticketTypeId,
    enrollmentId: userEnrollment.id,
    TicketType: {
      id: ticketType.id,
      name: ticketType.name,
      price: ticketType.price,
      isRemote: ticketType.isRemote,
      includesHotel: ticketType.includesHotel,
      createdAt: ticketType.createdAt,
      updatedAt: ticketType.updatedAt
    },
    createdAt: addTicket.createdAt,
    updatedAt: addTicket.updatedAt
  };

  return body as ticket;
}

const ticketsRepository = {
  getTicketTypes,
  findUserTicket,
  addNewTicket
};

export default ticketsRepository;
