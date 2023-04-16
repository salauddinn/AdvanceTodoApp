import { Response, NextFunction } from 'express';
import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import * as CommentService from '../CommentService';
import * as CommentController from '../CommentHandler';
import { AuthenticatedRequest } from '../../../middlewares/auth';

describe('CommentController', () => {
    let saveCommentStub: SinonStub;
    let statusStub: SinonStub;
    let jsonStub: SinonStub;
    let req: AuthenticatedRequest;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        saveCommentStub = sinon.stub(CommentService, 'saveComment');
        statusStub = sinon.stub();
        jsonStub = sinon.stub();
        req = {
            body: {
                email: 'test@test.com',
                name: 'Test',
                body: 'Test comment',
            },
            params: {
                postId: '1',
            },
            user: {
                id: '123',
            },
        } as unknown as AuthenticatedRequest
        res = {
            status: statusStub,
            json: jsonStub,
        } as unknown as Response;
        next = sinon.stub() as unknown as NextFunction;
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('saveCommentHandler', () => {
        it('should return 201 with the created comment', async () => {
            saveCommentStub.resolves({
                id: '1',
                email: 'test@test.com',
                name: 'Test',
                body: 'Test comment',
            });

            await CommentController.saveCommentHandler(req, res, next);

            expect(saveCommentStub.calledOnceWith('test@test.com', 'Test', 'Test comment', '1', '123')).to.be.true;
            expect(statusStub.calledOnceWith(201)).to.be.true;
        });
    });
});