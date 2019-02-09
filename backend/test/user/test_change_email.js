var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var User = require('../../model/user');
var should = require('chai').should();

chai.use(chaiHttp);


var uname = process.env.UNIT_TEST_USERNAME
var pword = process.env.UNIT_TEST_PASSWORD
var mail = process.env.UNIT_TEST_EMAIL

describe('Test Change Email', () => {

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

    describe('Change email without email', () => {
        it('Should return 400', (done) => {
            var info = {
                email: mail
            }
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/user/change-email')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(400)
                        done()
                    })
            }).catch((err) => {

            })
        })
    })

    describe('Change email with invalid email', () => {
        it('Should return 400', (done) => {
            var info = {
                email: 'invalid email'
            }
            User.findOne({ username: uname }, (err, user) => {
                //do the get request here 

                var token = user['tokens'][0]['token'][0]

                chai.request(server)
                    .post('/user/change-email')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(400)
                        done()
                    })
            });
        })
    })

    describe('Change email with invalid auth', () => {
        it('Should return 401', (done) => {
            var info = {
                email: mail
            }
            User.findOne({ username: uname }, (err, user) => {
                //do the get request here 

                var token = user['tokens'][0]['token'][0]

                chai.request(server)
                    .post('/user/change-email')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', 'bad auth')
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(401)
                        done()
                    })
            });
        })
    })

    describe('Change email with correct info', () => {
        it('Should return 200', (done) => {
            var info = {
                email: mail
            }
            User.findOne({ username: uname }, (err, user) => {
                //do the get request here 

                var token = user['tokens'][0]['token'][0]

                chai.request(server)
                    .post('/user/change-email')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.body.should.have.property('message', "User email successfully updated")
                        res.should.have.status(200)
                        done()
                    })
            });
        })
    })

})