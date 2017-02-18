import React from "react";
import ReactDOM from "react-dom";
import GoogleAPI from "./google_api.js";

var google_api = new GoogleAPI();

//----------------------------------------.
// Google Login Component.
//----------------------------------------.
var GoogleLogin = React.createClass({

    componentDidMount: function() {
        google_api.init(() => {});
    },

    render: function() {
        // get calendar data.
        var getCalendar = () => {
            google_api.getEvents((res) => {
                console.log(res.result.items);
            });
        };

        // sighin google function.
        var signin = () => {
            if(google_api.isLogined()) {
                // signed in.
                getCalendar();
            }
            else {
                // yet not signin.
                google_api.login(() => {
                    getCalendar();
                });
            }
        };
        return (<button id="google_with_signin_button" onClick={signin}
                        className="mdl-button mdl-button--raised mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                        Signin with Google
                </button>);
    },
});

//----------------------------------------.
// Render Google Login Component.
//----------------------------------------.
ReactDOM.render(
    <GoogleLogin />,
    document.getElementById('google_with_signin')
);
