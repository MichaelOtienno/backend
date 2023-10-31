import express from 'express'
import cron from 'node-cron'
import { welcomeUser } from './mailservices/welcomeUser';


const app = express();

const run = async()=>{
   
    cron.schedule('*/10 * * * * *', () => {
        console.log('check new user');
         welcomeUser();
    });

}
run()

app.listen(4400,async ()=>{
    console.log("mail server running on port 4400");

})