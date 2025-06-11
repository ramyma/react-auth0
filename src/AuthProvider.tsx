import React from 'react';
import authState from './authState';

/**
 * Proposed alternative to token state managment, look at `useAuth` for more.
 */
const AuthContext = React.createContext(authState);

export default AuthContext;
