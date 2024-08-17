import os from 'os';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import '@/app/connection';
import Routes from '@/routes';
import * as Exception from '@/app/exception';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));

app.use('/public', express.static('public'));

app.use(Routes);

app.use(Exception.sendNotFoundError);
app.use(Exception.catchCustomError);

Exception.catchGlobalError();

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Local:   http://localhost:${process.env.PORT}/`);

    const networkInterfaces = os.networkInterfaces();
    for (const networkInfo of Object.values(networkInterfaces)) {
        networkInfo?.forEach(info => {
            if (info.family === 'IPv4' && !info.internal) {
                console.log(`Network: http://${info.address}:${process.env.PORT}/`);
            }
        });
    }
});
