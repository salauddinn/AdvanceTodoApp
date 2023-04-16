import { expect } from "chai";
import sinon from "sinon";
import { Comment } from "../CommentModal";
import * as commentService from '../CommentService';
import { NotFoundError } from "../../../errors/NotFoundError";

describe("CommentService", () => {
    let sandbox;


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

            expect(result.email).to.deep.equal(comment.email);
            expect(result.name).to.deep.equal(comment.name);
            expect(result.body).to.deep.equal(comment.body);
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
            }
        });
    });

    describe("updateComment", () => {
        it("should update a comment and return it", async () => {
            const commentId = "commentId";
            const userId = "userId";
            const email = "test@example.com";
            const name = "Test User";
            const body = "Test comment body";
            const comment = {
                _id: commentId,
                user: userId,
                email: "old-email@example.com",
                name: "Old User",
                body: "Old comment body",
                save: () => { }
            };

            const findOneStub = sandbox.stub(Comment, "findOne");
            findOneStub.withArgs({ _id: commentId, user: userId }).resolves(comment);


            const result = await commentService.updateComment(
                commentId,
                userId,
                email,
                name,
                body
            );

            expect(findOneStub.calledOnceWithExactly({ _id: commentId, user: userId })).to.be
                .true;
            expect(result.email).to.equal(email);
            expect(result.name).to.equal(name);
            expect(result.body).to.equal(body);
        });
        it("should throw NotFoundError if comment is not found", async () => {
            const commentId = "commentId";
            const userId = "userId";

            const findOneStub = sandbox.stub(Comment, "findOne");
            findOneStub.withArgs({ _id: commentId, user: userId }).resolves(null);

            try {
                await commentService.updateComment(commentId, userId, "", "", "");
                expect.fail("Expected NotFoundError was not thrown");
            } catch (error) {
                expect(error).to.be.instanceOf(NotFoundError);
            }
        });
    });
    describe("deleteComment", () => {
        it("should delete a comment and return 'comment deleted successfully'", async () => {
            const comment = {
                _id: "123",
                user: "456",
                remove: sandbox.stub().resolves(),
            };


            const findOneStub = sandbox.stub(Comment, "findOne");
            findOneStub.resolves(comment);

            const result = await commentService.deleteComment(comment._id, comment.user);
            expect(findOneStub.calledOnceWithExactly({ _id: comment._id, user: comment.user })).to.be.true;
            expect(comment.remove.calledOnce).to.be.true;
            expect(result).to.equal("comment deleted successfully");
        });

        it("should throw NotFoundError if comment is not found", async () => {
            const findOneStub = sandbox.stub(Comment, "findOne");
            findOneStub.resolves(null);

            try {
                await commentService.deleteComment("123", "456");
                expect.fail("Expected NotFoundError was not thrown");
            } catch (error) {
                expect(error).to.be.instanceOf(NotFoundError);
            }
        });
    });
});
