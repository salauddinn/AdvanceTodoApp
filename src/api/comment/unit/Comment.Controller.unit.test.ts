import mongoose from "mongoose";
import sinon from "sinon";
import * as commentService from '../CommentService'
import { expect } from "chai";
import { NotFoundError } from "../../../errors/NotFoundError";
import { Comment } from "../CommentModal";

describe("CommentService", () => {
    let sandbox;

    before(() => {
        mongoose.connect("mongodb://localhost:27017/testdb");
    });

    after(() => {
        mongoose.connection.close();
    });

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("saveComment", () => {
        it("should save a comment and return it", async () => {
            const comment = {
                email: "test@example.com",
                name: "Test User",
                body: "Test comment body",
                post: "234252",
                user: "fdfdfd",
            };

            const saveStub = sandbox.stub(Comment.prototype, "save");
            saveStub.resolves(comment);

            const result = await commentService.saveComment(
                comment.email,
                comment.name,
                comment.body,
                comment.post,
                comment.user
            );

            expect(saveStub.calledOnce).to.be.true;
            expect(result).to.deep.equal(comment);
        });
    });

    describe("getAllComments", () => {
        it("should return all comments for a post", async () => {
            const postId = "2454676";
            const options = {
                page: 1,
                limit: 10,
                sort: { createdAt: -1 },
            };
            const paginationResult = {
                docs: [{}, {}],
                totalDocs: 2,
                totalPages: 1,
            };

            const paginateStub = sandbox.stub(Comment, "paginate");
            paginateStub.resolves(paginationResult);

            const result = await commentService.getAllComments(
                options.page,
                options.limit,
                postId
            );

            expect(paginateStub.calledOnceWithExactly({ post: postId }, options)).to.be
                .true;
            expect(result.comments).to.deep.equal(paginationResult.docs);
            expect(result.page).to.equal(options.page);
            expect(result.pages).to.equal(paginationResult.totalPages);
            expect(result.totalComments).to.equal(paginationResult.totalDocs);
        });
    });

    describe("getCommentById", () => {
        it("should return a comment by id", async () => {
            const comment = {
                _id: "rt5342345",
                email: "test@example.com",
                name: "Test User",
                body: "Test comment body",
            };

            const findOneStub = sandbox.stub(Comment, "findOne");
            findOneStub.resolves(comment);

            const result = await commentService.getCommentById(comment._id);

            expect(findOneStub.calledOnceWithExactly({ _id: comment._id })).to.be.true;
            expect(result).to.deep.equal(comment);
        });

        it("should throw NotFoundError if comment is not found", async () => {
            const findOneStub = sandbox.stub(Comment, "findOne");
            findOneStub.resolves(null);

            try {
                await commentService.getCommentById("");
                expect.fail("Expected NotFoundError was not thrown");
            } catch (error) {
                expect(error).to.be.instanceOf(NotFoundError);
                expect(error.message).to.equal("comment not found");
            }
        });
    });

});
