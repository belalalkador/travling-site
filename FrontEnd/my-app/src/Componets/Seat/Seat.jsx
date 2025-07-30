import { Link } from "react-router-dom";
import './Seat.css'

const Seat = ({ number, status, journeyId, seatId, }) => {
  return (
   <button className="btn" disabled={status === 'booked'} >
     <Link to={`/reserve/company-journeys/${journeyId}/${seatId}`}className={`seat ${status}`}>
        {number}
           
     </Link>
   </button>
  );
}


export default Seat;


