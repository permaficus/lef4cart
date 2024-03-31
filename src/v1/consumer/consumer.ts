import { rabbitInstance, RBMQ_CART_QUEUE, RBMQ_URL, RBMQ_CART_ROUTING_KEY } from "../../libs/amqplib";
import { handlingData } from "../worker/dataHandler";
import chalk from 'chalk'

export const consumerInit = async () => {
    const rbmq = rabbitInstance();
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
        await rbmq.createQueue({
            channel: channel,
            name: RBMQ_CART_QUEUE,
            options: {
                durable: true,
                arguments: { 
                    'x-queue-type': 'classic',
                    "x-dead-letter-exchange": exchange
                }
            }
        });
        await channel.bindQueue(RBMQ_CART_QUEUE, exchange, RBMQ_CART_ROUTING_KEY)
        await channel.consume(RBMQ_CART_QUEUE, async (msg: any) => {
            if (msg) {
                /** start doing some stuff here */
                const { task, origin, payload } = JSON.parse(msg.content);
                try {
                    await handlingData(task, payload, origin, { useMqtt: true })
                    channel.ack(msg)
                } catch (error: any) {
                    const errObject = JSON.parse(error.message)
                    if (errObject.status && errObject.code) {
                        channel.ack(msg)
                    } else {
                        channel.nack(msg, true, true)
                    }
                }
            }
        });
        process.once('SIGINT' || 'exit' || 'SIGKILL', async () => {
            rbmq.setClosingState(true);
            await channel.close();
            await conn.close();
            process.exit(1)
        })
    
        console.log(chalk.yellow("[RBMQ] Waiting for messages. To exit press CTRL+C\n"));
    });
    rbmq.on('error', error => {
        console.info(chalk.red(`[RBMQ] Error: ${error.message}`))
    })
    rbmq.on('reconnect', attempt => {
        console.info(`[RBMQ] Retrying connect to: ${chalk.yellow(RBMQ_URL.split('@')[1])}, attempt: ${chalk.green(attempt)}`)
    })
    rbmq.on('ECONNREFUSED', () => {
        console.error(chalk.red(`[RBMQ] Connection to ${RBMQ_URL.split('@')[1]} refused`))
        return;
    })
}
