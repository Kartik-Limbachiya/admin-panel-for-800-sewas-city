// ADMIN SIDE
// File: admin-panel-for-800-sewas-city/app/applications/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

function safeDate(value?: string) {
  if (!value) return "Not provided";
  const d = new Date(value);
  return isNaN(d.getTime()) ? value : d.toLocaleDateString();
}

function safeIncome(value?: string | number) {
  if (!value) return "Not provided";
  if (typeof value === "number") return `₹${value.toLocaleString()}`;
  return value.startsWith("₹") ? value : `₹${value}`;
}

function safeText(value?: string) {
  return value && value.trim() !== "" ? value : "Not provided";
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplication() {
      try {
        const res = await fetch(`/api/applications/${id}`);
        const data = await res.json();
        if (data.success) {
          setApplication(data.application);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchApplication();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!application) return <p>Application not found</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Application Details</h1>

      <div className="space-y-2">
        <p><strong>Name:</strong> {safeText(application.fullName)}</p>
        <p><strong>Father:</strong> {safeText(application.fatherName)}</p>
        <p><strong>Email:</strong> {safeText(application.emailAddress)}</p>
        <p><strong>Phone:</strong> {safeText(application.mobileNumber)}</p>
        <p><strong>Date of Birth:</strong> {safeDate(application.dateOfBirth)}</p>
        <p><strong>Gender:</strong> {safeText(application.gender)}</p>
        <p><strong>Occupation:</strong> {safeText(application.occupation)}</p>
        <p><strong>Monthly Income:</strong> {safeIncome(application.monthlyIncome)}</p>
        <p><strong>Permanent Address:</strong> {safeText(application.permanentAddress)}</p>
        <p><strong>Current Address:</strong> {safeText(application.currentAddress)}</p>
        <p><strong>City:</strong> {safeText(application.preferredCity)}</p>
        <p><strong>Housing:</strong> {safeText(application.housingPreference)}</p>
        <p><strong>Application Date:</strong> {safeDate(application.createdAt)}</p>
      </div>

      <h2 className="text-xl font-semibold mt-6">Agreements</h2>
      <ul className="space-y-1">
        <li>Legal Acknowledgment: {application.legalAcknowledgment ? "✅" : "❌"}</li>
        <li>Terms Agreement: {application.termsAgreement ? "✅" : "❌"}</li>
        <li>Marketing Consent: {application.marketingConsent ? "✅" : "❌"}</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">Documents</h2>
      <ul className="space-y-2">
        {application.documents && Object.keys(application.documents).length > 0 ? (
          Object.entries(application.documents).map(([docName, url]) => (
            <li key={docName}>
              {url ? (
                <a
                  href={url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {docName.toUpperCase()}
                </a>
              ) : (
                <span className="text-red-500">{docName.toUpperCase()} - Not uploaded</span>
              )}
            </li>
          ))
        ) : (
          <p>No documents uploaded</p>
        )}
      </ul>
    </div>
  );
}
