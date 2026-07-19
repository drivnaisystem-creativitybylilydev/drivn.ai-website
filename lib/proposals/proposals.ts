export interface GoogleDeliverable {
  item: string;
  why: string;
}

export interface DeliveryRow {
  item: string;
  detail: string;
}

export interface TimelineRow {
  step: string;
  when: string;
}

export interface ProposalData {
  slug: string;
  client: string;
  niche: string;
  city: string;
  accentColor: string;
  situation: string;
  websitePages: string[];
  websiteDesign: string;
  websiteLanguages?: string[];
  googleDeliverables: GoogleDeliverable[];
  deliveryTable: DeliveryRow[];
  pricingA: { setup: string; monthly: string; note?: string };
  pricingB: { monthly: string; term: string };
  timeline: TimelineRow[];
  extra?: string; // any niche-specific callout below google section
}

export const proposals: ProposalData[] = [
  {
    slug: "beirut-kosmetik",
    client: "Beirut Kosmetik",
    niche: "Kosmetikstudio",
    city: "Berlin",
    accentColor: "#8B5E3C",
    situation:
      `Wir haben nach "Kosmetikstudio [Bezirk] Berlin“ gesucht. Beirut Kosmetik taucht nicht auf.\n\nDas bedeutet: Jede Person, die gerade in Berlin nach Augenbrauen-Behandlung, Wimpernverlängerung oder Fadenepilation sucht — und das sind täglich Dutzende — findet Ihr Studio nicht. Sie bucht woanders. Sie merken es nie.`,
    websitePages: [
      "Startseite — Studio auf einen Blick, Bewertungen, direkter Kontaktweg",
      "Leistungen & Preise — Augenbrauen, Wimpern, Gesichtsbehandlung, Waxing, Massage, Make-up",
      "Über uns — Ihre Geschichte, Ihre Spezialisierung",
      "Galerie — Fotos Ihrer Arbeit und Ihres Studios",
      "Kontakt & Anfahrt — Adresse, Öffnungszeiten, Google Maps, WhatsApp",
      "Impressum & Datenschutz — gesetzlich erforderlich, wird von uns erstellt",
    ],
    websiteDesign:
      "Warme Erdtöne, klare Typografie — kein billiges Template. Professionell wie Ihre Arbeit.",
    googleDeliverables: [
      { item: "Google Business Profile", why: 'Ihr Studio erscheint in Google Maps — direkt wenn jemand nach "Kosmetikstudio Berlin" sucht' },
      { item: "Strukturierte Daten (Schema)", why: "Google liest Ihre Leistungen, Öffnungszeiten und Bewertungen automatisch aus" },
      { item: "Sitemap bei Google eingereicht", why: "Ihre Seite wird innerhalb von 2–4 Wochen von Google gefunden" },
      { item: "Bing Places", why: "Macht Ihr Studio sichtbar in ChatGPT und Copilot — KI-Suche wächst schnell" },
      { item: "Apple Business Connect", why: "Apple Maps und Siri — jede iPhone-Suche in der Nähe" },
      { item: "Suchbegriffe auf der Seite", why: 'Z.B. "Augenbrauen threading Berlin", "Wimpernverlängerung [Bezirk]" — was Ihre Kunden wirklich tippen' },
    ],
    deliveryTable: [
      { item: "Fertige Website, live", detail: "Innerhalb von 14 Tagen nach Kickoff" },
      { item: "Google Business Profile", detail: "Eingerichtet & optimiert — Sie bestätigen nur Ihre Adresse" },
      { item: "Bing Places + Apple Maps", detail: "Eingerichtet — Sie erscheinen in KI-Suchen" },
      { item: "Schema-Daten", detail: "Strukturierte Daten für Google, fertig eingepflegt" },
      { item: "Sitemap bei Google eingereicht", detail: "Wir kümmern uns darum" },
      { item: "Alle Zugangsdaten", detail: "Die Website gehört Ihnen — vollständig" },
      { item: "Impressum + Datenschutz", detail: "DSGVO-konform, fertig" },
      { item: "Monatlicher Bericht", detail: "Wie oft Sie bei Google gefunden wurden, wie viele Klicks" },
    ],
    pricingA: { setup: "1.000 €", monthly: "99 €/Monat", note: "Erster Monat kostenlos" },
    pricingB: { monthly: "333 €/Monat", term: "3 Monate, danach 99 €/Monat" },
    timeline: [
      { step: "Vertragsunterzeichnung", when: "Tag 0" },
      { step: "Kickoff-Gespräch (30 Min.)", when: "Tag 1–2" },
      { step: "Entwurf der Website", when: "Tag 5–7" },
      { step: "Ihre Korrekturrunde", when: "Tag 8–10" },
      { step: "Live-Schaltung + Google-Einrichtung", when: "Tag 12–14" },
      { step: "Erste Google-Sichtbarkeit", when: "2–4 Wochen nach Live" },
    ],
  },
  {
    slug: "badabing",
    client: "Badabing Social Club",
    niche: "Social Club · Kreuzberg",
    city: "Berlin",
    accentColor: "#F05A00",
    situation:
      `Badabing ist auf ZAZAPASS gelistet. Das ist gut — für die Community, die ZAZAPASS kennt.\n\nAber ZAZAPASS ist deren Plattform, nicht eure. Wenn jemand bei Google "Raucherlounge Kreuzberg" tippt, findet Google ZAZAPASS — nicht Badabing direkt. Eure 43 Fünf-Sterne-Bewertungen stärken eine fremde Domain. Und ChatGPT? Kennt euch nicht. Das ändern wir.`,
    websitePages: [
      "Startseite — Logo, Atmosphäre, eine Zeile, ein CTA",
      "Das Lokal — Gaming-Tisch, Waffeln, Bar, Zubehör, Events, Kreuzberger Spirit",
      "Bewertungen — eure 43 Google-Bewertungen, automatisch scrollend",
      "Anfahrt & Öffnungszeiten — Urbanstraße 49, täglich ab 16 Uhr, 21+",
      "Impressum & Datenschutz — gesetzlich erforderlich, erledigt",
    ],
    websiteDesign:
      "Dunkel. Orange. Bold. Passt zu eurem Logo und eurem Vibe — nicht zu einer Apotheke.",
    extra:
      "ZAZAPASS bleibt — das ist kein Entweder-oder. Beide Kanäle laufen parallel. Ihr gewinnt dazu, ihr verliert nichts.",
    googleDeliverables: [
      { item: "Eigenes Google Business Profile", why: 'Wenn jemand "Social Club Berlin" sucht, erscheint Badabing direkt — nicht über eine Plattform' },
      { item: "Strukturierte Daten (Schema)", why: "Google liest Öffnungszeiten, Lage und Bewertungen automatisch aus" },
      { item: "Sitemap bei Google eingereicht", why: "Eure Seite wird innerhalb von 2–4 Wochen von Google gefunden" },
      { item: "Bing Places", why: "Macht Badabing sichtbar für ChatGPT — KI-Suche ist der am schnellsten wachsende Kanal" },
      { item: "Apple Business Connect", why: "Apple Maps, Siri — jedes iPhone im Kiez" },
      { item: "llms.txt", why: "Erklärt KI-Systemen automatisch, was Badabing ist" },
    ],
    deliveryTable: [
      { item: "Fertige Website, live", detail: "Innerhalb von 14 Tagen nach Kickoff" },
      { item: "Eigenes Google Business Profile", detail: "Eingerichtet & vollständig optimiert" },
      { item: "Bing Places + Apple Maps", detail: "Sichtbarkeit in ChatGPT und Siri" },
      { item: "43 Bewertungen eingebunden", detail: "Prominent auf der Startseite, automatisch scrollend" },
      { item: "Alle Zugangsdaten", detail: "Die Website gehört euch — vollständig" },
      { item: "Impressum + Datenschutz", detail: "DSGVO-konform, fertig" },
      { item: "Monatlicher Bericht", detail: "Google-Sichtbarkeit, Klicks, Impressionen" },
    ],
    pricingA: { setup: "1.000 €", monthly: "99 €/Monat", note: "Erster Monat kostenlos" },
    pricingB: { monthly: "333 €/Monat", term: "3 Monate, danach 99 €/Monat" },
    timeline: [
      { step: "Vertragsunterzeichnung", when: "Tag 0" },
      { step: "Kickoff (30 Min.)", when: "Tag 1–2" },
      { step: "Entwurf der Website", when: "Tag 5–7" },
      { step: "Eure Korrekturrunde", when: "Tag 8–10" },
      { step: "Live-Schaltung + Google-Einrichtung", when: "Tag 12–14" },
      { step: "Erste Sichtbarkeit in Google", when: "2–4 Wochen nach Live" },
    ],
  },
  {
    slug: "cafe-kuchenliebe",
    client: "Café Kuchenliebe",
    niche: "Café · Schöneberg",
    city: "Berlin",
    accentColor: "#9E7B3A",
    situation:
      `73 Google-Bewertungen. Alle fünf Sterne. Das ist außergewöhnlich.\n\nDie aktuelle Website existiert. Aber sie arbeitet nicht für euch. Keine Online-Reservierung. Keine Mehrsprachigkeit für eure internationalen Gäste. 73 Fünf-Sterne-Bewertungen — und man sieht sie erst, wenn man aktiv nach euch sucht. Das ändern wir.`,
    websitePages: [
      "Startseite — eure 73 Bewertungen sofort sichtbar, Atmosphärebild, direkte CTAs",
      "Speisekarte — Kuchen, Croffles, Istanbul-Frühstück, Getränke — mit Fotos",
      "Reservierung — Online-Formular für Tische, Geburtstage und Events",
      "Über uns — Geschichte, Werte, was Kuchenliebe besonders macht",
      "Galerie — Atmosphäre, Produkte, das Café wie es wirklich ist",
      "Anfahrt & Öffnungszeiten — Mo–So 10–18 Uhr, Adresse, Google Maps",
      "Impressum & Datenschutz — DSGVO-konform, fertig",
    ],
    websiteDesign:
      "Editorial, warm, persönlich — so wie das Café selbst. Keine generische Café-Vorlage.",
    websiteLanguages: ["Deutsch", "Englisch", "Arabisch", "Türkisch"],
    googleDeliverables: [
      { item: "Technische SEO-Grundlage", why: "Schnell ladend, mobile-perfekt — Google bevorzugt das" },
      { item: "CafeOrCoffeeShop-Schema", why: "Google liest automatisch: Name, Öffnungszeiten, Adresse, Bewertungen" },
      { item: "Sitemap bei Google eingereicht", why: "Alle Seiten werden von Google gefunden und indexiert" },
      { item: "Suchbegriffe auf der Seite", why: 'Z.B. "croffles Berlin", "Café Schöneberg", "Istanbul Frühstück Berlin"' },
      { item: "Mehrsprachige hreflang-Tags", why: "Google zeigt die richtige Sprache dem richtigen Nutzer" },
      { item: "Bing Places + Apple Business Connect", why: "Sichtbar bei ChatGPT, Copilot und Siri" },
    ],
    extra:
      "ChatGPT empfiehlt lokale Cafés mit einer Conversion-Rate von 15,9 % — neunmal höher als Google-Suche (Seer Interactive, 2026). Eure 73 Bewertungen machen euch zu einem idealen Kandidaten für KI-Empfehlungen.",
    deliveryTable: [
      { item: "Komplette neue Website", detail: "Live in 14 Tagen" },
      { item: "4 Sprachen", detail: "DE, EN, AR, TR — vollständig" },
      { item: "Online-Reservierungsformular", detail: "Für Tische, Geburtstage, Events" },
      { item: "73 Bewertungen prominent", detail: "Direkt auf der Startseite, beim ersten Scroll" },
      { item: "Bing Places + Apple Maps", detail: "KI-Sichtbarkeit von Tag 1" },
      { item: "Alle Zugangsdaten", detail: "Die Website gehört euch" },
      { item: "Impressum + Datenschutz", detail: "Fertig, DSGVO-konform" },
      { item: "Monatlicher SEO-Bericht", detail: "Wie oft ihr bei Google gefunden wurdet" },
    ],
    pricingA: { setup: "1.000 €", monthly: "99 €/Monat", note: "Erster Monat kostenlos" },
    pricingB: { monthly: "333 €/Monat", term: "3 Monate, danach 99 €/Monat" },
    timeline: [
      { step: "Vertragsunterzeichnung", when: "Tag 0" },
      { step: "Kickoff-Gespräch (30 Min.)", when: "Tag 1–2" },
      { step: "Entwurf der Website", when: "Tag 5–7" },
      { step: "Eure Korrekturrunde", when: "Tag 8–10" },
      { step: "Live-Schaltung", when: "Tag 12–14" },
      { step: "Erste Ergebnisse in Google", when: "2–4 Wochen" },
    ],
  },
  {
    slug: "der-nagelmann",
    client: "Der Nagelmann",
    niche: "Nagelstudio · Charlottenburg",
    city: "Berlin",
    accentColor: "#D4617A",
    situation:
      "4,9 Sterne. 28 Bewertungen. Kein Termin nötig — einfach vorbeikommen.\n\nDie aktuelle Website existiert, aber sie macht euer Konzept nicht sichtbar. Keine Preise. Keine Galerie. Kein klarer Grund für jemanden in Charlottenburg, der um 21 Uhr Gel-Nägel sucht, bei euch zu landen statt beim Studio drei Straßen weiter.",
    websitePages: [
      'Startseite — Leistungen, Preise, Galerie und "Kein Termin nötig" sofort sichtbar',
      "Leistungen & Preise — vollständig und transparent: Nailart, Maniküre, Pediküre, Extras",
      "Galerie — eure Arbeit: Babyboomer, French, Ombré, Nailart — groß und überzeugend",
      "Anfahrt & Öffnungszeiten — Mo–Sa 10–19:30 Uhr, Adresse, Google Maps",
      "Impressum & Datenschutz — DSGVO-konform, fertig",
    ],
    websiteDesign:
      "Sauber, modern, feminin. Euer Rosa-Akzent, klare Struktur — keine Werbung, kein Lärm.",
    extra:
      'Wenn jemand "Gel Nägel Charlottenburg Preis" googlet und auf eurer Seite keine Preise findet, klickt sie weiter — zur nächsten Seite, die Preise hat. Wir zeigen eure Preise klar und vollständig. Das ist der einfachste Weg, aus Besuchern Walk-ins zu machen.',
    googleDeliverables: [
      { item: "NailSalon-Schema (strukturierte Daten)", why: "Google liest: Leistungen, Preise, Öffnungszeiten, Bewertungen — automatisch" },
      { item: "Suchbegriffe auf der Seite", why: 'Z.B. "Nagelstudio Charlottenburg", "Gel Nägel Berlin Walk-in", "Acryl Nägel Charlottenburg"' },
      { item: "Sitemap bei Google eingereicht", why: "Alle Seiten werden von Google gefunden" },
      { item: "Google Business Profile optimiert", why: "Korrekte Kategorie, vollständige Daten, Fotos" },
      { item: "Bing Places", why: "Der Nagelmann erscheint bei ChatGPT-Empfehlungen für Nagelstudios in Berlin" },
      { item: "Apple Business Connect", why: "Apple Maps und Siri — jedes iPhone im Kiez" },
    ],
    deliveryTable: [
      { item: "Komplette neue Website", detail: "Live in 14 Tagen" },
      { item: "Volle Preis- und Leistungsübersicht", detail: "Transparent und überzeugend" },
      { item: "Galerie mit eurer Arbeit", detail: "Gel, Acryl, Nailart — visuell" },
      { item: "Google Business Profile optimiert", detail: "Kategorie, Fotos, Öffnungszeiten" },
      { item: "Bing Places + Apple Maps", detail: "KI-Sichtbarkeit von Tag 1" },
      { item: "Alle Zugangsdaten", detail: "Die Website gehört euch" },
      { item: "Impressum + Datenschutz", detail: "Fertig, DSGVO-konform" },
      { item: "Monatlicher SEO-Bericht", detail: "Wie oft ihr bei Google gefunden wurdet" },
    ],
    pricingA: { setup: "1.000 €", monthly: "99 €/Monat", note: "Erster Monat kostenlos" },
    pricingB: { monthly: "333 €/Monat", term: "3 Monate, danach 99 €/Monat" },
    timeline: [
      { step: "Vertragsunterzeichnung", when: "Tag 0" },
      { step: "Kickoff-Gespräch (30 Min.)", when: "Tag 1–2" },
      { step: "Entwurf der Website", when: "Tag 5–7" },
      { step: "Eure Korrekturrunde", when: "Tag 8–10" },
      { step: "Live-Schaltung + Google-Einrichtung", when: "Tag 12–14" },
      { step: "Erste Ergebnisse in Google", when: "2–4 Wochen" },
    ],
  },
];

export function getProposal(slug: string): ProposalData | undefined {
  return proposals.find((p) => p.slug === slug);
}
