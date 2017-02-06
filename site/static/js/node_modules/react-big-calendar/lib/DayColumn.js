'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Selection = require('./Selection');

var _Selection2 = _interopRequireDefault(_Selection);

var _dates = require('./utils/dates');

var _dates2 = _interopRequireDefault(_dates);

var _selection = require('./utils/selection');

var _localizer = require('./localizer');

var _localizer2 = _interopRequireDefault(_localizer);

var _helpers = require('./utils/helpers');

var _propTypes = require('./utils/propTypes');

var _accessors = require('./utils/accessors');

var _TimeColumn = require('./TimeColumn');

var _TimeColumn2 = _interopRequireDefault(_TimeColumn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function snapToSlot(date, step) {
  var roundTo = 1000 * 60 * step;
  return new Date(Math.floor(date.getTime() / roundTo) * roundTo);
}

function startsBefore(date, min) {
  return _dates2.default.lt(_dates2.default.merge(min, date), min, 'minutes');
}

function startsAfter(date, max) {
  return _dates2.default.gt(_dates2.default.merge(max, date), max, 'minutes');
}

function positionFromDate(date, min, total) {
  if (startsBefore(date, min)) return 0;

  var diff = _dates2.default.diff(min, _dates2.default.merge(min, date), 'minutes');
  return Math.min(diff, total);
}

function overlaps(event, events, _ref, last) {
  var startAccessor = _ref.startAccessor,
      endAccessor = _ref.endAccessor;

  var eStart = (0, _accessors.accessor)(event, startAccessor);
  var offset = last;

  function overlap(eventB) {
    return _dates2.default.lt(eStart, (0, _accessors.accessor)(eventB, endAccessor));
  }

  if (!events.length) return last - 1;
  events.reverse().some(function (prevEvent) {
    if (overlap(prevEvent)) return true;
    offset = offset - 1;
  });

  return offset;
}

var DaySlot = _react2.default.createClass({
  displayName: 'DaySlot',


  propTypes: {
    events: _react2.default.PropTypes.array.isRequired,
    step: _react2.default.PropTypes.number.isRequired,
    min: _react2.default.PropTypes.instanceOf(Date).isRequired,
    max: _react2.default.PropTypes.instanceOf(Date).isRequired,
    now: _react2.default.PropTypes.instanceOf(Date),

    rtl: _react2.default.PropTypes.bool,
    titleAccessor: _propTypes.accessor,
    allDayAccessor: _propTypes.accessor.isRequired,
    startAccessor: _propTypes.accessor.isRequired,
    endAccessor: _propTypes.accessor.isRequired,

    selectRangeFormat: _propTypes.dateFormat,
    eventTimeRangeFormat: _propTypes.dateFormat,
    culture: _react2.default.PropTypes.string,

    selected: _react2.default.PropTypes.object,
    selectable: _react2.default.PropTypes.oneOf([true, false, 'ignoreEvents']),
    eventOffset: _react2.default.PropTypes.number,

    onSelecting: _react2.default.PropTypes.func,
    onSelectSlot: _react2.default.PropTypes.func.isRequired,
    onSelectEvent: _react2.default.PropTypes.func.isRequired,

    className: _react2.default.PropTypes.string,
    dragThroughEvents: _react2.default.PropTypes.bool,
    eventPropGetter: _react2.default.PropTypes.func,
    dayWrapperComponent: _propTypes.elementType,
    eventComponent: _propTypes.elementType,
    eventWrapperComponent: _propTypes.elementType.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return { dragThroughEvents: true };
  },
  getInitialState: function getInitialState() {
    return { selecting: false };
  },
  componentDidMount: function componentDidMount() {
    this.props.selectable && this._selectable();
  },
  componentWillUnmount: function componentWillUnmount() {
    this._teardownSelectable();
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.selectable && !this.props.selectable) this._selectable();
    if (!nextProps.selectable && this.props.selectable) this._teardownSelectable();
  },
  render: function render() {
    var _props = this.props,
        min = _props.min,
        max = _props.max,
        step = _props.step,
        now = _props.now,
        selectRangeFormat = _props.selectRangeFormat,
        culture = _props.culture,
        props = _objectWithoutProperties(_props, ['min', 'max', 'step', 'now', 'selectRangeFormat', 'culture']);

    this._totalMin = _dates2.default.diff(min, max, 'minutes');

    var _state = this.state,
        selecting = _state.selecting,
        startSlot = _state.startSlot,
        endSlot = _state.endSlot,
        style = this._slotStyle(startSlot, endSlot, 0);

    var selectDates = {
      start: this.state.startDate,
      end: this.state.endDate
    };

    return _react2.default.createElement(
      _TimeColumn2.default,
      _extends({}, props, {
        className: (0, _classnames2.default)('rbc-day-slot', _dates2.default.isToday(max) && 'rbc-today'),
        now: now,
        min: min,
        max: max,
        step: step
      }),
      this.renderEvents(),
      selecting && _react2.default.createElement(
        'div',
        { className: 'rbc-slot-selection', style: style },
        _react2.default.createElement(
          'span',
          null,
          _localizer2.default.format(selectDates, selectRangeFormat, culture)
        )
      )
    );
  },
  renderEvents: function renderEvents() {
    var _this = this;

    var _props2 = this.props,
        events = _props2.events,
        min = _props2.min,
        max = _props2.max,
        culture = _props2.culture,
        eventPropGetter = _props2.eventPropGetter,
        selected = _props2.selected,
        eventTimeRangeFormat = _props2.eventTimeRangeFormat,
        eventComponent = _props2.eventComponent,
        EventWrapper = _props2.eventWrapperComponent,
        startAccessor = _props2.startAccessor,
        endAccessor = _props2.endAccessor,
        titleAccessor = _props2.titleAccessor;


    var EventComponent = eventComponent,
        lastLeftOffset = 0;

    events.sort(function (a, b) {
      return +(0, _accessors.accessor)(a, startAccessor) - +(0, _accessors.accessor)(b, startAccessor);
    });

    return events.map(function (event, idx) {
      var start = (0, _accessors.accessor)(event, startAccessor);
      var end = (0, _accessors.accessor)(event, endAccessor);
      var startSlot = positionFromDate(start, min, _this._totalMin);
      var endSlot = positionFromDate(end, min, _this._totalMin);

      var continuesPrior = startsBefore(start, min);
      var continuesAfter = startsAfter(end, max);

      lastLeftOffset = Math.max(0, overlaps(event, events.slice(0, idx), _this.props, lastLeftOffset + 1));

      var style = _this._slotStyle(startSlot, endSlot, lastLeftOffset);

      var title = (0, _accessors.accessor)(event, titleAccessor);
      var label = _localizer2.default.format({ start: start, end: end }, eventTimeRangeFormat, culture);
      var _isSelected = (0, _selection.isSelected)(event, selected);

      if (eventPropGetter) var _eventPropGetter = eventPropGetter(event, start, end, _isSelected),
            xStyle = _eventPropGetter.style,
            className = _eventPropGetter.className;

      return _react2.default.createElement(
        EventWrapper,
        { event: event, key: 'evt_' + idx },
        _react2.default.createElement(
          'div',
          {
            style: _extends({}, xStyle, style),
            title: label + ': ' + title,
            onClick: function onClick(e) {
              return _this._select(event, e);
            },
            className: (0, _classnames2.default)('rbc-event', className, {
              'rbc-selected': _isSelected,
              'rbc-event-overlaps': lastLeftOffset !== 0,
              'rbc-event-continues-earlier': continuesPrior,
              'rbc-event-continues-later': continuesAfter
            })
          },
          _react2.default.createElement(
            'div',
            { className: 'rbc-event-label' },
            label
          ),
          _react2.default.createElement(
            'div',
            { className: 'rbc-event-content' },
            EventComponent ? _react2.default.createElement(EventComponent, { event: event, title: title }) : title
          )
        )
      );
    });
  },
  _slotStyle: function _slotStyle(startSlot, endSlot, leftOffset) {
    var _ref2;

    endSlot = Math.max(endSlot, startSlot + this.props.step); //must be at least one `step` high

    var eventOffset = this.props.eventOffset || 10,
        isRtl = this.props.rtl;

    var top = startSlot / this._totalMin * 100;
    var bottom = endSlot / this._totalMin * 100;
    var per = leftOffset === 0 ? 0 : leftOffset * eventOffset;
    var rightDiff = eventOffset / (leftOffset + 1);

    return _ref2 = {
      top: top + '%',
      height: bottom - top + '%'
    }, _ref2[isRtl ? 'right' : 'left'] = per + '%', _ref2.width = (leftOffset === 0 ? 100 - eventOffset : 100 - per - rightDiff) + '%', _ref2;
  },
  _selectable: function _selectable() {
    var _this2 = this;

    var node = (0, _reactDom.findDOMNode)(this);
    var selector = this._selector = new _Selection2.default(function () {
      return (0, _reactDom.findDOMNode)(_this2);
    });

    var maybeSelect = function maybeSelect(box) {
      var onSelecting = _this2.props.onSelecting;
      var current = _this2.state || {};
      var state = selectionState(box);
      var start = state.startDate,
          end = state.endDate;


      if (onSelecting) {
        if (_dates2.default.eq(current.startDate, start, 'minutes') && _dates2.default.eq(current.endDate, end, 'minutes') || onSelecting({ start: start, end: end }) === false) return;
      }

      _this2.setState(state);
    };

    var selectionState = function selectionState(_ref3) {
      var y = _ref3.y;
      var _props3 = _this2.props,
          step = _props3.step,
          min = _props3.min,
          max = _props3.max;

      var _getBoundsForNode = (0, _Selection.getBoundsForNode)(node),
          top = _getBoundsForNode.top,
          bottom = _getBoundsForNode.bottom;

      var mins = _this2._totalMin;

      var range = Math.abs(top - bottom);

      var current = (y - top) / range;

      current = snapToSlot(minToDate(mins * current, min), step);

      if (!_this2.state.selecting) _this2._initialDateSlot = current;

      var initial = _this2._initialDateSlot;

      if (_dates2.default.eq(initial, current, 'minutes')) current = _dates2.default.add(current, step, 'minutes');

      var start = _dates2.default.max(min, _dates2.default.min(initial, current));
      var end = _dates2.default.min(max, _dates2.default.max(initial, current));

      return {
        selecting: true,
        startDate: start,
        endDate: end,
        startSlot: positionFromDate(start, min, _this2._totalMin),
        endSlot: positionFromDate(end, min, _this2._totalMin)
      };
    };

    selector.on('selecting', maybeSelect);
    selector.on('selectStart', maybeSelect);

    selector.on('mousedown', function (box) {
      if (_this2.props.selectable !== 'ignoreEvents') return;

      return !(0, _Selection.isEvent)((0, _reactDom.findDOMNode)(_this2), box);
    });

    selector.on('click', function (box) {
      if (!(0, _Selection.isEvent)((0, _reactDom.findDOMNode)(_this2), box)) _this2._selectSlot(selectionState(box));

      _this2.setState({ selecting: false });
    });

    selector.on('select', function () {
      if (_this2.state.selecting) {
        _this2._selectSlot(_this2.state);
        _this2.setState({ selecting: false });
      }
    });
  },
  _teardownSelectable: function _teardownSelectable() {
    if (!this._selector) return;
    this._selector.teardown();
    this._selector = null;
  },
  _selectSlot: function _selectSlot(_ref4) {
    var startDate = _ref4.startDate,
        endDate = _ref4.endDate;

    var current = startDate,
        slots = [];

    while (_dates2.default.lte(current, endDate)) {
      slots.push(current);
      current = _dates2.default.add(current, this.props.step, 'minutes');
    }

    (0, _helpers.notify)(this.props.onSelectSlot, {
      slots: slots,
      start: startDate,
      end: endDate
    });
  },
  _select: function _select() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    (0, _helpers.notify)(this.props.onSelectEvent, args);
  }
});

function minToDate(min, date) {
  var dt = new Date(date),
      totalMins = _dates2.default.diff(_dates2.default.startOf(date, 'day'), date, 'minutes');

  dt = _dates2.default.hours(dt, 0);
  dt = _dates2.default.minutes(dt, totalMins + min);
  dt = _dates2.default.seconds(dt, 0);
  return _dates2.default.milliseconds(dt, 0);
}

exports.default = DaySlot;
module.exports = exports['default'];