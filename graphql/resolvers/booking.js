// --------------------
//  Mongoose models
// --------------------
const Event   = require('../../models/event');
const Booking = require('../../models/booking');

// Helpers to convert raw Mongo documents into API‑friendly objects
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
  /* -----------------------------------------------------------
   *  Query: bookings
   * -----------------------------------------------------------
   *  Returns all bookings that belong to the currently
   *  authenticated user.
   * ---------------------------------------------------------- */
  bookings: async (_args, context) => {
    const req = context.req;

    // 1) Make sure the request is authenticated
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    try {
      // 2) Find bookings where user field === logged‑in user
      const bookings = await Booking.find({ user: req.userId });

      // 3) Convert each booking to the output shape
      return bookings.map(booking => transformBooking(booking));
    } catch (err) {
      throw err; // bubble errors up to GraphQL
    }
  },

  /* -----------------------------------------------------------
   *  Mutation: bookEvent
   * -----------------------------------------------------------
   *  Creates a new booking that links the logged‑in user
   *  with the specified event.
   * ---------------------------------------------------------- */
  bookEvent: async (args, context) => {
    const req = context.req;

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    // 1) Verify the event exists
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    if (!fetchedEvent) {
      throw new Error('Event not found!');
    }

    // 2) Create and save the booking
    const booking = new Booking({
      user:  req.userId,       // Reference to User document
      event: fetchedEvent._id  // Reference to Event document
    });

    const result = await booking.save();

    // 3) Return the transformed booking
    return transformBooking(result);
  },

  /* -----------------------------------------------------------
   *  Mutation: cancelBooking
   * -----------------------------------------------------------
   *  Deletes a booking and returns the associated event,
   *  effectively “undoing” the reservation.
   * ---------------------------------------------------------- */
  cancelBooking: async (args, context) => {
    const req = context.req;

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    try {
      // 1) Look up the booking and pull in its event data
      const booking = await Booking.findById(args.bookingId).populate('event');
      if (!booking) {
        throw new Error('Booking not found!');
      }

      // 2) Store a transformed copy of the event (so we can return it)
      const event = transformEvent(booking.event);

      // 3) Remove the booking from the database
      await Booking.deleteOne({ _id: args.bookingId });

      // 4) Return the original event details
      return event;
    } catch (err) {
      throw err;
    }
  }
};
