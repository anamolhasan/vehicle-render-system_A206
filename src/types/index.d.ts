import {jwtPayload} from 'jsonwebtoken'

declare global {
    namespace Express {
        interface Request {
            users?:jwtPayload
        }
    }
}