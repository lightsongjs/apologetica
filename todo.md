# Gospel Content Pipeline

## Instructions

**CRITICAL WORKFLOW:**
1. Create ONE card at a time (either personality or place)
2. Run the validation test immediately after creating each card:
   ```bash
   npx playwright test tests/personality-cross-references.spec.ts
   ```
3. Fix any errors before proceeding to the next card
4. Mark the item as complete in this file with `[x]`
5. Commit and push after each successful card creation
6. Repeat for the next item

**Notes:**
- Items already marked `[x]` have existing cards in the codebase
- Some trivial items have been removed (e.g., "Road to Emmaus" when Emmaus town exists)
- Follow CLAUDE.md theological guidelines (Eastern Orthodox perspective only)
- Skip image creation (use placeholder paths)

---

## 1. Personalities

### Core Figures
- [x] Iisus Hristos (Jesus Christ)
- [x] Maria (Virgin Mary, mother of Jesus)
- [x] Iosif (Joseph, husband of Mary)

### The Twelve Apostles
- [x] Petru / Simon Petru (Peter/Simon Peter)
- [x] Andrei (Andrew)
- [x] Iacov fiul lui Zebedei (James son of Zebedee)
- [x] Ioan fiul lui Zebedei (John son of Zebedee)
- [x] Filip (Philip)
- [x] Bartolomeu / Natanael (Bartholomew/Nathanael)
- [x] Matei (Matthew/Levi)
- [x] Toma (Thomas)
- [x] Iacov fiul lui Alfeu (James son of Alphaeus)
- [x] Iuda Tadeu (Jude/Thaddaeus)
- [x] Simon Zilotul (Simon the Zealot)
- [x] Iuda Iscarioteanul (Judas Iscariot)

### Family of Jesus
- [x] Elisabeta (Elizabeth, mother of John the Baptist)
- [x] Zaharia (Zechariah, father of John the Baptist)
- [x] Ioan Botezătorul (John the Baptist)
- [x] Iacov (James, brother of Jesus)
- [x] Iose (Joses, brother of Jesus)
- [x] Iuda (Jude, brother of Jesus)
- [x] Simon (Simon, brother of Jesus)

### Women Followers
- [x] Maria Magdalena (Mary Magdalene)
- [x] Maria mama lui Iacov și Iose (Mary mother of James and Joses)
- [x] Salomeea (Salome)
- [x] Ioana (Joanna)
- [x] Suzana (Susanna)
- [x] Marta (Martha of Bethany)
- [x] Maria din Betania (Mary of Bethany)
- [x] Samarineanca (Samaritan Woman at the well)

### Jewish Religious Leaders
- [x] Caiafa (Caiaphas, high priest)
- [x] Ana (Annas, former high priest)
- [x] Nicodim (Nicodemus, Pharisee)
- [x] Iosif din Arimateea (Joseph of Arimathea)
- [x] Gamaliel (Gamaliel)
- [x] Simeon (Simeon in the Temple)
- [x] Ana profetisa (Anna the prophetess)

### Roman Officials
- [x] Pilat din Pont (Pontius Pilate)
- [x] Irod Antipa (Herod Antipas)
- [x] Irod cel Mare (Herod the Great)
- [x] Irodiada (Herodias)
- [x] Irodul Filip (Herod Philip)
- [x] Arhelau (Archelaus)
- [x] Centurionul de la Capernaum (Centurion at Capernaum)
- [x] Centurionul de la cruce (Centurion at the cross)

### People Jesus Healed/Encountered
- [x] Lazăr din Betania (Lazarus of Bethany)
- [x] Bartimeu (Bartimaeus, blind beggar)
- [x] Zaheu (Zacchaeus)
- [x] Femeia cu scurgere de sânge (Woman with hemorrhage)
- [x] Femeia cananeeancă (Canaanite woman)
- [x] Văduvă din Nain (Widow of Nain)
- [x] Leprosul samaritean (Samaritan leper)
- [x] Slăbănogul de la Betezda (Paralytic at Bethesda)
- [x] Orbul de la naștere (Man born blind)

### Old Testament Figures Mentioned
- [x] Avraam (Abraham)
- [x] Isaac (Isaac)
- [x] Iacov patriarhul (Jacob)
- [x] Moise (Moses)
- [x] Ilie (Elijah)
- [x] Elisei (Elisha)
- [x] David (David)
- [x] Solomon (Solomon)
- [x] Isaia (Isaiah)
- [x] Ieremia (Jeremiah)
- [x] Daniel (Daniel)
- [x] Iona (Jonah)
- [x] Abel (Abel)
- [x] Noe (Noah)

### Other Named Figures
- [x] Barabas (Barabbas)
- [x] Simeon Leproso (Simon the Leper)
- [x] Simon Fariseu (Simon the Pharisee)
- [x] Cleopa (Cleopas, road to Emmaus)
- [x] Malh (Malchus, servant whose ear was cut)
- [x] Magii (The Magi/Wise Men)

---

## 2. Places

### Major Cities & Towns
- [x] Ierusalim (Jerusalem)
- [x] Betleem (Bethlehem)
- [x] Nazaret (Nazareth)
- [x] Capernaum (Capernaum)
- [x] Betania (Bethany)
- [x] Betfaghe (Bethphage)
- [x] Betsaida (Bethsaida)
- [x] Corazin (Chorazin)
- [ ] Nain (Nain)
- [x] Cana din Galileea (Cana of Galilee)
- [ ] Arimateea (Arimathea)
- [ ] Efraim (Ephraim)
- [ ] Sihar (Sychar)

### Regions
- [ ] Galileea (Galilee)
- [ ] Iudeea (Judea)
- [ ] Samaria (Samaria)
- [ ] Pereea (Perea)
- [ ] Decapolis (Decapolis)
- [ ] Fenicia (Phoenicia)
- [ ] Idumea (Idumea)

### Geographic Features
- [x] Marea Galileii (Sea of Galilee)
- [x] Muntele Tabor (Mount Tabor)
- [x] Muntele Măslinilor (Mount of Olives)
- [x] Râul Iordan (Jordan River)
- [ ] Muntele Ispitei (Mount of Temptation/Wilderness)
- [ ] Marea Moartă (Dead Sea)

### Locations in/near Jerusalem
- [x] Golgota (Golgotha)
- [x] Ghetsimani (Gethsemane)
- [x] Templul (The Temple)
- [ ] Curtea Neamurilor (Court of the Gentiles - trivial, covered by Templul)
- [ ] Betezda (Pool of Bethesda)
- [ ] Siloam (Pool of Siloam)
- [ ] Calea Suferințelor (Via Dolorosa - trivial, covered by Golgota/Ierusalim)
- [ ] Cămara de Sus (Upper Room/Cenacle)
- [ ] Grădina lui Iosif (Joseph's Garden/Tomb - trivial, covered by Golgota)
- [ ] Mormântul Gol (Empty Tomb - trivial, covered by Golgota)

### Foreign/Gentile Territories
- [ ] Tir (Tyre)
- [ ] Sidon (Sidon)
- [ ] Cezareea Filippi (Caesarea Philippi)
- [ ] Gadara (Gadara)
- [ ] Gerasa (Gerasa)
- [ ] Egipt (Egypt)

### Roads & Paths
- [ ] Emaus (Emmaus)

### Other Specific Locations
(These have been moved to "Locations in/near Jerusalem" section above to avoid duplication)
