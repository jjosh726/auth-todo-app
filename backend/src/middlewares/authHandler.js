import jwt from "jsonwebtoken";
import { AuthorizationError } from "../errors/AuthorizationError";

const verifyToken = (req, res, next) => {
    try {
        //  Bearer <TokenName>
        const headerAuthText = req.header.authorization;
        
        if (!headerAuthText) throw new AuthorizationError();

        const headerAuthList = split(headerAuthText);
    
        if (headerAuthList[0] != "Bearer") throw new ServerAuthError();

        const token = headerAuthList[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;

        next();
    } catch (err) {
        next(err);
    }
}