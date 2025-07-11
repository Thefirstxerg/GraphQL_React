import React from 'react';

import './EventItem.css';
import { formatDate, formatPrice } from '../../../../utils/helpers';

const eventItem = props => (
  <li key={props.eventId} className="events__list-item">
    <div className="events__list-item-content">
      <h1>{props.title}</h1>
      <h2>
        {formatPrice(props.price)} - {formatDate(props.date)}
      </h2>
      {props.description && <p>{props.description}</p>}
    </div>
    <div className="events__list-item-actions">
      {props.userId === props.creatorId ? (
        <p style={{ margin: 0, color: '#10b981', fontWeight: '500', fontSize: '0.875rem' }}>
          You own this event
        </p>
      ) : props.isBooked ? (
        <p style={{ margin: 0, color: '#f59e0b', fontWeight: '500', fontSize: '0.875rem' }}>
          Already booked
        </p>
      ) : (
        <button className="btn" onClick={props.onDetail.bind(this, props.eventId)}>
          View Details
        </button>
      )}
    </div>
  </li>
);

export default eventItem;
