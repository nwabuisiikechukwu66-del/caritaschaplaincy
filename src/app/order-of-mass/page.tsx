"use client";
import { useState } from "react";

const tabs = [
  { id: "novus-english", label: "Novus Ordo (English)" },
  { id: "novus-latin", label: "Novus Ordo (Latin)" },
  { id: "tridentine", label: "Tridentine Mass" },
];

const novusOrdo = [
  { part: "Introductory Rites", items: [
    { en: "Entrance Procession & Song", la: "Cantus ad Introitum" },
    { en: "Sign of the Cross: In the name of the Father, and of the Son, and of the Holy Spirit. Amen.", la: "In nómine Patris et Fílii et Spíritus Sancti. Amen." },
    { en: "Greeting: The Lord be with you. And with your spirit.", la: "Dóminus vobíscum. Et cum spíritu tuo." },
    { en: "Penitential Rite — Confiteor: I confess to almighty God and to you, my brothers and sisters, that I have greatly sinned...", la: "Confíteor Deo omnipoténti et vobis, fratres, quia peccávi nimis..." },
    { en: "Kyrie: Lord, have mercy. Christ, have mercy. Lord, have mercy.", la: "Kýrie, eléison. Christe, eléison. Kýrie, eléison." },
    { en: "Gloria (Sundays & Feasts): Glory to God in the highest, and on earth peace to people of good will...", la: "Glória in excélsis Deo et in terra pax homínibus bonæ voluntátis..." },
    { en: "Collect (Opening Prayer)", la: "Collecta" },
  ]},
  { part: "Liturgy of the Word", items: [
    { en: "First Reading — Thanks be to God", la: "Lectio Prima — Deo gratias" },
    { en: "Responsorial Psalm", la: "Psalmus Responsorius" },
    { en: "Second Reading (Sundays/Solemnities) — Thanks be to God", la: "Lectio Secunda — Deo gratias" },
    { en: "Gospel Acclamation — Alleluia (or Praise to you, Lord Jesus Christ)", la: "Acclamatio ante Evangelium — Allelúia" },
    { en: "Gospel — The Gospel of the Lord. Praise to you, Lord Jesus Christ.", la: "Evangelium Dómini. Laus tibi, Christe." },
    { en: "Homily", la: "Homilia" },
    { en: "Creed (Nicene): I believe in one God, the Father almighty...", la: "Credo in unum Deum, Patrem omnipoténtem..." },
    { en: "Prayer of the Faithful (Universal Prayer)", la: "Oratio Universalis" },
  ]},
  { part: "Liturgy of the Eucharist", items: [
    { en: "Presentation of Gifts (Offertory)", la: "Præparatio Donorum" },
    { en: "Prayer over the Offerings", la: "Oratio super Oblata" },
    { en: "Eucharistic Prayer — Preface & Sanctus: Holy, Holy, Holy Lord God of hosts...", la: "Sanctus, Sanctus, Sanctus Dóminus Deus Sábaoth..." },
    { en: "Words of Institution: This is my Body... This is the chalice of my Blood...", la: "Hoc est enim Corpus meum... Hic est enim calix Sánguinis mei..." },
    { en: "Mystery of Faith: We proclaim your Death, O Lord, and profess your Resurrection...", la: "Mortem tuam annuntiámus, Dómine, et tuam resurrectiónem confitémur..." },
    { en: "Doxology & Great Amen: Through him, and with him, and in him... Amen.", la: "Per ipsum, et cum ipso, et in ipso... Amen." },
  ]},
  { part: "Communion Rite", items: [
    { en: "Lord's Prayer: Our Father, who art in heaven...", la: "Pater noster, qui es in cælis..." },
    { en: "Sign of Peace: The peace of the Lord be with you always. And with your spirit.", la: "Pax Dómini sit semper vobíscum. Et cum spíritu tuo." },
    { en: "Agnus Dei: Lamb of God, you take away the sins of the world, have mercy on us... grant us peace.", la: "Agnus Dei, qui tollis peccáta mundi, miserére nobis... dona nobis pacem." },
    { en: "Communion: Behold the Lamb of God... Lord, I am not worthy that you should enter under my roof...", la: "Ecce Agnus Dei... Dómine, non sum dignus, ut intres sub tectum meum..." },
    { en: "Prayer after Communion", la: "Oratio post Communionem" },
  ]},
  { part: "Concluding Rites", items: [
    { en: "Final Blessing: May almighty God bless you, the Father, and the Son, and the Holy Spirit. Amen.", la: "Benedícat vos omnípotens Deus, Pater, et Fílius, et Spíritus Sanctus. Amen." },
    { en: "Dismissal: Go forth, the Mass is ended. Thanks be to God.", la: "Ite, missa est. Deo grátias." },
  ]},
];

export default function OrderOfMassPage() {
  const [activeTab, setActiveTab] = useState("novus-english");
  const [openPart, setOpenPart] = useState<string | null>("Introductory Rites");

  return (
    <div className="pt-20">
      <section className="red-section sacred-bg py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-caritas-gold/60" />
            <span className="font-cinzel text-caritas-gold text-xs tracking-widest">Lex Orandi, Lex Credendi</span>
            <div className="w-12 h-px bg-caritas-gold/60" />
          </div>
          <h1 className="font-cinzel text-white text-5xl font-bold mb-4">Order of Mass</h1>
          <p className="font-garamond text-white/70 text-xl italic">The sacred liturgy of the Roman Rite — in English and Latin</p>
        </div>
      </section>

      <section className="py-12 bg-caritas-cream">
        <div className="max-w-3xl mx-auto px-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`font-cinzel text-xs px-5 py-2.5 rounded-sm tracking-wider transition-colors ${activeTab === tab.id ? "bg-caritas-red text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-caritas-red hover:text-caritas-red"}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {(activeTab === "novus-english" || activeTab === "novus-latin") && (
            <div className="space-y-4">
              {novusOrdo.map(section => (
                <div key={section.part} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <button onClick={() => setOpenPart(openPart === section.part ? null : section.part)}
                    className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-caritas-dark to-caritas-maroon text-white">
                    <h3 className="font-cinzel font-bold text-sm tracking-wider">{section.part}</h3>
                    <span>{openPart === section.part ? "−" : "+"}</span>
                  </button>
                  {openPart === section.part && (
                    <div className="p-6 space-y-4">
                      {section.items.map((item, i) => (
                        <div key={i} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                          <p className="font-garamond text-caritas-dark text-lg leading-relaxed">
                            {activeTab === "novus-latin" ? item.la : item.en}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "tridentine" && (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-caritas-gold/20 border border-caritas-gold/40 flex items-center justify-center mx-auto mb-6">
                <span className="font-cinzel text-caritas-gold text-2xl">✝</span>
              </div>
              <h3 className="font-cinzel text-caritas-dark text-2xl font-bold mb-4">Extraordinary Form (Tridentine)</h3>
              <div className="scripture pl-6 py-4 mb-6 text-left">
                <p className="font-playfair text-caritas-dark text-lg italic">
                  "The Tridentine Mass, codified by Pope St. Pius V in 1570, is offered entirely in Latin with the priest facing ad orientem — toward God and the East."
                </p>
              </div>
              <p className="font-garamond text-gray-600 leading-relaxed mb-6">
                The Extraordinary Form consists of: Prayers at the Foot of the Altar, Introit, Kyrie, Gloria, Collect, Epistle, Gradual, Gospel, Credo, Offertory, Lavabo, Secret, Preface, Sanctus, Canon of the Mass, Lord's Prayer, Agnus Dei, Communion, Post-Communion, Last Gospel (John 1:1-14).
              </p>
              <p className="font-garamond text-gray-400 text-sm italic">Full Tridentine text available upon request from the chaplain.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
