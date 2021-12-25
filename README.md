Built with React 17.0.X and Rollup 2.X

Dependencies moment.js

Usage:

import React, { useState } from "react";
import moment from "moment";
import { Calendar } from "../components/Calendar/Calendar";

export const App = () => {
const [selectedDate, setSelectedDate] = useState(moment());
return (
<Calendar
setSelectedDate={(e) => setSelectedDate(e)}
format="range"
size="sm"
dayFormat="normal"
/>
);
}

Manditory Prop:
/_ all dates will be returned in moment.js format _/

format = "single"/"range" => single - should be used for getting a single chosen date
=> range - should be used for geting a array of chosen dates

setSelectedDate = (date)=>{setSelectedDate(date)} => will retun the chosen date/date_array as per the format props

size = sm/md/lg => sm - (350px) , md - (400px) , lg - (500px)

dayFormat = short/normal => short - will display day names in short form (single letter)
=> normal - will display day names in normal form (three letters)
