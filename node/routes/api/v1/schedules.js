var express = require('express');
var router = express.Router();
var models = require('../../../models/');
var moment = require('moment');
var utility = require(__dirname + '/../../../public/javascripts/utility');
var google = require('./google');

// get current date string.
const getCurDate = () => {
    const now = new Date();
    return utility.toDateString(now) + " " + utility.toTimeString(now);
};

//-------------------------------------.
// Schedule Factory Class.
//-------------------------------------.
class ScheduleFactory {
    static create(user) {
        if(user.provider) return new GoogleSchedule(user);
        return new Schedule(user);
    }
}

//-------------------------------------.
// Schedule Class.
//-------------------------------------.
class Schedule {
    constructor(user) {
    }

    // get schedule data.
    getSchedule(user) {
        return new Promise((resolve, reject) => {
            models.Schedule.findAll({
                where: {member_id: user.id}
            })
            .then((schedules) => {
                // parse guests.
                const records = schedules.map((d) => {
                    return {
                        id: d.id,
                        memberid: d.member_id,
                        summary: d.summary,
                        memo: d.memo,
                        guest: d.guest,
                        startdatetime: d.start_date_time,
                        enddatetime: d.end_date_time,
                        created: d.created_at,
                        updated: d.updated_at,
                    };
                });
                resolve(records);
            })
            .catch((e) => {
                reject(e);
            });
        });
    }

    // add schedule.
    addSchedule(user, data) {
        return new Promise((resolve, reject) => {
            let schedule = models.Schedule.build(
                {
                    member_id: user.id,
                    summary: data.summary,
                    guest: data.guest,
                    memo: data.memo,
                    start_date_time: data.startdatetime,
                    end_date_time: data.enddatetime,
                }
            );
            schedule.save()
                .then((record) => {
                    resolve(record.id);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    // update schedule.
    updateSchedule(id, data) {
        return new Promise((resolve, reject) => {
            models.Schedule.update({
                    summary: data.summary,
                    guest: data.guest,
                    memo: data.memo,
                    start_date_time: data.startdatetime,
                    end_date_time: data.enddatetime,
                },
                {
                    where: {id: id},
                })
                .then((s) => {
                    resolve();
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    // move events to other calendar.
    moveSchedule() {
        return new Promise((resolve, reject) => {
            console.log("Schedule.moveSchedule is not supportted");
            resolve();
        });
    }

    // delete schedule.
    deleteSchedule(id) {
        return new Promise((resolve, reject) => {
            models.Schedule.destroy({where: {id: id}})
                .then(() => {
                    resolve();
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }
}

// google calendar schedule class.
class GoogleSchedule extends Schedule {
    constructor(user) {
        super(user);
        var google = require('google-calendar');
        this.googleCalendar = new google.GoogleCalendar(user.accessToken);
        this.calendarDatas = [];
        this.calendarLists = [];
    }

    // check get all calendar.
    // argment: Map Instance.
    _isAllCalendar(targets) {
        var get_count = 0;
        targets.forEach((t) => {
            if(t) get_count++;
        });
        return get_count === targets.size;
    }

    _parseCalendar(id, cal) {
        var cals = [];
        cal.items.forEach((i) => {
            // parse calendar.
            try {
                var attendees = i.attendees ? i.attendees.map((guest) => {return guest.email;}) : null;
                cals.push({
                    id: i.id, // event id.
                    calendarid: id, // calendarid.
                    summary: i.summary || '',
                    guest: attendees || '',
                    memo: i.description || '',
                    startdatetime: i.start.dateTime.replace('T', ' ').substr(0, 16) || '',
                    enddatetime: i.end.dateTime.replace('T', ' ').substr(0, 16) || '',
                });
            }
            catch(e) {
                console.log(e);
            }
        });
        return cals;
    }

    getSchedule(user) {
        // get calendarlist.
        var self = this;
        return new Promise((resolve, reject) => {
            let calendar_list = () => {
                return new Promise((cb) => {
                    self.googleCalendar.calendarList.list((err, data) => {
                        cb(data.items);
                    });
                });
            };
            calendar_list()
                .then((list) => {
                    // get all calendar data.
                    var target_calendar = new Map();
                    list.forEach((d) => {
                        // except holidays.
                        const id = d.id;
                        const calendar_title = d.summaryOverride || d.summary;
                        if(id === 'ja.japanese#holiday@group.v.calendar.google.com') return;

                        // insert target id.
                        target_calendar.set(id, false);
                        self.calendarLists = self.calendarLists.concat({id: id, name: calendar_title});

                        // get calendar lists.
                        const getGoogleCalendar = (id) => {
                            return new Promise((cb) => {
                                self.googleCalendar.events.list(id, {orderBy: 'startTime', singleEvents: true}, (err, cal) => {
                                    cb(cal);
                                });
                            });
                        };

                        // parse calendar datas.
                        getGoogleCalendar(id)
                            .then((cal) => {
                                // parse calendar.
                                self.calendarDatas = self.calendarDatas.concat(self._parseCalendar(id, cal));
                                target_calendar.set(id, true);

                                // nofity.
                                if(self._isAllCalendar(target_calendar)) resolve(self.calendarDatas);
                            })
                            .catch((e) => {
                                console.log(e);
                            });
                    });
                })
                .catch((e) => {
                    console.log(e);
                });
        });
    }

    // add schedule.
    addSchedule(user, data) {
        var self = this;
        return new Promise((resolve, reject) => {
            self.googleCalendar.events.quickAdd(data.calendarid, data.summary, (err, res) => {
                // consider about the response, return the response by first.
                resolve(res.id);

                // update schedule.
                self.updateSchedule(res.id, data)
                    .then(() => {
                        console.log("added: Success");
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            });
        });
    }

    // update schedule.
    updateSchedule(id, data) {
        var self = this;
        return new Promise((resolve, reject) => {
            // convert UTC Date.
            const startdatetime = utility.fromDateTimeString(data.startdatetime);
            const enddatetime = utility.fromDateTimeString(data.enddatetime);

            // update other parameters.
            self.googleCalendar.events.update(data.calendarid, id,
                                              {
                                                  summary: data.summary || '',
                                                  description: data.memo || '',
                                                  attendees: data.guest ? [{email: data.guest}] : '',
                                                  start: {dateTime: startdatetime, timeZone: 'Asia/Tokyo',},
                                                  end: {dateTime: enddatetime, timeZone: 'Asia/Tokyo',},
                                              },
                                              (err, res) => {
                                                  if(err) reject(err);
                                                  else resolve();
                                              });
        });
    }

    // move events to other calendar.
    moveSchedule(req) {
        var self = this;
        return new Promise((resolve, reject) => {
            self.googleCalendar.events.move(req.body.orgcalendarid, req.body.id,
                                            {destination: req.body.calendarid},
                                            (err, res) => {
                                                // consider about the response, return the response by first.
                                                resolve();
                                                // update other parameters.
                                                self.updateSchedule(res.id, req.body);
                                            });
        });
    }

    // delete schedule.
    deleteSchedule(id, data) {
        var self = this;
        return new Promise((resolve, reject) => {
            self.googleCalendar.events.delete(data.calendarid, id, (err, res) => {
                if(err) reject(err);
                else resolve();
            });
        });
    }
}

//-------------------------------------.
// Get Schedule API.
//-------------------------------------.
router.get('/', (req, res, next) => {
    // get schedule.
    let schedule = ScheduleFactory.create(req.user);
    schedule.getSchedule(req.user)
        .then(
            (d) => {
                res.json({
                    memberid: req.user.id,
                    schedule: d.map((r) => { return r; }),
                    list: schedule.calendarLists || null,
                });
            })
        .catch((e) => {
            console.log(e);
        });
});

//-------------------------------------.
// Post Schedule API.
//-------------------------------------.
router.post('/', (req, res, next) => {
    // insert schedule.
    let schedule = ScheduleFactory.create(req.user);
    schedule.addSchedule(req.user, req.body)
        .then((id) => {res.json({result: 'success', id: id});},
              (e) => {
                  console.log("error: " + e);
                  res.json({error: e});
              }
             );
});

//-------------------------------------.
// Put Schedule API.
//-------------------------------------.
router.put('/:id', (req, res) => {
    // update schedule.
    let schedule = ScheduleFactory.create(req.user);

    // check update or move.
    if(req.body.orgcalendarid !== req.body.calendarid) {
        schedule.moveSchedule(req)
            .then(() => {res.json({result: 'sucess'});},
                  (e) => { console.log(e); res.json({error: 'error: ' + e});}
            );
    }
    else {
        schedule.updateSchedule(req.params.id, req.body)
            .then(() => {res.json({result: 'sucess'});},
                  (e) => { console.log(e); res.json({error: 'error: ' + e});}
            );
    }
});

//-------------------------------------.
// Delete Schedule API.
//-------------------------------------.
router.delete('/:id', (req, res) => {
    // delete schedule.
    let schedule = ScheduleFactory.create(req.user);
    schedule.deleteSchedule(req.params.id, req.body)
        .then(() => {res.json({result: "success"});},
              (e) => {res.json({error: e});}
             );
});

module.exports = router;
