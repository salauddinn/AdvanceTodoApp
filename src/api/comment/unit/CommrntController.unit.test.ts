// import { expect } from 'chai';
// import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
// import { Response } from 'express';
// import { AuthenticatedRequest } from '../../../middlewares/auth';
// import * as CommentService from '../CommentService';
// import { CommentRouter } from '../CommentController';

// describe('CommentController', () => {
//     let sandbox: SinonSandbox;
//     let saveCommentStub: SinonStub;
//     let res: Response;

//     before(() => {
//         sandbox = createSandbox();
//         saveCommentStub = sandbox.stub(CommentService, 'saveComment');
//     });

//     after(() => {
//         sandbox.restore();
//     });

//     beforeEach(() => {
//         res = {
//             status: sandbox.stub().returnsThis(),
//             json: sandbox.stub().returnsThis(),
//         } as unknown as Response;
//     });

//     describe('POST /comment/:postId', () => {
//         it('should return 201 status code and create a comment', async () => {
//             const req = {
//                 body: {
//                     email: 'test@test.com',
//                     name: 'Test User',
//                     body: 'This is a test comment',
//                 },
//                 params: {
//                     postId: '616c21f9a2779f2c6a8b7f61',
//                 },
//                 user: {
//                     id: '616c21f9a2779f2c6a8b7f62',
//                 },
//             } as unknown as AuthenticatedRequest;

//             saveCommentStub.resolves({ _id: '616c21f9a2779f2c6a8b7f63', ...req.body });

//             await CommentRouter.handle(req, res);

//             expect(res.status).to.have.been.calledWith(201);
//             expect(res.json).to.have.been.calledWith({
//                 message: 'Comment created successfully',
//                 comment: { _id: '616c21f9a2779f2c6a8b7f63', ...req.body },
//             });
//             expect(saveCommentStub).to.have.been.calledWith(req.body.email, req.body.name, req.body.body, req.params.postId, req.user?.id);
//         });

//         it('should return 400 status code if there are validation errors', async () => {
//             const req = {
//                 body: {},
//                 params: {},
//             } as unknown as AuthenticatedRequest;

//             await CommentRouter.handle(req, res);

//             expect(res.status).to.have.been.calledWith(400);
//             expect(res.json).to.have.been.calledWith(sinon.match({ errors: sinon.match.array }));
//             expect(saveCommentStub).to.not.have.been.called;
//         });
//     });
//     // it('should return 500 status code if an error occurs', async () => {
//     //   const req = {
//     //     body: {
//     //       email: 'test@test.com',
//     //       name: 'Test User',
//     //       body: 'This is a test comment',
//     //     },
//     //     params: {
//     //       postId: '616c21f9a2779f2c6a8b7f61',
//     //     },
//     //     user: {
//     //       id: '616c21f9a2779f2c6a8b7f62',
//     //     },
//     //   } as unknown as AuthenticatedRequest;

//     //   saveCommentStub.rejects(new Error('Test error'));

//     //   await CommentRouter.handle(req, res);

//     //   expect(res.status).to.have.been.calledWith(500);
//     //   expect(res.json).to.have.been.calledWith(sinon.match({ message: 'Internal server error'
