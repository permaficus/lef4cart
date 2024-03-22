import { rabbitInstance, RBMQ_CART_QUEUE, RBMQ_URL } from "../../libs/amqplib";
import chalk from 'chalk'

export const consumerInit = async () => {
    const rbmq = rabbitInstance();
    rbmq.connect();
    rbmq.on('connected', async (EventListener) => {
        const { channel, conn } = EventListener;
        await rbmq.createExchange({
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
                arguments: { 'x-queue-type': 'classic' }
            }
        });
        await channel.consume(RBMQ_CART_QUEUE, async (msg: any) => {
            if (msg) {
                /** start doing some stuff here */
                const { task, origin, payload } = JSON.parse(msg.content)
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
        // logger.error(`[RBMQ] Connection to ${RBMQ_URL.split('@')[1]} refused`)
        console.error(chalk.red(`[RBMQ] Connection to ${RBMQ_URL.split('@')[1]} refused`))
        return;
    })
}
