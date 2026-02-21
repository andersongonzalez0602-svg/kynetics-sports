import React from 'react'
import LegalPage from './LegalPage'

const DisclaimerPage = () => (
  <LegalPage title="Disclaimer" lastUpdated="February 2026">
    <div className="callout-red">
      <p><strong>IMPORTANT: Please read carefully before using this Service.</strong></p>
    </div>

    <h2>1. For Entertainment Purposes Only</h2>
    <p>Kynetics Sports provides sports analysis, predictions, and statistics powered by artificial intelligence <strong>for entertainment and informational purposes only</strong>.</p>
    <p>We are not a sports betting platform, a gambling service, a prediction market or trading exchange, financial or investment advisors, or a guarantee of any outcome.</p>

    <h2>2. No Guarantee of Accuracy</h2>
    <p>While we employ advanced AI and statistical analysis, <strong>we do not guarantee</strong> accuracy of any prediction, success in any sports betting or gambling activity, specific outcomes or results, or profitability if you choose to bet.</p>
    <p>Sports are unpredictable. No prediction system — AI or human — can guarantee results. Our accuracy varies by sport, season, and other factors. We publish our track record transparently, but past performance does not guarantee future accuracy.</p>

    <h2>3. Not a Recommendation to Gamble</h2>
    <p>Kynetics Sports <strong>does not</strong> recommend, encourage, or facilitate sports betting or gambling in any form. If you choose to bet on sports, it is your decision and your responsibility. We are not liable for any losses. Never bet more than you can afford to lose.</p>

    <h2>4. Data Sources</h2>
    <p>Our predictions are based on publicly available data including official NBA statistics, injury reports, historical performance data, and publicly available betting market data (for informational context). Data may be incomplete, inaccurate, outdated, or subject to last-minute changes.</p>

    <h2>5. No Liability</h2>
    <p>To the maximum extent permitted by law, Kynetics Sports, its owners, employees, and affiliates shall not be liable for any losses from betting or gambling, inaccurate predictions, errors or omissions in data, service interruptions, or any decisions made based on our content.</p>
    <div className="callout-red">
      <p><strong>USE THIS SERVICE AT YOUR OWN RISK.</strong></p>
    </div>

    <h2>6. Legal Compliance</h2>
    <p>You are responsible for ensuring that your use of this Service and any related activities comply with all applicable laws in your jurisdiction. Sports betting is illegal or restricted in some locations. Do not bet if it is illegal where you are.</p>
    <p>You must be at least 18 years old (or the age of majority in your jurisdiction) to use this Service.</p>

    <h2>7. Intellectual Property</h2>
    <p>All content on Kynetics Sports — including mascot designs, predictions, analysis, and text — is protected by copyright and trademark law. Unauthorized use is prohibited.</p>

    <h2>8. Changes</h2>
    <p>This disclaimer may be updated at any time. Continued use of the Service constitutes acceptance of any changes.</p>

    <p><strong>By using Kynetics Sports, you acknowledge that you have read, understood, and agree to this Disclaimer.</strong></p>
  </LegalPage>
)

export default DisclaimerPage
