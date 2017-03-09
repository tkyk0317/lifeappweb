var express = require('express');
var router = express.Router();
var mysql = require('mysql');
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

//-------------------------------------.
// Schedule Class.
//-------------------------------------.
class Schedule {
    constructor() {
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

//-------------------------------------.
// Get Schedule API.
//-------------------------------------.
router.get('/', (req, res, next) => {
    // get schedule.
    let schedule = new Schedule();
    schedule.getSchedule(req.user)
        .then(
            (d) => {
                let s = {memberid: req.user, schedule: []};
                s.schedule = d.map((r) => { return r; });
                res.json(s);
            },
            (e) => {
            }
        );
});

//-------------------------------------.
// Post Schedule API.
//-------------------------------------.
router.post('/', (req, res, next) => {
    // insert schedule.
    let schedule = new Schedule();
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
    let schedule = new Schedule();
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
    let schedule = new Schedule();
    schedule.deleteSchedule(req.params.id)
        .then(() => {res.json({result: "success"});},
              (e) => {res.json({error: e});}
             );
});

module.exports = router;
