var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var User = require('../../model/user');
var should = require('chai').should();

chai.use(chaiHttp);


var uname = process.env.UNIT_TEST_USERNAME
var pword = process.env.UNIT_TEST_PASSWORD
var mail = process.env.UNIT_TEST_EMAIL

describe('Test Forgot Password', () => {

    before((done) => {
        var info = {
            username: uname,
            password: pword,
            email: mail,
        }
        chai.request(server)
            .post('/user/register')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(info).then(() => {
                chai.request(server)
                    .post('/user/login')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send(info)
                    .then((res) => {
                        done()
                    })
            })
    })

    after(() => {
        User.deleteOne({ username: uname }).then(() => {

        })
    })

    describe('Forgot password without email', () => {
        it('Should return 400', (done) => {

            var info = {
                email: mail
            }

            chai.request(server)
                    .post('/user/forgot-password')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send()
                    .end((err, res) => {
                        res.should.have.status(400);
                        done();
                    });
        })
    })

    describe('Forgot password with invalid email', () => {
        it('Should return 400', (done) => {
            var info = {
                email: 'invalid email'
            }
            chai.request(server)
                    .post('/user/forgot-password')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(400);
                        done();
                    });
        })
    })

    describe('Forgot password with wrong email', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }, (err, user) => {
                var info = {
                    email: 'wrongemail@wrongemail.com'
                }
                chai.request(server)
                    .post('/user/forgot-password')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(400);
                        done();
                    });
            })
        })
    })

    describe('Forgot password with correct info', () => {
        it('Should return 200', (done) => {
            var info = {
                email: mail
            }
            chai.request(server)
                    .post('/user/forgot-password')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send(info)
                    .end((err, res) => {
                        res.body.should.have.property('message', "Password has successfully been reset.")
                        res.should.have.status(200);
                        done();
                    });
        })
    })
})