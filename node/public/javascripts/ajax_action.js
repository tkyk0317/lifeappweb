var req = require('superagent');

//--------------------------------------.
// Ajax Action Functions.
//--------------------------------------.
// post action.
export function post(u, p, f) {
    req.post(u)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(p)
        .end(function(err, res) { f(err, res); });
}
// put(update) action.
export function put(u, p, f) {
    req.put(u)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(p)
        .end(function(err, res) { f(err, res); });
}
// del action.
export function del(u, p, f) {
    req.del(u)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(p)
        .end(function(err, res) { f(err, res); });
}
