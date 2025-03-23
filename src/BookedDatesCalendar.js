import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const fetchBookedDates = async (setError, setLoading) => {
  try {
    const response = await axios.get(
      `https://thingproxy.freeboard.io/fetch/https://www.holiday.by/callbacks/dom/calendar-data.json?houseSlug=zaozeryelogoysk`,
      // `https://thingproxy.fr`,
      { responseType: "text" }
    );
    const data = JSON.parse(response.data);
    return data.map(date => new Date(date));
  } catch (error) {
    console.error("Ошибка загрузки данных", error);
    setError(true);
    setLoading(false);
    return [];
  }
};

const BookedDatesCalendar = () => {
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchBookedDates(setError, setLoading)
      .then(dates => {
        setBookedDates(dates);
        setLoading(false);
      })
      .catch(() => {
        console.log("error");
        setError(true);
        setLoading(false);
      });
  }, []);

  const tileClassName = ({ date }) => {
    return bookedDates.some(bookedDate => bookedDate.toDateString() === date.toDateString()) ? "booked" : null;
  };

  return (
    <div className="subContainer">
      <div className="header">
        <h1>Dom Za Ozerom</h1>
        <div className="image"></div>
      </div>
      <h3>Календарь бронирования</h3>
      {loading ? (
        <div className="loading">
          <p className="loadingText">Загрузка...</p>
        </div>
      ) : error ? (
        <div className="errorMessage">
          <p style={{ color: "red" }}>Ошибка! Не удалось загрузить календарь.</p>
          <p>Доступные даты так же можно посмотреть на нашей страничке в <a href="https://www.holiday.by/by/dom/estates/zaozeryelogoysk/booking#content">holiday.by</a></p>
          <p>Спасибо за понимание!</p>
        </div>
      ) : (
        <div>
          <div className="calendar">
            <Calendar tileClassName={tileClassName} />
          </div>
          <div className="text">Забронированные даты &#10132; <span className="bookedExample"></span></div>
          <div className="text">Текущая дата &#10132; <span className="nowExample"></span></div>
        </div>
      )}
      <h3>Как забронировать усадьбу?</h3>
      <div className="text">Звоните по номеру <strong><a className="phone" href="tel:+375291321941">+375291321941</a> (Владимир)</strong></div>
      <div className="text">Или пишите нам в директ в инстаграмме <strong><a className="link" href="https://www.instagram.com/dom_za_ozerom?igsh=YThpMWVkazM2Z2Js&utm_source=qr">dom_za_ozerom</a></strong></div>
      <style>
        {`.booked { background-color: rgb(57, 57, 57) !important; color: white !important; }`}
      </style>
    </div>
  );
};

export default BookedDatesCalendar;
