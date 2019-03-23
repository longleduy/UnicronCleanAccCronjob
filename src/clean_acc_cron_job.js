import Agenda from 'agenda'
import './utils/mongoose'
import {userModel} from './models/user_model'
    try {
        let agenda = new Agenda({ db: { address: process.env.MONGODB_PATH} });
        agenda.define('remove accounts', async (job,done) => {
            const deleteInfo = await userModel.deleteMany({active:false,createTime:{$lt: new Date((new Date()).getTime() - 1*24*60*60000)}});
            console.log(`${deleteInfo.n} acounts were removed`);
            done();
        })
        agenda.on('ready', async function () {
            //agenda.every('5 seconds','email sender');
            agenda.every('5 seconds','remove accounts');
            agenda.start();
            console.log(`Remove accounts not active started`);

        });
        function graceful(){
            console.log('Something is gonna blow up.');
            agenda.stop(() => process.exit(0));
        }
        process.on('SIGTERM', graceful);
        process.on('SIGINT', graceful);
    } catch (error) {
        throw error;
    }
