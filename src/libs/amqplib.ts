import amqplib from 'amqplib';
import {
    RBMQ_URL,
    RBMQ_CART_QUEUE
} from '../constant/config'
import EventEmitter from 'events'

class RabbitConnector extends EventEmitter {
    connection: any
    attempt: number
    maxAttempt: number
    userCloseConnection: boolean
    constructor(){
        super()
        this.connection = null
        this.attempt = 0
        this.maxAttempt = 20
        this.userCloseConnection = false
        this.onError = this.onError.bind(this)
        this.onClosed = this.onClosed.bind(this)
    }

    setClosingState = (value: boolean) => {
        this.userCloseConnection = value
    }

    connect = async () => {

        try {
            const conn = await amqplib.connect(RBMQ_URL)
    
            conn.on('error', this.onError)
            conn.on('close', this.onClosed)
    
            this.emit('connected', conn)
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

export const rabbitInstance = () => {
    return new RabbitConnector()
}