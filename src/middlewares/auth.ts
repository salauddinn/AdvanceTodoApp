import { NextFunction, Response, Request } from "express";
import { UserDocument } from "../models/UserModal";

const jwt = require("jsonwebtoken");
export interface AuthenticatedRequest extends Request {
    user?: UserDocument;
}
module.exports = function (req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.header("token");
    if (!token) return res.status(401).json({ message: "Auth Error" });

    try {
        const decoded = jwt.verify(token, "randomString");
        req.user = decoded.user;
        next();
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Invalid Token" });
    }
};