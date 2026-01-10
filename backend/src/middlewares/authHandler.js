import jwt from "jsonwebtoken";
import { ServerAuthError } from "../errors/AuthorizationError.js";
import { AuthenticationError } from "../errors/AuthenticationError.js";

export const verifyToken = (req, res, next) => {
    try {
        //  Bearer <TokenName>
        const headerAuthText = req.headers.authorization;
        
        if (!headerAuthText) throw new AuthenticationError();

        const headerAuthList = headerAuthText.split(' ');
    
        if (headerAuthList[0].toLowerCase() != "bearer") throw new ServerAuthError();

        const token = headerAuthList[1];

        // return the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // check if payload has userId
        if ("userId" in decoded) {
            req.userId = decoded.userId;
        } else {
            throw new ServerAuthError();
        }

        next();
    } catch (err) {
        next(err);
    }
}