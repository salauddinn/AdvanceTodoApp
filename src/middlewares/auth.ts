import { NextFunction, Request, Response } from "express";
import { UserDocument } from "../controllers/user/UserModal";
import logger from "../logger";

const jwt = require("jsonwebtoken");
export interface AuthenticatedRequest extends Request {
    user?: UserDocument;
}
const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Auth Error please login and try again" });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, "randomString");
        req.user = decoded.user;
        next();
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Invalid Token" });
    }
};
export default authMiddleware;  