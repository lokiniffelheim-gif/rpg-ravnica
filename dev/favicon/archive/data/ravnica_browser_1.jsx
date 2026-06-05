import { useState, useMemo, useEffect, useCallback } from "react";

const HANDOUTS = [
  {"nom":"Notas de Laboratorio","propietari":"Manjatan","visible":"Manjatan","contingut":"Fajo desordenado de notas de laboratorio encontradas en la Cámara de Crecimiento Simic. Están principalmente redactadas en Vedalken y Tritón, aunque contiene notas en caracteres extraños escritos apresuradamente de forma enajenada y caótica que no reconoces. Su contenido revela que recientes acontecimientos han permitido realizar grandes avances en el campo de la gestión, control y regeneración de tejidos exánimes mediante la infusión de mana azul en metales no disponibles hasta la fecha. Tras aplicar Comprensión idiomática: los caracteres extraños siguen sin ser reconocibles, pero parece que el metal azul tiene propiedades nigromanticas."},
  {"nom":"Informe para el Juez de Manjatan","propietari":"Compartit","visible":"Ezzio Salvatore, Manjatan, Marchena","contingut":"Fajo desordenado de notas de laboratorio encontradas en la Cámara de Crecimiento Simic. Están principalmente redactadas en Vedalken y Tritón. Su contenido revela que recientes acontecimientos han permitido realizar grandes avances en el campo de la gestión, control y regeneración de tejidos exánimes."},
  {"nom":"Espada de la Venganza","propietari":"Wundyr Somo","visible":"Wundyr Somo","contingut":"Espada, poco común (requiere vinculación). Extraída de un esqueleto con cabeza animal. Obtienes +1 a tiradas de ataque y daño. Maldición: poseída por un espíritu vengativo. Mientras maldito, no puedes desprenderte de ella y tienes desventaja atacando con otras armas. CD 15 SAB cada vez que recibes daño en combate o debes atacar al agresor hasta que uno llegue a 0 PG. Conjurar Destierro sobre la espada libera al espíritu."},
  {"nom":"Gema de Resplandor","propietari":"Compartit","visible":"Tots","contingut":"Objeto maravilloso, Poco común. 50 cargas. 1ª palabra: luz brillante 30 pies (sin cargas). 2ª palabra: haz de luz, CD 15 CON o cegado 1 min (1 carga). 3ª palabra: destello en cono 30 pies (5 cargas). Al agotar las cargas, se convierte en joya no mágica de 50 gp."},
  {"nom":"Escudo Centinela","propietari":"Wundyr Somo","visible":"Wundyr Somo","contingut":"Armadura (escudo), poco común. Mientras estás equipado, tienes ventaja en las pruebas de iniciativa y percepción (Sabiduría). El escudo está adornado con un símbolo de un ojo."},
  {"nom":"Amuleto contra Detección y Localización","propietari":"Ezzio Salvatore","visible":"Ezzio Salvatore","contingut":"Objeto maravilloso, poco común (requiere vinculación). Protección ante la adivinación mágica. No puedes ser blanco de tal magia o percibido a través de métodos de escudriñamiento mágico."},
  {"nom":"Aparato de Mizzium","propietari":"Només DM","visible":"Només DM","contingut":"Objeto maravilloso, Poco común (requiere vinculación). Arnés de mizzium que actúa como foco arcano. Permite intentar lanzar hechizos no preparados de tu lista. Haz Inteligencia (Arcana) CD = 10 + 2× nivel del espacio. Con éxito, lanzas normalmente. Con fallo, lanzas un hechizo aleatorio de esa categoría."},
  {"nom":"Sombrero de disfraz","propietari":"Svikull Rusl","visible":"Svikull Rusl","contingut":"Objeto maravilloso, Poco común (requiere vinculación). Una acción para lanzar Alterar el propio aspecto a voluntad (solo modo Cambio de apariencia). El conjuro finaliza si te quitas el sombrero."},
  {"nom":"Perla de Poder","propietari":"Manjatan","visible":"Manjatan","contingut":"Objeto maravilloso, poco común (requiere vinculación con lanzador). Una acción: recupera un espacio de conjuro gastado de hasta nivel 3. Una vez utilizada, no puede usarse de nuevo hasta el próximo amanecer."},
  {"nom":"Cota de mallas Adamantina","propietari":"Marchena","visible":"Marchena","contingut":"Cota de mallas, Poco común. Reforzada con adamantina. Mientras la uses, cualquier golpe crítico contra ti se convierte en un golpe normal."},
  {"nom":"Baraja de Ilusiones","propietari":"Kasz","visible":"Kasz","contingut":"Objeto maravilloso, Poco común. 34 cartas de pergamino. Una acción: roba carta al azar y lánzala al suelo (30 pies). Aparece una criatura ilusoria real en apariencia pero sin daño. Cualquier interacción física la revela. INT (Investigación) CD 15 la hace translúcida."},
  {"nom":"Pergamino Mágico - Nube de Dagas","propietari":"Kasz","visible":"Kasz","contingut":"Nivel 2, conjuración. Lanzamiento: 1 acción. Alcance: 60 pies. Duración: Concentración hasta 1 minuto. Llenas el aire de dagas giratorias en un cubo de 5 pies creado en un punto a tu elección."},
  {"nom":"Guantelete de Fuerza de Ogro","propietari":"Yarog (HorseLuis)","visible":"Tots","contingut":"Objeto maravilloso, Poco común (requiere vinculación). Tu característica de Fuerza es 19 mientras lleves puestos estos guanteletes. No tienen efecto si tu Fuerza ya es 19 o más."},
  {"nom":"Par de Pistolas Ballesta Crueles","propietari":"Compartit","visible":"Tots","contingut":"2x Pistola Ballesta, raro. Cuando obtienes un 20 en tu tirada de ataque con esta arma mágica, el objetivo recibe 7 puntos de daño extra del mismo tipo."},
  {"nom":"Bolsa de Contención","propietari":"Compartit","visible":"Tots","contingut":"Objeto maravilloso, poco común. Capacidad: 500 lb / 64 pies cúbicos. Pesa 15 lb independientemente del contenido. Sacar un objeto requiere acción. Si se rompe, el contenido va al plano astral."},
  {"nom":"Deposito común en el Santísimo Banco Sindical Orzhov","propietari":"Compartit","visible":"Tots","contingut":"8650 cp (A) · 22950 cp (O) · 262 ep (A) · 557 gp (B).\nObjetos: Cáliz de cobre con filigrana de plata (25 gp) · 2x relicarios de oro con retrato pintado (25 gp) · Set de dados de hueso grabados (25 gp) · Pequeño espejo con marco de madera pintada (25 gp)."},
  {"nom":"3x Poción de Heroísmo (+3)","propietari":"Compartit","visible":"Tots","contingut":"Duración: 1 minuto. La criatura es inmune a ser asustada y gana PG temporales iguales al modificador de lanzamiento al inicio de cada uno de sus turnos."},
  {"nom":"Correo Misterioso","propietari":"Compartit","visible":"Ezzio Salvatore, Wundyr Somo","contingut":"\"He estado ausente durante muchas lunas, hubo contratiempos inesperados. Explica qué es lo que necesitas.\" — Firmado: Un aliado discreto.\n\n[12/XII/21] Necesito: (1) Un hermano goblin desaparecido en la Calle de Hojalata. (2) Cierto goblin ocasionando malestar entre gremios. (3) Grukurg fue engañado — se habla de \"el fantasma\". (4) Quiero saber del pasado de Pesha.\n\n[13/XII/21] Investigaré a Arkady, Pesha y el Goblin. El fantasma: poderoso y misterioso.\n\n[28/II/2022] No busques al goblin. Busca a su familia, retenida por miembros de mi orden o colaboradores de Tajic.\n\n[03/III/2022] Pronto el viento susurrará alguna otra pista."},
  {"nom":"Bandera Trofeo del Basilisco","propietari":"Compartit","visible":"Tots","contingut":"+1 a las tiradas de Persuasión."},
  {"nom":"Goblin Moñeco","propietari":"Compartit","visible":"Tots","contingut":"Objeto maravilloso, poco común. El espíritu de Kasz trascendió su cuerpo tras una desafortunada noche. Su cuerpo semi-momificado es adorado por sus seguidores. Proporciona ventaja en tiradas de Carisma si el Gremio del objetivo comparte al menos un color de maná con el del usuario, o desventaja si no comparte ninguno."}
];

const CHARS = [{"nom":"Ezzio Salvatore","bio":"Ezzio se crió en el orfanato Orzov, aprendió de jovencito a esconderse. Una vez adulto decidió pagar su deuda a la orden sirviendo para el gremio. Nunca le había gustado el hedonismo y la falsa moral de muchos miembros de la orden, sin embargo aún creía en la doctrina: \"sólo necesitan un buen guía\".","info":"Albert Camus contrata alarma · Cresh manda pastelitos a los gruul · Mimic en la bóveda · Cresh manda papeles iluminati","tags":["Orzhov","Dimir"],"controlledby":"Ezzio Salvatore","visible":"Tots","avatar":"https://s3.amazonaws.com/files.d20.io/images/127400758/HzQtetqtxICcl1lpMjIxjw/med.jpg?1587843436"},{"nom":"Wundyr Somo","bio":"Mi palabra es mi espada, mis hermanos son mi gremio y mi guia es mi señora Aurelia. Mediador hasta que observo algun acto malvado. Temperamental cuando no atienden a razones. Impartiré justicia vaya donde vaya.","info":"","tags":["Boros"],"controlledby":"Wundyr Somo","visible":"Tots","avatar":"https://s3.amazonaws.com/files.d20.io/images/127323363/4pCQ0r1OWaIiNq60_kyuKg/med.jpg?1587835305"},{"nom":"Yarog (HorseLuis)","bio":"","info":"","tags":["Gruul"],"controlledby":"Yarog (HorseLuis)","visible":"Tots","avatar":"https://s3.amazonaws.com/files.d20.io/images/127754962/l6mBha6VE1edth5mw9YpAg/med.jpg?1587908669"},{"nom":"Manjatan","bio":"","info":"","tags":["Izzet"],"controlledby":"Manjatan","visible":"Tots","avatar":"https://s3.amazonaws.com/files.d20.io/images/127416851/29ndmC1QD3EWKuQuLWAlYA/med.jpg?1587845240"},{"nom":"Svikull Rusl","bio":"","info":"","tags":["Golgari","Dimir"],"controlledby":"Svikull Rusl","visible":"Tots","avatar":"https://s3.amazonaws.com/files.d20.io/images/130785035/aM3cA0uhwDhc1bi5oPwyQg/med.jpg?1588537393"},{"nom":"Marchena","bio":"","info":"","tags":["Azorius"],"controlledby":"Marchena","visible":"Tots","avatar":"https://s3.amazonaws.com/files.d20.io/images/127690102/zUh54sl1TxUiU5Y1-lGPJw/med.jpg?1587894532"},{"nom":"Kasz","bio":"","info":"","tags":["Rakdos"],"controlledby":"Kasz","visible":"Tots","avatar":"https://s3.amazonaws.com/files.d20.io/images/127730251/LM6MK7XbCogQpcelULyLFw/med.jpg?1587903797"},{"nom":"El Vocero","bio":"El Vocero és un Homúnculo creat per magos Azorius per dur a terme tasques senzilles. Gritón i malhumerós, està lligat màgicament a l'Oficina Capella de la plaça principal del Aventino.","info":"Homunculus · Tiny construct, neutral · AC 13 · HP 5 (2d4) · Speed 20ft/fly 40ft · Telepathic Bond.","tags":["Azorius"],"controlledby":"DM","visible":"Tots","avatar":"https://s3.amazonaws.com/files.d20.io/images/134387587/69HvF5kPgZ2G_5NayjWJPg/med.jpg?1589459431"},{"nom":"Pesha la Tabernera","bio":"Pesha es la propietaria de El Cuerno de Oro, una minotaura con muy malas pulgas. Llegó al barrio con su tatuaje Rakdos en el brazo, algo de dinero y actitud a raudales, decidida a llevar su propia taberna y a no hablar de un pasado misterioso.","info":"Minotaur · Large monstrosity, chaotic evil · AC 14 · HP 76 · STR 18(+4) · Charge, Labyrinthine Recall, Reckless.","tags":["Rakdos"],"controlledby":"DM","visible":"Tots","avatar":"https://s3.amazonaws.com/files.d20.io/images/134908404/Bg0IuZ-7onyngUboYnx1DQ/med.jpg?1589583065"},{"nom":"Kotyali la Cazadora","bio":"Kotyali combina la apariencia salvaje de una cazadora centaura con el porte de una urbanita. Abierta y directa, su amable tono siempre encuentra el camino al corazón de quienes la escuchan.","info":"Centaur · Large monstrosity, neutral good · AC 12 · HP 45 · STR 18(+4) · Charge, Multiattack.","tags":["Guildless"],"controlledby":"DM","visible":"Ezzio Salvatore, Wundyr Somo, Yarog (HorseLuis), Svikull Rusl","avatar":"https://s3.amazonaws.com/files.d20.io/images/134925985/sAuOOF0z6gtT8L5spF0T8g/med.jpg?1589585826"},{"nom":"Shazel Bara, Chaman del clan","bio":"","info":"","tags":["Gruul"],"controlledby":"DM","visible":"Yarog (HorseLuis)","avatar":"https://s3.amazonaws.com/files.d20.io/images/159940191/bTqcBv26Ul8YCeClO4MaBw/med.jpg?1598303847"},{"nom":"Obez el Prestamista","bio":"No hay mucho que contar de Obez, pues ha elevado a la categoría de arte la mediocridad. Gordo y perezoso, lo único que le mantiene en el Sindicato son sus deudas. Su única fuente de placer es hundir en la desdicha a aquellos a los que ve felices.","info":"Cultist · Medium humanoid, non-good · AC 12 · HP 9 · Dark Devotion: ventaja contra ser encantado o asustado.","tags":["Orzhov"],"controlledby":"DM","visible":"Ezzio Salvatore, Svikull Rusl","avatar":"https://s3.amazonaws.com/files.d20.io/images/134952811/aZUvC5sukZM9fjZCMj_irA/med.jpg?1589589768"},{"nom":"Iván el Cocinero","bio":"Puede que la cocina de la taberna no sea exquisita, pero les proporciona un momento de tranquilidad. Sus gruesos dedos agarrando cuchillos y sus ojos perturbadoramente abiertos de par en par no deben inquietaros: Iván es (casi) siempre un buen muchacho.","info":"Berserker · Medium humanoid, chaotic · AC 13 · HP 67 · STR 16(+3) CON 17(+3) · Reckless.","tags":["Guildless"],"controlledby":"DM","visible":"Tots","avatar":"https://s3.amazonaws.com/files.d20.io/images/134953943/_FcJ2mPXNKCjs6UEP2ZEuQ/med.jpg?1589589992"},{"nom":"Grukurg el Tintador","bio":"Este ogro se pasa el día curtiendo pieles en su taller, y su actitud oscila entre el trabajo obsesivo y la furia psicótica, dependiendo de los gases de las cubas y los errores de sus empleados.","info":"Ogre · Large giant, chaotic evil · AC 11 · HP 59 · STR 19(+4) · Darkvision 60ft.","tags":["Guildless"],"controlledby":"DM","visible":"Ezzio Salvatore, Wundyr Somo, Svikull Rusl, Marchena, Manjatan","avatar":"https://s3.amazonaws.com/files.d20.io/images/135064372/J9vdKUYw41Wt5XUf8F59Mw/med.jpg?1589622122"},{"nom":"Ten el Pescadero","bio":"","info":"Currante, familiar, ha patit durant la crisi de l'aigua. On pesca??","tags":["Guildless"],"controlledby":"DM","visible":"Svikull Rusl, Marchena","avatar":"https://s3.amazonaws.com/files.d20.io/images/135066150/J5O_8n9-efZgG6i8e05Mlw/med.jpg?1589622763"},{"nom":"Morai la Capataz","bio":"Vivir sin la protección de un gremio en Ravnica no es fácil, pero a Morai le compensa: es su propia jefa (Obras Aventino SA). Algo reservada, pero en sus proyectos despliega un amplio abanico de conocimientos técnicos.","info":"CounterFlux Blastseeker · AC 13 · HP 39 · Counterflux Overcast (Recarga 5-6) · Hechizos: enlarge/reduce, scorching ray, counterspell. Putejada per Obez.","tags":["Guildless"],"controlledby":"DM","visible":"Ezzio Salvatore, Svikull Rusl, Wundyr Somo","avatar":"https://s3.amazonaws.com/files.d20.io/images/137136197/gTg-urlSCeaqyYEogMK8fA/med.jpg?1590173195"},{"nom":"Cresh el Vendedor de Comida Ambulante","bio":"Descrito como el empresario menos exitoso de Ravnica. Ha vendido desde un extraño líquido verde hasta auténticas reliquias sagradas. Ostenta a la vez los cargos de Presidente, Portavoz, Notario y Portero del gremio de Vendedores de Comida ambulante.","info":"Lizardfolk · AC 15 · HP 22 · CHA 15(+2) · Hold Breath 15 min · Persuasión+4, Insight+5.","tags":["Guildless"],"controlledby":"DM","visible":"Tots","avatar":"https://s3.amazonaws.com/files.d20.io/images/135068396/2YUbzAjPuH4t1tti5t0NnA/med.jpg?1589623501"},{"nom":"Elon Tusk el Mercader de grano","bio":"Si en el mercado escuchas maldiciones y ruido de cosas rompiéndose, te has encontrado a Elon. Ser un loxodon no evita ser descuidado ni torpe, aunque eso le ha permitido tener la plaza más espaciosa del mercado.","info":"Druid · AC 14 · HP 27 · WIS 16(+3) · Keen Smell: ventaja en Percepción, Supervivencia e Investigación por olfato.","tags":["Guildless"],"controlledby":"DM","visible":"Ezzio Salvatore, Wundyr Somo, Svikull Rusl, Marchena, Yarog (HorseLuis)","avatar":"https://s3.amazonaws.com/files.d20.io/images/135309178/qOA4xzoRTA77kVQxvDS7TA/med.jpg?1589665772"},{"nom":"Dhalya Macav la Comerciante","bio":"Toda una vida de aventuras comerciales le ha proporcionado una extensa red de contactos. Si necesitas cualquier cosa, ella puede conseguirlo. Es una negociadora brutal y nunca pierde la oportunidad de sacar tajada.","info":"Noble · AC 15 · HP 9 · CHA 16(+3) · Engaño+5, Perspicacia+4, Persuasión+5.","tags":["Guildless"],"controlledby":"DM","visible":"Svikull Rusl, Wundyr Somo","avatar":"https://s3.amazonaws.com/files.d20.io/images/136803555/vMU2EdrxXWy0mvAH8Ea2lg/med.jpg?1590082836"},{"nom":"Maeve la Carterista","bio":"Vivir en un mundo hecho a medida de gigantes no ha hecho más que facilitarle la vida a esta hada y a su banda de carteristas. La vida puede ser muy fácil cuando robar tu peso en oro no es solamente una expresión.","info":"Sprite · Tiny fey, neutral good · AC 15 · HP 2 · DEX 18(+4) · Stealth+8 · Heart Sight · Invisibilidad a voluntad.","tags":["Guildless"],"controlledby":"DM","visible":"Svikull Rusl","avatar":"https://s3.amazonaws.com/files.d20.io/images/137111466/1sTJYdiJeg5PNBB3Sb7DMg/med.jpg?1590168678"},{"nom":"Sila, Tribuno de la Legión","bio":"Uno de los más notables políticos y militares Boros en el último siglo. Tras distinguirse en las revueltas obreras Gruul y el asedio de la Senda Verde, los intentos de arrebatarle el control a Tajic le llevaron a la vida política. La Guerra de la Chispa reavivó su fuego justiciero.","info":"","tags":["Boros"],"controlledby":"DM","visible":"Wundyr Somo","avatar":"https://s3.amazonaws.com/files.d20.io/images/140846489/JZKrNO2P1TWnFITERAxa2g/med.jpg?1591302625"},{"nom":"Aurelio, Líder del Clan","bio":"","info":"","tags":["Gruul"],"controlledby":"DM","visible":"Ezzio Salvatore, Wundyr Somo, Yarog (HorseLuis)","avatar":"https://s3.amazonaws.com/files.d20.io/images/140847160/TyZ2lWlSB6gg3N-S-0jzjQ/med.jpg?1591302781"},{"nom":"Arkady el Alborotador","bio":"Arkady no ha tenido una vida fácil. Entró en la Escuela Eclesiástica Orzhov, donde destacó en pintura, teatro y poesía, pero perdió el interés en los estudios sacerdotales. Asistía a reuniones obreras secretas y asambleas Gruul. Finalmente abandonó el seminario para unirse a una tribu errante Gruul.","info":"","tags":["Gruul"],"controlledby":"DM","visible":"Tots","avatar":"https://s3.amazonaws.com/files.d20.io/images/140845373/PVuIlOgjL47nJ69sySSaNw/med.jpg?1591302449"},{"nom":"Ikram la Contrabandista","bio":"La Guerra de la chispa forzó el desplazamiento de miles de refugiados. Para gente como Ikram, quien no parece tener un hogar al que volver, ha implicado buscarse la vida de formas más creativas (y unos pocos psicotrópicos de contrabando nunca han hecho daño a nadie).","info":"","tags":["Golgari"],"controlledby":"DM","visible":"Tots","avatar":"https://s3.amazonaws.com/files.d20.io/images/141295640/AUoLogYYF5OAfAFey4FuKA/med.png?1591449211"},{"nom":"Bookworm el Consigliere","bio":"","info":"","tags":["Golgari"],"controlledby":"DM","visible":"Svikull Rusl","avatar":"https://s3.amazonaws.com/files.d20.io/images/140843081/GVU4rVcFV6W5SJoNVj2Q1A/med.jpg?1591301796"},{"nom":"Kakí Skýla, Lugarteniente del Enjambre Ochran","bio":"","info":"","tags":["Golgari"],"controlledby":"DM","visible":"Svikull Rusl","avatar":"https://s3.amazonaws.com/files.d20.io/images/140843529/jyLGYckmCCUC0ZlvYJVmYg/med.png?1591301929"},{"nom":"Tajic, Espada de la Legión","bio":"Como segundo al mando, Tajic se opuso al plan de Aurelia de unirse con otros gremios contra Bolas. Cree que los Boros sólo pueden confiar en los Boros. Está convencido de que cualquier esfuerzo de paz entre los gremios está condenado al fracaso sin el Pacto del Gremio.","info":"","tags":["Boros"],"controlledby":"DM","visible":"Wundyr Somo, Ezzio Salvatore","avatar":"https://s3.amazonaws.com/files.d20.io/images/140854963/R0SRtjGK0Izi3D2gyYX1dg/med.jpg?1591304630"},{"nom":"Sargento Instructor Gough","bio":"Gough \"Ojo de Halcón\" fue líder de los Wojek, la fuerza de asalto de élite de la Legión Boros. Su visión fue afectada por villanos que cubrieron con resina los ojos de su yelmo. Cegado, dedica sus días a preparar a las nuevas generaciones de cadetes.","info":"","tags":["Boros"],"controlledby":"DM","visible":"Wundyr Somo","avatar":"https://s3.amazonaws.com/files.d20.io/images/140855770/WBZX-9lAnN5MPHc-MTmGdg/med.jpg?1591304848"},{"nom":"Informante Secreto","bio":"","info":"","tags":["Dimir"],"controlledby":"DM","visible":"Wundyr Somo","avatar":"https://s3.amazonaws.com/files.d20.io/images/140870893/t21hggto0-yA7MIj_laMFQ/med.jpg?1591308207"},{"nom":"Mecenas misterioso","bio":"","info":"Araithia Shokta","tags":["Dimir"],"controlledby":"DM","visible":"Svikull Rusl","avatar":"https://s3.amazonaws.com/files.d20.io/images/140876166/O48syXaG8yjzet4REyfUYw/med.jpg?1591309478"},{"nom":"Emeritus Tobias Forge","bio":"","info":"","tags":["Orzhov"],"controlledby":"DM","visible":"Ezzio Salvatore","avatar":"https://s3.amazonaws.com/files.d20.io/images/140868977/Lp-qha-rigkYTb6NN232SA/med.jpg?1591307723"},{"nom":"Glenn Danzing, Sicario del Sindicato","bio":"","info":"","tags":["Orzhov"],"controlledby":"DM","visible":"Ezzio Salvatore","avatar":"https://s3.amazonaws.com/files.d20.io/images/140868744/E-fKQJO_Z_MVDgo_sYP52A/med.jpg?1591307658"},{"nom":"Padre Messiah Marcolin","bio":"","info":"","tags":["Orzhov","Dimir"],"controlledby":"DM","visible":"Ezzio Salvatore","avatar":"https://s3.amazonaws.com/files.d20.io/images/140874203/a9aOX7j82UAkkVGGTQKnGg/med.jpg?1591308993"},{"nom":"Niv-Mizzet, el Dracogenio","bio":"Niv-Mizzet, el Mente de Fuego, es un antiguo dragón de Ravnica obsesionado con la omnisciencia. Su intelecto excede al de los mortales en varios niveles. Poseedor de una arrogancia que iguala su vasto intelecto, dirige la investigación Izzet desde hace más de 10.000 años. Como nuevo Pacto del Gremio Viviente, sirve ahora como guardián de la propia Ravnica.","info":"","tags":["Izzet"],"controlledby":"DM","visible":"Manjatan","avatar":"https://s3.amazonaws.com/files.d20.io/images/140862521/pB5OGjqf61u9fNmWYUn7WQ/med.jpg?1591306200"},{"nom":"Sestri, Degana del Laboratorio de Tormentas y Electricidad","bio":"","info":"","tags":["Izzet"],"controlledby":"DM","visible":"Manjatan","avatar":"https://s3.amazonaws.com/files.d20.io/images/141591002/-HwGLQt8ZR7Eo2ItY7DfFw/med.jpg?1591527221"},{"nom":"Coldie, Genio Inestable","bio":"","info":"","tags":["Izzet"],"controlledby":"DM","visible":"Manjatan, Kasz","avatar":"https://s3.amazonaws.com/files.d20.io/images/140868357/JTN0fa84ue_DfZhdRV-O_A/med.png?1591307571"},{"nom":"Rotxar, Cultista Tatuador","bio":"","info":"","tags":["Rakdos"],"controlledby":"DM","visible":"Manjatan","avatar":"https://s3.amazonaws.com/files.d20.io/images/140867142/lqAT8fiu1kMwB7Hr94ebmQ/med.png?1591307292"},{"nom":"Tai On, Justicar del Senado","bio":"","info":"","tags":["Azorius"],"controlledby":"DM","visible":"Marchena","avatar":"https://s3.amazonaws.com/files.d20.io/images/140875451/WAbWGNJq8Z6lmhTRMVIpxQ/med.jpg?1591309280"},{"nom":"Randall, Comunero Pacifista","bio":"","info":"","tags":["Selesnya"],"controlledby":"DM","visible":"Tots","avatar":"https://s3.amazonaws.com/files.d20.io/images/140880223/aevu0RFjpabGlaafAhBCjQ/med.jpg?1591310457"},{"nom":"Khatnas, Juez de Asuntos Internos","bio":"","info":"","tags":["Azorius"],"controlledby":"DM","visible":"Marchena","avatar":"https://s3.amazonaws.com/files.d20.io/images/140866538/1-XJ8OLES4g4y2wLUII6TQ/med.jpg?1591307152"},{"nom":"Nebum Gerava, Arbites del Senado","bio":"Vigila a tus hermanos, su pecado de herejía es tu pecado de tolerancia.","info":"","tags":["Azorius"],"controlledby":"DM","visible":"Marchena","avatar":"https://s3.amazonaws.com/files.d20.io/images/140874775/_ifdQVORaOvaK0IvUALsAg/med.jpg?1591309125"},{"nom":"Gasz, Matón de la Calle de Hojalata","bio":"","info":"Extorsiona a la familia de Brir.","tags":["Guildless"],"controlledby":"DM","visible":"Kasz","avatar":"https://s3.amazonaws.com/files.d20.io/images/141587473/Umpkd9WtsYn8XuztaSYscA/med.jpg?1591525761"},{"nom":"Luda Manson, Productora y Cazatalentos","bio":"Luda Manson era la mejor representante de artistas de la pasada década. Cuando Kill-Pesha la abandona inesperadamente, el mundo de Luda se tambalea. Junto a Kasz y Rotxar se lanza al descubrimiento de nuevo talento.","info":"","tags":["Rakdos"],"controlledby":"DM","visible":"Wundyr Somo, Kasz","avatar":"https://s3.amazonaws.com/files.d20.io/images/141589479/ywvoxgAOpIS20pKVtXG_EQ/med.jpg?1591526639"},{"nom":"Ylldiane, Intendente Mayor","bio":"","info":"","tags":["Boros"],"controlledby":"DM","visible":"Wundyr Somo","avatar":"https://s3.amazonaws.com/files.d20.io/images/168007495/qHtdXRVqlst7hc_Ew7XJVg/med.jpg?1601579423"},{"nom":"Ayudantes de laboratorio Izzet","bio":"Aún son aprendices, pero algún día podrían llegar a maestros.....","info":"Commoner · AC 10 · HP 4 · Challenge 0.","tags":["Izzet"],"controlledby":"DM","visible":"Tots","avatar":"https://s3.amazonaws.com/files.d20.io/images/170790697/CY2lRS8Pn4KWc51K3YBkjg/med.jpg?1602760121"},{"nom":"Reclutas Azorius","bio":"Siempre queda tanto papeleo que hacer...","info":"Soldier · AC 18 (cota + escudo) · HP 16 · Multiattack: dos ataques con espada larga.","tags":["Azorius"],"controlledby":"DM","visible":"Tots","avatar":"https://s3.amazonaws.com/files.d20.io/images/170791153/sqaqJdvh1Pvc76rZ5cR4Og/med.png?1602760564"},{"nom":"Giagia, Ama de llaves del Hogar Ancestral Dalverjar","bio":"Ikram és el nom fals que amaga Giagia, que porta més de 3 segles servint aquesta família devkarin. La seva habilitat per preparar tinturas, pocions i verins és llegendària entre els Golgari. Ara que ha trobat l'hereu perdut dels Dalverjar, posarà tot el seu esforç a servir-los una altra vegada.","info":"","tags":["Golgari"],"controlledby":"DM","visible":"Svikull Rusl","avatar":"https://s3.amazonaws.com/files.d20.io/images/170792133/uy0FdokBYLIuUoGWD-Y7cw/med.jpg?1602761301"},{"nom":"Escuadrón Boros","bio":"La justicia no se va a servir sola...","info":"Soldier · AC 18 · HP 16 · Multiattack: dos ataques con espada larga.","tags":["Boros"],"controlledby":"DM","visible":"Tots","avatar":"https://s3.amazonaws.com/files.d20.io/images/170879029/HLCdE_eyUoUisS8ieQaooQ/med.jpg?1602792908"},{"nom":"Anarquistas Gruul","bio":"Raramente desarmados, raramente sobrios...","info":"Anarch · AC 13 · HP 11 · Aggressive: bonus acción · Siege Monster: daño doble a objetos.","tags":["Gruul"],"controlledby":"DM","visible":"Tots","avatar":"https://s3.amazonaws.com/files.d20.io/images/170880848/P9TQzFHBslgLcMYFxuouQg/med.jpg?1602793500"},{"nom":"Troupe Rakdos","bio":"El espectáculo debe continuar...","info":"Cultist · AC 12 · HP 9 · Dark Devotion: ventaja contra encantamiento y miedo.","tags":["Rakdos"],"controlledby":"DM","visible":"Kasz","avatar":"https://s3.amazonaws.com/files.d20.io/images/171299129/nEKZlFpY-4tEmDqrsn0EeQ/med.jpg?1602955642"},{"nom":"André el Herrero","bio":"André proviene de las arboledas del Cónclave Selesnya. Es conocida la traición sufrida a manos de sus compañeros vernadi, y su salvación por parte de un gigante Boros, con quién adquirió una deuda de sangre. Sus golpes son rápidos y precisos, moldeando el metal en herramientas certeras.","info":"","tags":["Boros","Selesnya"],"controlledby":"DM","visible":"Wundyr Somo","avatar":"https://s3.amazonaws.com/files.d20.io/images/195735154/6xG4kdSSvg-cezZtIrk1jA/med.jpg?1611611302"},{"nom":"Alysa la Sastre","bio":"Molt intel·ligent, es fa la tonta i la superficial, molt diva, mata hari.","info":"","tags":["Dimir"],"controlledby":"DM","visible":"Només DM","avatar":"https://s3.amazonaws.com/files.d20.io/images/237270295/qH_ideaNSEj6_6GvLrUVpg/med.jpg?1627750275"},{"nom":"Albert Camus de la Oficina del Banco","bio":"Financer, agarrat, depresiu, salary man, desagradable amb tothom perquè està fins la polla.","info":"","tags":["Orzhov"],"controlledby":"DM","visible":"Només DM","avatar":"https://s3.amazonaws.com/files.d20.io/images/237271906/awt7LUaVjpWk7J6ko0qmVg/med.jpg?1627750812"},{"nom":"(la de correos)","bio":"Mística xmen, changeling.","info":"","tags":["Dimir"],"controlledby":"DM","visible":"Només DM","avatar":"https://s3.amazonaws.com/files.d20.io/images/253587144/oT_jNN8ncQfzS8WJOCDCPg/med.jpg?1635879853"},{"nom":"Aiker Bosset","bio":"Después del dolor causado por la guerra, no dejará que esta se vuelva a producir. Incansable en la búsqueda de poder, utilizará todos los recursos Simic para evolucionar a una forma de vida superior. Cualquiera que busque la guerra será aniquilado.","info":"","tags":["Simic"],"controlledby":"DM","visible":"Tots","avatar":"https://s3.amazonaws.com/files.d20.io/images/273582674/_kGQBo4IxF28P970piApiQ/med.png?1646239114"},{"nom":"Los fieles seguidores del Maestro, el Evolucionador de hombres","bio":"El Maestro dijo: \"Los sanos no tienen necesidad de médico, sino los enfermos\". Él vino a buscar, levantar y salvar a los perdidos, a los débiles y abatidos. Él te conduce hacia la Verdad y la mejora personal.","info":"","tags":["Simic"],"controlledby":"DM","visible":"Tots","avatar":"https://s3.amazonaws.com/files.d20.io/images/272548250/RraMHSmmi8cxvJ7XYfzdww/med.jpg?1645702602"},{"nom":"Trisz, Legionario Caido (Fallecido)","bio":"Pese a que el hambre y el miedo siempre han estado presentes, Trisz nunca consideró tener una infancia infeliz. Su hermana era una fuente constante de cándida alegría. Fue lo que le empujó a alistarse. Con su última exhalación susurró su nombre... LEGIO AETERNA VICTRIX.","info":"","tags":["Boros"],"controlledby":"DM","visible":"Ezzio Salvatore, Wundyr Somo","avatar":"https://s3.amazonaws.com/files.d20.io/images/273132602/1iUa-yXw6gzNS9MgN6n9kQ/med.jpg?1645980222"},{"nom":"Pandora, Espíritu Servicial","bio":"Ver stat block: 5e.tools/bestiary/indentured-spirit-ggr.html","info":"","tags":["Orzhov"],"controlledby":"DM","visible":"Tots","avatar":"https://s3.amazonaws.com/files.d20.io/images/407240836/64bXVkPN2ygQUBoo1fqexA/med.webp?1724948729"}];

const GC = {Azorius:"#5b9fd4",Boros:"#d4621a",Dimir:"#7b6fd4",Golgari:"#5a9a3a",Gruul:"#c46a1a",Izzet:"#c44aaa",Orzhov:"#999",Rakdos:"#c43030",Selesnya:"#4a9a4a",Simic:"#1a9a7a",Guildless:"#8a7a5a"};
const GS = {Azorius:"⚖",Boros:"☀",Dimir:"👁",Golgari:"☽",Gruul:"⚡",Izzet:"∞",Orzhov:"✝",Rakdos:"♦",Selesnya:"✿",Simic:"⌬",Guildless:"◆"};
const AG = ["Azorius","Boros","Dimir","Golgari","Gruul","Izzet","Orzhov","Rakdos","Selesnya","Simic","Guildless"];
const PJS = ["Ezzio Salvatore","Wundyr Somo","Yarog (HorseLuis)","Manjatan","Svikull Rusl","Marchena","Kasz"];
const PC = {"Ezzio Salvatore":"#999","Wundyr Somo":"#d4621a","Yarog (HorseLuis)":"#c46a1a","Manjatan":"#c44aaa","Svikull Rusl":"#5a9a3a","Marchena":"#5b9fd4","Kasz":"#c43030","Compartit":"#8a7a5a","Només DM":"#555"};
const GOLD = "#a07830";
const BG = "#0f0e0c";
const BG2 = "#161410";
const BG3 = "#1c1a16";
const BORDER = "#2a2520";

const FONTS = \`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');\`;

const CSS = \`
\${FONTS}
* { box-sizing: border-box; }
.rv { font-family: 'Crimson Text', Georgia, serif; background: \${BG}; color: #c8bfa8; }
.rv-head { font-family: 'Cinzel', serif; }
.rv-mono { font-family: 'Cinzel', serif; }
.rv-row:hover { background: \${BG3} !important; }
.rv-btn-gold { background: \${GOLD}; color: #0f0e0c; border: none; cursor: pointer; font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.08em; padding: 5px 14px; border-radius: 3px; transition: filter 0.15s; }
.rv-btn-gold:hover { filter: brightness(1.3); }
.rv-input { background: \${BG2}; border: 1px solid \${BORDER}; color: #c8bfa8; font-family: 'Crimson Text', Georgia, serif; font-size: 14px; padding: 6px 10px; border-radius: 3px; outline: none; width: 100%; }
.rv-input:focus { border-color: \${GOLD}66; }
.rv-textarea { background: \${BG2}; border: 1px solid \${BORDER}; color: #c8bfa8; font-family: 'Crimson Text', Georgia, serif; font-size: 14px; line-height: 1.75; padding: 8px 10px; border-radius: 3px; outline: none; width: 100%; resize: vertical; min-height: 90px; }
.rv-textarea:focus { border-color: \${GOLD}66; }
.rv-editable { cursor: text; padding: 4px 8px; border-radius: 3px; border: 1px solid transparent; transition: border-color 0.15s; }
.rv-editable:hover { border-color: \${BORDER}; background: \${BG2}; }
.rv-tag { font-size: 10px; padding: 2px 8px; border-radius: 10px; font-family: 'Cinzel', serif; letter-spacing: 0.04em; cursor: pointer; transition: filter 0.1s; }
.rv-tag:hover { filter: brightness(1.3); }
.rv-filter { font-size: 9px; padding: 2px 8px; border-radius: 10px; cursor: pointer; font-family: 'Cinzel', serif; letter-spacing: 0.04em; border: 1px solid transparent; transition: all 0.1s; }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: \${GOLD}40; border-radius: 2px; }
@keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
.rv-detail { animation: fadeUp 0.16s ease; }
\`;

function mc(item, tab) {
  if (tab==="handouts") return PC[item.propietari]||"#8a7a5a";
  return item.tags?.length ? GC[item.tags[0]]||"#8a7a5a" : "#8a7a5a";
}
function initials(n) { return (n||"?").split(" ").filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join(""); }

function Field({value, onChange, multi=false, accent, ph="Editar..."}) {
  const [ed, setEd] = useState(false);
  const [draft, setDraft] = useState(value);
  useEffect(()=>setDraft(value),[value]);
  const ok=()=>{onChange(draft);setEd(false);};
  const cancel=()=>{setDraft(value);setEd(false);};
  if (!ed) return (
    <div className="rv-editable" onClick={()=>setEd(true)} style={{position:"relative"}}>
      <span style={{position:"absolute",top:4,right:6,fontSize:9,color:GOLD,opacity:0.35,pointerEvents:"none"}}>✎</span>
      {value
        ? <p style={{margin:0,fontSize:14,lineHeight:1.75,color:"#c8bfa8",whiteSpace:"pre-line",paddingRight:12}}>{value}</p>
        : <p style={{margin:0,fontSize:13,color:"#5a5040",fontStyle:"italic"}}>{ph}</p>}
    </div>
  );
  return (
    <div>
      {multi
        ? <textarea autoFocus className="rv-textarea" value={draft} onChange={e=>setDraft(e.target.value)} style={{borderColor:(accent||GOLD)+"66"}}/>
        : <input autoFocus className="rv-input" value={draft} onChange={e=>setDraft(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter")ok();if(e.key==="Escape")cancel();}}
            style={{borderColor:(accent||GOLD)+"66",fontFamily:"'Cinzel',serif",fontSize:13}}/>
      }
      <div style={{display:"flex",gap:6,marginTop:6}}>
        <button className="rv-btn-gold" onClick={ok} style={{background:accent||GOLD,color:BG}}>Desar</button>
        <button onClick={cancel} style={{fontSize:10,padding:"4px 12px",borderRadius:3,background:"transparent",color:"#6a6050",border:`1px solid ${BORDER}`,cursor:"pointer",fontFamily:"'Cinzel',serif",letterSpacing:"0.06em"}}>Cancel·lar</button>
      </div>
    </div>
  );
}

function Sel({value, opts, onChange, cm}) {
  const [ed, setEd] = useState(false);
  const col = cm?.[value]||"#8a7a5a";
  if (!ed) return (
    <span className="rv-tag" onClick={()=>setEd(true)}
      style={{background:col+"18",border:`1px solid ${col}44`,color:col}}>
      {value} ✎
    </span>
  );
  return (
    <select autoFocus value={value}
      onChange={e=>{onChange(e.target.value);setEd(false);}}
      onBlur={()=>setEd(false)}
      style={{fontSize:11,padding:"3px 8px",borderRadius:3,border:`1px solid ${GOLD}66`,
        background:BG2,color:"#c8bfa8",fontFamily:"'Crimson Text',Georgia,serif",cursor:"pointer"}}>
      {opts.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Rule({color}) {
  const c = color||GOLD;
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,margin:"10px 0"}}>
      <div style={{flex:1,height:"1px",background:`linear-gradient(to right, transparent, ${c}40)`}}/>
      <span style={{fontSize:8,color:c,opacity:0.5}}>✦</span>
      <div style={{flex:1,height:"1px",background:`linear-gradient(to left, transparent, ${c}40)`}}/>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("chars");
  const [q, setQ] = useState("");
  const [filt, setFilt] = useState("all");
  const [sel, setSel] = useState(null);
  const [showD, setShowD] = useState(false);
  const [hs, setHs] = useState(HANDOUTS);
  const [cs, setCs] = useState(CHARS);
  const [saved, setSaved] = useState("");
  const [mob, setMob] = useState(false);

  useEffect(()=>{
    const chk=()=>setMob(window.innerWidth<580);
    chk(); window.addEventListener("resize",chk);
    return ()=>window.removeEventListener("resize",chk);
  },[]);

  useEffect(()=>{
    (async()=>{
      try{
        const rh=await window.storage.get("ravnica_h2");
        if(rh) setHs(JSON.parse(rh.value));
        const rc=await window.storage.get("ravnica_c2");
        if(rc) setCs(JSON.parse(rc.value));
      }catch(e){}
    })();
  },[]);

  const save=useCallback(async(nh,nc)=>{
    try{
      await window.storage.set("ravnica_h2",JSON.stringify(nh||hs));
      await window.storage.set("ravnica_c2",JSON.stringify(nc||cs));
      setSaved("✦ Desat"); setTimeout(()=>setSaved(""),2000);
    }catch(e){}
  },[hs,cs]);

  const newH=()=>{const h=[...hs,{nom:"Nou handout",propietari:"Compartit",visible:"Tots",contingut:"",notes_dm:""}];setHs(h);save(h,null);setTab("handouts");setQ("");setFilt("all");setSel(h.length-1);setShowD(true);};
  const newC=()=>{const c=[...cs,{nom:"Nou personatge",bio:"",info:"",tags:["Guildless"],controlledby:"DM",visible:"Tots"}];setCs(c);save(null,c);setTab("chars");setQ("");setFilt("all");setSel(c.length-1);setShowD(true);};
  const del=()=>{
    if(!item) return;
    if(!window.confirm(`Eliminar "${item.nom}"?`)) return;
    if(tab==="handouts"){const h=hs.filter((_,i)=>i!==origI);setHs(h);save(h,null);}
    else{const c=cs.filter((_,i)=>i!==origI);setCs(c);save(null,c);}
    setSel(null);setShowD(false);
  };
  const updH=(i,f,v)=>{const h=hs.map((x,j)=>j===i?{...x,[f]:v}:x);setHs(h);save(h,null);};
  const updC=(i,f,v)=>{const c=cs.map((x,j)=>j===i?{...x,[f]:v}:x);setCs(c);save(null,c);};

  const items=tab==="handouts"?hs:cs;
  const fltd=useMemo(()=>{
    const lq=q.toLowerCase();
    return items.filter(x=>{
      const ms=!lq||x.nom.toLowerCase().includes(lq)||(x.contingut||"").toLowerCase().includes(lq)||(x.bio||"").toLowerCase().includes(lq)||(x.info||"").toLowerCase().includes(lq);
      const mf=tab==="chars"?filt==="all"||(x.tags||[]).includes(filt):filt==="all"||x.propietari===filt;
      return ms&&mf;
    });
  },[items,q,filt,tab]);

  const getOI=fi=>tab==="handouts"?hs.findIndex(x=>x===fi):cs.findIndex(x=>x===fi);
  const item=sel!==null&&sel<fltd.length?fltd[sel]:null;
  const origI=item?getOI(item):-1;
  const ac=item?mc(item,tab):GOLD;
  const isPJ=item&&PJS.includes(item.nom);
  const gTag=item&&tab==="chars"&&item.tags?.[0];

  function chTab(t){setTab(t);setQ("");setFilt("all");setSel(null);setShowD(false);}
  function pick(i){setSel(i===sel&&!mob?null:i);setShowD(true);}

  const Detail = item ? (
    <div className="rv-detail" style={{flex:1,overflowY:"auto",padding:"18px 20px",position:"relative",
      ...(mob?{position:"absolute",top:0,left:0,right:0,bottom:0,background:BG,zIndex:10,overflowY:"auto"}:{})}}>

      {mob&&<button onClick={()=>setShowD(false)} style={{marginBottom:14,background:"none",border:"none",
        cursor:"pointer",color:GOLD,fontSize:11,padding:0,fontFamily:"'Cinzel',serif",letterSpacing:"0.06em"}}>
        ← TORNAR
      </button>}

      {/* Top row */}
      <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:8}}>
        {/* Avatar */}
        <div style={{width:46,height:46,borderRadius:"50%",flexShrink:0,
          background:`radial-gradient(circle at 30% 30%, ${ac}28, ${ac}0a)`,
          border:`1px solid ${ac}55`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:tab==="handouts"?17:13,fontWeight:600,color:ac,
          fontFamily:"'Cinzel',serif"}}>
          {tab==="handouts" ? "📜" : initials(item.nom)}
        </div>

        <div style={{flex:1,minWidth:0}}>
          {/* Nom */}
          <div style={{fontFamily:"'Cinzel',serif",marginBottom:5}}>
            <Field value={item.nom}
              onChange={v=>tab==="handouts"?updH(origI,"nom",v):updC(origI,"nom",v)}
              accent={ac}/>
          </div>
          {/* Tags */}
          <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center",paddingLeft:8}}>
            {tab==="chars"?(
              <>
                {(item.tags||[]).map((t,ti)=>(
                  <Sel key={ti} value={t} opts={AG}
                    onChange={v=>{const nt=[...(item.tags||[])];nt[ti]=v;updC(origI,"tags",nt);}}
                    cm={GC}/>
                ))}
                <button onClick={()=>updC(origI,"tags",[...(item.tags||[]),"Guildless"])}
                  style={{fontSize:9,padding:"2px 7px",borderRadius:10,border:`1px dashed ${GOLD}44`,
                    background:"transparent",color:GOLD,cursor:"pointer",fontFamily:"'Cinzel',serif",opacity:0.6}}>
                  + gremi
                </button>
              </>
            ):(
              <Sel value={item.propietari} opts={[...PJS,"Compartit","Només DM"]}
                onChange={v=>updH(origI,"propietari",v)} cm={PC}/>
            )}
            {isPJ&&<span className="rv-tag" style={{background:ac+"18",border:`1px solid ${ac}44`,color:ac,cursor:"default"}}>PJ</span>}
          </div>
        </div>

        <div style={{display:"flex",gap:4,flexShrink:0}}>
          <button onClick={del} style={{background:"none",border:`1px solid #c4303033`,borderRadius:3,
            cursor:"pointer",color:"#c43030",fontSize:11,padding:"3px 7px",fontFamily:"inherit",
            transition:"border-color 0.15s"}}
            onMouseEnter={e=>e.target.style.borderColor="#c43030aa"}
            onMouseLeave={e=>e.target.style.borderColor="#c4303033"}>
            🗑
          </button>
          {!mob&&<button onClick={()=>{setSel(null);setShowD(false);}}
            style={{background:"none",border:"none",cursor:"pointer",color:"#5a5040",fontSize:18,padding:"0 2px",lineHeight:1,transition:"color 0.15s"}}
            onMouseEnter={e=>e.target.style.color="#c8bfa8"}
            onMouseLeave={e=>e.target.style.color="#5a5040"}>
            ×
          </button>}
        </div>
      </div>

      {/* Meta pills */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",paddingLeft:4,marginBottom:4}}>
        {tab==="chars"?(
          <div style={{fontSize:10,padding:"3px 10px",borderRadius:12,
            background:BG2,border:`1px solid ${BORDER}`,
            display:"flex",gap:5,alignItems:"center"}}>
            <span style={{opacity:0.5,fontSize:9}}>🎮</span>
            <span style={{color:"#5a5040",fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:"0.06em"}}>CONTROL</span>
            <span style={{color:"#c8bfa8",fontFamily:"'Crimson Text',serif",fontSize:12}}>{item.controlledby}</span>
          </div>
        ):(
          <div style={{fontSize:10,padding:"3px 10px",borderRadius:12,
            background:ac+"12",border:`1px solid ${ac}33`,
            display:"flex",gap:5,alignItems:"center"}}>
            <span style={{opacity:0.5,fontSize:9}}>⚔</span>
            <span style={{color:"#5a5040",fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:"0.06em"}}>PROPIETARI</span>
            <span style={{color:ac,fontFamily:"'Crimson Text',serif",fontSize:12,fontWeight:600}}>{item.propietari}</span>
          </div>
        )}
        <div style={{fontSize:10,padding:"3px 10px",borderRadius:12,
          background:BG2,border:`1px solid ${BORDER}`,
          display:"flex",gap:5,alignItems:"center",flex:"1 1 auto",minWidth:0}}>
          <span style={{opacity:0.5,fontSize:9,flexShrink:0}}>👁</span>
          <span style={{color:"#5a5040",fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:"0.06em",flexShrink:0}}>VISIBLE</span>
          <div style={{flex:1,minWidth:0}}>
            <Field value={item.visible}
              onChange={v=>tab==="handouts"?updH(origI,"visible",v):updC(origI,"visible",v)}
              accent={ac} ph="Tots"/>
          </div>
        </div>
      </div>

      <Rule color={ac}/>

      {/* Bio / Contingut */}
      <div style={{marginBottom:8}}>
        <div style={{fontSize:8,color:ac,fontFamily:"'Cinzel',serif",letterSpacing:"0.12em",
          marginBottom:4,paddingLeft:8,opacity:0.8}}>
          {tab==="handouts" ? "CONTINGUT" : "BIO & INFO"}
        </div>
        <Field value={item.bio||item.contingut||""}
          onChange={v=>tab==="handouts"?updH(origI,"contingut",v):updC(origI,"bio",v)}
          multi={true} accent={ac} ph="Afegir contingut..."/>
      </div>

      <Rule/>

      {/* Notes DM */}
      <div>
        <div style={{fontSize:8,color:"#5a5040",fontFamily:"'Cinzel',serif",letterSpacing:"0.12em",
          marginBottom:4,paddingLeft:8}}>
          NOTES DEL DM
        </div>
        <Field value={item.info||item.notes_dm||""}
          onChange={v=>tab==="handouts"?updH(origI,"notes_dm",v):updC(origI,"info",v)}
          multi={true} accent={GOLD} ph="Notes privades..."/>
      </div>
    </div>
  ) : null;

  return (
    <>
      <style>{CSS}</style>
      <div className="rv" style={{height:"100vh",maxHeight:720,
        border:`1px solid ${BORDER}`,borderRadius:6,
        overflow:"hidden",display:"flex",flexDirection:"column"}}>

        {/* HEADER */}
        <div style={{background:BG2,borderBottom:`1px solid ${BORDER}`,padding:"12px 16px 0",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{width:24,height:24,borderRadius:"50%",
              border:`1px solid ${GOLD}55`,background:`${GOLD}0f`,
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:12,lineHeight:1}}>⚜</span>
            </div>
            <div>
              <span className="rv-head" style={{fontSize:mob?13:15,color:"#d4c89a",letterSpacing:"0.07em",fontWeight:600}}>
                Arxiu de Ravnica
              </span>
              {!mob&&<span style={{fontSize:11,color:"#3a3028",fontStyle:"italic",
                fontFamily:"'Crimson Text',serif",marginLeft:10}}>
                Decàleg del Pacte del Gremi
              </span>}
            </div>
            {saved&&<span style={{fontSize:9,color:GOLD,marginLeft:4,fontFamily:"'Cinzel',serif",letterSpacing:"0.06em"}}>{saved}</span>}
            <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>
              {!mob&&<span style={{fontSize:9,color:"#3a3028",fontFamily:"'Cinzel',serif",letterSpacing:"0.05em"}}>
                {hs.length}H · {cs.length}P
              </span>}
              <button className="rv-btn-gold" onClick={tab==="handouts"?newH:newC}>
                + {tab==="handouts"?"HANDOUT":"PERSONATGE"}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:1}}>
            {[{id:"chars",icon:"👤",label:"Personatges"},{id:"handouts",icon:"📜",label:"Handouts"}].map(t=>(
              <button key={t.id} onClick={()=>chTab(t.id)} style={{
                background:tab===t.id?BG:"transparent",
                border:`1px solid ${tab===t.id?GOLD+"44":"transparent"}`,
                borderBottom:tab===t.id?`1px solid ${BG}`:"none",
                borderRadius:"3px 3px 0 0",
                padding:"6px 16px",fontSize:10,cursor:"pointer",
                color:tab===t.id?GOLD:"#4a4030",
                fontFamily:"'Cinzel',serif",letterSpacing:"0.07em",
                marginBottom:tab===t.id?-1:0,transition:"all 0.15s"}}>
                {t.icon} {t.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* BODY */}
        <div style={{display:"flex",flex:1,overflow:"hidden",position:"relative",background:BG}}>

          {/* LIST */}
          <div style={{
            width:mob?"100%":item?"36%":"100%",
            display:mob&&showD&&item?"none":"flex",
            flexDirection:"column",
            borderRight:!mob&&item?`1px solid ${BORDER}`:"none",
            transition:"width 0.2s",
          }}>
            {/* Search */}
            <div style={{padding:"8px 10px",borderBottom:`1px solid ${BORDER}`,flexShrink:0,background:BG2}}>
              <div style={{position:"relative",marginBottom:7}}>
                <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",
                  fontSize:11,color:GOLD,opacity:0.3,pointerEvents:"none"}}>⚜</span>
                <input className="rv-input" type="text"
                  placeholder={`Cerca ${tab==="handouts"?"handouts":"personatges"}...`}
                  value={q} onChange={e=>{setQ(e.target.value);setSel(null);}}
                  style={{paddingLeft:28}}/>
              </div>
              {/* Filters */}
              <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                <button className="rv-filter" onClick={()=>setFilt("all")} style={{
                  background:filt==="all"?GOLD+"22":"transparent",
                  border:`1px solid ${filt==="all"?GOLD+"55":BORDER}`,
                  color:filt==="all"?GOLD:"#4a4030"}}>
                  TOTS
                </button>
                {tab==="chars"
                  ?AG.filter(g=>cs.some(c=>(c.tags||[]).includes(g))).map(g=>(
                    <button key={g} className="rv-filter" onClick={()=>setFilt(g===filt?"all":g)} style={{
                      background:filt===g?GC[g]+"1a":"transparent",
                      border:`1px solid ${filt===g?GC[g]+"55":GC[g]+"22"}`,
                      color:filt===g?GC[g]:"#4a4030"}}>
                      {GS[g]} {g}
                    </button>
                  ))
                  :[...PJS,"Compartit","Només DM"].map(p=>(
                    <button key={p} className="rv-filter" onClick={()=>setFilt(p===filt?"all":p)} style={{
                      background:filt===p?(PC[p]||"#888")+"1a":"transparent",
                      border:`1px solid ${filt===p?(PC[p]||"#888")+"55":(PC[p]||"#888")+"22"}`,
                      color:filt===p?PC[p]||"#888":"#4a4030"}}>
                      {p}
                    </button>
                  ))
                }
              </div>
            </div>

            {/* Rows */}
            <div style={{overflowY:"auto",flex:1}}>
              {fltd.length===0&&(
                <div style={{padding:30,color:"#3a3028",fontSize:14,textAlign:"center",
                  fontStyle:"italic",fontFamily:"'Crimson Text',serif"}}>
                  Cap registre als arxius...
                </div>
              )}
              {fltd.map((x,i)=>{
                const c=mc(x,tab);
                const isSel=!mob&&sel===i;
                const sig=tab==="chars"&&x.tags?.[0]?GS[x.tags[0]]:"📜";
                return (
                  <div key={i} onClick={()=>pick(i)} className="rv-row" style={{
                    padding:"9px 14px",cursor:"pointer",
                    borderBottom:`1px solid ${BORDER}`,
                    background:isSel?BG3:"transparent",
                    borderLeft:isSel?`2px solid ${c}`:`2px solid transparent`,
                    display:"flex",alignItems:"center",gap:10,
                    transition:"background 0.1s",
                  }}>
                    {/* Sigil */}
                    <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,
                      background:`${c}14`,border:`1px solid ${c}33`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:13,color:c}}>
                      {sig}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,color:isSel?"#d4c89a":"#c8bfa8",
                        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                        fontFamily:"'Cinzel',serif",letterSpacing:"0.03em",fontWeight:isSel?600:400}}>
                        {x.nom}
                        {PJS.includes(x.nom)&&<span style={{marginLeft:5,fontSize:8,
                          background:c+"1a",color:c,borderRadius:2,padding:"1px 4px",
                          fontFamily:"'Cinzel',serif",letterSpacing:"0.05em",verticalAlign:"middle"}}>PJ</span>}
                      </div>
                      <div style={{display:"flex",gap:3,marginTop:3,flexWrap:"wrap"}}>
                        {tab==="chars"
                          ?(x.tags||[]).map(t=><span key={t} style={{fontSize:8,padding:"1px 5px",
                              borderRadius:8,background:GC[t]+"15",color:GC[t],
                              fontFamily:"'Cinzel',serif",letterSpacing:"0.03em"}}>
                              {GS[t]} {t}
                            </span>)
                          :x.propietari&&<span style={{fontSize:8,padding:"1px 5px",
                              borderRadius:8,background:(PC[x.propietari]||"#888")+"15",
                              color:PC[x.propietari]||"#888",fontFamily:"'Cinzel',serif",
                              letterSpacing:"0.03em"}}>
                              {x.propietari}
                            </span>
                        }
                        {x.visible&&x.visible!=="Tots"&&(
                          <span style={{fontSize:8,padding:"1px 5px",borderRadius:8,
                            background:BG3,color:"#3a3028",fontFamily:"'Crimson Text',serif",fontStyle:"italic"}}>
                            👁 {x.visible==="Només DM"?"DM":x.visible.split(",")[0].trim()+(x.visible.includes(",")?"…":"")}
                          </span>
                        )}
                      </div>
                    </div>
                    <span style={{color:isSel?c:"#2a2520",fontSize:14,flexShrink:0,transition:"color 0.1s"}}>›</span>
                  </div>
                );
              })}
            </div>

            {/* New button */}
            <div style={{padding:"8px 10px",borderTop:`1px solid ${BORDER}`,background:BG2,flexShrink:0}}>
              <button onClick={tab==="handouts"?newH:newC} style={{
                width:"100%",padding:"6px",fontSize:9,
                border:`1px dashed ${GOLD}30`,borderRadius:3,background:"transparent",
                color:"#3a3028",cursor:"pointer",fontFamily:"'Cinzel',serif",
                letterSpacing:"0.08em",transition:"all 0.15s"}}
                onMouseEnter={e=>{e.target.style.color=GOLD;e.target.style.borderColor=GOLD+"55";}}
                onMouseLeave={e=>{e.target.style.color="#3a3028";e.target.style.borderColor=GOLD+"30";}}>
                + NOU {tab==="handouts"?"HANDOUT":"PERSONATGE"}
              </button>
            </div>
          </div>

          {/* DETAIL */}
          {item&&(mob?(showD?Detail:null):<div style={{flex:1,overflowY:"auto",position:"relative"}}>{Detail}</div>)}
        </div>
      </div>
    </>
  );
}
