const { execSync } = require('child_process');

try {
  const out = execSync('npx vercel curl /v9/projects/prj_tgquPkOhkPNj0KYWo4dXqO0xNxHd -X PATCH -H "Content-Type: application/json" -d @patch_sso.json', { encoding: 'utf8' });
  console.log('OUTPUT:', out);
} catch (e) {
  console.error('ERROR:', e.stdout || e.message);
}
