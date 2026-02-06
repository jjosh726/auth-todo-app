import jwt from "jsonwebtoken";
import { AuthenticationError } from "../errors/AuthenticationError.js";

export const verifyToken = (req, res, next) => {
    try {
        const accessToken = req.cookies.access_token;

        if (!accessToken) {
            return tryRefresh(req, res, next);
        }

        // return the payload
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

        req.userId = decoded.userId;
        next();
    } catch (err) {
        return tryRefresh(req, res, next);
    }
}

const tryRefresh = (req, res, next) => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) throw new AuthenticationError();

    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

        // create new access token
        const accessToken = jwt.sign(
            { userId : payload.userId },
            process.env.JWT_SECRET,
            { expiresIn : process.env.JWT_EXPIRATION }
        );

        res.cookie("access_token", accessToken, {
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : "strict",
            path : "/",
            maxAge : 60 * 60 * 1000
        });

        req.userId = payload.userId;
        next();
    } catch (err) {
        throw new AuthenticationError();
    }
}