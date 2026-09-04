import { Transport } from './transport';

export const listingsApi = new Transport('/listings');
export const districtsApi = new Transport('/districts');
export const usersApi = new Transport('/users');
export const viewingsApi = new Transport('/viewings');