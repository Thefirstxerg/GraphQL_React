// Import necessary modules
const DataLoader = require('dataloader'); // Used to batch and cache database requests for better performance
const Event = require('../../models/event'); // Event Mongoose model
const User = require('../../models/user');   // User Mongoose model
const { dateToString } = require('../../helpers/date'); // Helper to format dates

// DataLoader to cache and batch event requests
const eventLoader = new DataLoader(eventIds => {
  return events(eventIds); // This will call the 'events' function with a list of event IDs
});

// DataLoader to cache and batch user requests
const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } }); // Find all users whose IDs are in the userIds array
});

// Function to fetch and transform multiple events based on their IDs
const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } }); // Get matching events from DB

    // Sort the events to match the order of eventIds
    events.sort((a, b) => {
      return (
        eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
      );
    });

    // Transform each event before returning
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err; // Re-throw error if something goes wrong
  }
};

// Fetch a single event using the DataLoader cache
const singleEvent = async eventId => {
  try {
    const event = await eventLoader.load(eventId.toString()); // Load event by ID
    return event;
  } catch (err) {
    throw err;
  }
};

// Fetch a single user using DataLoader and transform the data
const user = async userId => {
  try {
    const user = await userLoader.load(userId.toString()); // Load user by ID
    return {
      ...user._doc, // Spread the user document fields
      _id: user.id,
      // Lazily load the events the user created using eventLoader
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

// This function fetches all events created by a user
// Format and transform a single event document
const transformEvent = event => {
  return {
    ...event._doc, // Spread all fields from the Mongoose document
    _id: event.id,
    date: dateToString(event._doc.date), // Convert date to string
    creator: user.bind(this, event.creator) // Lazily load creator data using 'user' function
  };
};


// Format and transform a single booking document
const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user), // Lazily load user info
    event: singleEvent.bind(this, booking._doc.event), // Lazily load event info
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};

// Export transformation functions to be used elsewhere
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;

// Optional exports if needed elsewhere:
// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;
