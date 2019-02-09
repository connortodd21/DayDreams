var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var User = require('../../model/user');
var should = require('chai').should();


chai.use(chaiHttp);


var uname = process.env.UNIT_TEST_USERNAME
var pword = process.env.UNIT_TEST_PASSWORD
var mail = process.env.UNIT_TEST_EMAIL

describe('Test Login', () => {

    before((done) => {
        var info = {
            username: uname,
            password: pword,
            email: mail,
        }
        chai.request(server)
            .post('/user/register')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(info)
            .end((err, res) => {
                done();
            });
    })

    after((done) => {
        User.deleteOne({ username: uname }).then(() => {
            done()
        })
    })

    describe('Login without password', () => {
        it('Should return 400', (done) => {
            var info = {
                username: uname,
            }
            chai.request(server)
                .post('/user/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        })
    })

    describe('Login without username', () => {
        it('Should return 400', (done) => {
            var info = {
                password: pword,
            }

            chai.request(server)
                .post('/user/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        })
    })

    describe('Login with username that doesnt exist', () => {
        it('Should return 400', (done) => {
            var info = {
                username: 'Username does not exist',
                password: pword
            }

            chai.request(server)
                .post('/user/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        })
    })

    describe('Login with incorrect password', () => {
        it('Should return 400', (done) => {
            var info = {
                username: uname,
                password: 'Incorrect password'
            }

            chai.request(server)
                .post('/user/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        })
    })

    describe('Login with correct info', () => {
        it('Should return 200', (done) => {
            var info = {
                username: uname,
                password: pword
            }

            chai.request(server)
                .post('/user/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(info)
                .end((err, res) => {
                    res.header.should.have.property('token')
                    res.body.should.have.property('_id')
                    res.body.should.have.property('username')
                    res.body.should.have.property('email')
                    res.should.have.status(200);
                    done();
                })
        })
    })
});