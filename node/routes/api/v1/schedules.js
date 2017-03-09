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
// Get Schedule API.
//-------------------------------------.
router.get('/', (req, res, next) => {
    const getSchedule = (user_id) => {
        return new Promise((resolve, reject) => {
            connection.query({
                sql: 'select * from schedule where memberid = ?  order by startdatetime asc',
                values: [user_id],
            }, (e, r, f) => {
                if(e || !r) reject("Database error");
                else resolve(r);
            });
        });
    };

    // get schedule.
    getSchedule(req.user.id)
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
    const addSchedule = (d) => {
        return new Promise((resolve, reject) => {
            connection.query({
                sql: 'insert into schedule values(null, ?, ?, ?, ?, ?, ?, ?, ?)',
                values: [req.user, d.summary, d.guest, d.memo, d.startdatetime, d.enddatetime, getCurDate(), getCurDate()]
            }, (e, r) => {
                if(e) reject(e);
                else resolve(r.insertId);
            });
        });
    };

    // insert schedule.
    addSchedule(req.body)
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
    const updateSchedule = (id, p) => {
        return new Promise((resolve, reject) => {
            connection.query({
                sql: 'update schedule set startdatetime = ?, enddatetime = ?, guest = ?, summary = ?, memo = ?, updated = ? where id = ?',
                values: [p.startdatetime, p.enddatetime, p.guest, p.summary, p.memo, getCurDate(), id]
            }, (e, r) => {
                if(e) reject("Datebase error: " + e);
                else resolve();
            });
        });
    };

    // update schedule.
    updateSchedule(req.params.id, req.body)
        .then(() => {res.json({result: 'sucess'});},
              (e) => { console.log(e); res.json({error: 'error: ' + e});}
             );
});

//-------------------------------------.
// Delete Schedule API.
//-------------------------------------.
router.delete('/:id', (req, res) => {
    const deleteSchedule = (id) => {
        return new Promise((resolve, reject) => {
            connection.query({
                sql: 'delete from schedule where id = ?',
                values: [id]
            }, (e, f) => {
                if(e) reject("Database error: " + e);
                else resolve();
            });
        });
    };

    // delete schedule.
    deleteSchedule(req.params.id)
        .then(() => {res.json({result: "success"});},
              (e) => {res.json({error: e});}
             );
});

module.exports = router;
