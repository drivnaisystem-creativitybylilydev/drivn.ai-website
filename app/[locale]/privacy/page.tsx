import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Drivn.AI",
  description: "How Drivn.AI collects, uses, and protects your data.",
};

const EMAIL = "hello@drivn.ai";

function EnglishContent() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="lead">Last updated: July 2026</p>

      <p>
        This Privacy Policy explains what data Drivn.AI (&ldquo;we,&rdquo; &ldquo;us&rdquo;) collects when you visit this
        website or get in touch with us, why we collect it, and what rights you have over it. Drivn.AI
        is operated by Finn Schüler as an individual, not a registered company.
      </p>

      <h2>1. Who is responsible</h2>
      <p>
        Finn Schüler, operating as Drivn.AI.
        <br />
        Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      </p>

      <h2>2. What we collect and why</h2>
      <h3>Discovery / audit form</h3>
      <p>
        When you submit the &ldquo;Book a Free Systems Audit&rdquo; form, we collect your name, business name,
        email address, phone number, and anything else you write in the form. This is stored in our
        database and, depending on setup, may also be relayed to us by email. We use it only to
        respond to your inquiry and prepare for a call — never to build a marketing list without your
        separate consent.
      </p>
      <h3>Booking a call (Calendly)</h3>
      <p>
        Scheduling a call uses Calendly, a third-party service. Calendly processes the booking details
        you provide (name, email, selected time) and technical data (IP address, browser) under its own
        privacy policy. We only see the information needed to run the call.
      </p>
      <h3>Cookies and local storage</h3>
      <p>
        We use one functional entry in your browser&apos;s local storage to remember your cookie-banner
        choice, so we don&apos;t ask again on every visit. We do not currently run analytics or advertising
        cookies. If that changes in the future, they will only load after you actively accept them in
        the cookie banner.
      </p>

      <h2>3. Hosting</h2>
      <p>
        This site is hosted on Vercel Inc. (USA). Basic technical logs (IP address, request time,
        pages requested) are processed by Vercel to serve the site and keep it secure, under
        appropriate safeguards for international data transfer (EU Standard Contractual Clauses).
      </p>

      <h2>4. What we don&apos;t do</h2>
      <p>We don&apos;t sell your data. We don&apos;t share it with third parties beyond the tools named above.</p>

      <h2>5. How long we keep it</h2>
      <p>
        Discovery-form submissions and related correspondence are kept for as long as needed to
        respond to your inquiry or deliver a service, and are deleted on request.
      </p>

      <h2>6. Your rights</h2>
      <p>
        If you are in the EU/EEA, you have the right to access, correct, delete, or export your data,
        to restrict or object to its processing, and to lodge a complaint with your local data
        protection authority. To exercise any of these, email{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>

      <h2>7. Changes</h2>
      <p>We may update this policy as the site changes. The date above reflects the latest revision.</p>
    </>
  );
}

function GermanContent() {
  return (
    <>
      <h1>Datenschutzerklärung</h1>
      <p className="lead">Stand: Juli 2026</p>

      <p>
        Diese Datenschutzerklärung erklärt, welche Daten Drivn.AI (&bdquo;wir&ldquo;) erhebt, wenn Sie diese
        Website besuchen oder mit uns Kontakt aufnehmen, warum wir das tun, und welche Rechte Ihnen
        dabei zustehen. Drivn.AI wird von Finn Schüler als Einzelperson betrieben, nicht als
        eingetragenes Unternehmen.
      </p>

      <h2>1. Verantwortlicher</h2>
      <p>
        Finn Schüler, handelnd unter Drivn.AI.
        <br />
        E-Mail: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      </p>

      <h2>2. Welche Daten wir erheben und warum</h2>
      <h3>Kontakt-/Audit-Formular</h3>
      <p>
        Wenn Sie das Formular &bdquo;Book a Free Systems Audit&ldquo; ausfüllen, erheben wir Ihren Namen,
        Unternehmensnamen, Ihre E-Mail-Adresse, Telefonnummer sowie alle weiteren Angaben im Formular.
        Diese werden in unserer Datenbank gespeichert und ggf. zusätzlich per E-Mail an uns
        weitergeleitet. Wir nutzen die Daten ausschließlich zur Beantwortung Ihrer Anfrage und
        Vorbereitung eines Gesprächs — nicht zum Aufbau einer Marketingliste ohne Ihre gesonderte
        Einwilligung.
      </p>
      <h3>Terminbuchung (Calendly)</h3>
      <p>
        Für die Terminbuchung nutzen wir den Drittanbieter Calendly. Calendly verarbeitet die von
        Ihnen angegebenen Buchungsdaten (Name, E-Mail, gewählter Termin) sowie technische Daten
        (IP-Adresse, Browser) nach eigener Datenschutzerklärung. Wir erhalten nur die für das Gespräch
        notwendigen Informationen.
      </p>
      <h3>Cookies und lokaler Speicher</h3>
      <p>
        Wir verwenden einen einzigen funktionalen Eintrag im lokalen Speicher Ihres Browsers, um Ihre
        Cookie-Auswahl zu merken, damit wir Sie nicht bei jedem Besuch erneut fragen. Wir setzen
        aktuell keine Analyse- oder Marketing-Cookies ein. Sollte sich das ändern, werden diese
        ausschließlich nach Ihrer aktiven Zustimmung im Cookie-Banner geladen.
      </p>

      <h2>3. Hosting</h2>
      <p>
        Diese Website wird bei Vercel Inc. (USA) gehostet. Technische Basisdaten (IP-Adresse,
        Zeitpunkt der Anfrage, aufgerufene Seiten) werden von Vercel zum Betrieb und zur Absicherung
        der Website verarbeitet, unter Einhaltung geeigneter Garantien für die internationale
        Datenübermittlung (EU-Standardvertragsklauseln).
      </p>

      <h2>4. Was wir nicht tun</h2>
      <p>
        Wir verkaufen Ihre Daten nicht und geben sie über die oben genannten Dienste hinaus nicht an
        Dritte weiter.
      </p>

      <h2>5. Speicherdauer</h2>
      <p>
        Formular-Einreichungen und zugehörige Korrespondenz werden so lange gespeichert, wie es zur
        Beantwortung Ihrer Anfrage oder Leistungserbringung erforderlich ist, und auf Wunsch gelöscht.
      </p>

      <h2>6. Ihre Rechte</h2>
      <p>
        Innerhalb der EU/des EWR haben Sie das Recht auf Auskunft, Berichtigung, Löschung, Übertragung
        sowie Einschränkung oder Widerspruch der Verarbeitung Ihrer Daten und können sich bei Ihrer
        zuständigen Datenschutzaufsichtsbehörde beschweren. Zur Ausübung dieser Rechte wenden Sie sich
        an <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>

      <h2>7. Änderungen</h2>
      <p>
        Wir können diese Erklärung bei Änderungen an der Website aktualisieren. Das Datum oben zeigt
        die letzte Überarbeitung.
      </p>
    </>
  );
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Navigation />
      <main className="pt-40 pb-28" style={{ background: "var(--color-mono-bg)" }}>
        <div className="container-max max-w-3xl legal-prose">
          {locale === "de" ? <GermanContent /> : <EnglishContent />}
        </div>
      </main>
      <Footer />
    </>
  );
}
