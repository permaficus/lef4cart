import { rabbitInstance, RBMQ_URL, RBMQ_PUB_QUEUE, RBMQ_PUB_ROUTING_KEY } from "../../libs/amqplib";
import chalk from 'chalk'

export const publishMessage = async (message: any) => {
    const rbmq =  rabbitInstance();
    rbmq.connect();
    rbmq.on('connected', async (EventListener) => {
        const { channel, conn } = EventListener;
        const exchange = await rbmq.createExchange({
            name: null, 
            type: 'direct',
            durable: true,
            autoDelete: false,
            internal: false,
            channel: channel
        });
        rbmq.createQueue({
            name: RBMQ_PUB_QUEUE,
            channel: channel,
            options: {
                durable: true
            }
        })
        await channel.bindQueue(RBMQ_PUB_QUEUE, exchange, RBMQ_PUB_ROUTING_KEY)
        await channel.publish(exchange, RBMQ_PUB_ROUTING_KEY, Buffer.from(JSON.stringify(message)))
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