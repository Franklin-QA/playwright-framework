export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
}

/** Builds a unique booking so parallel tests never collide on shared data. */
export function newBooking(overrides: Partial<Booking> = {}): Booking {
  const suffix = Math.random().toString(36).slice(2, 8);
  return {
    firstname: `Franklin-${suffix}`,
    lastname: 'QA',
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2027-01-10', checkout: '2027-01-12' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}

export const ADMIN = { username: 'admin', password: 'password123' } as const;
