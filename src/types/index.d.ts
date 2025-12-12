import {jwtPayload} from 'jsonwebtoken'

declare global {
    namespace Express {
        interface Request {
            users?:jwtPayload
        }
    }
}

export type Role = {
    admin:'admin';
    customer:'customer'
}