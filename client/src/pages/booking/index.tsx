import FullCalendar, { EventContentArg } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../../config";
import AddEvent from "./addEvent";

const timeSlotMap: any = {
  am: "午前中",
  pm: "午後",
  all: "終日",
};

const Booking: React.FC = () => {
  const calendarRef = useRef(null as any);
  const jumpTo = useNavigate();
  const currentUser = localStorage.getItem("username");
  const [dateStr, setDateStr] = useState("");
  const [show, setShow] = useState(false);

  const handleDateClick = (e: DateClickArg) => {
    setDateStr(e.dateStr);
    e.dayEl.addEventListener("dblclick", () => {
      setShow(true);
    });
  };

  useEffect(() => {
    axiosInstance.get("/querySchedule").then((res) => {
      const calendarApi = calendarRef.current._calendarApi;
      calendarApi.removeAllEvents();

      res.data.data.forEach(
        ({
          realname,
          timeslot,
          username,
          role,
          dateStr,
        }: {
          realname: string;
          timeslot: string;
          username: string;
          role: number;
          dateStr: string;
        }) => {
          if (role === 0) {
            calendarApi.addEvent({
              realname: `${realname} さん`,
              timeslot: timeSlotMap[timeslot],
              start: dateStr,
              end: dateStr,
              role,
            });
          } else {
            calendarApi.addEvent({
              realname: `${realname} 先生`,
              timeslot: timeSlotMap[timeslot],
              start: dateStr,
              end: dateStr,
              role,
            });
          }
        }
      );
    });
  }, [show]);

  const renderEvent = (e: EventContentArg) => (
    <>
      <i>{e.event.extendedProps.realname}</i>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <i>{e.event.extendedProps.timeslot}</i>
    </>
  );

  return (
    <>
      <h3>
        Hello {currentUser}
        <button
          onClick={() => {
            jumpTo("/");
          }}
        >
          logout
        </button>
      </h3>

      {show && (
        <AddEvent
          dateStr={dateStr}
          setShow={setShow}
          handleClose={() => setShow(false)}
        />
      )}

      <FullCalendar
        height={850}
        ref={calendarRef}
        plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,today,next",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5],
          startTime: "7:00",
          endTime: "23:00",
        }}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
        }}
        editable={true}
        event-overlap={false}
        slotMinTime={"08:00"}
        slotMaxTime={"19:00"}
        slotDuration={"00:30:00"}
        eventContent={renderEvent}
        dateClick={handleDateClick}
      />
    </>
  );
};

export default Booking;
