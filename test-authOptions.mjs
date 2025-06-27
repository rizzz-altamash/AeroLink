// test-authOptions.js

import dotenv from 'dotenv';
// import { authOptions } from './lib/authOptions.cjs'; // Use .js extension if "type": "module" is set
import pkg from './lib/authOptions.cjs'; // Correct import for CommonJS module
const { authOptions } = pkg;

// ✅ Load env variables from local file
dotenv.config({ path: '.env.local' });

// 👇 Debug prints
console.log('🔍 Loaded authOptions:');
console.log({
  providersCount: authOptions.providers?.length,
  pages: authOptions.pages,
  hasCallbacks: !!authOptions.callbacks,
  session: authOptions.session,
  secret: authOptions.secret ? '✅ Present' : '❌ Missing',
});

// ✅ Test first provider
const credsProvider = authOptions.providers?.find(p => p.name === 'credentials');
if (credsProvider) {
  console.log('✅ Credentials Provider found.');
} else {
  console.error('❌ Credentials Provider not found.');
}

// ✅ Test Google provider keys
const googleProvider = authOptions.providers?.find(p => p.name === 'google');
if (googleProvider) {
  console.log('✅ Google Provider found.');
} else {
  console.error('❌ Google Provider not found.');
}

// ✅ Try calling authorize function safely
(async () => {
  const credentialsProvider = authOptions.providers?.find(p => p.name === 'credentials');

  if (!credentialsProvider) {
    console.error('❌ No credentials provider available.');
    return;
  }

  try {
    const dummyCredentials = {
      email: 'test@example.com',
      password: 'invalid'
    };

    const result = await credentialsProvider.authorize?.(dummyCredentials);
    console.log('🔐 Authorize function executed successfully:', result);
  } catch (err) {
    console.error('🔥 Error from authorize():', err.message);
  }
})();