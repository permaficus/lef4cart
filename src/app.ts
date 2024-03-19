import { 
    httpServer, 
    httpServerInit, 
    SERVICE_LOCAL_PORT, 
    NODE_ENV
} from "./libs/service.init";
import chalk from 'chalk'

(async () => {
    await httpServerInit();
    httpServer.listen(SERVICE_LOCAL_PORT, () => {
        console.log(
            `-----------------------------------------
            \n${chalk.black.bgGreenBright(`🚀 Lef4Cart Service is Up and Running\n`
            )}\nMode: ${chalk.blueBright(
              `${NODE_ENV}`
            )}\nURL: ${chalk.blueBright(
              `http://localhost:${SERVICE_LOCAL_PORT}`
            )}\nTime: ${chalk.blueBright(
                `${new Date(Date.now())}`
            )}\n\n-----------------------------------------`
          );
    })
})()