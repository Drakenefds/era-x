(function () {
  const levels = Array.from({ length: 21 }, function (_, index) {
    return index * 5;
  });

  const categoryLabels = {
    deuses: "Deuses",
    lendas: "Lendas",
    devotos: "Devotos",
    espiritos: "Espíritos",
    "encantados-maldicoes": "Encantados e Maldições"
  };

  const categoryDifficulty = {
    deuses: "Difícil",
    lendas: "Médio",
    devotos: "Médio",
    espiritos: "Fácil",
    "encantados-maldicoes": "Difícil"
  };

  const categoryRunes = {
    deuses: "✦✦✦",
    lendas: "✦✦",
    devotos: "✦✦",
    espiritos: "✦",
    "encantados-maldicoes": "✦✦✦"
  };

  const ranks = [
    "Despertar",
    "Primeiro Sinal",
    "Marca Pequena",
    "Chamado Inicial",
    "Domínio Baixo",
    "Pacto Vivo",
    "Autoridade Local",
    "Presença Firmada",
    "Domínio Médio",
    "Lei da Lenda",
    "Meia Coroa",
    "Vontade Aberta",
    "Selo Antigo",
    "Território Obediente",
    "Domínio Alto",
    "Presságio Maior",
    "Milagre Raro",
    "Lenda Encarnada",
    "Soberania Mítica",
    "Limiar Divino",
    "Apoteose"
  ];

  const passiveNames = [
    "Sangue do Presságio",
    "Perícia Simbólica",
    "Afinidade Natural",
    "Resistência Herdeira",
    "Sentido de Território",
    "Corpo Marcado",
    "Aura de Respeito",
    "Leitura de Rastro",
    "Vigor Encantado",
    "Benção de Domínio",
    "Guardião Interior",
    "Memória dos Causos",
    "Autoridade de Nome",
    "Proteção do Encanto",
    "Manto de Presença",
    "Sinal Inevitável",
    "Vínculo de Linhagem",
    "Território Sagrado",
    "Imunidade Lendária",
    "Destino de Encantado",
    "Forma Plena"
  ];

  const activeNames = [
    "Toque do Encanto",
    "Comando de Sinal",
    "Rajada Ancestral",
    "Mimetismo de Lenda",
    "Marca de Castigo",
    "Invocação Menor",
    "Zona de Presságio",
    "Golpe de Domínio",
    "Trança de Caminhos",
    "Chamado do Território",
    "Sentença do Causo",
    "Forma de Guerra",
    "Campo Encantado",
    "Quebra de Vontade",
    "Invocação Maior",
    "Rito de Virada",
    "Cárcere de Domínio",
    "Milagre de Cena",
    "Decreto da Lenda",
    "Último Presságio",
    "Apoteose Ativa"
  ];

  const passivePatterns = [
    "resistência",
    "perícia",
    "afinidade",
    "regeneração",
    "sentido",
    "aura",
    "imunidade",
    "empoderamento"
  ];

  const activePatterns = [
    "cinese",
    "invocação",
    "maldição",
    "campo",
    "mobilidade",
    "controle",
    "cura",
    "execução"
  ];

  const beings = [
    { category: "deuses", icon: "🌎", name: "Tupã", epithet: "Senhor do trovão, da criação e da ordem celeste", source: "trovões, criação, céu e justiça", themes: ["trovão", "vento sagrado", "ordem"], base: "relatos tupi-guarani sobre o senhor do trovão e criador", mechanic: "Carga do Céu: a cada uso de poder climático ou a cada turno sob chuva, acumula uma carga. Cargas aumentam dano, alcance ou autoridade de efeitos ligados ao céu." },
    { category: "deuses", icon: "🌕", name: "Jaci", epithet: "Senhora da lua, dos sonhos e dos ritmos noturnos", source: "lua, noite, marés e presságios", themes: ["luar", "sonho", "maré"], base: "contos indígenas sobre a lua, fertilidade e proteção noturna", mechanic: "Fases de Jaci: alterna entre Crescente, Cheia, Minguante e Nova. Cada fase muda a função dos poderes entre cura, revelação, ocultação e controle emocional." },
    { category: "deuses", icon: "☀️", name: "Guaraci", epithet: "Senhor do sol, da vida e da coragem manifesta", source: "sol, vida, coragem e revelação", themes: ["sol", "calor", "clareza"], base: "narrativas tupi-guarani ligadas ao sol e ao ciclo da vida", mechanic: "Brilho Vital: em cenas sob luz forte, acumula fulgor. O fulgor melhora cura, dano luminoso e resistência contra medo ou sombra." },
    { category: "deuses", icon: "🦌", name: "Anhangá", epithet: "Guardião assombrado das matas e da caça proibida", source: "mata, caça, culpa e punição", themes: ["assombro", "veado branco", "culpa"], base: "relatos de protetor das matas que pune caçadores cruéis", mechanic: "Culpa da Caça: inimigos que ferem animais, espíritos ou inocentes recebem marcas. Marcas ampliam medo, rastreio e punições de Anhangá." },
    { category: "deuses", icon: "❤️", name: "Rudá", epithet: "Deus dos vínculos, da saudade e dos amores declarados", source: "amor, desejo, união e saudade", themes: ["encanto", "coração", "saudade"], base: "tradições sobre o deus do amor e dos vínculos afetivos", mechanic: "Laço Vivo: cria vínculos com aliados ou alvos. Laços podem transferir cura, dividir dano, intensificar persuasão ou quebrar hostilidade." },
    { category: "deuses", icon: "🖤", name: "Ticê", epithet: "Senhora da noite, do silêncio e da passagem final", source: "noite, morte, silêncio e passagem", themes: ["sombra", "luto", "silêncio"], base: "mitos ligados à noite, ao repouso e aos limites da vida", mechanic: "Véu da Passagem: acumula silêncio quando apaga luzes, encerra conflitos ou toca mortos. O silêncio fortalece ocultação, necrose e proteção espiritual." },

    { category: "lendas", icon: "🦋", name: "Cuca", epithet: "Bruxa dos pesadelos, da vigília e do medo de dormir", source: "pesadelo, bruxaria e medo infantil", themes: ["pesadelo", "feitiço", "vigília"], base: "cantigas, causos familiares e relatos de assombração noturna", mechanic: "Medidor de Vigília: alvos cansados, assustados ou insones ficam mais vulneráveis. A Cuca troca sono por debuffs mentais e ilusões." },
    { category: "lendas", icon: "🔥", name: "Curupira", epithet: "Guardião dos caminhos trocados e da mata ferida", source: "floresta, rastros e vingança ecológica", themes: ["rastro invertido", "brasa", "mata"], base: "causos de guardião da mata que confunde caçadores", mechanic: "Rastro Invertido: cada deslocamento em mata cria rastros falsos. Quanto mais rastros, mais fácil confundir, prender ou punir invasores." },
    { category: "lendas", icon: "🐬", name: "Boto Cor de Rosa", epithet: "Encantado das festas, dos rios e dos segredos", source: "sedução, festa, rio e segredo", themes: ["encanto", "rio", "disfarce"], base: "relatos amazônicos sobre o visitante das festas ribeirinhas", mechanic: "Máscara de Festa: alterna entre forma social e forma de rio. Em festa, ganha persuasão; na água, ganha mobilidade e domínio emocional." },
    { category: "lendas", icon: "🐗", name: "Caipora", epithet: "Dona da caça justa e dos pactos de mata", source: "caça, animais e pacto da mata", themes: ["montaria", "fumo", "proteção"], base: "histórias de protetora dos bichos e das caçadas justas", mechanic: "Pacto de Caça: pode aceitar oferendas narrativas. Quando o pacto é respeitado, animais ajudam; quando é quebrado, a mata pune." },
    { category: "lendas", icon: "🪙", name: "Mãe-do-Ouro", epithet: "Luz das serras, das minas e da cobiça castigada", source: "ouro, fogo-fátuo e tesouros ocultos", themes: ["ouro", "labareda", "cobiça"], base: "relatos de luzes sobre serras, minas e riquezas escondidas", mechanic: "Cobiça Reluzente: riquezas marcadas atraem desejo. Quem tenta roubar ou explorar demais alimenta a luz e sofre punições minerais." },
    { category: "lendas", icon: "🎋", name: "Saci", epithet: "Travesso do redemoinho, do assobio e do azar pequeno", source: "vento, trapaça, assobio e azar", themes: ["redemoinho", "assobio", "travessura"], base: "contos populares sobre o menino de uma perna e carapuça vermelha", mechanic: "Travessura Acumulada: cada ação criativa ou provocação gera ponto de travessura. Pontos viram desvio, sabotagem, azar ou deslocamento curto." },
    { category: "lendas", icon: "🦉", name: "Matinta Pereira", epithet: "Assobio noturno, promessa cobrada e bruxaria amazônica", source: "assobio, cobrança e bruxaria", themes: ["assobio", "praga", "visita"], base: "relatos amazônicos de assobio noturno e promessa cobrada", mechanic: "Promessa da Noite: quando alguém responde ao assobio ou promete algo, cria dívida. Dívidas alimentam pragas, rastreio e visitas inevitáveis." },
    { category: "lendas", icon: "🧜🏾‍♀️", name: "Iara", epithet: "Mãe d'água do canto, do espelho e da correnteza", source: "canto, água, beleza e afogamento", themes: ["canto", "correnteza", "espelho"], base: "causos de rios sobre a mãe-d'água e seu chamado", mechanic: "Canto de Correnteza: quanto mais tempo o alvo ouve, mais difícil resistir. Água próxima amplia alcance, ilusão e controle de movimento." },

    { category: "devotos", icon: "🐍", name: "Devotos de Boitatá", epithet: "Servos da cobra de fogo que guarda campos e matas", source: "fogo, cobra de luz e proteção dos campos", themes: ["fogo vivo", "olhos de chama", "campo"], base: "relatos sobre a serpente luminosa que pune incêndios e profanações", mechanic: "Olhos de Chama: absorve luz e fogo justo. Incêndio criminoso, profanação ou dano ambiental converte-se em carga punitiva." },
    { category: "devotos", icon: "😇", name: "Cobra Norato e Maria Caninana", epithet: "Dualidade amazônica entre proteção e fúria serpentina", source: "dualidade, rio, serpente e destino", themes: ["pele de cobra", "rio profundo", "dualidade"], base: "narrativas amazônicas sobre Honorato e Caninana", mechanic: "Duas Peles: alterna Honorato e Caninana. Uma pele protege e cura; a outra persegue, aperta e envenena." },
    { category: "devotos", icon: "🛡️", name: "Icamiabas", epithet: "Guerreiras de disciplina, flecha e honra ancestral", source: "guerra, disciplina e proteção ancestral", themes: ["escudo", "flecha", "honra"], base: "relatos coloniais e lendas sobre guerreiras amazônicas", mechanic: "Formação de Guerra: quanto mais aliadas coordenadas, maior o bônus. Quebrar disciplina reduz dano recebido, mas limita ações impulsivas." },
    { category: "devotos", icon: "🪷", name: "Vitória-Régia", epithet: "Flor lunar do lago, do sacrifício e do amor impossível", source: "lago, lua, transformação e sacrifício", themes: ["lótus", "lago", "devoção"], base: "lenda indígena da jovem transformada em planta das águas", mechanic: "Flor da Lua: floresce à noite ou sobre água parada. A flor armazena cura, defesa e efeitos de transformação." },

    { category: "espiritos", icon: "🦢", name: "Garça Branca", epithet: "Espírito de margem, pureza e aviso silencioso", source: "pureza, margem, espera e aviso", themes: ["pluma", "margem", "presságio"], base: "observações ribeirinhas e simbolismo de aves das águas", mechanic: "Espera da Margem: ficar imóvel ou proteger alguém acumula serenidade. Serenidade melhora esquiva, cura e presságios." },
    { category: "espiritos", icon: "🌺", name: "Beija-Flor", epithet: "Espírito da velocidade, do néctar e da alegria curta", source: "velocidade, cura leve e alegria", themes: ["néctar", "vibração", "flor"], base: "relatos populares que ligam beija-flores a visita, sorte e delicadeza", mechanic: "Batimento Veloz: ações curtas em sequência acumulam vibração. Vibração cura pouco, aumenta desvio e fortalece apoio rápido." },
    { category: "espiritos", icon: "🦅", name: "Harpia Brasileira", epithet: "Espírito de altura, garra e soberania aérea", source: "altura, caça, visão e soberania", themes: ["garra", "altitude", "olhar"], base: "presença real da harpia nas matas e respeito dado à ave", mechanic: "Olhar do Dossel: quanto maior a altura, maior a precisão. Perde força em ambientes apertados, mas domina emboscadas." },
    { category: "espiritos", icon: "🐕", name: "Lobo Guará", epithet: "Espírito do cerrado, do faro e da caminhada solitária", source: "cerrado, caminhada, faro e solidão", themes: ["faro", "cerrado", "passo longo"], base: "encontros do cerrado e simbolismo do lobo de pernas altas", mechanic: "Passo do Cerrado: deslocamentos longos acumulam faro. Faro revela trilhas, fraquezas e rotas de fuga." },
    { category: "espiritos", icon: "🐍", name: "Sucuri", epithet: "Espírito da água parada, da espera e do aperto inevitável", source: "força, água parada e constrição", themes: ["aperto", "brejo", "espera"], base: "relatos de rios, igarapés e encontros com grandes serpentes", mechanic: "Espiral de Pressão: cada turno agarrando ou cercando aumenta constrição. A constrição reduz movimento e energia." },
    { category: "espiritos", icon: "💧", name: "Peixe Boi", epithet: "Espírito de mansidão, memória e fôlego profundo", source: "mansidão, resistência e memória d'água", themes: ["rio lento", "fôlego", "cuidado"], base: "observação amazônica do animal e sua ligação com águas calmas", mechanic: "Memória de Água: cenas calmas guardam energia. Energia guardada vira cura, escudo e resistência contra pressão." },
    { category: "espiritos", icon: "🐢", name: "Jabuti", epithet: "Espírito de paciência, casco e astúcia de fábula", source: "paciência, astúcia e casco", themes: ["casco", "paciência", "truque"], base: "fábulas brasileiras em que o jabuti vence pela inteligência", mechanic: "Vitória Devagar: cada turno sem pressa acumula vantagem. Vantagens viram defesa, contragolpe e solução esperta." },
    { category: "espiritos", icon: "🦜", name: "Arara Azul", epithet: "Espírito de cor, voz alta e memória de bando", source: "voz, cor, voo e memória", themes: ["pena azul", "grito", "bando"], base: "presença do Pantanal e lendas de aves mensageiras", mechanic: "Grito de Bando: comunicação clara cria ecos. Ecos ampliam ordens, alertas e ataques coordenados." },
    { category: "espiritos", icon: "🐒", name: "Mico Leão Dourado", epithet: "Espírito de agilidade, alerta e proteção coletiva", source: "agilidade, união e alerta", themes: ["salto", "dourado", "bando"], base: "símbolo real da Mata Atlântica e da proteção coletiva", mechanic: "Alarme Dourado: ao perceber perigo, marca aliados próximos. Marcados recebem deslocamento, esquiva e resposta rápida." },
    { category: "espiritos", icon: "🐆", name: "Onça Pintada", epithet: "Espírito da emboscada, do rugido e da majestade predadora", source: "predação, sombra e majestade", themes: ["pintura", "emboscada", "rugido"], base: "relatos de mata sobre a maior caçadora das Américas", mechanic: "Pintura de Caça: ficar oculto cria marcas de presa. A primeira ação contra presa marcada recebe dano e medo ampliados." },

    { category: "encantados-maldicoes", icon: "🐚", name: "Sereias", epithet: "Encantadas do mar, da voz e do naufrágio emocional", source: "mar, voz, desejo e naufrágio", themes: ["canto salgado", "concha", "maré"], base: "relatos litorâneos sobre vozes no mar e encantamento de navegantes", mechanic: "Maré de Desejo: voz e água criam fascínio. Fascínio acumula até virar obediência breve, esquecimento ou naufrágio de vontade." },
    { category: "encantados-maldicoes", icon: "🐴", name: "Mula-Sem-Cabeça", epithet: "Maldição de fogo, culpa e galope sem freio", source: "fogo, culpa, corrida e maldição", themes: ["chama", "galope", "castigo"], base: "causos rurais sobre aparição em noites marcadas", mechanic: "Galope Maldito: quanto mais corre, mais fogo acumula. Parar bruscamente cobra dano, mas libera explosões e medo." },
    { category: "encantados-maldicoes", icon: "🐺", name: "Lobisomem", epithet: "Maldição de lua, fome e transformação perseguida", source: "lua, fome, transformação e perseguição", themes: ["lua cheia", "garra", "faro"], base: "relatos rurais de sétimo filho, encruzilhada e fera noturna", mechanic: "Fome Lunar: ferir, farejar sangue ou lutar à noite acumula fome. Fome melhora físico, mas dificulta controle emocional." },
    { category: "encantados-maldicoes", icon: "💀", name: "Corpo Seco", epithet: "Maldição de rancor, terra recusada e corpo sem descanso", source: "maldição, terra recusada e rancor", themes: ["terra seca", "ossos", "rancor"], base: "causos sobre morto rejeitado pela terra por maldade extrema", mechanic: "Rancor Insepulto: dano recebido vira rancor. Rancor fortalece maldições, resistência e efeitos de decomposição." }
  ];

  function slugify(text) {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function percent(index, base, step, cap) {
    return Math.min(cap, base + index * step);
  }

  function range(level, index, multiplier) {
    return Math.max(3, Math.round((level || 5) * multiplier + index));
  }

  function uses(index) {
    if (index < 5) return "uma vez a cada quatro turnos";
    if (index < 10) return "duas vezes por combate";
    if (index < 15) return "uma vez a cada três turnos";
    if (index < 20) return "três vezes por ocasião";
    return "uma vez por ocasião";
  }

  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getTheme(being, index, offset) {
    return being.themes[(index + (offset || 0)) % being.themes.length];
  }

  function makePassive(being, level, index) {
    const theme = getTheme(being, index);
    const nextTheme = getTheme(being, index, 1);
    const pattern = passivePatterns[index % passivePatterns.length];
    const title = `${passiveNames[index]} - ${theme}`;
    const buff = percent(index, 10, 4, 85);
    const resist = percent(index, 15, 3, 75);
    const area = range(level, index, 0.7);

    const lore = `Por nascer da tradição de ${being.base}, o domínio de ${theme} aparece primeiro no corpo, nos sentidos e na presença do personagem.`;
    let effect;
    let bonus;
    let limit;

    if (pattern === "resistência") {
      effect = `Reduz em ${resist}% efeitos hostis ligados a ${being.source}. Se a ameaça vier de uma cena coerente com ${nextTheme}, a resistência também protege um aliado em até ${area} metros.`;
      bonus = `Ao resistir com sucesso, recupera ${Math.max(5, Math.floor(buff / 2))}% de energia ou recebe +${Math.floor(buff / 3)}% no próximo teste defensivo.`;
      limit = "Não bloqueia consequências narrativas maiores sem custo ou autorização do narrador.";
    } else if (pattern === "perícia") {
      effect = `Ganha domínio instintivo sobre armas, gestos ou ferramentas associadas a ${theme}. Ações criativas dentro do tema recebem +${buff}% de precisão.`;
      bonus = `Quando usa um símbolo apropriado em cena, seus poderes de ${nextTheme} custam ${Math.min(35, 5 + index)}% menos energia.`;
      limit = "A perícia não cria equipamento do nada; ela melhora o uso do que existe na cena.";
    } else if (pattern === "afinidade") {
      effect = `Animais, espíritos menores e sinais naturais ligados a ${theme} reconhecem a marca do personagem e hesitam antes de atacá-lo.`;
      bonus = `Pode compreender intenções simples e receber +${buff}% em diplomacia, rastreio ou leitura de ambiente dentro desse domínio.`;
      limit = "Criaturas mais fortes ainda podem resistir se forem comandadas por entidade superior.";
    } else if (pattern === "regeneração") {
      effect = `Sempre que permanece um turno inteiro próximo de ${theme}, restaura ${Math.max(5, Math.floor(buff / 2))}% de vida ou energia, escolhendo um dos dois.`;
      bonus = `Se estiver protegendo alguém ou cumprindo a mecânica exclusiva, a restauração aumenta em +${Math.floor(buff / 4)}%.`;
      limit = "A regeneração para quando o personagem age contra a própria natureza mítica.";
    } else if (pattern === "sentido") {
      effect = `Percebe alterações de ${theme} em até ${area * 2} metros, incluindo rastros, emoções, presságios ou deslocamentos compatíveis.`;
      bonus = `A primeira reação contra uma ameaça detectada recebe +${buff}% de velocidade narrativa ou defesa.`;
      limit = "Não revela segredos absolutos; entrega pistas, direção e intensidade.";
    } else if (pattern === "aura") {
      effect = `Emite uma aura de ${theme} por ${area} metros. Inimigos vulneráveis ao mito sofrem -${Math.floor(buff / 2)}% em coragem, foco ou agressão direta.`;
      bonus = `Aliados dentro da aura recebem +${Math.floor(buff / 2)}% contra medo, confusão ou efeitos de pressão espiritual.`;
      limit = "A aura exige presença clara; ocultação total ou silêncio ritual reduzem o efeito.";
    } else if (pattern === "imunidade") {
      effect = `Torna-se imune a manifestações fracas de ${theme} e recebe ${resist}% de resistência contra fontes superiores.`;
      bonus = `Depois de sofrer o mesmo tipo de efeito, ganha +10% de resistência acumulativa até o fim da cena, limite de ${Math.min(95, resist + 30)}%.`;
      limit = "Imunidade não vale contra poderes de escala divina sem disputa narrativa.";
    } else {
      effect = `Quando a cena favorece ${theme}, todos os poderes do personagem relacionados a ${being.source} ficam mais intensos.`;
      bonus = `Recebe +${buff}% de alcance, duração ou potência, escolhido no momento em que a habilidade é narrada.`;
      limit = "O bônus não acumula com outro empoderamento do mesmo tipo.";
    }

    return { title, lore, effect, bonus, limit };
  }

  function makeActive(being, level, index) {
    const theme = getTheme(being, index, 1);
    const nextTheme = getTheme(being, index, 2);
    const pattern = activePatterns[index % activePatterns.length];
    const title = `${activeNames[index]} - ${theme}`;
    const power = percent(index, 15, 5, 100);
    const area = range(level, index, 1.15);
    const duration = Math.min(5, 1 + Math.floor(index / 5));
    const lore = `A habilidade transforma o símbolo de ${theme} em ação direta, imitando a lógica dos causos em que ${being.name} interfere no mundo visível.`;
    let effect;
    let bonus;
    let limit;

    if (pattern === "cinese") {
      effect = `${uses(index)}, manipula ${theme} em até ${area} metros. Pode empurrar, prender, cortar, apagar rastros ou moldar o ambiente conforme a natureza do ser.`;
      bonus = `A força máxima do efeito recebe +${power}% e pode aplicar uma condição leve ligada a ${nextTheme} por ${duration} turno(s).`;
      limit = "Enquanto sustenta a cinese, não usa outra ativa de controle contínuo.";
    } else if (pattern === "invocação") {
      effect = `${uses(index)}, chama manifestações menores de ${theme}: sombras, animais, luzes, ventos, plantas, vozes ou formas espirituais.`;
      bonus = `As invocações duram ${duration + 1} turno(s), têm atributos proporcionais ao domínio ${level} e recebem +${Math.floor(power / 2)}% se estiverem no território correto.`;
      limit = "Invocações desaparecem se o personagem quebrar o pacto central da própria lenda.";
    } else if (pattern === "maldição") {
      effect = `${uses(index)}, marca um alvo com uma punição de ${theme}. A marca reduz movimento, foco, cura ou dano em ${Math.floor(power / 2)}%.`;
      bonus = `Se o alvo tiver cometido uma ação contrária ao mito de ${being.name}, a maldição dura +1 turno e também causa dano narrativo recorrente.`;
      limit = "Alvos sem culpa, vínculo ou exposição ao símbolo podem resistir com mais facilidade.";
    } else if (pattern === "campo") {
      effect = `${uses(index)}, cria uma zona de ${theme} em ${area} metros por ${duration} turno(s), alterando luz, som, terreno, água, vento ou medo.`;
      bonus = `Aliados coerentes com o domínio recebem +${Math.floor(power / 2)}%; inimigos que contrariem a lenda sofrem -${Math.floor(power / 3)}%.`;
      limit = "Campos opostos podem disputar a área; vence quem tiver maior domínio ou melhor preparação.";
    } else if (pattern === "mobilidade") {
      effect = `${uses(index)}, desloca-se através de ${theme}: salto, mergulho, redemoinho, sombra, voo curto ou avanço predatório.`;
      bonus = `Percorre até ${area} metros e recebe +${power}% de evasão até o fim do turno.`;
      limit = "Não atravessa barreiras sagradas, selos ou ambientes sem conexão com o tema.";
    } else if (pattern === "controle") {
      effect = `${uses(index)}, impõe uma ordem simbólica por meio de ${theme}. O alvo pode ser atraído, silenciado, confundido, acalmado ou forçado a recuar.`;
      bonus = `A ordem afeta até ${Math.max(1, Math.floor(index / 5) + 1)} alvo(s) e ganha +${Math.floor(power / 2)}% se houver preparo ritual.`;
      limit = "Ordens suicidas, absolutas ou fora do domínio exigem custo maior e decisão do narrador.";
    } else if (pattern === "cura") {
      effect = `${uses(index)}, converte ${theme} em restauração. Cura um aliado ou purga uma condição compatível com ${being.source}.`;
      bonus = `Restaura ${Math.floor(power / 2)}% de vida ou energia; se usado após proteger alguém, adiciona +${Math.floor(power / 5)}%.`;
      limit = "Não revive mortos antes do domínio 80, salvo se a lenda do ser permitir e houver sacrifício.";
    } else {
      effect = `Uma vez por ocasião, libera a face mais perigosa de ${theme} contra um alvo ou ponto em até ${area} metros.`;
      bonus = `Causa impacto de escala ${level}, ignora ${Math.floor(power / 3)}% de resistência comum e deixa uma consequência de cena por ${duration} turno(s).`;
      limit = "Uso extremo sempre cobra exaustão, dívida espiritual ou reação do território.";
    }

    return { title, lore, effect, bonus, limit };
  }

  function createPowerCard(being, level, index, type) {
    const data = type === "passive" ? makePassive(being, level, index) : makeActive(being, level, index);
    const article = document.createElement("article");
    article.className = `power-entry ${type}`;
    article.innerHTML = `
      <div class="power-entry-level">
        <span>${level}</span>
        <small>${ranks[index]}</small>
      </div>
      <div class="power-entry-copy">
        <h5>${escapeHtml(data.title)}</h5>
        <p><b>Fundamento:</b> ${escapeHtml(data.lore)}</p>
        <p><b>Como funciona:</b> ${escapeHtml(data.effect)}</p>
        <p><b>Buff:</b> ${escapeHtml(data.bonus)}</p>
        <p><b>Limite:</b> ${escapeHtml(data.limit)}</p>
      </div>
    `;
    return article;
  }

  function createPowerSection(being, type) {
    const section = document.createElement("section");
    section.className = `power-section ${type}`;
    section.innerHTML = `
      <header>
        <span>${type === "passive" ? "✯ Poderes Passivos ✯" : "✯ Poderes Ativos ✯"}</span>
        <p>${type === "passive" ? "Efeitos sempre presentes, ligados ao sangue, ao território e ao mito." : "Técnicas declaradas em cena, com custo, alcance, duração e consequência."}</p>
      </header>
    `;

    const list = document.createElement("div");
    list.className = "power-section-list";
    levels.forEach(function (level, index) {
      list.appendChild(createPowerCard(being, level, index, type));
    });
    section.appendChild(list);
    return section;
  }

  function createBeingCard(being) {
    const details = document.createElement("details");
    details.className = "being-card codex-being";
    details.dataset.category = being.category;
    details.dataset.name = being.name.toLowerCase();
    details.id = slugify(being.name);

    const summary = document.createElement("summary");
    summary.innerHTML = `
      <span class="being-icon">${being.icon}</span>
      <span>
        <small>${categoryLabels[being.category]}</small>
        <strong>${escapeHtml(being.name)}</strong>
        <em>${escapeHtml(being.epithet)}</em>
      </span>
      <b>0-100</b>
    `;
    details.appendChild(summary);

    const body = document.createElement("div");
    body.className = "being-body codex-body";
    body.innerHTML = `
      <div class="being-profile">
        <div class="being-portrait" aria-hidden="true">
          <span>${being.icon}</span>
        </div>
        <div class="being-profile-copy">
          <p class="eyebrow">${categoryLabels[being.category]}</p>
          <h4>${escapeHtml(being.name)}</h4>
          <p>${escapeHtml(being.epithet)}. Domínios principais: ${escapeHtml(being.source)}.</p>
          <div class="being-tags">
            ${being.themes.map(function (theme) { return `<span>${escapeHtml(theme)}</span>`; }).join("")}
          </div>
        </div>
      </div>

      <div class="mechanic-grid">
        <article>
          <small>Nível de dificuldade</small>
          <strong>${categoryDifficulty[being.category]} <span>${categoryRunes[being.category]}</span></strong>
        </article>
        <article>
          <small>Mecânica exclusiva</small>
          <p>${escapeHtml(being.mechanic)}</p>
        </article>
        <article>
          <small>Inspiração</small>
          <p>${escapeHtml(being.base)}. A adaptação usa tema, símbolo e lógica narrativa, não texto copiado de outros kits.</p>
        </article>
      </div>
    `;

    const columns = document.createElement("div");
    columns.className = "power-columns";
    columns.appendChild(createPowerSection(being, "passive"));
    columns.appendChild(createPowerSection(being, "active"));

    body.appendChild(columns);
    details.appendChild(body);
    return details;
  }

  function createCategorySection(category, items) {
    const section = document.createElement("section");
    section.className = "powers-category";
    section.id = category;
    section.dataset.categorySection = category;

    const heading = document.createElement("div");
    heading.className = "powers-category-heading";
    heading.innerHTML = `
      <p class="eyebrow">${items.length} seres cadastrados</p>
      <h3>${categoryLabels[category]}</h3>
    `;
    section.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "being-stack";
    items.forEach(function (being) {
      grid.appendChild(createBeingCard(being));
    });
    section.appendChild(grid);

    return section;
  }

  function renderCatalog() {
    const catalog = document.getElementById("powersCatalog");
    if (!catalog) return;
    catalog.innerHTML = "";

    Object.keys(categoryLabels).forEach(function (category) {
      const items = beings.filter(function (being) {
        return being.category === category;
      });
      catalog.appendChild(createCategorySection(category, items));
    });
  }

  function applyFilters() {
    const searchInput = document.getElementById("powerSearch");
    const categoryInput = document.getElementById("powerCategory");
    const search = (searchInput.value || "").trim().toLowerCase();
    const category = categoryInput.value;

    document.querySelectorAll(".being-card").forEach(function (card) {
      const matchesName = !search || card.dataset.name.includes(search);
      const matchesCategory = category === "all" || card.dataset.category === category;
      card.hidden = !matchesName || !matchesCategory;
    });

    document.querySelectorAll("[data-category-section]").forEach(function (section) {
      const visible = Array.from(section.querySelectorAll(".being-card")).some(function (card) {
        return !card.hidden;
      });
      section.hidden = !visible;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("powerSearch");
    const categoryInput = document.getElementById("powerCategory");
    renderCatalog();
    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (categoryInput) categoryInput.addEventListener("change", applyFilters);
  });
})();
