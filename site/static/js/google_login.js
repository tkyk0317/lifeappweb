import React from "react";
import ReactDOM from "react-dom";

//----------------------------------------.
// Google Login Component.
//----------------------------------------.
var GoogleLogin = React.createClass({
    componentDidMount: function() {
        var obj = this;
        gapi.load('client:auth2', function() {
            gapi.client.init({
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
                clientId: "546592957711-hcj7ou2imh6f3f4f13eh5j0619p4i7u5.apps.googleusercontent.com",
                scope: "https://www.googleapis.com/auth/calendar.readonly",
            });
        });
    },

    render: function() {
        // get calendar data.
        var params = {
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime',
        };
        var getCalendar = () => {
            gapi.client.calendar.events.list(params)
            .then(function(response) {
                console.log(response.result.items);
            });
        };

        // sighin google function.
        var signin = () => {
            if(gapi.auth2.getAuthInstance().isSignedIn.get()) {
                // signed in.
                getCalendar();
            }
            else {
                // yet not signin.
                gapi.auth2.getAuthInstance().signIn()
                .then(() => {
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
