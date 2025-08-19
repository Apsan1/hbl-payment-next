// src/lib/ActionRequest.ts
import axios, { AxiosInstance } from "axios";
import {
    CompactEncrypt,
    compactDecrypt,
    importPKCS8,
    importSPKI,
    SignJWT,
    jwtVerify,
    JWTPayload,
} from "jose";
import { v4 as uuidv4 } from "uuid";
import SecurityData from "./SecurityData"

export abstract class ActionRequest {
    private static PaymentEndpoint = "https://core.demo-paco.2c2p.com/";
    protected client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: ActionRequest.PaymentEndpoint,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    
    // For JWS (signing/verification)
    protected async getSigningPrivateKey(pemKey: string): Promise<CryptoKey> {
        const privateKeyPem = [
            "-----BEGIN PRIVATE KEY-----",
            pemKey.replace(/\\n/g, "\n").trim(),
            "-----END PRIVATE KEY-----",
        ].join("\n");
        return await importPKCS8(privateKeyPem, "PS256"); // RSA-PSS for signing
    }

    protected async getSigningPublicKey(pemKey: string): Promise<CryptoKey> {
        const publicKeyPem = [
            "-----BEGIN PUBLIC KEY-----",
            pemKey.replace(/\\n/g, "\n").trim(),
            "-----END PUBLIC KEY-----",
        ].join("\n");
        return await importSPKI(publicKeyPem, "PS256"); // RSA-PSS for verification
    }

    // For JWE (encryption/decryption)
    protected async getEncryptionPublicKey(pemKey: string): Promise<CryptoKey> {
        const publicKeyPem = [
            "-----BEGIN PUBLIC KEY-----",
            pemKey.replace(/\\n/g, "\n").trim(),
            "-----END PUBLIC KEY-----",
        ].join("\n");
        return await importSPKI(publicKeyPem, "RSA-OAEP"); // RSA-OAEP for encryption
    }

    protected async getDecryptionPrivateKey(pemKey: string): Promise<CryptoKey> {
        const privateKeyPem = [
            "-----BEGIN PRIVATE KEY-----",
            pemKey.replace(/\\n/g, "\n").trim(),
            "-----END PRIVATE KEY-----",
        ].join("\n");
        return await importPKCS8(privateKeyPem, "RSA-OAEP"); // RSA-OAEP for decryption
    }


    /**
     * Creates an encrypted JOSE Token from given payload
     * (JWS → JWE)
     */
    protected async encryptPayload(
        payload: Record<string, any>,
        signingKey: CryptoKey,
        encryptingKey: CryptoKey
    ): Promise<string> {
        // JWS (sign)
        const jws = await new SignJWT(payload)
            .setProtectedHeader({
                alg: SecurityData.JWSAlgorithm,
                typ: SecurityData.TokenType,
            })
            .sign(signingKey);

        // JWE (encrypt signed token)
        const encoder = new TextEncoder();
        const jwe = await new CompactEncrypt(encoder.encode(jws))
            .setProtectedHeader({
                alg: SecurityData.JWEAlgorithm,
                enc: SecurityData.JWEEncrptionAlgorithm,
                kid: SecurityData.EncryptionKeyId,
                typ: SecurityData.TokenType,
            })
            .encrypt(encryptingKey);

        return jwe;
    }

    /**
     * Decrypts a JOSE Token and returns verified payload
     */
    protected async decryptToken(
        token: string,
        decryptingKey: CryptoKey,
        signatureVerificationKey: CryptoKey
    ): Promise<JWTPayload> {
        // Decrypt JWE → get inner JWS
        const { plaintext } = await compactDecrypt(token, decryptingKey);
        const jws = new TextDecoder().decode(plaintext);

        // Verify JWS
        const { payload } = await jwtVerify(jws, signatureVerificationKey, {
            algorithms: [SecurityData.JWSAlgorithm],
            audience: SecurityData.AccessToken,
            issuer: "PacoIssuer",
        });

        // jose already checks exp, nbf, iat automatically if set in payload
        return payload;
    }

    /**
     * Generate a GUID
     */
    protected guid(): string {
        return uuidv4();
    }
}
