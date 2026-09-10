import { ViewingStatus } from '../generated/prisma/index.js';

export const ALLOWED_TRANSITIONS: Record<ViewingStatus, readonly ViewingStatus[]> = {
  [ViewingStatus.created]: [ViewingStatus.pending_approval],
  [ViewingStatus.pending_approval]: [ViewingStatus.approved, ViewingStatus.rejected],
  [ViewingStatus.approved]: [ViewingStatus.closed],
  [ViewingStatus.rejected]: [ViewingStatus.closed],
  [ViewingStatus.closed]: [],
};

export const VIEWING_STATUSES = Object.keys(ALLOWED_TRANSITIONS) as ViewingStatus[];

export function canTransition(from: ViewingStatus, to: ViewingStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getAllowedTransitions(currentStatus: ViewingStatus): ViewingStatus[] {
  return [...(ALLOWED_TRANSITIONS[currentStatus] ?? [])];
}