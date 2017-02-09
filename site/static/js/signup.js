import React from 'react';
import ReactDOM from 'react-dom';
import TextField from 'material-ui/TextField';
import {GridList, GridTile} from 'material-ui/GridList';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {gray700} from 'material-ui/styles/colors';

// call for touch event.
injectTapEventPlugin();

var utility = require('./utility.js');

//-------------------------------------.
// Form Component.
//-------------------------------------.
var FieldComponent = React.createClass({ render: function() {
    var style = {
      width: "500px",
      color: "white",
    };
    var line_style = {
      underlineStyle: {
        borderColor: "#3f51b5",
      },
      focuslineStyle: {
        borderColor: gray700,
      }
    };
    return (
      <TextField style={style}
                 id="text-field-controlled"
                 hintText={this.props.hint}
                 errorText={this.props.error}
                 name={this.props.name}
                 type={this.props.type}
                 defaultValue=""
                 underlineStyle={line_style.underlineStyle}
                 underlineFocusStyle={line_style.focuslineStyle}
                 onChange={this.onChange}>
      </TextField>
    );
  },

  onChange: function(e) {
    this.props.onChange(e);
  }
});

//-------------------------------------.
// Signup Form Component.
//-------------------------------------.
var SignupForm = React.createClass({
  getInitialState: function() {
    return {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      password_confirm: "",
      firstname_empty: "",
      lastname_empty: "",
      email_empty: "",
      password_empty: "",
      password_confirm_empty: "",
    };
  },

  onChange: function(e) {
    this.setState({[e.target.name]: e.target.value});

    if("firstname" === e.target.name) {
      if("" !== this.state.firstname_empty) this.setState({firstname_empty: ""});
    }
    if("lastname" === e.target.name) {
      if("" !== this.state.lastname_empty) this.setState({lastname_empty: ""});
    }
    if("email" === e.target.name) {
      if("" !== this.state.email_empty) this.setState({email_empty: ""});
    }
    if("password" === e.target.name) {
      if("" !== this.state.password_empty) this.setState({password_empty: ""});
    }
    if("password_confirm" === e.target.name) {
      if("" !== this.state.password_confirm_empty) this.setState({password_confirm_empty: ""});
    }
  },

  onSubmit: function() {
    // check empty.
    var is_empty = false;
    if(utility.isEmpty(this.state.email)) {
      this.setState({email_empty: "this field is required"});
      is_empty = true;
    }
    if(utility.isEmpty(this.state.password)) {
      this.setState({password_empty: "this field is required"});
      is_empty = true;
    }
    if(utility.isEmpty(this.state.password_confirm)) {
      this.setState({password_confirm_empty: "this field is required"});
      is_empty = true;
    }
    if(utility.isEmpty(this.state.firstname)) {
      this.setState({firstname_empty: "this field is required"});
      is_empty = true;
    }
    if(utility.isEmpty(this.state.lastname)) {
      this.setState({lastname_empty: "this field is required"});
      is_empty = true;
    }

    if(is_empty) return;

    // validation.
    if(!utility.checkEmailValidation(this.state.email)) return;
    if(!utility.checkPasswordValidation(this.state.password)) return;
    if(!this.checkPasswordConfirm(this.state.password, this.state.password_confirm)) return;

    // send form.
    document.getElementById('_form').submit();
  },

  render: function() {
    var style = {
      disable_button: {
        width: "500px",
        cursor: "not-allowed",
        pointerEvents: "none",
      },
      enable_button: {
        width: "500px",
      },
    };

    // email validation.
    var button_style = style.enable_button;
    var email_validation = "";
    if("" !== this.state.email_empty) {
      email_validation = this.state.email_empty;
    }
    else if(false === utility.checkEmailValidation(this.state.email)) {
      button_style = style.disable_button;
      email_validation = "Please enter the correct email";
    }

    // password validation.
    var password_validation = "";
    if("" !== this.state.password_empty) {
      button_style = style.disable_button;
      password_validation = this.state.password_empty;
    }
    else if(false === utility.checkPasswordValidation(this.state.password)) {
      button_style = style.disable_button;
      password_validation = "Please enter the password between 8 and 12 characters(numbers and captal letters for minimum one letter)";
    }

    // password confirm validation.
    var password_confirm = "";
    if("" !== this.state.password_confirm_empty) {
      button_style = style.disable_button;
      password_confirm = this.state.password_confirm_empty;
    }
    else if(false === this.checkPasswordConfirm(this.state.password, this.state.password_confirm)) {
      button_style = style.disable_button;
      password_confirm = "Password and Confirm-password do not match";
    }

    // firstname validation.
    var firstname_empty = "";
    if("" !== this.state.firstname_empty) {
      button_style = style.disable_button;
      firstname_empty = this.state.firstname_empty;
    }

    // lastname validation.
    var lastname_empty = "";
    if("" !== this.state.lastname_empty) {
      button_style = style.disable_button;
      lastname_empty = this.state.lastname_empty;
    }

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div>
          <FieldComponent hint="First Name" error={firstname_empty} name="firstname" onChange={this.onChange} />
          <br />
          <FieldComponent hint="Last Name" error={lastname_empty} name="lastname" onChange={this.onChange} />
          <br />
          <FieldComponent hint="Email Address" error={email_validation} name="email" type="email" onChange={this.onChange} />
          <br />
          <FieldComponent hint="Password" error={password_validation} name="password" type="password" onChange={this.onChange} />
          <br />
          <FieldComponent hint="Confirm Password" error={password_confirm} name="password_confirm" type="password" onChange={this.onChange} />
          <br />
          <button style={button_style} onClick={this.onSubmit} type="button"
                  className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored">Signup</button>
        </div>
      </MuiThemeProvider>
    );
  },

  checkPasswordConfirm: function(password, password_confirm) {
    if(utility.isEmpty(password)) return true;
    if(password === password_confirm) return true;
    return false;
  },

});

//-------------------------------------.
// Render Signup Form Component.
//-------------------------------------.
ReactDOM.render(
  <SignupForm />,
  document.getElementById("signup_form")
);
