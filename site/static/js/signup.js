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
    };
  },

  onChange: function(e) {
    this.setState({[e.target.name]: e.target.value});
  },

  onSubmit: function() {
    var form = document.getElementById('_form');
    form.submit();
  },

  render: function() {
    var style={
      width: "500px",
    };
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div>
          <FieldComponent hint="First Name" name="firstname" onChange={this.onChange} />
          <br />
          <FieldComponent hint="Last Name" name="lastname" onChange={this.onChange} />
          <br />
          <FieldComponent hint="Email Address" name="email" type="email" onChange={this.onChange} />
          <br />
          <FieldComponent hint="Password" name="password" type="password" onChange={this.onChange} />
          <br />
          <FieldComponent hint="Password Confirm" name="password_confirm" type="password" onChange={this.onChange} />
          <br />
          <button style={style}
                  className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored">Signup</button>
        </div>
      </MuiThemeProvider>
    );
  }
});

//-------------------------------------.
// Render Signup Form Component.
//-------------------------------------.
ReactDOM.render(
  <SignupForm />,
  document.getElementById("signup_form")
);
