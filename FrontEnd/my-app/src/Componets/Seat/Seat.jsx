import React from "react";

const Seat = ({ seatNumber, isBooked, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={isBooked}
      className={`w-10 h-10 rounded-md font-bold transition-all duration-200 ${
        isBooked
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-green-400 cursor-pointer hover:scale-110"
      }`}
    >
      {seatNumber}
    </button>
  );
};

export default Seat;
