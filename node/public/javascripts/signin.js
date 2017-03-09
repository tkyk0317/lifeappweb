import React from "react";
import ReactDOM from "react-dom";
import GoogleAPI from "./google_api.js";

//----------------------------------------.
// Signin Component.
//----------------------------------------.
var Signin = React.createClass({
    getInitialState: function() {
        return ({email: ''});
    },

    onChangeEmail: function(e) {
        this.setState({email: e.target.value});
    },

    componentWillMount: function() {
        var email = document.getElementById('email').value;
        this.setState({email: email});
    },

    render: function() {
        var title = document.getElementById('title').value;
        var error = document.getElementById('error').value;
        return (
            <div className="mdl-layout mdl-js-layout mdl-color--gray-100">
                <main className="mdl-layout__content">
                    <div className="mdl-card mdl-shadow--6dp">
                        <div className="mdl-card__title mdl-color--primary mdl-color-text--white">
                            <h2 className="mdl-card__title-text">{title}</h2>
                        </div>
                        <p style={{color:"red", textAlign:"center"}}>{error}</p>
                        <div className="mdl-card__supporting-text">
                            <form name="login_action" method="POST" action="/signin">
                                <div className="mdl-textfield mdl-js-textfield">
                                    <input className="mdl-textfield__input" type="text" name="email" value={this.state.email} onChange={this.onChangeEmail} />
                                    <label className="mdl-textfield__label" htmlFor="username">Email Address</label>
                                </div>
                                <div className="mdl-textfield mdl-js-textfield">
                                    <input className="mdl-textfield__input" type="password" name="password" />
                                    <label className="mdl-textfield__label" htmlFor="userpass">Password</label>
                                </div>
                                <button style={{width: "100%"}}
                                        className="mdl-button mdl-button--raised mdl-js-button mdl-js-ripple-effect mdl-button--colored">Signin</button>
                            </form>
                            <br />
                            <GoogleLogin />
                            <a href="/signup"><div id="create_account">Create your Account?</div></a>
                        </div>
                    </div>
                </main>
            </div>
        );
    },
});

//----------------------------------------.
// Google Login Component.
//----------------------------------------.
var GoogleLogin = React.createClass({
    componentDidMount: function() {
        GoogleAPI.init(() => {});
    },

    render: function() {
        // get calendar data.
        var getCalendar = () => {
            GoogleAPI.getEvents((res) => {
                console.log(res.result.items);
            });
        };

        // sighin google function.
        var signin = () => {
            if(GoogleAPI.isLogined()) {
                // signed in.
                getCalendar();
            }
            else {
                // yet not signin.
                GoogleAPI.login(() => {
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
    <Signin />,
    document.getElementById('signin')
);
