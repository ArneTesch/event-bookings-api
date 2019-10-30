const Event = require("../../models/event");
const User = require("../../models/user");
const Dataloader = require("dataloader");
const { dateToString } = require("../../helpers/date");

const eventLoader = new Dataloader(eventIds => {
  return events(eventIds);
});

const userLoader = new Dataloader(userIds => {
  // find user which's id is in the array of userIds -> returns .then-able function
  console.log(userIds);

  return User.find({ _id: { $in: userIds } });
});

// manual population >> Helper functions
const events = async eventIds => {
  // async/await always returns the topmost promise
  // retrieve all events that have their ID in the pool of Id's provided in the args
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (error) {
    throw error;
  }
};

const user = async userId => {
  try {
    // id in MongoDb is an object > dataloader checks if there are equal values > Because the id's are objects,
    // they are not seen as equal >> .toString()
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await eventLoader.load(eventId.toString());
    // No need to transform it again, this is done in the events function by the dataloader
    return event;
  } catch (error) {
    throw error;
  }
};

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator)
  };
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;

// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;
