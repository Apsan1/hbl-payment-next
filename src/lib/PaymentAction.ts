import { ActionRequest } from "./ActionRequest";
import SecurityData from "./SecurityData";
import { DateTime } from "luxon";
import { JWTPayload } from "jose";

export class Inquiry extends ActionRequest {
    async executeJose(
        officeId: string = "DEMOOFFICE",
        orderNo: string = "1635476979216"
    ): Promise<JWTPayload> {
        const now = DateTime.utc();
        const request = {
            apiRequest: {
                requestMessageID: this.guid(),
                requestDateTime: now.toISO(),
                language: "en-US",
            },
            advSearchParams: {
                controllerInternalID: null,
                officeId: [officeId],
                orderNo: [orderNo],
                invoiceNo2C2P: null,
                fromDate: "0001-01-01T00:00:00",
                toDate: "0001-01-01T00:00:00",
                amountFrom: null,
                amountTo: null,
            },
        };

        const payload = {
            request,
            iss: SecurityData.AccessToken,
            aud: "PacoAudience",
            CompanyApiKey: SecurityData.AccessToken,
            iat: Math.floor(Date.now() / 1000),
            nbf: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
        };

        const signingKey = await this.getSigningPrivateKey(SecurityData.MerchantSigningPrivateKey);
        const encryptingKey = await this.getEncryptionPublicKey(SecurityData.PacoEncryptionPublicKey);
        const body = await this.encryptPayload(payload, signingKey, encryptingKey);

        const { data } = await this.client.post("api/1.0/Inquiry/transactionList", body, {
            headers: {
                Accept: "application/jose",
                CompanyApiKey: SecurityData.AccessToken,
                "Content-Type": "application/jose; charset=utf-8",
            },
        });

        const decryptingKey = await this.getDecryptionPrivateKey(SecurityData.MerchantDecryptionPrivateKey);
        const signatureVerificationKey = await this.getSigningPublicKey(SecurityData.PacoSigningPublicKey);

        return this.decryptToken(data, decryptingKey, signatureVerificationKey);
    }
}

export class Refund extends ActionRequest {
    async executeJose(
        officeId: string = "DEMOOFFICE",
        orderNo: string = "1643362945100",
        amount: number = 1000,
        currency: string = "THB",
        actionBy: string = "System|c88ef0dc-14ea-4556-922b-7f62a6a3ec9e",
        actionEmail: string = "babulal.cho@2c2pexternal.com"
    ): Promise<JWTPayload> {
        const now = DateTime.utc();
        const request = {
            refundAmount: {
                amountText: amount.toFixed(0).padStart(12, "0"),
                currencyCode: currency,
                decimalPlaces: 2,
                amount,
            },
            refundItems: [],
            localMakerChecker: {
                maker: { username: actionBy, email: actionEmail },
            },
            officeId,
            orderNo,
        };

        const payload = {
            request,
            iss: SecurityData.AccessToken,
            aud: "PacoAudience",
            CompanyApiKey: SecurityData.AccessToken,
            iat: Math.floor(Date.now() / 1000),
            nbf: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
        };

        const signingKey = await this.getSigningPrivateKey(SecurityData.MerchantSigningPrivateKey);
        const encryptingKey = await this.getEncryptionPublicKey(SecurityData.PacoEncryptionPublicKey);
        const body = await this.encryptPayload(payload, signingKey, encryptingKey);

        const { data } = await this.client.post("api/1.0/Refund/refund", body, {
            headers: {
                Accept: "application/jose",
                CompanyApiKey: SecurityData.AccessToken,
                "Content-Type": "application/jose; charset=utf-8",
            },
        });

        const decryptingKey = await this.getDecryptionPrivateKey(SecurityData.MerchantDecryptionPrivateKey);
        const signatureVerificationKey = await this.getSigningPublicKey(SecurityData.PacoSigningPublicKey);

        return this.decryptToken(data, decryptingKey, signatureVerificationKey);
    }
}

export class Settlement extends ActionRequest {
    async executeJose(
        officeId: string = "DEMOOFFICE",
        orderNo: string = "1643362945100",
        productDescription: string = "Sample request",
        amount: number = 1000,
        currency: string = "THB",
        approvalCode: string = "141857"
    ): Promise<JWTPayload> {
        const now = DateTime.utc();
        const request = {
            officeId,
            orderNo,
            productDescription,
            issuerApprovalCode: approvalCode,
            actionBy: "System",
            settlementAmount: {
                amountText: amount.toFixed(0).padStart(12, "0"),
                currencyCode: currency,
                decimalPlaces: 2,
                amount,
            },
        };

        const payload = {
            request,
            iss: SecurityData.AccessToken,
            aud: "PacoAudience",
            CompanyApiKey: SecurityData.AccessToken,
            iat: Math.floor(Date.now() / 1000),
            nbf: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
        };

        const signingKey = await this.getSigningPrivateKey(SecurityData.MerchantSigningPrivateKey);
        const encryptingKey = await this.getEncryptionPublicKey(SecurityData.PacoEncryptionPublicKey);
        const body = await this.encryptPayload(payload, signingKey, encryptingKey);

        const { data } = await this.client.put("api/1.0/Settlement", body, {
            headers: {
                Accept: "application/jose",
                CompanyApiKey: SecurityData.AccessToken,
                "Content-Type": "application/jose; charset=utf-8",
            },
        });

        const decryptingKey = await this.getDecryptionPrivateKey(SecurityData.MerchantDecryptionPrivateKey);
        const signatureVerificationKey = await this.getSigningPublicKey(SecurityData.PacoSigningPublicKey);

        return this.decryptToken(data, decryptingKey, signatureVerificationKey);
    }
}

export class VoidRequest extends ActionRequest {
    async executeJose(
        officeId: string = "DEMOOFFICE",
        orderNo: string = "1643362945102",
        productDescription: string = "Sample request",
        amount: number = 1000,
        currency: string = "THB",
        approvalCode: string = "140331"
    ): Promise<JWTPayload> {
        const now = DateTime.utc();
        const request = {
            officeId,
            orderNo,
            productDescription,
            issuerApprovalCode: approvalCode,
            actionBy: "System",
            voidAmount: {
                amountText: amount.toFixed(0).padStart(12, "0"),
                currencyCode: currency,
                decimalPlaces: 2,
                amount,
            },
        };

        const payload = {
            request,
            iss: SecurityData.AccessToken,
            aud: "PacoAudience",
            CompanyApiKey: SecurityData.AccessToken,
            iat: Math.floor(Date.now() / 1000),
            nbf: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
        };

        const signingKey = await this.getSigningPrivateKey(SecurityData.MerchantSigningPrivateKey);
        const encryptingKey = await this.getEncryptionPublicKey(SecurityData.PacoEncryptionPublicKey);
        const body = await this.encryptPayload(payload, signingKey, encryptingKey);

        const { data } = await this.client.post("api/1.0/Void", body, {
            headers: {
                Accept: "application/jose",
                CompanyApiKey: SecurityData.AccessToken,
                "Content-Type": "application/jose; charset=utf-8",
            },
        });

        const decryptingKey = await this.getDecryptionPrivateKey(SecurityData.MerchantDecryptionPrivateKey);
        const signatureVerificationKey = await this.getSigningPublicKey(SecurityData.PacoSigningPublicKey);

        return this.decryptToken(data, decryptingKey, signatureVerificationKey);
    }
}
