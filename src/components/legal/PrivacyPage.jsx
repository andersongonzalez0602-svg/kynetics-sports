import React from 'react'
import LegalPage from './LegalPage'

const PrivacyPage = () => (
  <LegalPage title="Privacy Policy" lastUpdated="February 2026">
    <div className="callout">
      <p><strong>Your privacy matters.</strong> This policy explains what we collect, how we use it, and your rights. We keep it simple and honest.</p>
    </div>

    <h2>1. Information We Collect</h2>
    <h3>Information You Provide</h3>
    <p>When you create an account via Google Sign-In, we receive your Google email address, display name, and profile photo (if available). You also choose a public username that is visible to other users. We do not collect your Google password or access any other Google account data beyond basic profile information.</p>
    <h3>Information Generated Through Use</h3>
    <p>When you interact with the Service, we collect your game predictions and community votes, your public username, and account creation date. This data is tied to your user account and used to provide the Service.</p>
    <h3>Information Collected Automatically</h3>
    <p>When you use the Service, we automatically collect basic device information (browser type, operating system), usage information (pages visited, interactions), and general location (country level, based on IP address). We do not collect precise location.</p>

    <h2>2. How We Use Your Information</h2>
    <p>We use your information to provide and maintain the Service (your account, your votes, your predictions), display your public username alongside community activity, improve the platform (understand usage patterns, fix bugs), communicate with you (service updates, support), and ensure security (prevent fraud, protect accounts).</p>
    <div className="callout-green">
      <p><strong>We do not use your email for marketing.</strong> Your Google email is used solely for authentication. We will not send promotional emails, newsletters, or marketing communications unless you explicitly opt in to such communications in the future.</p>
    </div>

    <h2>3. What Is Public vs. Private</h2>
    <p>Your <strong>username</strong> and <strong>community votes</strong> are publicly visible to other users. Your <strong>email address</strong>, <strong>Google account details</strong>, and <strong>account ID</strong> are private and never exposed to other users or third parties.</p>

    <h2>4. Third-Party Services</h2>
    <p>We currently use the following third-party services:</p>
    <ul>
      <li><strong>Supabase</strong> — authentication and database hosting</li>
      <li><strong>Google OAuth</strong> — sign-in authentication (Google receives confirmation that you signed into our service; we receive only basic profile data)</li>
      <li><strong>Vercel</strong> — website hosting</li>
    </ul>
    <p>If we add analytics, advertising, or other third-party services in the future, we will update this policy accordingly.</p>

    <h2>5. How We Share Your Information</h2>
    <div className="callout-green">
      <p><strong>We do not sell your personal information.</strong> We do not rent, trade, or share your data with third parties for their marketing purposes.</p>
    </div>
    <p>We may share information with service providers who help us operate the platform (under contract to protect your data), and with legal authorities if required by law, court order, or to protect our rights and safety.</p>

    <h2>6. Data Retention</h2>
    <p>We retain your account data as long as your account is active. If you delete your account, we remove your personal data within 30 days. Your public predictions and votes may be retained in anonymized form for aggregate statistics. Backups may persist for up to 90 days before being purged.</p>

    <h2>7. Security</h2>
    <p>We use encryption in transit (TLS/SSL), secure authentication through Google OAuth and Supabase, Row Level Security policies on all user data tables, and access controls to protect your data. User emails are stored server-side only and are never exposed through our frontend application. However, no system is 100% secure. If we experience a data breach that affects you, we will notify you promptly.</p>

    <h2>8. Your Rights</h2>
    <p>Regardless of where you live, you can:</p>
    <ul>
      <li><strong>Access</strong> — request a copy of your data</li>
      <li><strong>Correct</strong> — update inaccurate information</li>
      <li><strong>Delete</strong> — request deletion of your account and data</li>
      <li><strong>Object</strong> — opt out of any future marketing communications</li>
    </ul>
    <p>If you are in the EU/EEA (GDPR) or a US state with privacy laws (CCPA, VCDPA, etc.), you may have additional rights including data portability and the right to restrict processing.</p>
    <p>To exercise any right, email us at <a href="mailto:kyneticssports@gmail.com">kyneticssports@gmail.com</a> with the subject "Privacy Request." We will respond within 30 days.</p>

    <h2>9. Children's Privacy</h2>
    <p>The Service is not intended for users under 18. We do not knowingly collect personal information from children. If we learn we have collected data from a minor, we will delete it promptly.</p>

    <h2>10. International Data</h2>
    <p>Your data may be processed in countries other than your own. We ensure adequate protection through standard security practices and contractual safeguards.</p>

    <h2>11. Changes</h2>
    <p>We may update this policy from time to time. Changes take effect when posted with a new "Last Updated" date. Material changes will be communicated via prominent notice on the site.</p>

    <h2>12. Contact</h2>
    <p>Privacy questions: <a href="mailto:kyneticssports@gmail.com">kyneticssports@gmail.com</a></p>
  </LegalPage>
)

export default PrivacyPage
