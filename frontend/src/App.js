import React, { Component } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

import './App.css';

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Routes>
                {this.state.token && <Route path="/" element={<Navigate to="/events" replace />} />}
                {this.state.token && <Route path="/auth" element={<Navigate to="/events" replace />} />}
                {!this.state.token && <Route path="/auth" element={<AuthPage />} />}
                <Route path="/events" element={<EventsPage />} />
                {this.state.token && <Route path="/bookings" element={<BookingsPage />} />}
                {!this.state.token && <Route path="*" element={<Navigate to="/auth" replace />} />}
              </Routes>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
