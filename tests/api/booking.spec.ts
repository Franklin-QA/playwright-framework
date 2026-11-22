import { test, expect } from '../../fixtures/test';
import { newBooking } from '../../test-data/booking';

/**
 * API tests against the public Restful-Booker practice API.
 * Covers the full CRUD lifecycle plus auth and negative cases.
 */
test.describe('Booking API', () => {
  test('health check responds @smoke', async ({ api }) => {
    const res = await api.get('/ping');
    expect(res.status()).toBe(201);
  });

  test('create, read, update and delete a booking', async ({ api, authToken }) => {
    const booking = newBooking();

    // CREATE
    const created = await api.post('/booking', { data: booking });
    expect(created.ok()).toBeTruthy();
    const { bookingid, booking: saved } = await created.json();
    expect(bookingid).toBeGreaterThan(0);
    expect(saved).toMatchObject(booking);

    // READ
    const read = await api.get(`/booking/${bookingid}`);
    expect(read.status()).toBe(200);
    expect(await read.json()).toMatchObject({ firstname: booking.firstname });

    // UPDATE (requires auth)
    const updated = await api.put(`/booking/${bookingid}`, {
      data: { ...booking, totalprice: 999 },
      headers: { Cookie: `token=${authToken}` },
    });
    expect(updated.status()).toBe(200);
    expect((await updated.json()).totalprice).toBe(999);

    // DELETE (requires auth) then confirm it is gone
    const deleted = await api.delete(`/booking/${bookingid}`, { headers: { Cookie: `token=${authToken}` } });
    expect(deleted.status()).toBe(201);
    expect((await api.get(`/booking/${bookingid}`)).status()).toBe(404);
  });

  test('search by name returns the created booking', async ({ api }) => {
    const booking = newBooking();
    const { bookingid } = await (await api.post('/booking', { data: booking })).json();

    const res = await api.get('/booking', { params: { firstname: booking.firstname, lastname: booking.lastname } });
    expect(res.status()).toBe(200);
    const ids = (await res.json()).map((b: { bookingid: number }) => b.bookingid);
    expect(ids).toContain(bookingid);
  });

  test('update without a token is forbidden', async ({ api }) => {
    const { bookingid } = await (await api.post('/booking', { data: newBooking() })).json();
    const res = await api.put(`/booking/${bookingid}`, { data: newBooking() });
    expect(res.status()).toBe(403);
  });

  test('update with an invalid token is forbidden', async ({ api }) => {
    const { bookingid } = await (await api.post('/booking', { data: newBooking() })).json();
    const res = await api.put(`/booking/${bookingid}`, {
      data: newBooking(),
      headers: { Cookie: 'token=not-a-real-token' },
    });
    expect(res.status()).toBe(403);
  });

  test('wrong admin password does not return a token', async ({ api }) => {
    const res = await api.post('/auth', { data: { username: 'admin', password: 'wrong' } });
    const body = await res.json();
    expect(body.token).toBeUndefined();
    expect(body.reason).toMatch(/bad credentials/i);
  });

  test('unknown booking returns 404', async ({ api }) => {
    expect((await api.get('/booking/999999999')).status()).toBe(404);
  });
});
