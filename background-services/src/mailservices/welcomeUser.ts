import express from 'express'
import ejs from 'ejs'
import mssql from 'mssql'
import dotenv from 'dotenv'
import { sqlConfig } from '../config/sqlConfig'
import { sendMail } from '../helpers/emailHelpers'

dotenv.config()


export const welcomeUser = async () => {
        const pool = await mssql.connect(sqlConfig);
        const employees = (await pool.request().query('SELECT * FROM Employees WHERE welcome = 0')).recordset
        
        console.log(employees);
        for (let employee of employees){
            ejs.renderFile('templates/welocmeUser.ejs',{Name:employee.NAME},async(error,data)=>{
                let mailOptions = {
                    from:process.env.EMAIL as string,
                    to:employee.email,
                    subject:"Welcome Onboard",
                    html:data
                }
                try {
                    await sendMail(mailOptions)
                    await pool.request().query('UPDATE Employees SET welcome = 1 WHERE welcome  = 0')
                    console.log('Email sent to new users');
                } catch (error) {
                    console.log(error);
                    
                }
        }   )}
   
};
    



