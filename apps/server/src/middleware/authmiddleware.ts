import express, { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken'; 
import { prisma } from '..';
import { User } from '@prisma/client';

export interface requestwithuser extends Request{
    user  : User
} 

export const authmiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const cookie = req.cookies
    const token = cookie?.token?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "User not logged in." }); // 401 Unauthorized
    }

    try {
        
        const decoded  =  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as JwtPayload;
        const user = await prisma.user.findUnique({ where: { id:decoded.userId } }); 
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        
        (req as requestwithuser).user = user;
        
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token has expired. Please log in again." }); // Token expired
        }
        return res.status(403).json({ message: "Invalid token." }); // 403 Forbidden
    }
    
 }