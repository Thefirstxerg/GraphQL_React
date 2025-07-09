// Import necessary modules
const DataLoader = require('dataloader'); // Used to batch and cache database requests for better performance
const Event = require('../../models/event'); // Event Mongoose model
const User = require('../../models/user');   // User Mongoose model
const { dateToString } = require('../../helpers/date'); // Helper to format dates

// DataLoader to cache and batch event requests
const eventLoader = new DataLoader(async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } }); // Get matching events from DB

    // Return events in the same order as eventIds, ensuring same length
    return eventIds.map(id => {
      const event = events.find(event => event._id.toString() === id.toString());
      return event ? transformEvent(event) : null;
    });
  } catch (err) {
    throw err;
  }
});

// DataLoader to cache and batch user requests
const userLoader = new DataLoader(async userIds => {
  try {
    const users = await User.find({ _id: { $in: userIds } }); // Find all users whose IDs are in the userIds array
    
    // Sort users to match the order of userIds and ensure same length
    return userIds.map(id => {
      return users.find(user => user._id.toString() === id.toString()) || null;
    });
  } catch (err) {
    throw err;
  }
});

// Function to fetch and transform multiple events based on their IDs
const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } }); // Get matching events from DB

    // Return events in the same order as eventIds
    return eventIds.map(id => {
      const event = events.find(event => event._id.toString() === id.toString());
      return event ? transformEvent(event) : null;
    }).filter(event => event !== null); // Remove null entries for this function
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
    if (!user) {
      return null; // Return null if user not found
    }
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
    creator: event.creator ? user.bind(this, event.creator) : () => null // Lazily load creator data using 'user' function, or return null if no creator
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
