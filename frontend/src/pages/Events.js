import React, { Component } from 'react';

// Custom UI Components
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';

// Context for user authentication (token & userId)
import AuthContext from '../context/auth-context';
import config from '../config/config';

import './Events.css';

class EventsPage extends Component {
  // Initial component state
  state = {
    creating: false,         // Whether the "Create Event" modal is open
    events: [],              // All events fetched from the backend
    isLoading: false,        // Spinner toggle for loading state
    selectedEvent: null,     // Stores selected event for detail modal
    userBookings: []         // User's bookings to check booking status
  };

  // Used to prevent state updates on unmounted component
  isActive = true;

  // Enables this.context to access AuthContext
  static contextType = AuthContext;

  constructor(props) {
    super(props);

    // Refs for grabbing values from uncontrolled form fields
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  // Called when component is mounted
  componentDidMount() {
    this.fetchEvents(); // Load all events from backend
    if (this.context.token) {
      this.fetchUserBookings(); // Load user's bookings if authenticated
    }
  }

  // Triggered when "Create Event" is clicked
  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  // Submits the form from the "Add Event" modal
  modalConfirmHandler = () => {
    this.setState({ creating: false });

    // Grab form input values
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    // Simple validation
    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    // Event data to send
    const event = { title, price, date, description };
    console.log(event);

    // GraphQL mutation with variables
    const requestBody = {
      query: `
        mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!) {
          createEvent(eventInput: {title: $title, description: $desc, price: $price, date: $date}) {
            _id
            title
            description
            date
            price
          }
        }
      `,
      variables: {
        title: title,
        desc: description,
        price: price,
        date: date
      }
    };

    const token = this.context.token;

    // Send request to backend
    fetch(config.apiUrl, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log('Create Event API Response:', resData);
        if (resData.data && resData.data.createEvent) {
          // Append new event to local state
          this.setState(prevState => {
            const updatedEvents = [...prevState.events];
            updatedEvents.push({
              _id: resData.data.createEvent._id,
              title: resData.data.createEvent.title,
              description: resData.data.createEvent.description,
              date: resData.data.createEvent.date,
              price: resData.data.createEvent.price,
              creator: {
                _id: this.context.userId
              }
            });
            return { events: updatedEvents };
          });
        } else {
          console.error('Error creating event:', resData);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  // Cancel both create and view modals
  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  // Fetch all events from backend
  fetchEvents() {
    this.setState({ isLoading: true });

    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
      `
    };

    fetch(config.apiUrl, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log('Events API Response:', resData);
        if (resData.errors) {
          console.error('GraphQL Errors:', resData.errors);
          resData.errors.forEach(error => {
            console.error('Error message:', error.message);
            console.error('Error details:', error);
          });
        }
        if (resData.data && resData.data.events) {
          const events = resData.data.events;
          if (this.isActive) {
            this.setState({ events: events, isLoading: false });
          }
        } else {
          console.error('No events data received:', resData);
          if (this.isActive) {
            this.setState({ events: [], isLoading: false });
          }
        }
      })
      .catch(err => {
        console.log('Events fetch error:', err);
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

  // Fetch user's bookings to determine which events are already booked
  fetchUserBookings = () => {
    if (!this.context.token) {
      return; // Skip if not authenticated
    }

    const requestBody = {
      query: `
        query {
          bookings {
            _id
            event {
              _id
            }
          }
        }
      `
    };

    fetch(config.apiUrl, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        if (resData.data && resData.data.bookings) {
          const bookings = resData.data.bookings;
          if (this.isActive) {
            this.setState({ userBookings: bookings });
          }
        } else {
          if (this.isActive) {
            this.setState({ userBookings: [] });
          }
        }
      })
      .catch(err => {
        console.log('User bookings fetch error:', err);
        if (this.isActive) {
          this.setState({ userBookings: [] });
        }
      });
  }

  // Show event detail modal
  showDetailHandler = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return { selectedEvent: selectedEvent };
    });
  };

  // Book an event for the logged-in user
  bookEventHandler = () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }

    const requestBody = {
      query: `
        mutation BookEvent($id: ID!) {
          bookEvent(eventId: $id) {
            _id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        id: this.state.selectedEvent._id
      }
    };

    fetch(config.apiUrl, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        if (resData.data && resData.data.bookEvent) {
          // Refresh user bookings to update the UI
          this.fetchUserBookings();
        }
        this.setState({ selectedEvent: null });
      })
      .catch(err => {
        console.log(err);
      });
  };

  // Prevent setting state after unmount
  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    return (
      <React.Fragment>
        {/* Show backdrop if a modal is open */}
        {(this.state.creating || this.state.selectedEvent) && <Backdrop />}

        {/* "Create Event" modal */}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
            confirmText="Confirm"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.dateElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea id="description" rows="4" ref={this.descriptionElRef} />
              </div>
            </form>
          </Modal>
        )}

        {/* "Event Details" modal */}
        {this.state.selectedEvent && (
          <Modal
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm={this.context.token && !this.state.userBookings.some(booking => 
              booking.event && booking.event._id === this.state.selectedEvent._id
            )}
            onCancel={this.modalCancelHandler}
            onConfirm={this.bookEventHandler}
            confirmText={this.context.token ? 'Book' : 'Confirm'}
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>
              ${this.state.selectedEvent.price} -{' '}
              {new Date(this.state.selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        )}

        {/* Button to trigger event creation if logged in */}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}

        {/* Spinner while loading, otherwise list events */}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EventList
            events={this.state.events}
            authUserId={this.context.userId}
            userBookings={this.state.userBookings}
            onViewDetail={this.showDetailHandler}
          />
        )}
      </React.Fragment>
    );
  }
}

export default EventsPage;
