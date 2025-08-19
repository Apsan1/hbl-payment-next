export default class SecurityData {
    /**
     * JWE Key Id.
     */
    public static EncryptionKeyId = process.env.ENCRYPTION_KEY_ID!;

    /**
     * Access Token.
     *
     */
    public static AccessToken = process.env.ACCESS_TOKEN!;

    /**
     * Token Type - Used in JWS and JWE header.
     *
     */
    public static TokenType = process.env.TOKEN_TYPE!;

    /**
     * JWS (JSON Web Signature) Signature Algorithm - This parameter identifies the cryptographic algorithm used to
     * secure the JWS.
     *
     */
    public static JWSAlgorithm = process.env.JWS_ALGORITHM!;

    /**
     * JWE (JSON Web Encryption) Key Encryption Algorithm - This parameter identifies the cryptographic algorithm
     * used to secure the JWE.
     *
     */
    public static JWEAlgorithm = process.env.JWE_ALGORITHM!;

    /**
     * JWE (JSON Web Encryption) Content Encryption Algorithm - This parameter identifies the content encryption
     * algorithm used on the plaintext to produce the encrypted ciphertext.
     *
     */
    public static JWEEncrptionAlgorithm = process.env.JWE_ENCRYPTION_ALGORITHM!;

    /**
     * Merchant Signing Private Key is used to cryptographically sign and create the request JWS.
     *
     */
    public static MerchantSigningPrivateKey = process.env.MERCHANT_SIGNING_PRIVATE_KEY!;

    /**
     * PACO Encryption Public Key is used to cryptographically encrypt and create the request JWE.
     *
     */
    public static PacoEncryptionPublicKey = process.env.PACO_ENCRYPTION_PUBLIC_KEY!;

    /**
     * PACO Signing Public Key is used to cryptographically verify the response JWS signature.
     *
     */
    public static PacoSigningPublicKey = process.env.PACO_SIGNING_PUBLIC_KEY!;

    /**
     * Merchant Decryption Private Key used to cryptographically decrypt the response JWE.
     */
    public static MerchantDecryptionPrivateKey = process.env.MERCHANT_DECRYPTION_PRIVATE_KEY!;
}
