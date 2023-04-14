import express from 'express';
import config  from './config/serverConfig';

const setUpAndStartServer = async () => {
    const app = express();
    app.listen(config.PORT, () => {
        console.log(`Server🚀 Started at ${config.PORT}`);
    });
}
setUpAndStartServer();