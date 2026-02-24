import React from 'react'
import LegalPage from './LegalPage'

const ResponsibleGamingPage = () => (
  <LegalPage title="Responsible Gaming" lastUpdated="February 2026">
    <div className="callout">
      <p><strong>Kynetics Sports is an entertainment platform — not a gambling service.</strong> However, we recognize that sports predictions can be used alongside betting activities. We encourage all users to engage with sports content responsibly.</p>
    </div>

    <h2>1. Our Position</h2>
    <p>Kynetics Sports does not facilitate, promote, or encourage gambling in any form. Our predictions and analysis are for entertainment and informational purposes only. We do not accept bets, process wagers, or operate as a sportsbook.</p>

    <h2>2. If You Choose to Bet</h2>
    <p>If you participate in sports betting outside of our platform, we encourage you to:</p>
    <ul>
      <li><strong>Set a budget</strong> — decide what you can afford to lose before you start, and never exceed it</li>
      <li><strong>Treat it as entertainment</strong> — not a source of income</li>
      <li><strong>Never chase losses</strong> — trying to win back money usually leads to bigger losses</li>
      <li><strong>Don't bet under the influence</strong> — avoid gambling when intoxicated or emotional</li>
      <li><strong>Take breaks</strong> — don't let it interfere with your daily life</li>
    </ul>

    <h2>3. Get Help</h2>
    <p>If you or someone you know is struggling with gambling, confidential help is available 24/7:</p>
    <div className="callout-green">
      <p><strong>United States</strong><br />
      National Council on Problem Gambling<br />
      Call or Text: <strong>1-800-522-4700</strong><br />
      <a href="https://www.ncpgambling.org" target="_blank" rel="noopener noreferrer">www.ncpgambling.org</a></p>

      <p><strong>United Kingdom</strong><br />
      GamCare: <strong>0808 8020 133</strong><br />
      <a href="https://www.gamcare.org.uk" target="_blank" rel="noopener noreferrer">www.gamcare.org.uk</a></p>

      <p><strong>International</strong><br />
      <a href="https://www.gamblersanonymous.org" target="_blank" rel="noopener noreferrer">Gamblers Anonymous</a><br />
      <a href="https://www.gamblingtherapy.org" target="_blank" rel="noopener noreferrer">Gambling Therapy</a></p>
    </div>

    <h2>4. Minors</h2>
    <p>Kynetics Sports is strictly for users aged 18 and over. We recommend that parents use filtering software to prevent minors from accessing gambling-related content online.</p>

    <h2>5. Contact Us</h2>
    <p>If you have concerns or need assistance: <a href="mailto:kyneticssports@gmail.com">kyneticssports@gmail.com</a></p>
  </LegalPage>
)

export default ResponsibleGamingPage
