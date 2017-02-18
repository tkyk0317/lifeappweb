//---------------------------------------------.
// Google API Functions.
//---------------------------------------------.
export default class GooglAPI {
    constructor() {
        this.googleParams = {
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'orderBy': 'startTime',
        };
    }

    init(f) {
        gapi.load('client:auth2', function() {
            gapi.client.init({
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
                clientId: "546592957711-hcj7ou2imh6f3f4f13eh5j0619p4i7u5.apps.googleusercontent.com",
                scope: "https://www.googleapis.com/auth/calendar.readonly",
            })
            .then(() => { f; });
        });
    }

    login(f) {
        gapi.auth2.getAuthInstance().signIn()
            .then(() => {
                f();
            });
    }

    isLogined() {
        return gapi.auth2.getAuthInstance().isSignedIn.get();
    }

    getEvents(f) {
        gapi.client.calendar.events.list(this.googleParams)
        .then((res) => {
            f(res);
        });
    }
}
