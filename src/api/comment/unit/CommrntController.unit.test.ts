// import { expect } from 'chai';
// import { Agent,request } from 'supertest';
// import { app } from '../../app';
// import { Comment } from './CommentModel';
// import { User } from '../user/UserModel';
// import { connect, clearDatabase, closeDatabase } from '../../config/database';
// import { createAccessToken } from '../../middlewares/auth';
// import { redisClient } from '../../config/redisConfig';
// import { promisify } from 'util';
// import { cacheMiddleware } from '../../middlewares/cache';

// const agent = new Agent(app);

// describe('CommentRouter', () => {
//     before(async () => {
//         await connect();
//     });

//     beforeEach(async () => {
//         await clearDatabase();
//     });

//     after(async () => {
//         await closeDatabase();
//     });

//     describe('POST /comment/:postId', () => {
//         it('should create a new comment on a post', async () => {
//             const res = await request(app)
//               .post('/comment/123')
//               .send({
//                 email: 'test@example.com',
//                 name: 'Test User',
//                 body: 'This is a test comment',
//               })
//               .set('Authorization', `Bearer ${process.env.TEST_JWT}`);
      
//             expect(res.status).to.equal(201);
//             expect(res.body).to.have.property('message', 'Comment created successfully');
//             expect(res.body.comment).to.have.property('postId', '123');
//             expect(res.body.comment).to.have.property('email', 'test@example.com');
//             expect(res.body.comment).to.have.property('name', 'Test User');
//             expect(res.body.comment).to.have.property('body', 'This is a test comment');
//           });
//     });

//     describe('GET /comment', () => {
//         it('should get all comments for a post', async () => {
//             const user = await User.create({ email: 'test@example.com', password: 'password' });

//             const post = {
//                 title: 'Test Post',
//                 body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
//                 author: user.id,
//             };

//             const savedPost = await request(app).post('/post').send(post).set('Authorization', `Bearer ${createAccessToken(user)}`);

//             const comment = {
//                 email: 'test@example.com',
//                 name: 'Test User',
//                 body: 'Great post!',
//                 postId: savedPost.body.post._id,
//                 userId: user.id,
//             };

//             await Comment.create(comment);

//             const response = await agent.get(`/comment?postId=${savedPost.body.post._id}`).set('Authorization', `Bearer ${createAccessToken(user)}`);

//             expect(response.status).to.equal(200);
//             expect(response.body).to.be.an('array').that.has.lengthOf(1);
//             expect(response.body[0]).to.include(comment);
//         });
//     });
// });