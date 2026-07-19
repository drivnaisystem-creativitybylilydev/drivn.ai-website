// Walk-in sales targets for Berlin sprint.
// Barbershop entries are generated from the CSV — all score 10 (no website).

export interface Target {
  id: string;
  name: string;
  niche: string;
  address: string;
  district: string;
  phone?: string;
  mapsUrl: string;
  situation: string;
  situationTag: "no_site" | "weak_site" | "third_party";
  googleRating: number | null;
  googleReviews: number | null;
  accentColor: string;
  opener: string;
  painPoints: { title: string; pitch: string }[];
  objections: { q: string; a: string }[];
  demoNote: string;
  closeScript: string;
}

function id(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Shared barbershop objection rebuttals (same for all 19)
const BARBER_OBJECTIONS: Target["objections"] = [
  {
    q: "Wir kommen über Stammkunden / Empfehlung",
    a: "Stammkunden sind euer Fundament — das bleibt. Aber Neukunden kommen heute über Google. Jemand zieht in den Kiez, sucht einen Barbershop — wenn ihr da nicht auftaucht, geht er woanders. Das sind eure zukünftigen Stammkunden die ihr gerade nicht seht.",
  },
  {
    q: "Ich mach das über Instagram",
    a: "Instagram zeigt euren Content nur Leuten die euch schon folgen. Google zeigt euch Leuten die aktiv suchen — 'Barbershop [Bezirk]'. Das ist Kaufabsicht. Das ist ein völlig anderer Kanal.",
  },
  {
    q: "Was kostet das?",
    a: "1.000€ einmalig — Design, Preisliste, Galerie, Google-Anbindung, alles. Dann 99€/Monat. Zwei Neukunden im Monat über die Seite und das hat sich bezahlt. Alt: 333€ × 3 Monate, kein Setup-Fee.",
  },
  {
    q: "Ich hab keine Zeit",
    a: "Das ist genau der Punkt — ihr macht gar nichts. Ich bau alles, pflege es. Ihr schickt mir ein neues Foto wenn ihr wollt. Euer einziger Aufwand ist dieses Gespräch.",
  },
];

const BARBER_CLOSE = `"Ich will euch heute nichts verkaufen — ich schick euch einen Demo-Link, eine fertige Seite die ich für euch vorgebaut hab. Schaut sie in Ruhe an. Wenn's passt, reden wir. Wie erreiche ich euch am besten?" → WhatsApp. Senden innerhalb einer Stunde.`;

const BARBER_DEMO_NOTE =
  "Kein Demo gebaut. Vor dem Walk-in bauen: dunkles Barbershop-Theme, Serif-Akzentschrift, Preisliste, Galerie-Grid, Google Maps Embed, Öffnungszeiten prominent. Auf dem Handy zeigen — dunkle Screens wirken im Laden gut.";

function makeBarberTarget(
  name: string,
  address: string,
  district: string,
  phone: string,
  rating: number,
  reviews: number,
  mapsUrl: string,
  accentColor: string = "#8B1A1A",
): Target {
  return {
    id: id(name),
    name,
    niche: "Barbershop",
    address,
    district,
    phone: phone || undefined,
    mapsUrl,
    situation: "Kein Website. Nur Google Maps Eintrag.",
    situationTag: "no_site",
    googleRating: rating,
    googleReviews: reviews,
    accentColor,
    opener: `"Ich hab euch auf Google gefunden — ${reviews} Bewertungen, ${rating} Sterne. Stark. Aber eine eigene Website hab ich nicht gefunden. Macht ihr das bewusst so, oder ist das noch nicht angegangen?"`,
    painPoints: [
      {
        title: "Kein Website = keine Sichtbarkeit nach 18 Uhr",
        pitch: `Wer abends googlet 'Barbershop ${district}' findet euch nur als Maps-Pin — keine Seite, keine Preise, keine Fotos. Konkurrenten mit Website gewinnen diese Kunden. "Der Buchungsmoment ist digital — und da seid ihr gerade nicht."`,
      },
      {
        title: `${reviews} Bewertungen, aber keine eigene Plattform`,
        pitch: `Ihr habt ${reviews} Bewertungen — das ist stärker als die meisten Shops in Berlin. Aber die Wirkung bleibt in Google Maps begraben. Eine eigene Seite mit dieser Social Proof vorne drauf: jeder neue Besucher ist in fünf Sekunden überzeugt.`,
      },
      {
        title: "Keine Preise online = Kunden gehen zur Konkurrenz",
        pitch: `Wer sucht 'Herrenfriseur Preise ${district}' findet eure Preise nicht. Er geht weiter und bucht beim ersten der sie zeigt. "Das kostet euch täglich Kunden — die ihr nie seht, weil sie nie anklopfen."`,
      },
    ],
    objections: BARBER_OBJECTIONS,
    demoNote: BARBER_DEMO_NOTE,
    closeScript: BARBER_CLOSE,
  };
}

// ─── Barbershop leads (from berlin-barbershops-MASTER-2026-05-13.csv) ─────────
// All score 10 — no website. Sorted by review count desc.

const BARBERSHOPS: Target[] = [
  makeBarberTarget("Çetin's Gentlemen's Barber", "Grunewaldstraße 88, 10823 Berlin", "Schöneberg", "+49 30 47057007", 4.9, 611, "https://maps.google.com/?q=Çetin+Gentlemens+Barber+Berlin+Schöneberg", "#6B2D2D"),
  makeBarberTarget("Classic Barbershop", "Silbersteinstraße 39, 12051 Berlin", "Neukölln", "+49 176 41825085", 4.8, 535, "https://maps.google.com/?q=Classic+Barbershop+Neukölln+Berlin", "#2D4A3A"),
  makeBarberTarget("Friseur shibaar", "Grünberger Str. 28, 10243 Berlin", "Friedrichshain", "+49 176 15747205", 4.9, 475, "https://maps.google.com/?q=Friseur+shibaar+Friedrichshain+Berlin", "#1A3050"),
  makeBarberTarget("KHALED'S BARBERSHOP", "Schönwalder Str. 17A, 13347 Berlin", "Wedding", "+49 176 81309051", 5.0, 418, "https://maps.google.com/?q=Khaled+Barbershop+Wedding+Berlin", "#8B1A1A"),
  makeBarberTarget("Moustache Barbershop by Ibo", "Amsterdamer Str. 25, 13347 Berlin", "Wedding", "+49 30 55615425", 5.0, 441, "https://maps.google.com/?q=Moustache+Barbershop+Ibo+Wedding+Berlin", "#3A2A1A"),
  makeBarberTarget("Barber Brothers 2", "Pettenkoferstraße 48, 10247 Berlin", "Friedrichshain", "+49 30 21236400", 4.8, 381, "https://maps.google.com/?q=Barber+Brothers+2+Friedrichshain+Berlin", "#1A3A1A"),
  makeBarberTarget("Barber Brothers", "Boxhagener Str. 50, 10245 Berlin", "Friedrichshain", "+49 30 43203412", 4.9, 341, "https://maps.google.com/?q=Barber+Brothers+Friedrichshain+Berlin", "#2A1A3A"),
  makeBarberTarget("Barbershop REZO FRISEUR", "Berliner Str. 40, 13189 Berlin", "Pankow", "+49 30 55518528", 4.8, 339, "https://maps.google.com/?q=Barbershop+Rezo+Friseur+Pankow+Berlin", "#1A2A3A"),
  makeBarberTarget("Bro's Barbershop", "Berlinickestraße 10, 12165 Berlin", "Steglitz", "+49 30 76954774", 4.9, 358, "https://maps.google.com/?q=Bros+Barbershop+Steglitz+Berlin", "#3A1A2A"),
  makeBarberTarget("WestBarberShop", "Lietzenburger Str. 22, 10789 Berlin", "Charlottenburg", "+49 30 28628873", 4.6, 325, "https://maps.google.com/?q=WestBarberShop+Charlottenburg+Berlin", "#1A3A2A"),
  makeBarberTarget("Orient Style Barber", "Alte Potsdamer Str. 7, 10785 Berlin", "Tiergarten", "+49 176 64274816", 4.9, 312, "https://maps.google.com/?q=Orient+Style+Barber+Tiergarten+Berlin", "#2A3A1A"),
  makeBarberTarget("FADE MASTER", "Böckhstraße 27, 10967 Berlin", "Kreuzberg", "+49 179 3900133", 4.9, 603, "https://maps.google.com/?q=Fade+Master+Kreuzberg+Berlin", "#8B4A1A"),
  makeBarberTarget("Barbershop gabol Friseur", "Alexanderplatz Mittlere Ladenpassage, 10178 Berlin", "Mitte", "", 4.7, 237, "https://maps.google.com/?q=Barbershop+gabol+Friseur+Alexanderplatz+Berlin", "#1A1A3A"),
  makeBarberTarget("030 Barber", "Hauptstraße 7, 13127 Berlin", "Pankow", "+49 30 55060698", 4.8, 199, "https://maps.google.com/?q=030+Barber+Pankow+Berlin", "#3A2A2A"),
  makeBarberTarget("Lux Barber (Der Friseur)", "Lütticher Str. 51, 13353 Berlin", "Wedding", "+49 30 91492255", 4.9, 174, "https://maps.google.com/?q=Lux+Barber+Wedding+Berlin", "#2A1A1A"),
  makeBarberTarget("SAM Barber Shop", "Weitlingstraße 48, 10317 Berlin", "Lichtenberg", "+49 30 55152622", 4.8, 125, "https://maps.google.com/?q=SAM+Barber+Shop+Lichtenberg+Berlin", "#1A2A1A"),
  makeBarberTarget("Friseur Tümer BARBERSHOP", "Skalitzer Str. 101, 10997 Berlin", "Kreuzberg", "+49 30 6182786", 4.9, 254, "https://maps.google.com/?q=Friseur+Tümer+Barbershop+Kreuzberg+Berlin", "#3A1A3A"),
  makeBarberTarget("Turkish Style Herren Friseur", "Lützowstraße 39, 10785 Berlin", "Tiergarten", "+49 30 51890895", 4.9, 74, "https://maps.google.com/?q=Turkish+Style+Herren+Friseur+Tiergarten+Berlin", "#2A3A3A"),
  makeBarberTarget("BERLIN BARBER LOUNGE", "Manteuffelstraße 52, 12103 Berlin", "Tempelhof", "+49 1523 4676369", 5.0, 64, "https://maps.google.com/?q=Berlin+Barber+Lounge+Tempelhof", "#3A3A1A"),
];

// ─── Original 4 targets (beauty / café / cannabis) ────────────────────────────

const SPECIAL_TARGETS: Target[] = [
  {
    id: "beirut-kosmetik",
    name: "Beirut Kosmetik",
    niche: "Beauty Studio",
    address: "Berlin (address TBC on walk-in)",
    district: "Berlin",
    mapsUrl: "https://maps.google.com/?q=Beirut+Kosmetik+Berlin",
    situation: "No website. Not on Google Maps at all.",
    situationTag: "no_site",
    googleRating: null,
    googleReviews: null,
    accentColor: "#8B5E3C",
    opener: "\"Ich konnte Ihr Studio nicht auf Google finden — aber Ihre Kunden schon.\"",
    demoNote: "Demo built: mocha palette, Playfair Display, full services + pricing. Open before walking in.",
    painPoints: [
      {
        title: "Zero Google visibility",
        pitch: "Search 'Augenbrauen threading Berlin' — show her competitors on Maps. Her name is not there. Say: \"Das heißt: Wer gerade sucht, bucht woanders — und Sie merken es nie.\"",
      },
      {
        title: "Silent revenue loss",
        pitch: "\"Die verlorenen Kunden melden sich nicht. Die buchen einfach woanders. Sie bekommen keine Benachrichtigung.\"",
      },
      {
        title: "Undervalued specialization",
        pitch: "Middle Eastern brow techniques, threading, precision lamination — genuinely differentiated. Nobody can find it. Say: \"Beirut Kosmetik — allein der Name sagt, hier ist jemand der wirklich was kann. Das muss man sehen können — online.\"",
      },
    ],
    objections: [
      { q: "Ich krieg meine Kunden über Instagram", a: "Instagram zeigt Ihre Inhalte nur Leuten, die Ihnen schon folgen. Google zeigt Sie Leuten, die aktiv suchen — genau im Buchungsmoment. Beides zusammen ist stärker." },
      { q: "Ich hab keine Zeit dafür", a: "Deswegen machen Sie nichts selbst. Ich bau alles, pflege es. Ihr einziger Aufwand: dieses Gespräch." },
      { q: "Was kostet das?", a: "1.000€ einmalig — Design, Texte, Google-Anbindung, alles. Dann 99€/Monat. Eine Neukunde pro Monat über die Seite hat sich das gerechnet. Alt: 333€/Monat × 3, kein Setup-Fee." },
      { q: "Muss ich das mit jemandem besprechen", a: "Absolut. Darf ich Ihnen den Demo-Link schicken, damit Sie ihn gemeinsam anschauen? Kein Versprechen — nur ein konkretes Bild davon." },
    ],
    closeScript: "\"Ich möchte Ihnen nichts aufschwatzen. Schick ich Ihnen die Demo — schauen Sie sie in Ruhe an. Wie erreiche ich Sie am besten?\" → Get WhatsApp. Send link within the hour.",
  },
  {
    id: "badabing-social-club",
    name: "Badabing Social Club",
    niche: "Cannabis Lounge",
    address: "Urbanstraße 49, 10967 Berlin-Kreuzberg",
    district: "Kreuzberg",
    mapsUrl: "https://maps.google.com/?q=Badabing+Social+Club+Berlin+Kreuzberg",
    situation: "Listed on ZAZAPASS platform only. No owned website.",
    situationTag: "third_party",
    googleRating: 5.0,
    googleReviews: 43,
    accentColor: "#F05A00",
    opener: "\"Hey — ich hab euch auf Google gefunden. Habt ihr eine eigene Website, oder lauft ihr komplett über ZAZAPASS?\"",
    demoNote: "Demo built: dark mode, Badabing Orange, Bebas Neue, full attitude. Open on phone — dark screen looks great in a dim room.",
    painPoints: [
      { title: "Borrowing someone else's house", pitch: "ZAZAPASS owns their traffic. If it pivots, raises prices, or folds — Badabing disappears overnight. Say: \"Momentan existiert ihr online auf einer fremden Plattform. Eine eigene Seite ist euer Haus — eures.\"" },
      { title: "Google can't properly read ZAZAPASS listings", pitch: "Searches for 'cannabis lounge Kreuzberg' fragment credit across the platform, not to them. Say: \"Eure 43 Bewertungen sollten euch berühmt machen — nicht ZAZAPASS.\"" },
      { title: "Culture without a home", pitch: "43 five-star reviews. The vibe, the team, the waffles. A generic aggregator listing does this place zero justice. \"Das verdient eine eigene Seite — keine generische Plattformliste.\"" },
    ],
    objections: [
      { q: "Wir haben ja ZAZAPASS", a: "ZAZAPASS für die Community — gut, das behaltet ihr. Aber das ist ihre Plattform. Eure Seite ist das, was Google-Traffic bringt und langfristig bleibt. Beides gleichzeitig ist stärker." },
      { q: "Wir kommen über Stammgäste — brauchen das nicht", a: "Stammgäste kommen sowieso. Eine Website bringt die, die noch nie von euch gehört haben — Touristen, neue Kiez-Leute. Die googlen. Momentan finden die euch nicht direkt." },
      { q: "Was kostet das?", a: "1.000€ einmalig, dann 99€/Monat — weniger als ein einzelner Abend Einnahmen. Die Seite arbeitet 24/7. Alt: 333€/Monat × 3, kein Setup." },
      { q: "Wir machen das über Instagram/TikTok", a: "Social zeigt dir Leute die dir schon folgen. Google zeigt dir Leute die aktiv suchen. 'Cannabis lounge Berlin' — das ist Kaufabsicht. Das ist Gold." },
    ],
    closeScript: "\"Ich lass euch das nicht heute entscheiden — schick ich euch den Demo-Link. Schaut ihn in Ruhe an. Wie kann ich euch am besten erreichen?\" → Instagram DM or WhatsApp. Send same day.",
  },
  {
    id: "cafe-kuchenliebe",
    name: "Café Kuchenliebe",
    niche: "Café",
    address: "Gleditschstraße 27, 10781 Berlin-Schöneberg",
    district: "Schöneberg",
    mapsUrl: "https://maps.google.com/?q=Café+Kuchenliebe+Schöneberg+Berlin",
    situation: "Has a website (cafe-kuchenliebe.de). No online reservations. Likely basic/outdated.",
    situationTag: "weak_site",
    googleRating: 5.0,
    googleReviews: 73,
    accentColor: "#9E7B3A",
    opener: "\"Ich hab eure Seite angeschaut — schöne Basis, aber ich glaub da ist noch viel Potenzial. Darf ich kurz zeigen was ich meine?\"",
    demoNote: "Demo built: Cormorant Garamond editorial, bento cake grid, croffles dark section, multilingual DE/EN/AR/TR, reservation form. Lead with the review strip — 73 × 5★ front and center.",
    painPoints: [
      { title: "No online reservation = lost bookings", pitch: "\"73 Bewertungen, alle fünf Sterne — aber wie reserviert jemand bei euch? Ihr verliert Anfragen immer dann, wenn ihr gerade beschäftigt seid oder die Küche in Vollbetrieb ist.\"" },
      { title: "Multicultural audience, German-only site", pitch: "Schöneberg is hugely international. They know it — they listed AR and TR locales. Say: \"Habt ihr eure Seite auch auf Englisch, Arabisch, Türkisch? Ich frag weil ich das direkt eingebaut hab.\"" },
      { title: "'Croffles Berlin' is a live search term", pitch: "Croffles are still trending. If they don't own the Google result for it, a competitor will. Say: \"Wisst ihr wie ihr für 'croffles berlin' rankt? Wer da oben steht, kriegt täglich neue Gäste — ohne Werbebudget.\"" },
    ],
    objections: [
      { q: "Wir haben schon eine Website", a: "Ich weiß — ich hab sie mir angeschaut. Sie ist da, das ist gut. Aber sie bringt euch keine neuen Gäste aktiv rein. Die hier ist darauf ausgelegt: Reservierungen, Mehrsprachigkeit, Google-Ranking. Eine Seite die arbeitet." },
      { q: "Wir kommen gut ohne", a: "73 Fünf-Sterne sind euer größtes Asset — aber momentan sieht man sie erst wenn man aktiv nach euch sucht. Ich würd sie auf die Startseite stellen, sofort im ersten Scroll. Dann überzeugt das jeden Neukunden in Sekunden." },
      { q: "Ich hab keine Zeit", a: "Machen Sie nicht. Ich bin euer Webmaster — Sie schicken mir ein neues Foto, ich update es. Der Retainer von 99€ bedeutet: kein Technikstress für Sie." },
      { q: "Was kostet das?", a: "1.000€ einmalig: Redesign, alle vier Sprachen, Reservierungsformular, Google-Optimierung. Dann 99€/Monat. Ein Neukunde pro Woche über die Seite hat das längst gerechnet." },
    ],
    closeScript: "\"Schaut euch die Demo heute noch kurz an — und wenn ihr Fragen habt, treffen wir uns 20 Minuten. Kein Pitch, nur zeigen was ich machen würde.\" → Get email or WhatsApp. Send demo within the hour.",
  },
  {
    id: "der-nagelmann",
    name: "Der Nagelmann",
    niche: "Nagelstudio",
    address: "Joachim-Friedrichstraße 30, 10711 Berlin-Charlottenburg",
    district: "Charlottenburg",
    mapsUrl: "https://maps.google.com/?q=Der+Nagelmann+Charlottenburg+Berlin",
    situation: "Has a website (dernagelmann.de). Walk-in model. No pricing visible. No gallery.",
    situationTag: "weak_site",
    googleRating: 4.9,
    googleReviews: 28,
    accentColor: "#D4617A",
    opener: "\"Ich hab euch über Google gefunden — ich wollte kurz fragen: wie kommen bei euch neue Kunden rein? Instagram, Google, Laufkundschaft?\"",
    demoNote: "Demo built: pink accent, clean service cards, pricing section, gallery grid. Highlight the pricing page first — that's the gap they feel most.",
    painPoints: [
      { title: "'Kein Termin nötig' — but online visitors can't spontaneously walk in", pitch: "Their whole model is walk-in. But someone at 9pm on their phone can't come in right now — they want to see prices, photos, location. If that's not there, they're gone. Say: \"Die Leute die um 21 Uhr auf eure Seite gehen, können nicht sofort kommen. Wenn die da nichts finden, buchen sie woanders.\"" },
      { title: "No pricing = lost conversions", pitch: "People Google 'Gel Nägel Charlottenburg Preis' before deciding. If prices aren't there, they bounce to a competitor. Say: \"Wenn jemand googlet 'Gel Nägel Charlottenburg Preis' — findet er eure Preise? Weil wenn nicht, geht er zur nächsten Seite und bucht dort.\"" },
      { title: "No gallery = no proof", pitch: "Gel, Acryl, Ombré, Babyboomer — that's the product. If it's not visually on the site in a gallery, visitors don't believe it. Say: \"Das ist euer Aushängeschild — das muss man als große, schöne Galerie sehen. Das ist der Unterschied zwischen 'naja' und 'da geh ich hin.'\"" },
    ],
    objections: [
      { q: "Wir haben schon eine Website", a: "Ich weiß — ich hab sie mir angeschaut. Aber sie bringt keine neuen Kunden aktiv rein. Preise sofort sichtbar, Galerie die überzeugt, Google-Optimierung — das ist der Unterschied zwischen einer Seite die existiert und einer die arbeitet." },
      { q: "Wir brauchen keine Terminbuchung — wir sind Walk-in", a: "Absolut, das ändere ich nicht. Kein Terminsystem. Aber ein klares 'Einfach vorbeikommen' mit Öffnungszeiten, Preisen und Karte — das konvertiert Besucher in echte Walk-ins. Die kommen dann wirklich." },
      { q: "Was kostet das?", a: "1.000€ einmalig, dann 99€/Monat. Eine Neukundin pro Woche über die Seite — das hat sich in einem Monat gerechnet. Und wenn nicht zufrieden: monatlich kündbar." },
      { q: "Wir kommen gut über Instagram / Laufkundschaft", a: "Das ist ein stabiles Fundament. Aber Instagram wächst nicht passiv — Google-Traffic wächst über Zeit, wenn die Seite gut ist. Das ist ein dritter Kanal den ihr gerade gar nicht habt." },
    ],
    closeScript: "\"Ich würde euch den Demo-Link schicken — schaut ihn in Ruhe an. Wenn's interessant klingt, meldet euch einfach. Wie kann ich euch am besten erreichen?\" → WhatsApp or Instagram. Send same day.",
  },
];

export const TARGETS: Target[] = [...SPECIAL_TARGETS, ...BARBERSHOPS];

export const NICHES = ["All", ...Array.from(new Set(TARGETS.map((t) => t.niche))).sort()];
