import { NextRequest, NextResponse } from "next/server";
import { Payment } from "@/lib/Payment";

interface PaymentPageData {
    response: {
        Data: {
            paymentPage: {
                paymentPageURL: string;
            };
        }
    };
}

export async function POST(req: NextRequest) {
    try {
        const payment = new Payment();
        const body = await req.json();

        const {
            merchant_id,
            api_key,
            input_currency,
            input_amount,
            input_3d,
            success_url,
            fail_url,
            cancel_url,
            backend_url,
        } = body;

        // Call your JOSE wrapper
        const resPayload = await payment.executeFormJose(
            merchant_id,
            api_key,
            input_currency,
            input_amount,
            input_3d,
            success_url,
            fail_url,
            cancel_url,
            backend_url
        ) as unknown as PaymentPageData;

        const paymentUrl = resPayload?.response.Data.paymentPage.paymentPageURL;

        if (!paymentUrl) {
            return NextResponse.json(
                { error: "Payment URL not found in response" },
                { status: 400 }
            );
        }

        return NextResponse.json({ paymentUrl });
    } catch (err) {
        console.error("Payment Error:", err);
        return NextResponse.json(
            { error: err },
            { status: 500 }
        );
    }
}
