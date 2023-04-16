import { expect } from "chai";
import sinon from "sinon";
import { Todo } from "../TodoModal";
import * as todoService from '../TodoService';
import { NotFoundError } from "../../../errors/NotFoundError";

describe("TodoService", () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("saveTodo", () => {
        it("should save a todo and return it", async () => {
            const todo = {
                completed: false,
                content: "Test todo content",
                user: "fdfdfd",
            };

            const saveStub = sandbox.stub(Todo.prototype, "save");
            saveStub.resolves(todo);

            const result = await todoService.saveTodo(
                todo.user,
                todo.content,
                todo.completed
            );
            expect(saveStub.calledOnce).to.be.true;

            expect(result.completed).to.deep.equal(todo.completed);
            expect(result.content).to.deep.equal(todo.content);
        });
    });

    describe("getAllTodos", () => {
        it("should return all todos for a todo", async () => {
            const user = "2342"
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

            const paginateStub = sandbox.stub(Todo, "paginate");
            paginateStub.resolves(paginationResult);

            const result = await todoService.getAlltodos(
                options.page,
                options.limit,
                user
            );

            expect(paginateStub.calledOnceWithExactly({ user: { $ne: user }} , options)).to.be
                .true;
            expect(result.todos).to.deep.equal(paginationResult.docs);
            expect(result.page).to.equal(options.page);
            expect(result.pages).to.equal(paginationResult.totalPages);
            expect(result.totalTodos).to.equal(paginationResult.totalDocs);
        });
    });

    describe("getTodo", () => {
        it("should return a todo by id if requested id of user is diffrent", async () => {
            const user = "2342"
            const todo = {
                _id: "rt5342345",
                completed: false,
                content: "Test todo content",
                user:"mskmdsk"
            };

            const findOneStub = sandbox.stub(Todo, "findOne");
            findOneStub.resolves(todo);

            const result = await todoService.getTodo(todo._id,user);

            expect(findOneStub.calledOnceWithExactly({ _id: todo._id, user: { $ne: user } })).to.be.true;
            expect(result).to.deep.equal(todo);
        });

        it("should throw NotFoundError if todo is not found", async () => {
            const findOneStub = sandbox.stub(Todo, "findOne");
            findOneStub.resolves(null);

            try {
                await todoService.getTodo("","");
                expect.fail("Expected NotFoundError was not thrown");
            } catch (error) {
                expect(error).to.be.instanceOf(NotFoundError);
            }
        });
    });

    describe("updateTodo", () => {
        it("should update a todo and return it", async () => {
            const todoId = "todoId";
            const userId = "userId";
            const completed = false;
            const content = "Test todo content";
            const todo = {
                _id: todoId,
                user: userId,
                completed: false,
                content: "Old todo content",
                save: () => { }
            };

            const findOneStub = sandbox.stub(Todo, "findOne");
            findOneStub.withArgs({ _id: todoId, user: userId }).resolves(todo);


            const result = await todoService.updateTodo(
                todoId,
                userId,
                content,
                completed
                
            );

            expect(findOneStub.calledOnceWithExactly({ _id: todoId, user: userId })).to.be
                .true;
            expect(result.completed).to.equal(completed);
            expect(result.content).to.equal(content);
        });
        it("should throw NotFoundError if todo is not found", async () => {
            const todoId = "todoId";
            const userId = "userId";

            const findOneStub = sandbox.stub(Todo, "findOne");
            findOneStub.withArgs({ _id: todoId, user: userId }).resolves(null);

            try {
                await todoService.updateTodo(todoId, userId, "", false);
                expect.fail("Expected NotFoundError was not thrown");
            } catch (error) {
                expect(error).to.be.instanceOf(NotFoundError);
            }
        });
    });
    describe("deleteTodo", () => {
        it("should delete a todo and return 'todo deleted successfully'", async () => {
            const todo = {
                _id: "123",
                user: "456",
                remove: sandbox.stub().resolves(),
            };


            const findOneStub = sandbox.stub(Todo, "findOne");
            findOneStub.resolves(todo);

            const result = await todoService.deleteTodo(todo._id, todo.user);
            expect(findOneStub.calledOnceWithExactly({ _id: todo._id, user: todo.user })).to.be.true;
            expect(todo.remove.calledOnce).to.be.true;
            expect(result).to.equal("Todo deleted successfully");
        });

        it("should throw NotFoundError if todo is not found", async () => {
            const findOneStub = sandbox.stub(Todo, "findOne");
            findOneStub.resolves(null);

            try {
                await todoService.deleteTodo("123", "456");
                expect.fail("Expected NotFoundError was not thrown");
            } catch (error) {
                expect(error).to.be.instanceOf(NotFoundError);
            }
        });
    });
});
