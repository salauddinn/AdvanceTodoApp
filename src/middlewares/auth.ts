import { NextFunction, Request, Response } from "express";
import { UserDocument } from "../api/user/UserModal";
import { redisClient } from "../config/redisConfig";

const jwt = require("jsonwebtoken");
export interface AuthenticatedRequest extends Request {
    user: {
        id: string
    };
}

const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log("auth middleware");
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: "Auth Error, please provide a token" });
    }

    const token = authHeader.split(" ")[1];
    let payload: any;
    try {
        payload = jwt.verify(token, "TodoApp");
        req.user = payload.user;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {

            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({ message: "Auth Error, please provide a refresh token" });
            }
            console.log("Refresh token", refreshToken)
            try {
                const decodedRefreshToken = jwt.verify(refreshToken, "TodoAppRefreshToken");
                console.log("Refresh token", decodedRefreshToken.userId)

                const data = await redisClient.get(`refreshToken${decodedRefreshToken.userId}`);
                console.log(data)
                if (data != null && data === refreshToken) {
                    const newPayload = { user: decodedRefreshToken.userId };
                    const newAccessToken = jwt.sign(newPayload, "TodoApp", { expiresIn: "1h" });
                    res.cookie("accessToken", newAccessToken, { httpOnly: true, secure: true, sameSite: "strict" });
                    req.user = {
                        id: decodedRefreshToken.userId
                    };
                    next()
                }
                else {
                    res.status(401).json({ message: "Auth Error, token is not matched" });
                }
            } catch (err) {
                console.error(err);
                res.status(401).json({ message: "Auth Error, refresh token is invalide" });
            }
        } else {
            console.error(err);
            res.status(401).json({ message: "Auth Error, token is invalid" });
        }
    }
};

export default authMiddleware;
