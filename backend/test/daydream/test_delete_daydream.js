var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var User = require('../../model/user');
var Circle = require('../../model/circle')
DayDream = require('../../model/daydream')
var should = require('chai').should();

chai.use(chaiHttp);


var uname = process.env.UNIT_TEST_USERNAME
var pword = process.env.UNIT_TEST_PASSWORD
var mail = process.env.UNIT_TEST_EMAIL

describe('Test Delete Daydream', () => {
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
                                var ddinfo = {
                                    circleID: circRes.body._id.toString(),
                                    destination: 'MA 175',
                                    description: 'CS 408 At 9:00 AM T/TH',
                                    totalCost: '1'
                                }

                                chai.request(server)
                                    .post('/daydream/add')
                                    .set('content-type', 'application/x-www-form-urlencoded')
                                    .set('token', res.headers.token)
                                    .send(ddinfo).then((dd) => {
                                        done()
                                    })
                            })
                    })
            })
    })

    after((done) => {
        User.deleteOne({ username: uname }).then(() => {
            Circle.deleteOne({ circleName: 'RAnDoM CirCLE NamE' }).then(() => {
                DayDream.deleteOne({ description: 'CS 408 At 9:00 AM T/TH' }).then(() => {
                    done()
                })
            })
        })
    })

    describe('Delete daydream without circle id', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                var token = user['tokens'][0]['token'][0]
                Circle.findOne({ circleName: 'RAnDoM CirCLE NamE' }).then((circ) => {
                    DayDream.findOne({ description: 'CS 408 At 9:00 AM T/TH' }).then((dd) => {
                        var info = {
                            daydreamID: dd._id.toString(),
                            // circleID: circ._id.toString()
                        }
                        chai.request(server)
                            .post('/daydream/delete')
                            .set('content-type', 'application/x-www-form-urlencoded')
                            .set('token', token)
                            .send(info)
                            .end((err, res) => {
                                res.should.have.status(400)
                                done()
                            })
                    })
                })
            })
        })
    })

    describe('Delete daydream without daydream id', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                var token = user['tokens'][0]['token'][0]
                Circle.findOne({ circleName: 'RAnDoM CirCLE NamE' }).then((circ) => {
                    DayDream.findOne({ description: 'CS 408 At 9:00 AM T/TH' }).then((dd) => {
                        var info = {
                            // daydreamID: dd._id.toString(),
                            circleID: circ._id.toString()
                        }
                        chai.request(server)
                            .post('/daydream/delete')
                            .set('content-type', 'application/x-www-form-urlencoded')
                            .set('token', token)
                            .send(info)
                            .end((err, res) => {
                                res.should.have.status(400)
                                done()
                            })
                    })
                })
            })
        })
    })

    describe('Delete daydream with invalid auth', () => {
        it('Should return 401', (done) => {
            User.findOne({ username: uname }).then((user) => {
                var token = user['tokens'][0]['token'][0]
                Circle.findOne({ circleName: 'RAnDoM CirCLE NamE' }).then((circ) => {
                    DayDream.findOne({ description: 'CS 408 At 9:00 AM T/TH' }).then((dd) => {
                        var info = {
                            daydreamID: dd._id.toString(),
                            circleID: circ._id.toString()
                        }
                        chai.request(server)
                            .post('/daydream/delete')
                            .set('content-type', 'application/x-www-form-urlencoded')
                            .set('token', 'invalid token')
                            .send(info)
                            .end((err, res) => {
                                res.should.have.status(401)
                                done()
                            })
                    })
                })
            })
        })
    })

    describe('Delete daydream with correct info', () => {
        it('Should return 200', (done) => {
            User.findOne({ username: uname }).then((user) => {
                var token = user['tokens'][0]['token'][0]
                Circle.findOne({ circleName: 'RAnDoM CirCLE NamE' }).then((circ) => {
                    DayDream.findOne({ description: 'CS 408 At 9:00 AM T/TH' }).then((dd) => {
                        var info = {
                            daydreamID: dd._id.toString(),
                            circleID: circ._id.toString()
                        }
                        chai.request(server)
                            .post('/daydream/delete')
                            .set('content-type', 'application/x-www-form-urlencoded')
                            .set('token', token)
                            .send(info)
                            .end((err, res) => {
                                res.should.have.status(200)
                                done()
                            })
                    })
                })
            })
        })
    })
})