import { Request, Response } from "express";
import mssql from 'mssql'
import {v4} from 'uuid'
import bcrypt from 'bcrypt'
import { sqlConfig } from "../config/sqlConfig";
import jwt from 'jsonwebtoken'
import { LoginEmployee } from "../interfaces/employee";
import Connection from "../dbhelpers/dbhelpers";
import { ExtendedEmployee } from "../middleware/verifyToken";


const dbhelper = new Connection

//register Employee
export const registerEmployee = async(req:Request,res:Response)=>{
    try{
        let {name,email,phone_no,id_no,password} = req.body
        let employee_id = v4()
        const hashedPwd = await bcrypt.hash(password,5)


        const pool = await mssql.connect(sqlConfig)
        let result =   await pool.request()
        .input("employee_id",mssql.VarChar,employee_id)
        .input("name",mssql.VarChar,name)
        .input("email",mssql.VarChar,email)
        .input("phone_no",mssql.VarChar,phone_no)
        .input("id_no",mssql.VarChar,id_no)
        .input("password",mssql.VarChar,hashedPwd)
        .execute('registerEmployee')

//dbhelper

        // let result = dbhelper.execute('registerEmployee',{
        //     employee_id,name,email,phone_no,id_no,password:hashedPwd
        // });

        return res.status(200).json({
            message:'Emplyee registered successfully'
        })
    }catch(error){
        return res.json({
            error:error
        })
    }
}

//login Employee
export const loginEmployee = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const pool = await mssql.connect(sqlConfig);

        let user = await (await pool
            .request()
            .input('email', mssql.VarChar, email)
            .input('password',mssql.VarChar,password)
            .execute('loginEmployee')).recordset;

        if (user.length === 1) {
            const correctPwd = await bcrypt.compare(password, user[0].password);

            if (!correctPwd) {
                return res.status(401).json({
                    message: 'Incorrect password',
                });
            }

            const loginCredentials = user.map((record) => {
                const { phone_no, id_no, password, ...rest } = record;
                return rest;
            });

            const token = jwt.sign(loginCredentials[0], process.env.SECRET as string, {
                expiresIn: '3600s',
            });

            return res.status(200).json({
                message: 'Logged in successfully',
                token,
            });
        } else {
            return res.status(401).json({
                message: 'Email not found',
            });
        }
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
}

//prevent users who dont have token
export const checkUserDetails = async (req:ExtendedEmployee,res:Response)=>{
    if(req.info){
        res.json({
            info:req.info
        })
    }

}


export const getAllEmployees = async (req:Request,res:Response)=>{
    try {

        const pool = await mssql.connect(sqlConfig)

     let employees  =   (await pool.request().execute('fetchAllEmployees')).recordset
     return res.json({
        employees:employees
     })
        
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
            message: 'Internal Server Error',
        });
        
    }
}
