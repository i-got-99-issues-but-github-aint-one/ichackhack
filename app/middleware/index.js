import {json} from 'body-parser';
import cookieParser from 'cookie-parser';

export const cookies = cookieParser(process.env.COOKIE_KEY);
export const body = json();
export {default as auth} from './auth';
export {default as notFound} from './not-found';
export {default as error} from './error';
