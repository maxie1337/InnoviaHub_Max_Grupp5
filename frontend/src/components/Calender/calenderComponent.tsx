import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';


type CalendarComponentProps = {
  selectedDates: Date[];
  setSelectedDates: (dates: Date[]) => void;
};

const CalendarComponent = ({ selectedDates, setSelectedDates }: CalendarComponentProps) => {

    //const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    
    const handleDatesChange =(dates: Date) => {
    const exists = selectedDates.some((d) => d.toDateString() === dates.toDateString());
    if (exists) {
      // If date exists, remove it
      setSelectedDates(selectedDates.filter((d) => d.toDateString() !== dates.toDateString()));
        } else {
        // If date doesn't exist, add it
        setSelectedDates([...selectedDates, dates]);
        }
    };
    const isSelected = (date: Date) => {
        return selectedDates.some((d) => d.toDateString() === date.toDateString());
    };

    return (
        <div className="react-calendar">
        <h2>Calendar</h2>

        <Calendar
            minDate={new Date()}
            onClickDay={handleDatesChange}
            tileClassName={({ date }) => (isSelected(date) ? "selected-date" : "")}       

        />

        {selectedDates.length > 0 && (
            <div>
            <h3>Selected Dates:</h3>
            <ul>
                {selectedDates.map((date, i) => (
                <li key={i}>{date.toDateString()}</li>
                ))}
            </ul>          
            </div>        
        )}
        <button onClick={() => setSelectedDates([])}>Clear Dates</button><br />
        
        </div>
    );   
}

export default CalendarComponent;