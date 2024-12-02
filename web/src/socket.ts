import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? window.location.hostname : 'http://localhost:4000';
console.log(URL)
export const socket = io(URL,{ path: '/api/socket.io' });

