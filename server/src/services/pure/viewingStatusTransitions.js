const ALLOWED_TRANSITIONS = {
  created: ['pending approval'],
  'pending approval': ['approved', 'rejected'],
  approved: ['closed'],
  rejected: ['closed'],
  closed: [],
};

function canTransition(from, to) {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

function getAllowedTransitions(currentStatus) {
  return ALLOWED_TRANSITIONS[currentStatus] ?? [];
}

module.exports = { canTransition, ALLOWED_TRANSITIONS, getAllowedTransitions };