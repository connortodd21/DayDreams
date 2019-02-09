var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var User = require('../../model/user');
var Circle = require('../../model/circle')
var should = require('chai').should();

chai.use(chaiHttp);


var uname = process.env.UNIT_TEST_USERNAME
var pword = process.env.UNIT_TEST_PASSWORD
var mail = process.env.UNIT_TEST_EMAIL

describe('Test Edit Circle Name', () => {

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

                        var circleInfo = {
                            circleName: 'RAnDoM CirCLE NamE'
                        }

                        chai.request(server)
                            .post('/circle/add')
                            .set('content-type', 'application/x-www-form-urlencoded')
                            .set('token', res.headers.token)
                            .send(circleInfo)
                            .then((circRes) => {
                                done()
                            })
                    })
            })
    })

    after((done) => {
        User.deleteOne({ username: uname }).then(() => {
            Circle.deleteOne({ circleName: 'RAnDoM NeW CirCLE NamE' }).then(() => {
                Circle.deleteOne({circleName: 'RAnDoM CirCLE NamE'}).then(() => {
                    done()
                })
            })
        })
    })

    describe('Edit circle without circle name', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                var token = user['tokens'][0]['token'][0]
                Circle.findOne({ circleName: 'RAnDoM CirCLE NamE' }).then((circ) => {
                    var info = {
                        circleID: circ._id.toString(),
                    }
                    chai.request(server)
                        .post('/circle/edit-name')
                        .set('content-type', 'application/x-www-form-urlencoded')
                        .set('token', token)
                        .send(info)
                        .end((err, res) => {
                            res.should.have.status(400)
                            done()
                        })
                })
            }).catch((err) => {

            })
        })
    })

    describe('Edit circle without circle id', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                var token = user['tokens'][0]['token'][0]
                Circle.findOne({ circleName: 'RAnDoM CirCLE NamE' }).then((circ) => {
                    var info = {
                        circleName: 'RandOM NeW CirClE NAmE'
                    }
                    chai.request(server)
                        .post('/circle/edit-name')
                        .set('content-type', 'application/x-www-form-urlencoded')
                        .set('token', token)
                        .send(info)
                        .end((err, res) => {
                            res.should.have.status(400)
                            done()
                        })
                })
            }).catch((err) => {

            })
        })
    })

    describe('Edit circle without invalid auth', () => {
        it('Should return 401', (done) => {
            User.findOne({ username: uname }).then((user) => {
                var token = user['tokens'][0]['token'][0]
                Circle.findOne({ circleName: 'RAnDoM CirCLE NamE' }).then((circ) => {
                    var info = {
                        circleID: circ._id.toString(),
                        circleName: 'RandOM NeW CirClE NAmE'
                    }
                    chai.request(server)
                        .post('/circle/edit-name')
                        .set('content-type', 'application/x-www-form-urlencoded')
                        .set('token', 'invalid auth')
                        .send(info)
                        .end((err, res) => {
                            res.should.have.status(401)
                            done()
                        })
                })
            }).catch((err) => {

            })
        })
    })

    describe('Edit circle with correct info', () => {
        it('Should return 200', (done) => {
            User.findOne({ username: uname }).then((user) => {
                var token = user['tokens'][0]['token'][0]
                Circle.findOne({ circleName: 'RAnDoM CirCLE NamE' }).then((circ) => {
                    var info = {
                        circleID: circ._id.toString(),
                        circleName: 'RandOM NeW CirClE NAmE'
                    }
                    chai.request(server)
                        .post('/circle/edit-name')
                        .set('content-type', 'application/x-www-form-urlencoded')
                        .set('token', token)
                        .send(info)
                        .end((err, res) => {
                            res.should.have.status(200)
                            done()
                        })
                })
            }).catch((err) => {

            })
        })
    })

})