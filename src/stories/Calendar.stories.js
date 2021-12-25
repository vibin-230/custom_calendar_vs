import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import moment from "moment";
import { Calendar } from "../components/Calendar/Calendar";

const stories = storiesOf("App Test", module);

stories.add("App", () => {
  const [date, setDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment());
  return (
    <Calendar
      setSelectedDate={(e) => setSelectedDate(e)}
      format="range"
      size="sm"
      dayFormat={"normal"}
    />
  );
});
