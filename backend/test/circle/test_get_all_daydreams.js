var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var User = require('../../model/user');
var Circle = require('../../model/circle')
var DayDream = require('../../model/daydream')
var should = require('chai').should();

chai.use(chaiHttp);


var uname = process.env.UNIT_TEST_USERNAME
var pword = process.env.UNIT_TEST_PASSWORD
var mail = process.env.UNIT_TEST_EMAIL

describe('Test Get Cirlce info', () => {

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
                DayDream.deleteOne({description: 'CS 408 At 9:00 AM T/TH'}).then(() => {
                    done()
                })
            })
        })
    })

    describe('Test get all daydreams without circle id', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                var token = user['tokens'][0]['token'][0]
                Circle.findOne({ circleName: 'RAnDoM CirCLE NamE' }).then((circ) => {
                    chai.request(server)
                        .get('/circle/all-daydreams')
                        .set('content-type', 'application/x-www-form-urlencoded')
                        .set('token', token)
                        .send()
                        .end((err, res) => {
                            res.should.have.status(400)
                            done()
                        })
                })
            }).catch((err) => {

            })
        })
    })

    describe('Test get all daydreams with bad circle id', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                var token = user['tokens'][0]['token'][0]
                Circle.findOne({ circleName: 'RAnDoM CirCLE NamE' }).then((circ) => {
                    chai.request(server)
                        .get('/circle/all-daydreams')
                        .set('content-type', 'application/x-www-form-urlencoded')
                        .set('token', token)
                        .send()
                        .end((err, res) => {
                            res.should.have.status(400)
                            done()
                        })
                })
            }).catch((err) => {

            })
        })
    })

    describe('Test get all daydreams with invalid auth', () => {
        it('Should return 401', (done) => {
            User.findOne({ username: uname }).then((user) => {
                var token = user['tokens'][0]['token'][0]
                Circle.findOne({ circleName: 'RAnDoM CirCLE NamE' }).then((circ) => {
                    chai.request(server)
                        .get('/circle/all-daydreams')
                        .set('content-type', 'application/x-www-form-urlencoded')
                        .set('token', 'bad token')
                        .set('circleid', circ._id.toString())
                        .send()
                        .end((err, res) => {
                            res.should.have.status(401)
                            done()
                        })
                })
            }).catch((err) => {

            })
        })
    })

    describe('Test get all daydreams with correct info', () => {
        it('Should return 200', (done) => {
            User.findOne({ username: uname }).then((user) => {
                var token = user['tokens'][0]['token'][0]
                Circle.findOne({ circleName: 'RAnDoM CirCLE NamE' }).then((circ) => {
                    chai.request(server)
                        .get('/circle/all-daydreams')
                        .set('content-type', 'application/x-www-form-urlencoded')
                        .set('token', token)
                        .set('circleid', circ._id.toString())
                        .send()
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