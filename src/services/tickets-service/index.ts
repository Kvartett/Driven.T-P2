import ticketsRepository from "@/repositories/ticket-repository";

export async function getTicketTypes() {
  const ticketsTypesAll = await ticketsRepository.getTicketTypes();

  return ticketsTypesAll;
}

export async function findUserTicket(userId: number) {
  const ticketsTypesSearch = await ticketsRepository.findUserTicket(userId);
  return ticketsTypesSearch;
}

export async function addNewTicket(userId: number, ticketTypeId: number) {
  const ticketsTypesInsert = await ticketsRepository.addNewTicket(userId, ticketTypeId);
  return ticketsTypesInsert;
}

const ticketsService = {
  getTicketTypes,
  findUserTicket,
  addNewTicket
};

export default ticketsService;
