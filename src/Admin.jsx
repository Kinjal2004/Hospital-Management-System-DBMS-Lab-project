import React, { useEffect, useState } from 'react';
import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://hms_owner:npg_37PzNXjhxZve@ep-damp-term-a115kp8h-pooler.ap-southeast-1.aws.neon.tech/hms?sslmode=require');

const fetchReports = async (patient_number) => {
  try {
    const result = await sql`
      SELECT r.recordid, r.patientid, p.patientname, r.diagnosis, r.prescription, r.recorddate 
      FROM medical_records r
      JOIN patients p ON r.patientid = p.patientid
      WHERE r.patientid = ${patient_number}
    `;
    return result;
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
};

const fetchPendingPayments = async (patient_number) => {
  try {
    const result = await sql`
      SELECT pay.billid, pay.patientid, p.patientname, pay.totalamount, pay.paymentstatus
      FROM billing pay
      JOIN patients p ON pay.patientid = p.patientid
      WHERE pay.paymentstatus = false AND pay.patientid = ${patient_number}
    `;
    return result;
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
};

const Admin = () => {
  const [reports, setReports] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const patient_number = localStorage.getItem('patient_number');

  useEffect(() => {
    const getData = async () => {
      if (patient_number) {
        const reportsData = await fetchReports(patient_number);
        const paymentsData = await fetchPendingPayments(patient_number);
        setReports(reportsData);
        setPendingPayments(paymentsData);
      }
    };
    getData();
  }, [patient_number]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Patient Dashboard</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Medical Reports</h2>
          {reports.length > 0 ? (
            <div className="overflow-x-auto rounded-lg shadow bg-white">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Record ID</th>
                    <th className="px-4 py-3 text-left">Patient ID</th>
                    <th className="px-4 py-3 text-left">Patient Name</th>
                    <th className="px-4 py-3 text-left">Diagnosis</th>
                    <th className="px-4 py-3 text-left">Prescription</th>
                    <th className="px-4 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.recordid} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{report.recordid}</td>
                      <td className="px-4 py-3">{report.patientid}</td>
                      <td className="px-4 py-3">{report.patientname}</td>
                      <td className="px-4 py-3">{report.diagnosis}</td>
                      <td className="px-4 py-3">{report.prescription}</td>
                      <td className="px-4 py-3">{new Date(report.recorddate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">No reports found.</p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pending Payments</h2>
          {pendingPayments.length > 0 ? (
            <div className="overflow-x-auto rounded-lg shadow bg-white">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-red-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Bill ID</th>
                    <th className="px-4 py-3 text-left">Patient ID</th>
                    <th className="px-4 py-3 text-left">Patient Name</th>
                    <th className="px-4 py-3 text-left">Total Amount</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPayments.map((payment) => (
                    <tr key={payment.billid} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{payment.billid}</td>
                      <td className="px-4 py-3">{payment.patientid}</td>
                      <td className="px-4 py-3">{payment.patientname}</td>
                      <td className="px-4 py-3">₹{payment.totalamount}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-3 py-1 text-sm font-medium bg-yellow-200 text-yellow-800 rounded-full">
                          Pending
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">No pending payments.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Admin;
