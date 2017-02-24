import React from 'react';
import DefaultLayout from './layout';

//----------------------------------------.
// Index Component.
//----------------------------------------.
var Index = React.createClass({
    render: function() {
      return (
        <DefaultLayout title={this.props.title}>
          <div style={{display:"none"}}>
            <h1>{this.props.title}</h1>
          </div>
          <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
            <header className="mdl-layout__header">
              <div className="mdl-layout__header-row">
                <span className="mdl-layout-title">{this.props.title}</span>
                <div className="mdl-layout-spacer"></div>
                <button id="schedule_regist"
                        className="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect">
                  <i className="material-icons">add</i>
                </button>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right">
                  <label className="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect"
                         htmlFor="fixed-header-drawer-exp">
                    <i className="material-icons">search</i>
                  </label>
                  <div className="mdl-textfield__expandable-holder">
                    <input className="mdl-textfield__input"
                           type="text"
                           name="search_schedule"
                           id="fixed-header-drawer-exp" />
                  </div>
                </div>
              </div>
            </header>
            <div className="mdl-layout__drawer">
              <span className="mdl-layout-title">{this.props.title}</span>
              <nav className="mdl-navigation">
                <a className="mdl-navigation__link" href="">Link</a>
                <a className="mdl-navigation__link" href="">Config</a>
                <a className="mdl-navigation__link" href="/signout">Signout</a>
              </nav>
            </div>
            <main id="page_top" className="mdl-layout__content">
              <div id="page-content"></div>
            </main>
          </div>
          <link type="text/css" rel="stylesheet" href="/stylesheets/index.css" />
          <script src="/javascripts/build/main.bundle.js" />
        </DefaultLayout>
      );
    },
});

module.exports = Index;
