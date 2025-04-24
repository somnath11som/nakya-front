


// import { useState } from "react";
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// const localizer = momentLocalizer(moment);

// const SchedulingStep = () => {
//   const [events, setEvents] = useState([
//     {
//       id: 1,
//       title: "00 Nutrients",
//       start: new Date(2024, 11, 17),
//       end: new Date(2024, 11, 17),
//       color: "bg-yellow-500",
//     },
//     {
//       id: 2,
//       title: "00 Inoculation", 
//       start: new Date(2024, 11, 18),
//       end: new Date(2024, 11, 18),
//       color: "bg-green-500",
//     },
//     {
//       id: 3,
//       title: "00 Harvest",
//       start: new Date(2024, 11, 19),
//       end: new Date(2024, 11, 19),
//       color: "bg-red-500",
//     },
//     {
//       id: 4,
//       title: "00 Agitation",
//       start: new Date(2024, 11, 19),
//       end: new Date(2024, 11, 19),
//       color: "bg-orange-500",
//     },
//     {
//       id: 5,
//       title: "00 Feed",
//       start: new Date(2024, 11, 20),
//       end: new Date(2024, 11, 20),
//       color: "bg-blue-500",
//     },
//     {
//       id: 6,
//       title: "00 Sample & Volume",
//       start: new Date(2024, 11, 20),
//       end: new Date(2024, 11, 20),
//       color: "bg-purple-500",
//     },
//   ]);

//   const [currentDate, setCurrentDate] = useState(new Date());

//   const handleNavigate = (action) => {
//     const newDate = new Date(currentDate);
//     if (action === 'PREV') {
//       newDate.setMonth(newDate.getMonth() - 1);
//     } else if (action === 'NEXT') {
//       newDate.setMonth(newDate.getMonth() + 1);
//     }
//     setCurrentDate(newDate);
//   };

//   const handleSelect = ({ start, end }) => {
//     const title = window.prompt('New Event name');
//     if (title) {
//       setEvents([
//         ...events,
//         {
//           id: events.length + 1,
//           title,
//           start,
//           end,
//           color: "bg-blue-500" // Default color
//         },
//       ]);
//     }
//   };

//   return (
//     <div className="flex h-screen w-full bg-black text-white">
//       {/* Sidebar */}
//       <div className="w-1/4 p-4 border-r border-gray-700">
//         <h2 className="text-sm font-semibold mb-2">Select One or More Conditions</h2>
//         <div className="space-y-2">
//           {["Feed", "Nutrients", "Agitation", "Inoculation", "Sample & Volume", "Harvest"].map(
//             (item, index) => (
//               <button
//                 key={index}
//                 className={`w-full px-4 py-2 text-left text-sm border border-gray-600 rounded-md ${
//                   events.some((e) => e.title.includes(item)) ? "bg-gray-800" : "bg-black"
//                 }`}
//               >
//                 {item}
//               </button>
//             )
//           )}
//         </div>
//       </div>

//       {/* Calendar Section */}
//       <div className="w-3/4 p-4 relative">
//         {/* Month Navigation */}
//         <div className="flex justify-center items-center mb-4">
//           <FaChevronLeft 
//             className="text-gray-400 cursor-pointer mx-2" 
//             onClick={() => handleNavigate('PREV')}
//           />
//           <h2 className="text-lg font-semibold">
//             {moment(currentDate).format('MMMM YYYY')}
//           </h2>
//           <FaChevronRight 
//             className="text-gray-400 cursor-pointer mx-2"
//             onClick={() => handleNavigate('NEXT')} 
//           />
//         </div>

//         {/* Calendar */}
//         <div className="h-[calc(100vh-150px)]">
//           <Calendar
//             localizer={localizer}
//             events={events}
//             startAccessor="start"
//             endAccessor="end"
//             selectable
//             onSelectSlot={handleSelect}
//             date={currentDate}
//             onNavigate={date => setCurrentDate(date)}
//             style={{ height: "100%" }}
//             className="text-white bg-black rounded-md"
//             components={{
//               event: ({ event }) => (
//                 <div className={`px-2 py-1 text-xs text-white ${event.color} rounded`}>
//                   {event.title}
//                 </div>
//               ),
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SchedulingStep;






import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const localizer = momentLocalizer(moment);

const SchedulingStep = () => {
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "00 Nutrients",
      start: new Date(2024, 11, 17),
      end: new Date(2024, 11, 17),
      color: "bg-yellow-500",
    },
    {
      id: 2,
      title: "00 Inoculation", 
      start: new Date(2024, 11, 18),
      end: new Date(2024, 11, 18),
      color: "bg-green-500",
    },
    {
      id: 3,
      title: "00 Harvest",
      start: new Date(2024, 11, 19),
      end: new Date(2024, 11, 19),
      color: "bg-red-500",
    },
    {
      id: 4,
      title: "00 Agitation",
      start: new Date(2024, 11, 19),
      end: new Date(2024, 11, 19),
      color: "bg-orange-500",
    },
    {
      id: 5,
      title: "00 Feed",
      start: new Date(2024, 11, 20),
      end: new Date(2024, 11, 20),
      color: "bg-blue-500",
    },
    {
      id: 6,
      title: "00 Sample & Volume",
      start: new Date(2024, 11, 20),
      end: new Date(2024, 11, 20),
      color: "bg-purple-500",
    },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());

  const handleNavigate = (action) => {
    const newDate = new Date(currentDate);
    if (action === 'PREV') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (action === 'NEXT') {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getColorForCondition = (condition) => {
    switch(condition) {
      case "Feed": return "bg-blue-500";
      case "Nutrients": return "bg-yellow-500";
      case "Agitation": return "bg-orange-500";
      case "Inoculation": return "bg-green-500";
      case "Sample & Volume": return "bg-purple-500";
      case "Harvest": return "bg-red-500";
      default: return "bg-blue-500";
    }
  };

  const handleSelect = ({ start, end }) => {
    if (!selectedCondition) return;

    setEvents([
      ...events,
      {
        id: events.length + 1,
        title: `00 ${selectedCondition}`,
        start,
        end,
        color: getColorForCondition(selectedCondition)
      },
    ]);
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      setSelectedEvent(null);
    }
  };

  const handleEditEvent = () => {
    if (selectedEvent) {
      // For now, just allow changing the condition
      const newCondition = window.prompt('Edit condition:', selectedEvent.title.substring(3));
      if (newCondition) {
        setEvents(events.map(event => 
          event.id === selectedEvent.id 
            ? {
                ...event,
                title: `00 ${newCondition}`,
                color: getColorForCondition(newCondition)
              }
            : event
        ));
        setSelectedEvent(null);
      }
    }
  };

  return (
    <div className="flex h-[100vh] w-full bg-black text-white">
      {/* Sidebar */}
      <div className="w-1/4 p-4 border-r border-gray-700">
        <h2 className="text-sm font-semibold mb-2">Select One or More Conditions</h2>
        <div className="space-y-2">
          {["Feed", "Nutrients", "Agitation", "Inoculation", "Sample & Volume", "Harvest"].map(
            (item, index) => (
              <button
                key={index}
                onClick={() => setSelectedCondition(item)}
                className={`w-full px-4 py-2 text-left text-sm border border-gray-600 rounded-md ${
                  selectedCondition === item ? "bg-gray-800" : "bg-black"
                } flex items-center`}
              >
                <div className={`w-3 h-3 rounded-full mr-2 ${getColorForCondition(item)}`}></div>
                {item}
              </button>
            )
          )}
        </div>

        {/* Event Options */}
        {selectedEvent && (
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold">Event Options</h3>
            <button
              onClick={handleEditEvent}
              className="w-full px-4 py-2 text-sm bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Edit Event
            </button>
            <button
              onClick={handleDeleteEvent}
              className="w-full px-4 py-2 text-sm bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete Event
            </button>
          </div>
        )}
      </div>

      {/* Calendar Section */}
      <div className="w-3/4 p-4 relative">
        {/* Month Navigation */}
        <div className="flex justify-center items-center mb-4">
          <FaChevronLeft 
            className="text-gray-400 cursor-pointer mx-2" 
            onClick={() => handleNavigate('PREV')}
          />
          <h2 className="text-lg font-semibold">
            {moment(currentDate).format('MMMM YYYY')}
          </h2>
          <FaChevronRight 
            className="text-gray-400 cursor-pointer mx-2"
            onClick={() => handleNavigate('NEXT')} 
          />
        </div>

        {/* Calendar */}
        <div className="h-[calc(100vh-150px)]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelect}
            onSelectEvent={handleEventSelect}
            date={currentDate}
            onNavigate={date => setCurrentDate(date)}
            style={{ height: "100%" }}
            className="text-white bg-black rounded-md"
            components={{
              event: ({ event }) => (
                <div className={`px-2 py-1 text-xs text-white ${event.color} rounded`}>
                  {event.title}
                </div>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SchedulingStep;
