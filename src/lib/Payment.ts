// src/lib/Payment.ts
import { ActionRequest } from "./ActionRequest";
import SecurityData from "./SecurityData";
import { v4 as uuidv4 } from "uuid";
import { DateTime } from "luxon";
import {
    JWTPayload,
} from "jose";

export class Payment extends ActionRequest {
    /**
     * JOSE request with dynamic merchant details
     */
    async executeFormJose(
        mid: string,
        apiKey: string,
        curr: string,
        amt: number,
        threeD: "Y" | "N",
        successUrl: string,
        failedUrl: string,
        cancelUrl: string,
        backendUrl: string
    ): Promise<JWTPayload> {
        const now = DateTime.utc();
        const orderNo = Date.now().toString();

        const request = {
            apiRequest: {
                requestMessageID: this.guid(),
                requestDateTime: now.toISO(),
                language: "en-US",
            },
            officeId: mid,
            orderNo,
            productDescription: `desc for '${orderNo}'`,
            paymentType: "CC",
            paymentCategory: "ECOM",
            storeCardDetails: { storeCardFlag: "N", storedCardUniqueID: uuidv4() },
            installmentPaymentDetails: { ippFlag: "N", installmentPeriod: 0, interestType: null },
            mcpFlag: "N",
            request3dsFlag: threeD,
            transactionAmount: {
                amountText: (amt * 100).toString().padStart(12, "0"),
                currencyCode: curr,
                decimalPlaces: 2,
                amount: amt,
            },
            notificationURLs: {
                confirmationURL: successUrl,
                failedURL: failedUrl,
                cancellationURL: cancelUrl,
                backendURL: backendUrl,
            },
            deviceDetails: {
                browserIp: "1.0.0.1",
                browser: "Postman Browser",
                browserUserAgent: "PostmanRuntime/7.26.8 - not from header",
                mobileDeviceFlag: "N",
            },
            purchaseItems: [
                {
                    purchaseItemType: "ticket",
                    referenceNo: "260376026",
                    purchaseItemDescription: "HHAHAHHAH insurance",
                    purchaseItemPrice: {
                        amountText: "000000000100",
                        currencyCode: "NPR",
                        decimalPlaces: 2,
                        amount: 1,
                    },
                    subMerchantID: "string",
                    passengerSeqNo: 1,
                },
            ],
            customFieldList: [{ fieldName: "TestField", fieldValue: "This is test" }],
        };

        const payload = {
            request,
            iss: apiKey,
            aud: "PacoAudience",
            CompanyApiKey: apiKey,
            iat: Math.floor(Date.now() / 1000),
            nbf: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
        };

        // For signing the payload (JWS)
        const signingKey = await this.getSigningPrivateKey(SecurityData.MerchantSigningPrivateKey);

        // For encrypting the signed payload (JWE)
        const encryptingKey = await this.getEncryptionPublicKey(SecurityData.PacoEncryptionPublicKey);

        // Then encrypt
        const body = await this.encryptPayload(payload, signingKey, encryptingKey);

        const { data } = await this.client.post("api/1.0/Payment/prePaymentUi", body, {
            headers: {
                Accept: "application/jose",
                CompanyApiKey: apiKey,
                "Content-Type": "application/jose; charset=utf-8",
            },
        });

        // For decrypting JWE
        const decryptingKey = await this.getDecryptionPrivateKey(SecurityData.MerchantDecryptionPrivateKey);

        // For verifying JWS
        const signatureVerificationKey = await this.getSigningPublicKey(SecurityData.PacoSigningPublicKey);

        return this.decryptToken(data, decryptingKey, signatureVerificationKey);

    }
}
