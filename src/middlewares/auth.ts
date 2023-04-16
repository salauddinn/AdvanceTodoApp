import { NextFunction, Request, Response } from "express";
import { UserDocument } from "../api/user/UserModal";

const jwt = require("jsonwebtoken");
export interface AuthenticatedRequest extends Request {
    user?: UserDocument;
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
            try {
                const decodedRefreshToken = jwt.verify(refreshToken, "TodoAppRefreshToken");
                payload = decodedRefreshToken
                const newPayload = { user: payload.user };
                const newAccessToken = jwt.sign(newPayload, "TodoApp", { expiresIn: "1h" });
                res.cookie("accessToken", newAccessToken, { httpOnly: true, secure: true, sameSite: "strict" });
                req.user = payload.user;
                next();
            } catch (err) {
                console.error(err);
                res.status(401).json({ message: "Auth Error, refresh token is invalid" });
            }
        } else {
            console.error(err);
            res.status(401).json({ message: "Auth Error, token is invalid" });
        }
    }
};

export default authMiddleware;
