var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var User = require('../../model/user');
var should = require('chai').should();

chai.use(chaiHttp);


var uname = process.env.UNIT_TEST_USERNAME
var pword = process.env.UNIT_TEST_PASSWORD
var mail = process.env.UNIT_TEST_EMAIL

describe('Test Register', () => {

    after( function() {
        User.deleteOne({username: uname}).then(() => {

        })
    })

    describe('Register without password', () => {

        var info = {
            username: uname,
            email: mail,
        }

        it('Should return 400', (done) => {
            chai.request(server)
                .post('/user/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        })
    })

    describe('Register without username', () => {

        var info = {
            password: pword,
            email: mail,
        }

        it('Should return 400', (done) => {
            chai.request(server)
                .post('/user/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(info)
                .end((err, res) => {
                    // console.log(res)
                    res.should.have.status(400);
                    done();
                });
        })
    })

    describe('Register without email', () => {

        var info = {
            username: uname,
            password: pword,
        }

        it('Should return 400', (done) => {
            chai.request(server)
                .post('/user/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        })
    })

    describe('Register with invalid email', () => {

        var info = {
            username: uname,
            password: pword,
            email: 'invalid email'
        }

        it('Should return 400', (done) => {
            chai.request(server)
                .post('/user/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        })
    })

    describe('Register without email', () => {

        var info = {
            username: uname,
            password: pword,
        }

        it('Should return 400', (done) => {
            chai.request(server)
                .post('/user/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        })
    })

    describe('Register with correct info', () => {

        var info = {
            username: uname,
            password: pword,
            email: mail
        }

        it('Should return 200', (done) => {
            chai.request(server)
                .post('/user/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(info)
                .end((err, res) => {
                    // console.log(res)
                    res.should.have.status(200);
                    done();
                });
        })
    })

    describe('Register duplicate user', () => {

        var info = {
            username: uname,
            password: pword,
            email: mail
        }

        it('Should return 400', (done) => {
            chai.request(server)
                .post('/user/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        })
    })

})