import React from "react";
import moment from "moment";
import "./style.css";

const localStorageName = "calendar-events";

export default class Calendar extends React.Component {
  eventlist = JSON.parse(localStorage.getItem(localStorageName)) || {};

  state = {
    dateContext: moment(),
    selectedDay: moment().format('l'),
    dateContextWeeker: moment(),
    today: moment(),
    showMonthPopup: false,
    showYearPopup: false,

    WeekOfmonth: true
  };

  constructor(props) {
    super(props);
    this.width = props.width || "350px";
    this.style = props.style || {};
    this.style.width = this.width;
  }

  weekdays = moment.weekdays();
  weekdaysMin = moment.weekdaysMin();
  months = moment.months();

  buttoner = () => {
    let fieldvalue = document.getElementsByTagName("input")[0].value;
    if (fieldvalue === "") return false;
    let dateFormatted = this.state.selectedDay;

    if (!this.eventlist[dateFormatted]) this.eventlist[dateFormatted] = [];
    this.eventlist[dateFormatted].push(fieldvalue);
    localStorage.setItem(localStorageName, JSON.stringify(this.eventlist));
    document.getElementsByTagName("input")[0].value = "";

    this.setState({
      selectedDay: this.state.selectedDay
    });
  };

  selected = d => {
    return moment(this.state.selectedDay).date() == d;
  };

  freeday = d => {
      return (
        moment([
          this.state.dateContext.year(),
          this.state.dateContext.month(),
          d
        ]).day() === 5 ||
        moment([
          this.state.dateContext.year(),
          this.state.dateContext.month(),
          d
        ]).day() === 6
      );
  };

  nextMonth = () => {
    this.setState({
      dateContext: this.state.dateContext.add(1, "month")
    });
    this.props.onNextMonth && this.props.onNextMonth();
    this.selectedDayRender();
  };

  nextWeek = () => {
    this.setState({
      dateContextWeeker: this.state.dateContextWeeker.add(7, "d")
    });
    this.props.onnextWeek && this.props.onnextWeek();
  };
  prevWeek = () => {
    this.setState({
      dateContextWeeker: this.state.dateContextWeeker.subtract(7, "d")
    });
    this.props.onprevWeek && this.props.onprevWeek();
  };
  prevMonthNav = () => {
    let dateContext = this.state.dateContext;
    let prevMonth = moment(dateContext)
      .subtract("months", 1)
      .format("MMM");
    return prevMonth;
  };

  nextMonthNav = () => {
    let dateContext = this.state.dateContext;
    let nextMonth = moment(dateContext)
      .add("months", 1)
      .format("MMM");

    return nextMonth;
  };
  selectedDayRender = () => {
    this.setState({
      selectedDay: moment([
        this.state.dateContext.year(),
        this.state.dateContext.month(),
        moment(this.state.selectedDay).date()
      ]).format("l")
    });
  };
  prevMonth = () => {
    this.setState({
      dateContext: this.state.dateContext.subtract(1, "month")
    });
    this.props.onPrevMonth && this.props.onPrevMonth();
    this.selectedDayRender();
  };

  dateOfCurrentWeek = () => {
    return <span className="label-week">{this.dateOfWeekNav()}</span>;
  };
  abs = () => {
    return <span className="abs">{moment(this.state.selectedDay).format("MMM, D")}</span>;
  };
  year = () => {
    if (this.state.WeekOfmonth == true)
      return this.state.dateContext.format("Y");
    else return this.state.dateContextWeeker.format("Y");
  };
  month = () => {
    if (this.state.WeekOfmonth == true)
      return this.state.dateContext.format("MMMM");
    else return this.state.dateContextWeeker.format("MMMM");
  };

  daysinweek = () => {
    return this.state.dateContext;
  };
  daysInMonth = () => {
    return this.state.dateContext.daysInMonth();
  };
  currentDate = () => {
    return this.state.dateContext.get("date");
  };
  currentDay = () => {
    return this.state.dateContext.format("D");
  };
  currentFullDay = b => {

    if (this.state.WeekOfmonth == true)
      return this.state.dateContext.format("DD MM YYYY");
    else if (this.state.WeekOfmonth == false) {
      if (b === this.state.today.isoWeek())
        return this.state.dateContextWeeker.format("DD MM YYYY");
    }
  };

  firstDayOfMonth = () => {
    if (this.state.WeekOfmonth == true) {
      let dateContext = this.state.dateContext;
      let firstDay = moment(dateContext)
        .startOf("month")
        .format("d");
      return firstDay;
    } else {
      let dateContextWeeker = this.state.dateContextWeeker;
      let firstDay = moment(dateContextWeeker)
        .startOf("month")
        .format("d");
      return firstDay;
    }
  };
  firstDayOfMonth = () => {
    if (this.state.WeekOfmonth == true) {
      let dateContext = this.state.dateContext;
      let firstDay = moment(dateContext)
        .startOf("month")
        .format("d");
      return firstDay;
    } else {
      let dateContextWeeker = this.state.dateContextWeeker;
      let firstDay = moment(dateContextWeeker)
        .startOf("month")
        .format("d");
      return firstDay;
    }
  };

  SelectList = props => {
    let popup = props.data.map(data => {
      return (
        <div key={data}>
          <a
            href="#"
            onClick={e => {
              this.onSelectChange(e, data);
            }}
          >
            {data}
          </a>
        </div>
      );
    });

    return <div className="month-popup">{popup}</div>;
  };
  setMonth = month => {
    let monthNo = this.months.indexOf(month);
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).set("month", monthNo);
    this.setState({
      dateContext: dateContext,
      dateContextWeeker: dateContext
    });
  };
  onSelectChange = (e, data) => {
    this.setMonth(data);
    this.props.onMonthChange && this.props.onMonthChange();
  };

  onChangeMonth = (e, month) => {
    this.setState({
      showMonthPopup: !this.state.showMonthPopup
    });
  };

  MonthNav = () => {
    return (
      <span
        className="label-month"
        onClick={e => {
          this.onChangeMonth(e, this.month());
        }}
      >
        {this.month()}
        {this.state.showMonthPopup && <this.SelectList data={this.months} />}
      </span>
    );
  };

  showYearEditor = () => {
    this.setState({
      showYearNav: true
    });
  };

  setYear = year => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).set("year", year);
    this.setState({
      dateContext: dateContext,
      dateContextWeeker: dateContext
    });
  };
  onYearChange = e => {
    this.setYear(e.target.value);
    this.props.onYearChange && this.props.onYearChange(e, e.target.value);
  };

  onKeyUpYear = e => {
    if (e.which === 13 || e.which === 27) {
      this.setYear(e.target.value);
      this.setState({
        showYearNav: false
      });
    }
  };

  onDayClick = (e, day, idName) => {
    let id = idName + day;
    let name = "";
    if (document.querySelector("td.selected")) {
      name = document.querySelector("td.selected").className;
      document.querySelector("td.selected").className = name.substr(
        0,
        name.length - 8
      );
    }

    name = document.getElementById(id).className;
    document.getElementById(id).className = name + "selected";
    this.props.onDayClick && this.props.onDayClick(e, day);

    if (this.state.WeekOfmonth == true)
      this.setState({
        selectedDay: moment([
          this.state.dateContext.year(),
          this.state.dateContext.month(),
          day
        ]).format("l")
      });
    else {
      this.setState({
        selectedDay: moment([
          this.state.dateContextWeeker.year(),
          this.state.dateContextWeeker.month(),
          day
        ]).format("l")
      });
    }
  };

  openSelectionMenu = e => {
    document.getElementById("hiddenMenu").style.visibility = "visible";
    document.getElementById("open").style.display = "none";
    document.getElementById("close").style.display = "inline";
    this.props.openSelectionMenu && this.props.openSelectionMenu(e);
  };
  closeSelectionMenu = e => {
    document.getElementById("hiddenMenu").style.visibility = "hidden";
    document.getElementById("close").style.display = "none";
    document.getElementById("open").style.display = "inline";
    this.props.closeSelectionMenu && this.props.closeSelectionMenu(e);
  };

  monthPrev = () => {
    return (
      <span
        id="prev"
        onClick={e => {
          this.prevMonth();
        }}
      >
        {this.prevMonthNav()}
      </span>
    );
  };

  monthNext = () => {
    return (
      <span
        id="next"
        onClick={e => {
          this.nextMonth();
        }}
      >
        {this.nextMonthNav()}
      </span>
    );
  };
  dateOfWeekNav = () => {
    let dateOfWeek = moment(this.state.dateContextWeeker)
    .startOf("week")
    .format("D") + "-" + moment(this.state.dateContextWeeker)
    .endOf("week")
    .format("D");
    return dateOfWeek;
  };
  YearNav = () => {
    return this.state.showYearNav ? (
      <input
        defaultValue={this.year()}
        className="editor-year"
        ref={yearInput => {
          this.yearInput = yearInput;
        }}
        onKeyUp={e => this.onKeyUpYear(e)}
        onChange={e => this.onYearChange(e)}
        type="number"
        placeholder="year"
      />
    ) : (
      <span
        className="label-year"
        onDoubleClick={e => {
          this.showYearEditor();
        }}
      >
        {this.year()}
      </span>
    );
  };

  onlyWeek = e => {

    document.getElementById("prev").style.display = "none";
    document.getElementById("next").style.display = "none";
    document.getElementById("prevWeekButton").style.display = "inline";
    document.getElementById("nextWeekButton").style.display = "inline";
    document.querySelector("span.label-week").style.display = "inline";
    this.props.onlyWeek && this.props.onlyWeek(e);
    if (this.state.WeekOfmonth == true) {
      this.setState({ WeekOfmonth: !this.state.WeekOfmonth });
    }
  };
  onlyMonth = e => {

    document.getElementById("prev").style.display = "inline";
    document.getElementById("next").style.display = "inline";
    document.getElementById("prevWeekButton").style.display = "none";
    document.getElementById("nextWeekButton").style.display = "none";
    document.querySelector("span.label-week").style.display = "none";
    this.props.onlyMonth && this.props.onlyMonth(e);
    if (this.state.WeekOfmonth == false) {
      this.setState({ WeekOfmonth: !this.state.WeekOfmonth });
    }
  };

  startofweek = i => {
    let startDateOfWeek = moment([
      this.state.dateContextWeeker.year(),
      this.state.dateContextWeeker.month(),
      moment(this.state.dateContextWeeker)
        .startOf("week")
        .format("D")
    ])
      .add(i, "d")
      .format("D");

    return startDateOfWeek;
  };

  eventclick = item => {
    let dateFormatted = this.state.selectedDay;
    if (!this.eventlist[dateFormatted]) return false;
    if (this.eventlist[dateFormatted].length === 1)
      delete this.eventlist[dateFormatted];
    else
      this.eventlist[dateFormatted].splice(
        this.eventlist[dateFormatted].indexOf(item),
        1
      );
    localStorage.setItem(localStorageName, JSON.stringify(this.eventlist));

    this.setState({ selectedDay: this.state.selectedDay });
  };

  eventday = (d) => {
    if (this.state.WeekOfmonth == true) {
        return this.eventlist[
          moment([this.state.dateContext.year(),this.state.dateContext.month(), d]).format("l")
        ];
   } else {
      return this.eventlist[
        moment([
          this.state.dateContextWeeker.year(),
          this.state.dateContextWeeker.month(),
          d
        ]).format("l")
      ];
  }
  };

  render() {
    let weekdays = this.weekdaysMin.map(day => {
      return (
        <td key={day} className="week-day">
          {day}
        </td>
      );
    });
    let daysInMonth = [];
    let blanks = [];

    if (this.state.WeekOfmonth == true) {
      for (let i = 0; i < this.firstDayOfMonth(); i++) {
        blanks.push(
          <td key={i * 80} className="emptySlot">
            {""}
          </td>
        );
      }

      for (let d = 1; d <= this.daysInMonth(); d++) {
        let selectedDay = "";

        selectedDay = this.selected(d) ? "selected" : "";

        let className =
          moment([moment().year(), moment().month(), d]).format("DD MM YYYY") ==
          this.currentFullDay()
            ? " current-day"
            : this.eventday(d)
            ? " event"
            : this.freeday(d)
            ? " freeday"
            : " ";
        let idName = "day";
        daysInMonth.push(
          <td
            key={d}
            className={idName +className + " " + selectedDay}
            id={idName + d}
            onClick={e => {
              this.onDayClick(e, d, idName);
            }}
          >
            <span>{d}</span>
          </td>
        );
      }
    } else {
      let i = 0;
      while (i <= 6) {
        let selectedDay = "";
        let d = this.startofweek(i);
        selectedDay = this.selected(d) ? "selected" : "";
        let className =
          moment([moment().year(), moment().month(), d]).format("DD MM YYYY") ==
          this.currentFullDay(this.state.dateContextWeeker.isoWeek())
            ? " current-day"
            : this.eventday(d, this.state.dateContextWeeker.isoWeek())
            ? " event"
            : i === 5 || i === 6
            ? " freeday"
            : " ";

        let idName = "day";
        daysInMonth.push(
          <td
            key={d + i}
            className={idName + className + " " + selectedDay}
            id={idName + d}
            onClick={e => {
              this.onDayClick(e, d, idName);
            }}
          >
            <span>{d}</span>
          </td>
        );
        i++;
      }
    }

    var totalSlots = [...blanks, ...daysInMonth];
    let rows = [];
    let cells = [];
    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        let insertRow = cells.slice();
        rows.push(insertRow);
        cells = [];
        cells.push(row);
      }
      if (i === totalSlots.length - 1) {
        let insertRow = cells.slice();
        rows.push(insertRow);
      }
    });

    let trElems = rows.map((d, i) => {
      return <tr key={i * 100}>{d}</tr>;
    });
    let eventl = this.eventlist[this.state.selectedDay] || [
      "there is not any event"
    ];
    let eventTemplate = [];
    eventl.forEach(item => {
      eventTemplate.push(
        <li
          onClick={e => {
            this.eventclick(item);
          }}
        >

          {item}
        </li>
      );
    });

    return (
      <div className="calendar-container" style={this.style}>
        <table className="calendar">
          <thead className="thead">
            <tr className="calendar-top ">
              <td className="nav-month">
                <div>
                  <this.monthPrev />
                  <span
                    id="prevWeekButton"
                    onClick={e => {
                      this.prevWeek();
                    }}
                  >
                    Prev{" "}
                  </span>
                </div>
              </td>
              <td colSpan="5">
                <this.MonthNav /> <this.YearNav /> <this.dateOfCurrentWeek />
                <i
                  className="open fas fa-chevron-down"
                  id="open"
                  onClick={e => {
                    this.openSelectionMenu();
                  }}
                />
                <i
                  className="open fas fa-chevron-up"
                  id="close"
                  onClick={e => {
                    this.closeSelectionMenu();
                  }}
                  />
              </td>
              <td className="nav-month">
                <div>
                  <this.monthNext />
                  <span
                    id="nextWeekButton"
                    onClick={e => {
                      this.nextWeek();
                    }}
                  >
                    Next{" "}
                  </span>
                </div>
              </td>
            </tr>
            <div id="hiddenMenu">
              <span
                className="hiddenMenuButton"
                onClick={e => {
                  this.onlyWeek();
                }}
              >
                This week
              </span>
              <span className="hiddenMenuButton" onClick={e => {this.onlyMonth();}}>
                This month
              </span>
            </div>
            <tr className="weekDay">{weekdays}</tr>
          </thead>
          <tbody className="calendar-bottom">{trElems}</tbody>
          <tr className="monthShort">
            <this.abs />
            <div>
              CurrentEvents
              <ul className="eventslist">{eventTemplate}</ul>
              <input />
              <button onClick={e => { this.buttoner();}}>
                OK
              </button>
            </div>
          </tr>
        </table>
      </div>
    );
  }
}
