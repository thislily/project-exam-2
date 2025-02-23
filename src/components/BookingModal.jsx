import React from "react";
import { Dialog } from "@headlessui/react";
import Calendar from "./Calendar";

const BookingModal = ({
  isOpen,
  onClose,
  id,
  bookings,
  selectedDates,
  onDateChange,
  guestCount,
  setGuestCount,
  onConfirm,
  onDelete,
  editingBooking,
  bookingConfirmed,
  confirmDelete,
  onCancelDelete, // Callback to cancel delete confirmation.
  onRequestDelete, // Callback triggered when user clicks "Delete Booking".
  newTotalCost,
  originalCost,
  newCost,
  costDiff,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <Dialog.Panel className="bg-white p-6 rounded-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          X
        </button>
        {bookingConfirmed ? (
          <div>
            <p className="mb-4">
              {editingBooking ? "Booking updated!" : "Booking confirmed!"}
            </p>
            {editingBooking && (
              <p className="mb-4">
                Original Cost: ${originalCost} | New Cost: ${newCost} (
                {costDiff >= 0 ? "+" : ""}
                {costDiff})
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-breeze text-black rounded"
              >
                Okay
              </button>
            </div>
          </div>
        ) : confirmDelete ? (
          <div>
            <p className="mb-4 text-red-600">
              Are you sure you want to delete this booking?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={onDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={onCancelDelete}
                className="px-4 py-2 bg-gray-300 text-black rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="mb-4 text-xl font-semibold">
              {editingBooking ? "Edit your booking" : "Confirm your booking"}
            </h3>
            <Calendar
              venueId={id}
              bookings={bookings}
              onDateChange={onDateChange}
              selectedDates={selectedDates}
            />
            <div className="mb-4">
              <label htmlFor="guestCount" className="block mb-2">
                Number of Guests:
              </label>
              <input
                id="guestCount"
                type="number"
                min="1"
                max="100"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            {selectedDates && selectedDates.start && selectedDates.end && (
              <>
                {!editingBooking && newTotalCost !== null && (
                  <p className="mb-4">Total Cost: ${newTotalCost}</p>
                )}
                {editingBooking && (
                  <p className="mb-4">
                    Original Cost: ${originalCost} | New Cost: ${newCost} (
                    {costDiff >= 0 ? "+" : ""}
                    {costDiff})
                  </p>
                )}
              </>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-breeze text-black rounded"
              >
                {editingBooking ? "Update Booking" : "Confirm Booking"}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-black rounded"
              >
                Cancel
              </button>
              {editingBooking && (
                <button
                  onClick={onRequestDelete}
                  className="px-4 py-2 bg-red-300 text-black rounded"
                >
                  Delete Booking
                </button>
              )}
            </div>
          </div>
        )}
      </Dialog.Panel>
    </Dialog>
  );
};

export default BookingModal;
