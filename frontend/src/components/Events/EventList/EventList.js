import React from 'react';

import EventItem from './EventItem/EventItem';
import './EventList.css';

const eventList = props => {
  const events = props.events.map(event => {
    // Check if the current user has booked this event
    const isBooked = props.userBookings && props.userBookings.some(booking => 
      booking.event && booking.event._id === event._id
    );

    return (
      <EventItem
        key={event._id}
        eventId={event._id}
        title={event.title}
        price={event.price}
        date={event.date}
        userId={props.authUserId}
        creatorId={event.creator ? event.creator._id : null}
        isBooked={isBooked}
        onDetail={props.onViewDetail}
      />
    );
  });

  return <ul className="event__list">{events}</ul>;
};

export default eventList;
