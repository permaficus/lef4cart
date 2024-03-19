import dotenv from 'dotenv';
dotenv.config().parsed;

export const RBMQ_URL = process.env.RBMQ_URL || 'amqp://username:password@localhost:5672'
export const RBMQ_CART_QUEUE = process.env.RBMQ_CART_QUEUE || 'cartMessageQueue'
export const SERVICE_LOCAL_PORT = process.env.SERVICE_LOCAL_PORT || 8081
export const NODE_ENV = process.env.NODE_ENV || 'DEVELOPMENT'