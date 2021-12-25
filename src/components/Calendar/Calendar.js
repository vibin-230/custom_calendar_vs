/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import React, { useReducer, useEffect } from "react";

export const Calendar = ({ setSelectedDate, dayFormat, size, format }) => {
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      date: moment(),
      selectedDate: format === "range" ? [moment()] : moment(),
      currentDate: moment(),
      startDate: moment(),
      endDate: moment(),
      startDateActive: false,
      endDateActive: false,
      currentMonth: moment(),
      startOfMonth: moment().startOf("month").startOf("week"),
      endOfMonth: moment().endOf("month").endOf("week"),
      nextMonth: false,
      previousMonth: false,
    }
  );
  let hw = size === "md" ? 400 : size === "sm" ? 350 : 500;
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayNameShort = ["M", "T", "W", "T", "F", "S", "S"];

  const changeDate = (_date) => {
    let sd = state.startDate;
    let ed = state.endDate;
    if (!state.startDateActive && !state.endDateActive) {
      if (_date.isAfter(sd, "day")) {
        sd = moment(_date);
        ed = null;
        setState({ startDateActive: false, endDateActive: true });
      } else if (_date.isBefore(sd, "day")) {
        if (_date.isBefore(moment(), "day")) {
          sd = moment();
          ed = null;
          setState({ startDateActive: false, endDateActive: true });
        } else {
          sd = moment(_date);
          ed = null;
          setState({ startDateActive: false, endDateActive: true });
        }
      } else {
        sd = ed = moment(_date);
        setState({ selectedDate: [sd] });
      }
    } else {
      if (state.endDateActive) {
        if (_date.isBefore(sd, "day")) {
          sd = moment(_date);
          ed = null;
          setState({ startDateActive: false, endDateActive: true });
        } else {
          ed = moment(_date);
          setState({ startDateActive: false, endDateActive: false });
          let array = [];
          let x = moment(state.startDate);

          for (let i = ed.diff(x, "days") + 1; i > 0; i--) {
            array.push(moment(x));
            console.log(x, array, ed.diff(x, "days"));
            x.add(1, "day");
          }
          setState({ selectedDate: array });
        }
      }
    }

    setState({ startDate: sd, endDate: ed });
  };

  let selectedDateCheck = (days) => {
    if (format === "range") {
      if (
        days.isBetween(state.startDate, state.endDate, "day") ||
        days.isSame(state.startDate, "day") ||
        days.isSame(state.endDate, "day")
      ) {
        return true;
      }
    } else {
      return days.isSame(state.selectedDate, "day") && true;
    }
  };

  const singleDay = (dayFullFormat, days) => {
    return (
      <span
        style={{
          flex: 1,
          height: size === "md" ? 40 : size === "sm" ? 25 : 70,
          // width: size === "md" ? 40 : size === "sm" ? 48 : 70,
          display: "flex",
          cursor: "pointer",
          backgroundColor: selectedDateCheck(days) && "#488DFF",
          justifyContent: "center",
          alignItems: "center",
          color: selectedDateCheck(days)
            ? "#ffffff"
            : moment().isSame(days, "day")
            ? "#ce4ee3"
            : moment(days).format("MMYYYY") ===
              moment(state.currentDate).format("MMYYYY")
            ? "#7180AD"
            : moment(state.date).format("MMYYYY") ===
              moment(days).format("MMYYYY")
            ? "#CED9a7"
            : "#CED9F7",
          border: selectedDateCheck(days)
            ? "1px solid #2476FF"
            : "1px solid ghostwhite",

          borderTopLeftRadius:
            format === "range"
              ? ((!state.startDate.isSame(state.endDate, "day") &&
                  days.isSame(state.selectedDate[0], "day")) ||
                  days.isSame(state.startDate, "day")) &&
                30
              : days.isSame(state.selectedDate, "day") && 30,
          borderBottomLeftRadius:
            format === "range"
              ? ((!state.startDate.isSame(state.endDate, "day") &&
                  days.isSame(state.selectedDate[0], "day")) ||
                  days.isSame(state.startDate, "day")) &&
                30
              : days.isSame(state.selectedDate, "day") && 30,
          borderTopRightRadius:
            format === "range"
              ? ((!state.startDate.isSame(state.endDate, "day") &&
                  days.isSame(
                    state.selectedDate[state.selectedDate.lenght - 1],
                    "day"
                  )) ||
                  days.isSame(state.endDate, "day")) &&
                30
              : days.isSame(state.selectedDate, "day") && 30,
          borderBottomRightRadius:
            format === "range"
              ? ((!state.startDate.isSame(state.endDate, "day") &&
                  days.isSame(
                    state.selectedDate[state.selectedDate.lenght - 1],
                    "day"
                  )) ||
                  days.isSame(state.endDate, "day")) &&
                30
              : days.isSame(state.selectedDate, "day") && 30,

          fontSize: 16,
          fontWeight: 600,
          margin: "5px 0",
        }}
        onClick={() => {
          if (format === "range") {
            console.log(dayFullFormat.isSame(state.selectedDate[0], "day"));
            if (dayFullFormat.isSame(state.endDate, "day")) {
              setState({ startDate: moment(), endDate: moment() });
            } else {
              changeDate(dayFullFormat);
            }
          } else {
            setState({ selectedDate: moment(dayFullFormat) });
          }
        }}
      >
        {moment(days).format("D")}
      </span>
    );
  };
  const days = (_date) => {
    let startOfMonth = moment(_date).startOf("month").startOf("week");
    let endOfMonth = moment(_date).endOf("month").endOf("week");
    let weekStart = moment(startOfMonth);
    let daysRow = [];
    let week = [];
    while (weekStart < endOfMonth) {
      let row = [];
      let weekEnd = moment(weekStart).endOf("week");
      let days = moment(weekStart);
      for (let i = 0; i < weekEnd.diff(weekStart, "days") + 1; i++) {
        let dayFullFormat = moment(days);
        row.push(singleDay(dayFullFormat, days));
        days.add(1, "days");
      }
      week.push(<div style={{ display: "flex" }}>{row}</div>);
      weekStart.add(7, "days");
    }
    daysRow.push(week);
    week = [];
    return daysRow;
  };
  useEffect(() => {
    setState({
      startOfMonth: moment(state.date).startOf("month").startOf("week"),
      endOfMonth: moment(state.date).endOf("month").endOf("week"),
      currentMonth: moment(state.date),
    });
  }, [state.date]);
  useEffect(() => {
    if (state.nextMonth) {
      setTimeout(() => {
        setState({ date: moment(state.date).startOf("month").add(1, "month") });
        setState({ nextMonth: false });
      }, 500);
    }
  }, [state.nextMonth]);
  useEffect(() => {
    if (state.previousMonth) {
      setTimeout(() => {
        setState({
          date: moment(state.date).startOf("month").subtract(1, "month"),
        });
        setState({ previousMonth: false });
      }, 500);
    }
  }, [state.previousMonth]);
  useEffect(() => {
    setSelectedDate(state.selectedDate);
  }, [state.selectedDate]);

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      {/* style={{ width: "100%", margin: "auto" }}> */}
      <div
        style={{
          position: "relative",
          width: hw,
          height: hw,
          background: "ghostwhite",
          boxShadow: "0 0 10px 5px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 8,
          padding: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            height: 30,
          }}
        >
          <button
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: 0,
              boxShadow: "0 0 5px 2px rgba(0,0,0,0.2)",
            }}
            onClick={() => {
              setState({ previousMonth: true });
            }}
          >
            {"<"}
          </button>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 20,
              color: "#7180AD",
            }}
          >
            {moment(state.date).format("MMMM YYYY")}
          </div>
          <button
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: 0,
              boxShadow: "0 0 5px 2px rgba(0,0,0,0.2)",
            }}
            onClick={() => {
              setState({ nextMonth: true });
            }}
          >
            {">"}
          </button>
        </div>
        <div
          style={{
            display: "flex",
            // border: "2px solid #ececec",
            width: "100%",
            boxSizing: "border-box",
            margin: "auto",
            zIndex: 1,
          }}
        >
          {(dayFormat === "short" ? dayNameShort : dayNames).map((a, i) => (
            <span
              style={{
                padding: "10px",
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 12,
                color: "rgba(147,147,147,0.70)",
              }}
              key={i}
            >
              {a}
            </span>
          ))}
        </div>
        <span
          style={{
            display: "flex",
            width: hw,
            justifyContent: "center",
            margin: "auto",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              minWidth: hw,
              // border: "2px solid #ececec",
              transform: state.previousMonth
                ? "translateX(100%)"
                : "translateX(0)",
              transition: state.previousMonth ? "transform 500ms" : "none",

              zIndex: state.previousMonth ? "2" : "0",
              display: "block",
              left: 0,
            }}
          >
            {" "}
            {days(moment(state.date).startOf("month").subtract(1, "month"))}
          </span>
          <span
            style={{
              minWidth: hw,
              // border: "2px solid #ececec",
              transform: state.previousMonth
                ? "translateX(100%)"
                : state.nextMonth
                ? "translateX(-100%)"
                : "translateX(0)",
              transition: state.previousMonth
                ? "transform 500ms"
                : state.nextMonth
                ? "transform 500ms"
                : "none",
              zIndex: "2",
              display: "block",
            }}
          >
            {days(state.date)}
          </span>
          <span
            style={{
              minWidth: hw,
              // border: "2px solid #ececec",
              transform: state.nextMonth
                ? "translateX(-100%)"
                : "translateX(0)",
              transition: state.nextMonth ? "transform 500ms" : "none",
              zIndex: state.nextMonth ? "2" : "0",
              display: "block",
              right: 0,
            }}
          >
            {days(moment(state.date).startOf("month").add(1, "month"))}
          </span>
        </span>
      </div>
    </div>
  );
};
