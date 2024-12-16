import React from "react";
import "./cancellation.css";
function Cancellation() {
  return (
    <div className="refund-policy-container">
      <h1 className="refund-policy-title">Cancellation And Refund Policy</h1>
      <div className="refund-section">
        <h2 className="section-title">Cancellation Policy</h2>

        <p className="section-description">
          Cancellations are permitted only if the request is submitted within 48
          hours of service activation. Any requests made after this timeframe
          may not qualify for cancellation.
        </p>
        <p className="section-description">
          <strong>Reporting Issues :</strong>
        </p>
        <p className="section-description">
          If you believe that the service does not meet your expectations or
          that there is a discrepancy in the service details provided, you must
          bring this to the attention of our Support Team within 48 hours of
          service activation. Please provide all relevant details and supporting
          documentation (if applicable) to expedite the review process. Our team
          will carefully investigate your concerns and determine the appropriate
          resolution, which may include modifications, refunds, or other
          corrective actions as per our policies.
        </p>
        <p className="section-description">
          <strong>Acceptance of Terms :</strong>
        </p>
        <p className="section-description">
          By using our services, you acknowledge and accept the terms outlined
          in this agreement. Additionally, you agree to adhere to any future
          updates or modifications to these terms. Continued use of the services
          after such revisions constitutes your acceptance of the updated
          policies.
        </p>
        <p className="section-description">
          <strong>Termination of Services :</strong>
        </p>
        <p className="section-description">
          If you are dissatisfied with the services provided, you have the right
          to discontinue them at any time. To do so, you must notify us in
          writing with a formal termination request. Please note:
        </p>
        <ul className="section-list">
          <li>
            Any dues or outstanding payments linked to your account will remain
            your responsibility and must be settled in full.
          </li>
          <li>
            Service termination does not absolve you of financial obligations
            for any period during which the service was active and functional.
          </li>
        </ul>
        <p className="section-description">
          We also retain the authority to terminate services without prior
          notice in the following circumstances:
        </p>
        <ul>
          <li>
            <strong>Non-Payment:</strong> Failure to settle invoices within the
            specified due dates.
          </li>
          <li>
            <strong>Policy Violation:</strong> Breach of any clause within our
            Terms and Conditions.
          </li>
          <li>
            <strong>Fraudulent Activities:</strong> Provision of false
            information or involvement in fraudulent activities.
          </li>
          <li>
            <strong>Unauthorized Use:</strong> Utilization of services for
            purposes deemed illegal, unethical, or contrary to public morality.
          </li>
        </ul>
        <p className="section-description">
          <strong>Post-Cancellation Obligations :</strong>
        </p>
        <p className="section-description">
          Upon cancellation or termination of services:
        </p>
        <ul className="section-list">
          <li>
            Access to your account, data, and services will be immediately
            revoked.
          </li>
          <li>
            You are encouraged to back up all essential data before initiating a
            cancellation request, as retrieval post-cancellation may not be
            possible.
          </li>
          <li>
            Refunds, if applicable, will be governed by our Refund Policy.
          </li>
        </ul>
        <p className="section-description">
          <strong>Right to Refuse Service :</strong>
        </p>
        <p className="section-description">
          We reserve the right to decline any request for service activation,
          continuation, or renewal at our sole discretion if the account holder
          is found in violation of any policies or poses a risk to the integrity
          of our platform and services.
        </p>
        <p className="section-description">
          For further clarification on cancellations, please contact our Support
          Team. We are committed to assisting you throughout the process and
          ensuring a fair resolution.
        </p>

        <h2 className="section-title">Refund Policy</h2>
        <p className="section-description">
          We strive to deliver the best possible experience with our services.
          However, if you are not satisfied, refunds may be provided under the
          following conditions:
        </p>
        <ul className="section-list">
          <li>
            Refund requests must be made within 30 days from the date of
            installation or termination of services
          </li>
          <li>
            Refunds will only be issued for the unused portion of the service,
            calculated on a pro-rata basis.
          </li>
          <li>
            Any applicable taxes or fees will be deducted from the refundable
            amount.
          </li>
        </ul>
        <p className="section-description">
          Refunds will be processed at our sole discretion and may be issued
          either as a credit note or to the original payment method. No refunds
          will be provided for the amount corresponding to the services already
          utilized.
        </p>
        <p className="section-description">
          Please note that refunds may take 7-10 business days to process,
          depending on the payment method and bank policies.
        </p>
      </div>
    </div>
  );
}

export default Cancellation;
