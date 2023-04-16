import { expect } from "chai";
import sinon from "sinon";
import { Post } from "../PostModal";
import * as postService from '../PostService';
import { NotFoundError } from "../../../errors/NotFoundError";

describe("PostService", () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("savePost", () => {
        it("should save a post and return it", async () => {
            const post = {
                title: "title",
                body: "Test post body",
                user: "fdfdfd",
            };

            const saveStub = sandbox.stub(Post.prototype, "save");
            saveStub.resolves(post);

            const result = await postService.savePost(
                post.title,
                post.body,
                post.user
            );
            expect(saveStub.calledOnce).to.be.true;

            expect(result.title).to.deep.equal(post.title);
            expect(result.body).to.deep.equal(post.body);
        });
    });

    describe("getAllPosts", () => {
        it("should return all posts for a post", async () => {
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

            const paginateStub = sandbox.stub(Post, "paginate");
            paginateStub.resolves(paginationResult);

            const result = await postService.getAllPosts(
                options.page,
                options.limit,
            );

            expect(paginateStub.calledOnceWithExactly({}, options)).to.be
                .true;
            expect(result.posts).to.deep.equal(paginationResult.docs);
            expect(result.page).to.equal(options.page);
            expect(result.pages).to.equal(paginationResult.totalPages);
            expect(result.totalPosts).to.equal(paginationResult.totalDocs);
        });
    });

    describe("getPostById", () => {
        it("should return a post by id", async () => {
            const post = {
                _id: "rt5342345",
                title: "Test User",
                body: "Test post body",
            };

            const findOneStub = sandbox.stub(Post, "findOne");
            findOneStub.resolves(post);

            const result = await postService.getPost(post._id);

            expect(findOneStub.calledOnceWithExactly({ _id: post._id })).to.be.true;
            expect(result).to.deep.equal(post);
        });

        it("should throw NotFoundError if post is not found", async () => {
            const findOneStub = sandbox.stub(Post, "findOne");
            findOneStub.resolves(null);

            try {
                await postService.getPost("");
                expect.fail("Expected NotFoundError was not thrown");
            } catch (error) {
                expect(error).to.be.instanceOf(NotFoundError);
            }
        });
    });

    describe("updatePost", () => {
        it("should update a post and return it", async () => {
            const postId = "postId";
            const userId = "userId";
            const title = "Test User";
            const body = "Test post body";
            const post = {
                _id: postId,
                user: userId,
                title: "Old User",
                body: "Old post body",
                save: () => { }
            };

            const findOneStub = sandbox.stub(Post, "findOne");
            findOneStub.withArgs({ _id: postId, user: userId }).resolves(post);


            const result = await postService.updatePost(
                postId,
                userId,
                title,
                body
            );

            expect(findOneStub.calledOnceWithExactly({ _id: postId, user: userId })).to.be
                .true;
            expect(result.title).to.equal(title);
            expect(result.body).to.equal(body);
        });
        it("should throw NotFoundError if post is not found", async () => {
            const postId = "postId";
            const userId = "userId";

            const findOneStub = sandbox.stub(Post, "findOne");
            findOneStub.withArgs({ _id: postId, user: userId }).resolves(null);

            try {
                await postService.updatePost(postId, userId, "", "");
                expect.fail("Expected NotFoundError was not thrown");
            } catch (error) {
                expect(error).to.be.instanceOf(NotFoundError);
            }
        });
    });
    describe("deletePost", () => {
        it("should delete a post and return 'post deleted successfully'", async () => {
            const post = {
                _id: "123",
                user: "456",
                remove: sandbox.stub().resolves(),
            };


            const findOneStub = sandbox.stub(Post, "findOne");
            findOneStub.resolves(post);

            const result = await postService.deletePost(post._id, post.user);
            expect(findOneStub.calledOnceWithExactly({ _id: post._id, user: post.user })).to.be.true;
            expect(post.remove.calledOnce).to.be.true;
            expect(result).to.equal("post deleted successfully");
        });

        it("should throw NotFoundError if post is not found", async () => {
            const findOneStub = sandbox.stub(Post, "findOne");
            findOneStub.resolves(null);

            try {
                await postService.deletePost("123", "456");
                expect.fail("Expected NotFoundError was not thrown");
            } catch (error) {
                expect(error).to.be.instanceOf(NotFoundError);
            }
        });
    });
});
