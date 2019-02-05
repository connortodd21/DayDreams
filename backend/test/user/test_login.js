var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var User = require('../../model/user');

chai.use(chaiHttp);


var uname = process.env.UNIT_TEST_USERNAME
var pword = process.env.UNIT_TEST_PASSWORD
var mail = process.env.UNIT_TEST_EMAIL

describe('Test Login', () => {

    before(() => {
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
                res.should.have.status(200);
                done();
            });
    })

    after(() => {
        User.deleteOne({ username: uname }).then(() => {

        })
    })

    describe('Login without password', () => {
        it('Should return 400', () => {
            var info = {
                username: uname,
            }
    
            it('Should return 400', (done) => {
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
    })

    describe('Login without username', () => {
        it('Should return 400', () => {
            var info = {
                password: pword,
            }
    
            it('Should return 400', (done) => {
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
    })

    describe('Login with username that doesnt exist', () => {
        it('Should return 400', () => {
            var info = {
                username: 'Username does not exist',
                password: pword
            }
    
            it('Should return 400', (done) => {
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
    })

    describe('Login with incorrect password', () => {
        it('Should return 400', () => {
            var info = {
                username: uname,
                password: 'Incorrect password'
            }
    
            it('Should return 400', (done) => {
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
    })

    describe('Login with correct info', () => {
        it('Should return 200', () => {
            var info = {
                username: uname,
                password: pword
            }
    
            it('Should return 400', (done) => {
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
    })
});