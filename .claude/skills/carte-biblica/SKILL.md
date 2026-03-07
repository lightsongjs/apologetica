---
name: carte-biblica
description: Generează pagini complete pentru cărți biblice în perspectivă ortodoxă
version: 1.0.0
---

# Biblical Book Generator (Orthodox Perspective)

Acest skill generează pagini complete pentru cărți ale Bibliei din perspectivă EXCLUSIV ortodoxă.

## Usage

```
/carte-biblica [nume-carte]
```

**Exemple:**
- `/carte-biblica Ieșirea`
- `/carte-biblica Leviticul`
- `/carte-biblica Evanghelia după Matei`

## Instructions

Când utilizatorul invocă acest skill:

1. **Identifică cartea biblică** menționată
2. **Generează fișierul** în `src/content/teme/[slug].md` cu slug-ul corect (ex: `cartea-iesirea.md`, `evanghelia-matei.md`)
3. **Populează cu conținut teologic ortodox** complet și detaliat

## Template Structure

Fișierul generat TREBUIE să urmeze EXACT această structură:

```markdown
---
title: "[Nume complet carte] ([Nume alternativ])"
summary: "O descriere scurtă (1-2 propoziții) care prezintă esența cărții"
type: "carte-biblica"
category: "apologetica"
tags: ["tag1", "tag2", "tag3"]
related: ["slug-tema-1", "slug-tema-2"]
completeness: "complete"
last_updated: "YYYY-MM-DD"
---

## Prezentare generală

**[Nume carte]** (în ebraică/greacă: transliterație, traducere) este [descriere poziție în canon, context istoric].

Cartea răspunde la întrebări fundamentale: [2-3 întrebări teologice cheie]

## Autor și context

**Autor:** [[personalitati/slug|Nume]] (tradiția unanimă/predominantă)

**Perioadă de scriere:** Secol/An

**Scop:** [De ce a fost scrisă cartea, contextul istoric, destinatarii]

## Structură

[Nume carte] se împarte în [număr] secțiuni majore:

### Partea I: [Titlu] (capitolele X-Y)

[Descriere scurtă]

| Capitol | Eveniment |
|---------|-----------|
| **X-Y** | [Eveniment major] |
| **Z** | [Alt eveniment] |

### Partea II: [Titlu] (capitolele A-B)

[Descriere scurtă]

| Capitol | [Coloană relevantă] | Evenimente cheie |
|---------|----------|------------------|
| **A-B** | [Info] | [Detalii] |

## Personaje principale

### [Categorie de personaje]

- **[[personalitati/slug|Nume]]** - rol, descriere
- **[[personalitati/slug|Nume]]** - rol, descriere

### [Altă categorie]

- **[[personalitati/slug|Nume]]** - rol, descriere

## Cronologie

IMPORTANT: Această secțiune folosește ### pentru titluri (pentru stilul timeline vertical)

### [Eveniment 1] ([Referință biblică], [Data aproximativă])

[Descriere detaliată a evenimentului. Include context istoric, semnificație teologică, tipologie dacă este cazul.]

### [Eveniment 2] ([Referință biblică], [Data aproximativă])

[Descriere detaliată...]

[Continuă cu 8-12 evenimente cheie din carte]

## Teme teologice

IMPORTANT: Folosește BULLET POINTS (nu ### subsecțiuni)

- **[Temă 1]** - [Explicație detaliată a temei teologice, cu referințe biblice și aplicare ortodoxă]

- **[Temă 2]** - [Explicație...]

- **[Temă 3]** - [Explicație...]

[5-6 teme teologice majore]

## Versete cheie

**[Referință]** — „[Text verset]"

**[Referință]** — „[Text verset]" — **[Eticheta specială dacă e cazul]**

[6-10 versete cheie]

## Tipologie și profeții mesianice

[Paragraf introductiv despre tipologia din această carte]

| Tip în [Carte] | Împlinire în Hristos |
|----------------|----------------------|
| **[Persoană/eveniment]** ([ref]) | [Cum prefigurează pe Hristos] |
| **[Persoană/eveniment]** ([ref]) | [Cum prefigurează pe Hristos] |

[5-8 tipuri mesianice]

## Importanță în teologia ortodoxă

IMPORTANT: Folosește BULLET POINTS (nu ### subsecțiuni)

- **[Aspect teologic 1]** - [Explicație detaliată despre cum această carte fundamentează doctrina ortodoxă. Include citate patristice sau liturgice dacă sunt relevante.]

- **[Aspect teologic 2]** - [Explicație...]

- **[Aspect teologic 3]** - [Explicație...]

[4-6 aspecte teologice]

## Lecturi liturgice

[Cartea] este citită [context liturgic]:

- **[Referință]** - citire la [sărbătoare/moment liturgic]
- **[Referință]** - citire la [sărbătoare/moment liturgic]

[3-6 lecturi liturgice]

## Sfinți Părinți și [Nume carte]

IMPORTANT: Folosește BULLET POINTS pentru Părinți

- **[Sfânt Părinte]** - *[Titlu lucrare]*

- **[Sfânt Părinte]** - *[Titlu lucrare]*

- **[Sfânt Părinte]** - *[Titlu lucrare]*

[Paragraf final despre abordarea patristica - literală și tipologică]

## Vezi și

- [[teme/slug|Titlu temă]]
- [[teme/slug|Titlu temă]]
- [[personalitati/slug|Nume personalitate]]
```

## Content Guidelines

### 1. Perspectivă EXCLUSIV Ortodoxă

- **Surse:** Părinții Bisericii, Septuaginta, tradiția liturgică ortodoxă
- **Canon:** Folosește canonul ortodox (cu cărțile deuterocanice pentru VT)
- **Interpretare:** Literală ȘI tipologică (nu alegoric la modul Protestant)
- **Nu folosi:** Hermeneutică protestantă, sola scriptura, dispensaționalism

### 2. Stilul Timeline pentru Cronologie

Secțiunea Cronologie TREBUIE să folosească `###` pentru titluri (nu bullet points) pentru ca template-ul să poată aplica stilul vertical timeline cu bulină.

### 3. Bullet Points pentru Teme și Importanță

Secțiunile "Teme teologice", "Importanță în teologia ortodoxă", și "Sfinți Părinți" TREBUIE să folosească bullet points cu titlul bold urmat de liniuță:

```markdown
- **Titlu bold** - Explicație text normal
```

### 4. Wiki-links

Folosește wiki-links pentru:
- **Personalități:** `[[personalitati/slug|Nume]]`
- **Teme:** `[[teme/slug|Titlu]]`
- **Locuri:** `[[locuri/slug|Nume]]`

VERIFICĂ că slug-urile există! Pentru personalități noi, folosește sluguri logice (ex: `moise`, `iosua`, `david`).

### 5. Tags

Alege tag-uri relevante:
- Pentru Vechiul Testament: `["vechiul-testament", "pentateuh/profeti/istoric/sapiential", "specific-carte"]`
- Pentru Noul Testament: `["noul-testament", "evanghelii/epistole/apocalipsa", "specific"]`

Exemple:
- Pentateuh: `["vechiul-testament", "pentateuh", "moise", "legea"]`
- Profeți: `["vechiul-testament", "profeti", "profeții-mesianice"]`
- Evanghelii: `["noul-testament", "evanghelii", "viata-lui-hristos"]`

### 6. Slug-uri

**Vechiul Testament:**
- Cărți: `cartea-[nume]` (ex: `cartea-iesirea`, `cartea-leviticul`)
- Excepții: `psalmi`, `proverbe`, `cartea-intelepciunii-lui-solomon`

**Noul Testament:**
- Evanghelii: `evanghelia-[autor]` (ex: `evanghelia-matei`, `evanghelia-ioan`)
- Epistole: `epistola-[destinatar]` (ex: `epistola-romani`, `epistola-efeseni`, `prima-epistola-corinteni`)
- Excepții: `faptele-apostolilor`, `apocalipsa`

### 7. Related Content

În `related:`, include:
- Cărți biblice conexe (ex: Facerea → Ieșirea)
- Teme teologice majore (ex: `profetiile-mesianice`, `sfanta-treime`)
- Personalități cheie (doar cele cu fișier existent)

### 8. Calitatea Conținutului

- **Detaliat:** Fiecare secțiune trebuie să fie substanțială (nu stub-uri)
- **Teologic solid:** Bazat pe Părinți și tradiție, nu speculație
- **Citate exacte:** Versete din Biblie cu referințe precise
- **Tipologie bogată:** Pentru VT, arată cum prefigurează pe Hristos
- **Context liturgic:** Include unde/când se citește în slujbe

### 9. Date și Cronologie

Folosește datele tradiționale ortodoxe:
- **Facerea:** ~1450 î.Hr. (scriere de Moise)
- **Ieșirea:** 1446 î.Hr. (evenimente), ~1410 î.Hr. (scriere)
- **Evanghelii:** Matei (~50-60 d.Hr.), Marcu (~60-65), Luca (~60-62), Ioan (~90-100)

### 10. Structura Tabelelor

**Pentru structură:**
```markdown
| Capitol | Secțiune | Descriere |
```

**Pentru tipologie:**
```markdown
| Tip în [Carte] | Împlinire în Hristos |
```

Folosește tabele pentru claritate vizuală.

## Examples

### Example 1: Cartea Ieșirea

```
/carte-biblica Ieșirea
```

Generează `src/content/teme/cartea-iesirea.md` cu:
- Title: "Cartea Ieșirea (Exod)"
- Summary: "A doua carte a Pentateuhului - eliberarea poporului Israel din Egipt și darea Legii pe Sinai"
- Tags: `["vechiul-testament", "pentateuh", "moise", "legea", "pascale"]`
- Cronologie: Chemarea lui Moise, cele 10 plăgi, Paștile, traversarea Mării Roșii, darea Legii, chivotul, cortul întâlnirii
- Tipologie: Moise = Hristos, Paștile = jertfa lui Hristos, Marea Roșie = botezul, mana = Euharistia

### Example 2: Evanghelia după Matei

```
/carte-biblica Evanghelia după Matei
```

Generează `src/content/teme/evanghelia-matei.md` cu:
- Title: "Evanghelia după Matei"
- Summary: "Prima Evanghelie, scrisă pentru iudei, prezintă pe Iisus ca Mesia promis și Împăratul"
- Tags: `["noul-testament", "evanghelii", "viata-lui-hristos", "mesianisme"]`
- Structură: Nașterea și copilăria (1-2), Botezul și ispitele (3-4), Predici și minuni (5-25), Patima și Învierea (26-28)
- Focus: Împlinirea profețiilor VT, Predica de pe Munte, parabole, Hristos ca Împărat al lui Israel

## Validation

După generare:

1. **Verifică slug-urile wiki-links** - TOATE trebuie să fie valide
2. **Rulează validarea:** `npm run validate-content`
3. **Testează pagina:** `http://localhost:4324/teme/[slug]`
4. **Verifică stilul timeline** - secțiunea Cronologie trebuie să aibă bulină verticală
5. **Verifică bullet points** - Teme teologice și Importanță trebuie să aibă bullet points

## Output

La final, afișează utilizatorului:

```
✅ Generat: src/content/teme/[slug].md
📖 Carte: [Nume complet]
📊 Secțiuni: 11/11 complete
🔗 Wiki-links: [număr] (verifică să fie valide!)
🌐 URL: http://localhost:4324/teme/[slug]

Recomandări:
- Verifică wiki-links pentru personalități noi
- Rulează: npm run validate-content
- Revizuiește tipologia și citatele patristice
```

## Notes

- **Canon ortodox VT:** 49 cărți (39 protocanonice + 10 deuterocanice)
- **Canon NT:** 27 cărți (4 Evanghelii, Fapte, 21 Epistole, Apocalipsa)
- **Prioritate:** Pentateuh → Profeți Majori → Evanghelii → Epistole Pauline → restul
- **Limba:** Română pentru conținut, transliterații pentru ebraică/greacă
- **Respectă:** Tradiția Septuagintei pentru VT, textul grec pentru NT
