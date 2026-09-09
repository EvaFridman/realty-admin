//TODO: убрать при появлении DB-слоя
export type ViewingStatus = 'created' | 'pending approval' | 'approved' | 'rejected' | 'closed';

export const ALLOWED_TRANSITIONS: Record<ViewingStatus, readonly ViewingStatus[]> = {
  created: ['pending approval'],
  'pending approval': ['approved', 'rejected'],
  approved: ['closed'],
  rejected: ['closed'],
  closed: [],
};

export const VIEWING_STATUSES = Object.keys(ALLOWED_TRANSITIONS) as ViewingStatus[];

export function canTransition(from: ViewingStatus, to: ViewingStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getAllowedTransitions(currentStatus: ViewingStatus): ViewingStatus[] {
  return [...(ALLOWED_TRANSITIONS[currentStatus] ?? [])];
}