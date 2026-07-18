# Tests

## Unit and Build Checks

Run the checks used by GitHub Actions:

```bash
npm run lint
npm run type-check
npm test -- --runInBand
npm run build
```

`src/auth/auth.service.spec.ts` covers SMS OTP request delegation, successful
phone-user session creation, and rejected-code behavior with Twilio mocked.
Unit tests do not send an SMS.

## MongoDB End-to-End Tests

The container test suite starts MongoDB and the API using safe placeholder
Twilio configuration:

```bash
npm run test:e2e:document:docker
```

Phone OTP integration against a real Twilio Verify Service should be run with
a test number or Twilio-approved test strategy in the environment where real
credentials are provided.

---

Previous: [File uploading](file-uploading.md)

Next: [Benchmarking](benchmarking.md)
