export const Status = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  PREPARED: 'PREPARED',
  PICKED_UP: 'PICKED_UP',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

export const allowedTransitions = {
  [Status.PENDING]: [Status.ACCEPTED, Status.CANCELLED],
  [Status.ACCEPTED]: [Status.PREPARED],
  [Status.PREPARED]: [Status.PICKED_UP],
  [Status.PICKED_UP]: [Status.DELIVERED],
  [Status.DELIVERED]: [],
  [Status.CANCELLED]: []
};

export function canTransition(from, to) {
  return allowedTransitions[from]?.includes(to) || false;
}