import { expect } from "chai";
import sinon from "sinon";
import { AlreadyExist } from "../../../errors/AlreadyExist";
import { User } from "../UserModal";
import * as UserService from '../UserService';
import { NotFoundError } from "../../../errors/NotFoundError";

describe("UserService", () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("saveUser", () => {
        it("should save a user and return its id", async () => {
            const email = "test@test.com";
            const password = "password";
            const id = "643c07cb668e1666f8cdd246";
            const user = {
                id: "643c07cb668e1666f8cdd246",
                email: email,
                password: password,
                save: () => { }
            };

            const findOneStub = sandbox.stub(User, "findOne");
            findOneStub.resolves(null);

            const saveStub = sandbox.stub(User.prototype, "save");
            saveStub.resolves(user);

            const result = await UserService.saveUser(email, password);

            expect(findOneStub.calledOnceWithExactly({ email })).to.be.true;
            expect(saveStub.calledOnce).to.be.true;
        });

        it("should throw AlreadyExist if user already exists", async () => {
            const email = "test@test.com";
            const password = "password";
            const user = {
                id: "userId",
                email: email,
                password: password,
            };

            const findOneStub = sandbox.stub(User, "findOne");
            findOneStub.resolves(user);

            try {
                await UserService.saveUser(email, password);
                expect.fail("Expected AlreadyExist was not thrown");
            } catch (error) {
                expect(error).to.be.instanceOf(AlreadyExist);
            }
        });
    });

    describe("getUser", () => {
        it("should return a user by id", async () => {
            const id = "userId";
            const user = {
                id: id,
                email: "test@sds.com",
                password: "password",

            };
            const select = {
                select: sandbox.stub().resolves(user),
            }

            const findByIdStub = sandbox.stub(User, "findById");
            findByIdStub.returns(select);

            const result = await UserService.getUser(id);

            expect(findByIdStub.calledOnceWithExactly(id)).to.be.true;
            expect(result).to.deep.equal(user);
        });

        it("should throw NotFoundError if user is not found", async () => {
            const select = {
                select: sandbox.stub().resolves(null),
            }

            const findByIdStub = sandbox.stub(User, "findById");
            findByIdStub.returns(select);


            try {
                await UserService.getUser("userId");
                expect.fail("Expected NotFoundError was not thrown");
            } catch (error) {
                console.log(error)
                expect(error).to.be.instanceOf(NotFoundError);
            }
        });
    });
});
