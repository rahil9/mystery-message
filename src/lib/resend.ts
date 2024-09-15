import { Resend } from 'resend';

// exporting so that whenever we import this file all the api work is done on a single place itself
export const resend = new Resend(process.env.RESEND_API_KEY);