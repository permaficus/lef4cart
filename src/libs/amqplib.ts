import amqplib from 'amqplib';
import {
    RBMQ_URL,
    RBMQ_CART_EXCHANGE,
    RBMQ_CART_QUEUE,
    RBMQ_PUB_ROUTING_KEY,
    RBMQ_PUB_QUEUE
} from '../constant/config'
import EventEmitter from 'events'

interface BrokerExchange {
    channel: any
    name: string | undefined | null
    type: 'direct' | 'fanout' | 'headers' | 'topics'
    durable: boolean
    autoDelete?: boolean
    internal?: boolean
}
interface QueueType {
    name: string | undefined | null
    channel: any,
    options?: {
        durable: boolean,
        arguments?: {
            'x-queue-type'?: 'classic' | 'quorum' | 'stream',
            'x-dead-letter-exchange'?: string | string[] | null,
            'x-dead-letter-routing-key'?: string | string[] | null
        }
    }
}
class RabbitConnector extends EventEmitter {
    connection: any
    attempt: number
    maxAttempt: number
    userCloseConnection: boolean
    defaultExchange: string

    constructor(){
        super()
        this.connection = null
        this.attempt = 0
        this.maxAttempt = 20
        this.userCloseConnection = false
        this.defaultExchange = RBMQ_CART_EXCHANGE
        this.onError = this.onError.bind(this)
        this.onClosed = this.onClosed.bind(this)
    }

    setClosingState = (value: boolean) => {
        this.userCloseConnection = value
    }

    connect = async () => {

        try {
            const conn = await amqplib.connect(RBMQ_URL);
            const channel = await conn.createChannel();
            const EventListener = { conn, channel }
            conn.on('error', this.onError)
            conn.on('close', this.onClosed)
            this.emit('connected', EventListener)
            this.connection = conn
            this.attempt = 0
        } catch (error: any) {
            if (error.code == 'ECONNREFUSED') {
                this.emit('ECONNREFUSED', error.message);
                if (this.attempt >= this.maxAttempt) {
                    return
                }
            }
    
            if ((/ACCESS_REFUSED/g).test(error.message) == true) {
                this.emit('ACCREFUSED', error.message);
                return;
            }
            
            this.onError(error)
        }
    }

    createExchange = async (options: BrokerExchange) => {
        await options.channel.assertExchange(
            options.name || this.defaultExchange, 
            options.type, 
            {
                durable: options.durable,
                autoDelete: options.autoDelete,
                internal: options.internal
        });
        return options.name || this.defaultExchange
    }
    createQueue = async (config: QueueType) => {
        await config.channel.assertQueue(config.name, { ...config.options })
    }
    reconnect = () => {
        this.attempt++
        this.emit('reconnect', this.attempt)
        setTimeout((async () => await this.connect()), 5000);
    }

    onError = (error: any) => {
        this.connection = null,
        this.emit('error', error)
        if (error.message !== 'Connection closing') {
            this.reconnect();
        }
    }

    onClosed = () => {
        this.connection = null
        this.emit('close', this.connection)
        if (!this.userCloseConnection) {
            this.reconnect();
        }
    }
}

const rabbitInstance = () => {
    return new RabbitConnector()
}

export { rabbitInstance, RBMQ_CART_QUEUE, RBMQ_URL, RBMQ_CART_EXCHANGE, RBMQ_PUB_ROUTING_KEY, RBMQ_PUB_QUEUE}