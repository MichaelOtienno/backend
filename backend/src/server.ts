import express, { NextFunction, Request, Response, json } from 'express'
import employee_router from './routes/employeeRoutes';

const app  = express();

app.use(json())


app.use('/employee',employee_router)
app.use((error:Error,req:Request,res:Response,next:NextFunction)=>{
    res.json({
        message:error.message
    })
});

app.listen(4500,()=>{
    console.log("server running on port 4500")
});

