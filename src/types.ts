export type Trades = 'carpenters';

export interface Location {
  city: string;
  state: string;
  country: string;
}

export interface Business {
  name?: string;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
}
