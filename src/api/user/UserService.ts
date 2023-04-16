import { AlreadyExist } from "../../errors/AlreadyExist";
import { InvalidToken } from "../../errors/InvalidToken";
import { NotFoundError } from "../../errors/NotFoundError";
import { UserRouter } from "./UserController";
import { User } from "./UserModal";
import bcrypt from 'bcrypt';

export const saveUser = async (email: string, password: string) => {
    let user = await User.findOne({
        email,
    });
    if (user) {
        throw new AlreadyExist("User already exists")
    }

    user = new User({
        email,
        password,
    });
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    return {
        user: {
            id: user.id,
        },
    };
}

export const getUser = async (id: string) => {

    const user = await User.findById(id).select('-password');

    if (!user) {
        throw new NotFoundError("User doesn not exist")
    }
    return user;
}
export const loginUser = async (email: string, password: string) => {

    const user = await User.findOne({
        email,
    });

    if (!user) {
        throw new NotFoundError("User doesn not exist")
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new InvalidToken("Incorrect password")
    }

    return {
        user: {
            id: user.id,
        },
    };
}