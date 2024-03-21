import { rabbitInstance, RBMQ_URL, RBMQ_PUB_QUEUE, RBMQ_PUB_ROUTING_KEY } from "../../libs/amqplib";
import chalk from 'chalk'

interface PublisherOptions {
    replyQueue?: string | undefined | null
    replyRoutingKey?: string | undefined | null
    message: object
}

export const publishMessage = async (options: PublisherOptions) => {
    const rbmq =  rabbitInstance();
    rbmq.connect();
    rbmq.on('connected', async (EventListener) => {
        const { channel, conn } = EventListener;
        const targetQueue = options.replyQueue || RBMQ_PUB_QUEUE;
        const targetRoutingKey = options.replyRoutingKey || RBMQ_PUB_ROUTING_KEY;
        const exchange = await rbmq.createExchange({
            name: null, 
            type: 'direct',
            durable: true,
            autoDelete: false,
            internal: false,
            channel: channel
        });
        rbmq.createQueue({
            name: targetQueue,
            channel: channel,
            options: {
                durable: true
            }
        });
        await channel.bindQueue(targetQueue, exchange, targetRoutingKey)
        await channel.publish(exchange, targetRoutingKey, Buffer.from(JSON.stringify(options.message)))
        rbmq.setClosingState(true)
        await channel.close();
        await conn.close()
    })
    rbmq.on('error', error => {
        console.info(chalk.red(`[RBMQ] Error: ${error.message}`))
    })
    rbmq.on('reconnect', attempt => {
        console.info(`[RBMQ] Retrying connect to: ${chalk.yellow(RBMQ_URL.split('@')[1])}, attempt: ${chalk.green(attempt)}`)
    })
    rbmq.on('ECONNREFUSED', () => {
        // logger.error(`[RBMQ] Connection to ${RBMQ_URL.split('@')[1]} refused`)
        console.error(chalk.red(`[RBMQ] Connection to ${RBMQ_URL.split('@')[1]} refused`))
        return;
    })
}