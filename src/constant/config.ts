import dotenv from 'dotenv';
dotenv.config().parsed;

export const RBMQ_URL = process.env.RBMQ_URL || 'amqp://username:password@localhost:5672'
export const RBMQ_CART_QUEUE = process.env.RBMQ_CART_QUEUE || 'cartMessageQueue'
export const RBMQ_CART_EXCHANGE = process.env.RBMQ_CART_EXCHANGE || 'lef4cart'
export const RBMQ_CART_ROUTING_KEY = process.env.RBMQ_CART_ROUTING_KEY || 'cartMessageRoutingKey'
export const RBMQ_PUB_QUEUE = process.env.RBMQ_PUB_QUEUE || 'pub.MessageQueue'
export const RBMQ_PUB_ROUTING_KEY = process.env.RBMQ_ROUTING_KEY || 'pub.RoutingKey'
export const SERVICE_LOCAL_PORT = process.env.SERVICE_LOCAL_PORT || 8081
export const NODE_ENV = process.env.NODE_ENV || 'DEVELOPMENT'