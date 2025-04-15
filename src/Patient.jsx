import React, { useState } from 'react';
import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://hms_owner:npg_37PzNXjhxZve@ep-damp-term-a115kp8h-pooler.ap-southeast-1.aws.neon.tech/hms?sslmode=require');

const fetchPatientDetails = async (id) => {
  try {
    const result = await sql`SELECT * FROM patients WHERE patientid=${id}`;
    return result;
  } catch (error) {
    console.error("Error fetching patient details:", error);
  }
};

const fetchDoctorDetails = async () => {
  try {
    const result = await sql`SELECT * FROM doctors`;
    return result;
  } catch (error) {
    console.error("Error fetching doctor details:", error);
  }
};

const bookAppointment = async (patientid, doctorid, date, time) => {
  try {
    const result = await sql`
      INSERT INTO appointments (patientid, doctorid, appointmentdate, appointmenttime)
      VALUES (${patientid}, ${doctorid}, ${date}, ${time})
    `;
    return result;
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw error;
  }
};

const fetchAppointmentsByPatientId = async (patientid) => {
  try {
    const result = await sql`
      SELECT a.appointmentid, a.appointmentdate, a.appointmenttime, d.doctorname, d.specialisation 
      FROM appointments a
      JOIN doctors d ON a.doctorid = d.doctorid
      WHERE a.patientid = ${patientid}
      ORDER BY a.appointmentdate, a.appointmenttime
    `;
    return result;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

const Patient = () => {
  const [patientId, setPatientId] = useState('');
  const [patientDetails, setPatientDetails] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [bookingDoctorId, setBookingDoctorId] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');

  const handleFetchPatient = async () => {
    if (patientId) {
      const patientData = await fetchPatientDetails(patientId);
      if (patientData.length > 0) {
        setPatientDetails(patientData[0]);
        localStorage.setItem('patient_number', patientId);
        const appointmentData = await fetchAppointmentsByPatientId(patientId);
        setAppointments(appointmentData);
      } else {
        setPatientDetails(null);
        setAppointments([]);
        alert("Patient not found");
      }
    }
  };

  const handleFetchDoctors = async () => {
    const doctorData = await fetchDoctorDetails();
    setDoctors(doctorData);
  };

  const handleBookClick = (doctorid) => {
    setBookingDoctorId(doctorid);
  };

  const handleConfirmBooking = async () => {
    if (!appointmentDate || !appointmentTime) {
      alert("Please enter date and time");
      return;
    }
    try {
      await bookAppointment(patientDetails.patientid, bookingDoctorId, appointmentDate, appointmentTime);
      alert("Appointment booked successfully");
      const updatedAppointments = await fetchAppointmentsByPatientId(patientDetails.patientid);
      setAppointments(updatedAppointments);
      setBookingDoctorId(null);
      setAppointmentDate('');
      setAppointmentTime('');
    } catch (e) {
      alert("Failed to book appointment");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6">🩺 Patient Portal</h1>

      {/* Patient ID Input */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <input
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Enter Patient ID(like 1,2,3..)"
          className="input input-bordered w-full sm:w-64"
        />
        <button className="btn btn-primary" onClick={handleFetchPatient}>
          Fetch Patient Details
        </button>
      </div>

      {/* Patient Details */}
      {patientDetails && (
        <div className="bg-base-100 shadow-lg rounded-lg p-4 mb-6 border">
          <h2 className="text-xl font-semibold mb-2">👤 Patient Details</h2>
          <ul className="space-y-1">
            <li><strong>ID:</strong> {patientDetails.patientid}</li>
            <li><strong>Name:</strong> {patientDetails.patientname}</li>
            <li><strong>Age:</strong> {patientDetails.age}</li>
            <li><strong>Gender:</strong> {patientDetails.gender}</li>
            <li><strong>Address:</strong> {patientDetails.address}</li>
          </ul>
        </div>
      )}

      {/* Appointment List */}
      {appointments.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">📅 Appointments</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Appointment ID</th>
                  <th>Doctor</th>
                  <th>Specialisation</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.appointmentid}>
                    <td>{appt.appointmentid}</td>
                    <td>{appt.doctorname}</td>
                    <td>{appt.specialisation}</td>
                    <td>{new Date(appt.appointmentdate).toLocaleDateString()}</td>
                    <td>{appt.appointmenttime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Doctor List and Booking */}
      <div className="mb-6">
        <button className="btn btn-accent" onClick={handleFetchDoctors}>
          Show Available Doctors
        </button>

        {doctors.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">🩺 Doctors</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Specialisation</th>
                    <th>Availability</th>
                    <th>Book</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doc) => (
                    <tr key={doc.doctorid}>
                      <td>{doc.doctorname}</td>
                      <td>{doc.specialisation}</td>
                      <td>{doc.availablility}</td>
                      <td>
                        <button className="btn btn-outline btn-success" onClick={() => handleBookClick(doc.doctorid)}>
                          Book
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Appointment Booking Form */}
            {bookingDoctorId && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-medium mb-2">Book with Doctor ID: {bookingDoctorId}</h3>
                <div className="flex flex-wrap gap-3 items-center">
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="input input-bordered"
                  />
                  <input
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="input input-bordered"
                  />
                  <button className="btn btn-primary" onClick={handleConfirmBooking}>
                    Confirm
                  </button>
                  <button className="btn btn-outline btn-error" onClick={() => setBookingDoctorId(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Patient;
