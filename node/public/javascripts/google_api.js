//---------------------------------------------.
// Google API Functions.
//---------------------------------------------.
export default class GooglAPI {
    static init(f) {
        gapi.load('client:auth2', function() {
            gapi.client.init({
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
                clientId: "546592957711-hcj7ou2imh6f3f4f13eh5j0619p4i7u5.apps.googleusercontent.com",
                scope: "https://www.googleapis.com/auth/calendar.readonly",
            })
                .then(() => { f; });
        });
    }

    static login(f) {
        gapi.auth2.getAuthInstance().signIn()
            .then(() => {
                f();
            });
    }

    static isLogined() {
        return gapi.auth2.getAuthInstance().isSignedIn.get();
    }

    static getEvents(f) {
        var googleParams = {
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'orderBy': 'startTime',
        };
        gapi.client.calendar.events.list(googleParams)
            .then((res) => {
                f(res);
            });
    }
}
