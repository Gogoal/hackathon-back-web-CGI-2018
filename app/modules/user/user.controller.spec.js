import chai from 'chai';
import chaiHttp from 'chai-http';
// import { describe, it } from 'mocha';

import './user.controller';
// import server from '../../server';

chai.use(chaiHttp);

/* Exemple test unit */

// Contains all test unit User
// describe('Users', () => {
//   // Success 200 - Get All Users
//   it('should list ALL users on /users GET', (done) => {
//     chai.request(server)
//       .get('/users')
//       .end((err, res) => {
//         chai.expect(res).to.have.status(200);
//         done();
//       });
//   });
//
//   // Contains all forgot password test unit
//   describe('forgotPassword', () => {
//     // Error 500 - Forgot password (no-param)
//     it('should PLANTAGE on /users/forgotPassword POST because there is no param', (done) => {
//       chai.request(server)
//         .post('/users/forgotPassword')
//         .end((err, res) => {
//           chai.expect(res).to.have.status(500);
//           done();
//         });
//     });
//
//
//     // Contains all test unit forgotpassword
//     describe('ForgotPasswordComplete', () => {
//       // We init an id user
//       let idUserTest;
//
//       // We init email user
//       const emailUserTest = 'sam.mignot@gmail.com';
//
//       // Success 200 - Create an user
//       it('should create an User on /auth/register POST only for try auth requests', (done) => {
//         chai.request(server)
//           .post('/auth/register')
//           .send({
//             lastName: 'Michel',
//             firstName: 'Michel',
//             email: emailUserTest,
//             birthdate: '12/12/12',
//             gender: 'H',
//             password: 'Michel',
//             sports: ['5a673faf6f7bf824748febae', '5a673ffe6f7bf824748febaf'],
//           })
//           .end((err, res) => {
//             idUserTest = res.body.user._id;
//             chai.expect(res).to.have.status(200);
//             done();
//           });
//       });
//
//       // Success 200 - Forgotpassword
//       it('should set recuperation mail on /users/forgotPassword POST', (done) => {
//         chai.request(server)
//           .post('/users/forgotPassword')
//           .send({
//             email: emailUserTest,
//           })
//           .end((err, res) => {
//             chai.expect(res).to.have.status(200);
//             done();
//           });
//       });
//
//       // Success 200 - Delete an user
//       it('should delete an User on users/:id DELETE', (done) => {
//         chai.request(server)
//           .delete(`/users/${idUserTest}`)
//           .end((err, res) => {
//             chai.expect(res).to.have.status(200);
//             done();
//           });
//       });
//     });
//   });
//
//
//     // Contains all Reset Password Complete
//     describe('ResetPasswordComplete', () => {
//       // We init id user
//       let idUserTest;
//       // We init token password
//       let tokenPasswordForgot;
//
//       // We init mail user
//       const emailUserTest = 'kevtrog4@gmail.com';
//
//       // Success 200 - Create user
//       it('should create an User on /auth/register POST only for try auth requests', (done) => {
//         chai.request(server)
//           .post('/auth/register')
//           .send({
//             lastName: 'Michel',
//             firstName: 'Michel',
//             email: emailUserTest,
//             birthdate: '12/12/12',
//             gender: 'H',
//             password: 'Michel',
//             sports: ['5a673faf6f7bf824748febae', '5a673ffe6f7bf824748febaf'],
//           })
//           .end((err, res) => {
//             idUserTest = res.body.user._id;
//             chai.expect(res).to.have.status(200);
//             done();
//           });
//       });
//
//       // Success 200 - Forgot password
//       it('should set recuperation mail on /users/forgotPassword POST', (done) => {
//         chai.request(server)
//           .post('/users/forgotPassword')
//           .send({
//             email: emailUserTest,
//           })
//           .end((err, res) => {
//             tokenPasswordForgot = res.body.token;
//             chai.expect(res).to.have.status(200);
//             done();
//           });
//       });
//
//       // Success 200 - Verify reset password
//       it('should verify token for reset password users/resetPassword POST', (done) => {
//         chai.request(server)
//           .post('/users/verifyResetPassword')
//           .send({ email: emailUserTest, token: tokenPasswordForgot })
//           .end((err, res) => {
//             chai.expect(res).to.have.status(200);
//             done();
//           });
//       });
//
//       // Success 200 - Reset password
//       it('should reset a password on users/resetPassword POST', (done) => {
//         chai.request(server)
//           .post('/users/resetPassword')
//           .send({
//             email: emailUserTest,
//             token: tokenPasswordForgot,
//             password: 'rozerzerzerzerzerzerzerot',
//           })
//           .end((err, res) => {
//             chai.expect(res).to.have.status(200);
//             done();
//           });
//       });
//
//       // Success 200 - Delete user
//       it('should delete an User on users/:id DELETE', (done) => {
//         chai.request(server)
//           .delete(`/users/${idUserTest}`)
//           .end((err, res) => {
//             chai.expect(res).to.have.status(200);
//             done();
//           });
//       });
//     });
//   });
// });
