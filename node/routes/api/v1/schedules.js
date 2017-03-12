var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var moment = require('moment');
var utility = require(__dirname + '/../../../public/javascripts/utility');

const connection = mysql.createConnection({
    host: 'database',
    user: 'albio',
    password: 'albio',
    database: 'lifeapp'
});

// get current date string.
const getCurDate = () => {
    const now = new Date();
    return utility.toDateString(now) + " " + utility.toTimeString(now);
};

// check google login.
const isGoogle = (user) => {
    if(!user.provider) return false;
    return user.provider === 'google';
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
            connection.query({
                sql: 'select * from schedule where memberid = ?  order by startdatetime asc',
                values: [user.id],
            }, (e, r, f) => {
                if(e || !r) reject("Database error");
                else resolve(r);
            });
        });
    }

    // add schedule.
    addSchedule(user, data) {
        return new Promise((resolve, reject) => {
            connection.query({
                sql: 'insert into schedule values(null, ?, ?, ?, ?, ?, ?, ?, ?)',
                values: [user.id, data.summary, data.guest, data.memo, data.startdatetime, data.enddatetime, getCurDate(), getCurDate()]
            }, (e, r) => {
                if(e) reject(e);
                else resolve(r.insertId);
            });
        });
    }

    // update schedule.
    updateSchedule(id, data) {
        connection.query({
            sql: 'update schedule set startdatetime = ?, enddatetime = ?, guest = ?, summary = ?, memo = ?, updated = ? where id = ?',
            values: [data.startdatetime, data.enddatetime, data.guest, data.summary, data.memo, getCurDate(), id]
        }, (e, r) => {
            if(e) reject("Datebase error: " + e);
            else resolve();
        });
    }

    // delete schedule.
    deleteSchedule(id) {
        return new Promise((resolve, reject) => {
            connection.query({
                sql: 'delete from schedule where id = ?',
                values: [id]
            }, (e, f) => {
                if(e) reject("Database error: " + e);
                else resolve();
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
                                self.googleCalendar.events.list(id, (err, cal) => {
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
            const startdatetime = moment.utc(utility.fromDateTimeString(data.startdatetime).toISOString()).toDate();
            const enddatetime = moment.utc(utility.fromDateTimeString(data.startdatetime).toISOString()).toDate();

            // update other parameters.
            self.googleCalendar.events.update(data.calendarid, id,
                                              {
                                                  start: {dateTime: startdatetime}, end: {dateTime: enddatetime},
                                                  summary: data.summary || '', description: data.memo || '',
                                              },
                                              (err, res) => {
                                                  if(err) reject(err);
                                                  else resolve();
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
                const memberid = isGoogle(req.user) ? req.user.id : req.user;
                let s = {memberid: memberid, schedule: d.map((r) => { return r; }), list: schedule.calendarLists || null};
                res.json(s);
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
    schedule.updateSchedule(req.params.id, req.body)
        .then(() => {res.json({result: 'sucess'});},
              (e) => { console.log(e); res.json({error: 'error: ' + e});}
             );
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
