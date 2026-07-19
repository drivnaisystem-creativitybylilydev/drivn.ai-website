import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Legal Notice / Impressum — Drivn.AI",
  description: "Legal notice and provider identification for Drivn.AI.",
};

const EMAIL = "hello@drivn.ai";

function EnglishContent() {
  return (
    <>
      <h1>Legal Notice</h1>
      <p className="lead">Provider identification (Impressum), per §5 TMG / §5 DDG</p>

      <h2>Provider</h2>
      <p>
        Finn Schüler
        <br />
        <span className="note">[Street address and city — to be confirmed and added]</span>
        <br />
        Germany
      </p>

      <h2>Contact</h2>
      <p>
        Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        <br />
        <span className="note">[Phone number — optional, add if you want it public]</span>
      </p>

      <h2>Responsible for content</h2>
      <p>Finn Schüler, address as above.</p>

      <h2>VAT</h2>
      <p>
        Drivn.AI is operated by an individual without a registered business or VAT ID. Invoices are
        issued without separate VAT shown.
      </p>

      <h2>Dispute resolution</h2>
      <p>
        The European Commission provides a platform for online dispute resolution (ODR):{" "}
        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
          ec.europa.eu/consumers/odr
        </a>
        . We are not obliged and not willing to participate in dispute resolution proceedings before a
        consumer arbitration board.
      </p>

      <h2>Liability for content and links</h2>
      <p>
        As a private provider, content on this site is prepared with care, but no liability is
        accepted for its accuracy, completeness, or currentness. This site may link to external
        websites; their content is the responsibility of the respective operators, and no liability is
        accepted for external content.
      </p>
    </>
  );
}

function GermanContent() {
  return (
    <>
      <h1>Impressum</h1>
      <p className="lead">Angaben gemäß § 5 TMG / § 5 DDG</p>

      <h2>Anbieter</h2>
      <p>
        Finn Schüler
        <br />
        <span className="note">[Straße, Hausnummer und Ort — noch zu bestätigen und zu ergänzen]</span>
        <br />
        Deutschland
      </p>

      <h2>Kontakt</h2>
      <p>
        E-Mail: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        <br />
        <span className="note">[Telefonnummer — optional, nur falls gewünscht öffentlich]</span>
      </p>

      <h2>Verantwortlich für den Inhalt</h2>
      <p>Finn Schüler, Anschrift wie oben.</p>

      <h2>Umsatzsteuer</h2>
      <p>
        Drivn.AI wird von einer Einzelperson ohne eingetragenes Gewerbe und ohne
        Umsatzsteuer-Identifikationsnummer betrieben. Rechnungen werden ohne gesonderten Ausweis von
        Umsatzsteuer gestellt.
      </p>

      <h2>Streitschlichtung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
          ec.europa.eu/consumers/odr
        </a>
        . Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>

      <h2>Haftung für Inhalte und Links</h2>
      <p>
        Als privater Anbieter werden die Inhalte dieser Seite mit Sorgfalt erstellt, dennoch wird keine
        Gewähr für Richtigkeit, Vollständigkeit und Aktualität übernommen. Diese Seite kann auf externe
        Websites verlinken; für deren Inhalte sind ausschließlich die jeweiligen Betreiber
        verantwortlich, eine Haftung für fremde Inhalte wird nicht übernommen.
      </p>
    </>
  );
}

export default async function ImpressumPage({
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
