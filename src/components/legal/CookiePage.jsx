import React from 'react'
import LegalPage from './LegalPage'

const CookiePage = () => (
  <LegalPage title="Cookie Policy" lastUpdated="February 2026">
    <div className="callout">
      <p><strong>We keep it simple.</strong> We use minimal cookies — only what's needed to make the site work.</p>
    </div>

    <h2>1. What Are Cookies?</h2>
    <p>Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and keep you logged in.</p>

    <h2>2. Cookies We Use</h2>
    <h3>Essential Cookies (Required)</h3>
    <p>These are necessary for the site to function. You cannot disable them.</p>
    <ul>
      <li><strong>Authentication session</strong> — keeps you logged in (Provider: Supabase, Duration: session)</li>
      <li><strong>Security token</strong> — protects against cross-site attacks (Duration: session)</li>
    </ul>
    <p>That's currently all we use. We do not run Google Analytics, Facebook Pixel, or any advertising trackers at this time.</p>

    <h3>Future Cookies</h3>
    <p>If we add analytics or advertising services in the future, we will update this policy and provide a cookie consent banner so you can choose which non-essential cookies to accept.</p>

    <h2>3. Managing Cookies</h2>
    <p>You can control cookies through your browser settings:</p>
    <ul>
      <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
      <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies</li>
      <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
      <li><strong>Edge:</strong> Settings → Privacy → Cookies</li>
    </ul>
    <p>Blocking essential cookies may prevent you from logging in or using certain features.</p>

    <h2>4. Changes</h2>
    <p>We will update this policy if our cookie usage changes. Check the "Last Updated" date at the top.</p>

    <h2>5. Contact</h2>
    <p>Questions about cookies: <a href="mailto:kyneticssports@gmail.com">kyneticssports@gmail.com</a></p>
  </LegalPage>
)

export default CookiePage
