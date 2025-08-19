"use client";

import { useSearchParams } from "next/navigation";

interface Props {
  params: { status: string };
}

export default function PaymentStatusPage({ params }: Props) {
  const { status } = params;
  const searchParams = useSearchParams();

  const orderNo = searchParams.get("orderNo");
  const productDescription = searchParams.get("productDescription");
  const controllerInternalId = searchParams.get("controllerInternalId");

  let message = "";
  let color = "";

  switch (status) {
    case "success":
      message = "Payment Successful!";
      color = "text-green-600";
      break;
    case "failed":
      message = "Payment Failed!";
      color = "text-red-600";
      break;
    case "cancel":
      message = "Payment Cancelled!";
      color = "text-yellow-600";
      break;
    default:
      message = "Unknown Payment Status";
      color = "text-gray-600";
      break;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className={`text-2xl font-bold ${color} mb-4`}>{message}</h1>

        {status === "success" && (
          <p className="text-gray-700">
            Thank you! Your transaction has been completed successfully.
          </p>
        )}
        {status === "failed" && (
          <p className="text-gray-700">
            Payment could not be processed. Please try again or contact support.
          </p>
        )}
        {status === "cancel" && (
          <p className="text-gray-700">
            Payment was cancelled. You can try again anytime.
          </p>
        )}

        {/* Show order details if available */}
        {(orderNo || productDescription || controllerInternalId) && (
          <div className="mt-4 text-left text-gray-600">
            {orderNo && (
              <p>
                <strong>Order No:</strong> {orderNo}
              </p>
            )}
            {productDescription && (
              <p>
                <strong>Product:</strong>{" "}
                {decodeURIComponent(productDescription)}
              </p>
            )}
            {controllerInternalId && (
              <p>
                <strong>Controller ID:</strong> {controllerInternalId}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
