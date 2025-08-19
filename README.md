# HBL Payment Next.js Integration

This is a [Next.js](https://nextjs.org) project integrating **HBL Payment Gateway** using **JOSE encryption** for secure transactions.

## Project Structure

```tree
src/
├── app/
│   ├── api/payment/route.ts        # API route to handle HBL
│   ├── payment/[status]/page.tsx   # Payment result page (success, failed, cancelled)
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # App layout
│   └── page.tsx                    # Homepage / testing page
├── components/                     # UI components (optional)
└── lib/
├── SecurityData.ts             # Loads credentials from .env for HBL
├── ActionRequest.ts            # Handles JOSE encryption, decryption, signing
└── Payment.ts                  # Core payment logic & execution

```

## Flow Overview

1. **SecurityData.ts**

   - Imports HBL credentials from your `.env` file.
   - Keeps private keys, public keys, API keys, etc.

2. **ActionRequest.ts**

   - Provides functions to **encrypt/decrypt JWE** payloads.
   - Handles **JWS signing and verification**.

3. **Payment.ts**

   - Uses `ActionRequest` to **create encrypted payment payloads**.
   - Sends requests to HBL payment endpoints.
   - Handles payment responses.

4. **app/api/payment/route.ts**

   - Next.js API route.
   - Receives frontend requests and calls `Payment.ts` to execute the payment.

5. **app/payment/[status]/page.tsx**
   - Renders **payment result pages** based on status (`success`, `failed`, `cancel`).
   - Displays order info and user-friendly messages.

## Setup

1. Create a `.env` file:

```env
MERCHANT_ID=your_hbl_merchant_id
MERCHANT_SIGNING_PRIVATE_KEY="your_private_key_here"
MERCHANT_DECRYPTION_PRIVATE_KEY="your_decryption_key_here"
PACO_SIGNING_PUBLIC_KEY="paco_signing_public_key_here"
PACO_ENCRYPTION_PUBLIC_KEY="paco_encryption_public_key_here"
API_KEY="your_hbl_api_key"
```

2. Install dependencies:

```bash
pnpm install
# or npm install
```

3. Run dev server:

```bash
pnpm dev
# or npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser and voila!!.

## Learn More

- [HBL Payment Gateway Documentation](https://www.hbl.com.np/)
- [2C2P-v2 Documentation (Only for HBL)*](https://devzone.2c2p.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app/building-your-application/routing)

_Note: Since, Himalayan Bank Limited can't update their gateway to implement [2c2p-v4](https://developer.2c2p.com/docs/general), I had to do it the hardway._