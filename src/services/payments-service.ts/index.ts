import { TicketPost } from "@/protocols";
import paymentRepository from "@/repositories/payment-repository";

export async function findPayment(ticketId: string, userId: number) {
  const findPayments = await paymentRepository.findPayment(ticketId, userId);

  return findPayments;
}

export async function createNewPayment(userId: number, payments: TicketPost) {
  const newPayment = await paymentRepository.createNewPayment(userId, payments);

  return newPayment;
}

const paymentsService = {
  findPayment,
  createNewPayment
};

export default paymentsService;
