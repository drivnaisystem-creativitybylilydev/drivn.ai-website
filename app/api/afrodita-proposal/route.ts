import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic()

export async function POST(req: NextRequest) {
  const { packages, client } = await req.json()

  const packageList = packages
    .map((p: { name: string; duration: string; description: string }) =>
      `- ${p.name} (${p.duration})`
    )
    .join('\n')

  const tone = client.tone === 'formal' ? 'Sie/Ihr (formell)' : 'Du/Dein (informell)'
  const greeting = client.tone === 'formal'
    ? `Sehr geehrte/r ${client.firstName} ${client.lastName}`
    : `Liebe/r ${client.firstName}`

  const dateStr = client.callDate
    ? new Date(client.callDate).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'unserem Gespräch'

  const lang = client.language === 'de' ? 'Deutsch' : 'English'

  const prompt = `Du bist Afrodita Panovska — internationale Executive & Career Coach, ICF ACC zertifiziert, MBA. Du hast über 25 Jahre Erfahrung in führenden HR-Positionen (u.a. CHRO bei Teleperformance, 5.000+ Mitarbeiter in 7 Ländern). Du kennst beide Seiten des Tisches: als jemand, der täglich Einstellungsentscheidungen trifft, und als Coach. Deine Klienten sind Fach- und Führungskräfte, die Klarheit, Selbstvertrauen und Kompetenz für ihre nächste Karrierestufe entwickeln wollen.

Schreibe ein professionelles, persönliches Coaching-Angebot auf ${lang}.

KUNDENDATEN:
- Name: ${client.firstName} ${client.lastName}
- Rolle: ${client.role || 'nicht angegeben'}
- Unternehmen/Branche: ${client.company || 'nicht angegeben'}
- Discovery Call: ${dateStr}
- Ziel: ${client.goal}
- Gesprächsnotizen: ${client.notes || 'keine weiteren Notizen'}

AUSGEWÄHLTE PAKETE:
${packageList}

ANREDE: ${tone}

STRUKTUR (halte dich genau daran):

${greeting},

[Eröffnung — 2-3 Sätze: Bedanke Dich für das Gespräch, zeige dass Du wirklich zugehört hast, fasse in einem Satz zusammen wo ${client.firstName} steht und wohin ${client.tone === 'formal' ? 'Sie möchten' : 'Du möchtest'}.]

MEIN VERSTÄNDNIS IHRER SITUATION
[3-4 Sätze: Spiegele zurück was Du im Gespräch gehört hast — die konkrete Herausforderung, den Kontext, was ${client.tone === 'formal' ? 'Sie' : 'Dich'} bewegt. Konkret und personalisiert, nicht generisch.]

MEIN ANSATZ FÜR ${client.firstName.toUpperCase()}
[3-4 Sätze: Erkläre wie Du speziell mit dieser Person arbeiten würdest, basierend auf Deiner HR-Expertise und dem Gespräch. Was Du einbringst das andere Coaches nicht haben: Du siehst den Bewerbungsprozess von beiden Seiten.]

DAS VORGESCHLAGENE PAKET
[Beschreibe die ausgewählten Pakete mit dem konkreten Mehrwert für genau diese Person. Was ändert sich für ${client.firstName}? Was ist nach dem Coaching anders?]

INVESTITION
[Investition: wird individuell besprochen — bitte nehmen Sie Kontakt auf.]

NÄCHSTE SCHRITTE
1. [Konkrete Handlungsempfehlung]
2. Terminvereinbarung: calendly.com/afrodita-panovska/discovery-call
3. [Dritter Schritt oder Start des Prozesses]

[Persönlicher Abschluss — 1-2 Sätze, warm und zuversichtlich.]

Mit herzlichen Grüßen,

Afrodita Panovska
Executive & Career Coach
ACC | ICF | MBA
📧 info@afrodita-panovska.com
🌐 afrodita-panovska.com
📱 +49 172 2185779

Ton: Warm, professionell, direkt. Jeder Satz zeigt dass Du diese Person kennst. Keine Floskeln. Kurze, präzise Sätze. ${client.tone === 'formal' ? 'Durchgehend formelles Sie.' : 'Durchgehend informelles Du.'} Kein Markdown-Formatierung — plain text.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    })

    const proposal = message.content[0].type === 'text' ? message.content[0].text : ''
    return NextResponse.json({ proposal })
  } catch (error) {
    console.error('Proposal generation error:', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
