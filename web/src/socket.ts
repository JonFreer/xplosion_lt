import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? window.location.hostname : 'http://localhost:4001';
const PATH = process.env.NODE_ENV === 'production' ? '/api/socket.io' : '/socket.io'
console.log(URL,PATH)
export const socket = io(URL,{ path: PATH });

