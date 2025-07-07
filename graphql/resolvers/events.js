// Mongoose models
const Event = require('../../models/event');
const User  = require('../../models/user');

// Utility that converts a raw Event document into the public‑facing shape
const { transformEvent } = require('./merge');

module.exports = {
  /* ------------------------------------------------------------------
   *  Query: events
   *  -----------------------------------------------------------------
   *  Returns all events in the database, each passed through
   *  transformEvent() so the caller gets nicely formatted data.
   * ----------------------------------------------------------------- */
  events: async () => {
    try {
      const events = await Event.find();          // Fetch *all* events
      return events.map(event => transformEvent(event));
    } catch (err) {
      throw err;                                  // Bubble up errors
    }
  },

  /* ------------------------------------------------------------------
   *  Mutation: createEvent
   *  -----------------------------------------------------------------
   *  Adds a new event to the DB, ties it to the authenticated user,
   *  and returns the newly created event (also transformed).
   *
   *  args:     GraphQL args (contains eventInput.{title,description…})
   *  context:  Holds the Express request, so we can check auth status
   * ----------------------------------------------------------------- */
  createEvent: async (args, context) => {
    const req = context.req;

    // Guard clause: only authenticated users may create events
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    // Build a new Event instance
    const event = new Event({
      title:       args.eventInput.title,
      description: args.eventInput.description,
      price:       +args.eventInput.price,          // Unary + → number
      date:        new Date(args.eventInput.date),
      creator:     req.userId                       // Link to user
    });

    let createdEvent;  // Will hold the transformed version we return

    try {
      // 1) Save the event to MongoDB
      const result = await event.save();

      // 2) Convert to API‑friendly format
      createdEvent = transformEvent(result);

      // 3) Add this event to the creator’s createdEvents array
      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdEvents.push(event);
      await creator.save();

      // 4) Return the transformed event
      return createdEvent;

    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
