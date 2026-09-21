// ============================================
// DADOS DOS CANDIDATOS À PRESIDÊNCIA 2026
// Fonte: TSE / DivulgaCandContas / PDF do projeto
// ============================================

const CANDIDATOS_PRESIDENTE = [
    {
        id: 1,
        nome: "Luiz Inácio Lula da Silva",
        nomeCompleto: "LUIZ INÁCIO LULA DA SILVA",
        partido: "PT",
        partidoNome: "Partido dos Trabalhadores",
        numero: 13,
        vice: "Geraldo Alckmin",
        vicePartido: "PSB",
        coligacao: "Brasil da Esperança",
        nascimento: "06/10/1945",
        naturalidade: "Brasileira Nata / PE - Garanhuns",
        profissao: "Torneiro Mecânico",
        formacao: "Ensino Fundamental Completo",
        trajetoria: "Político e ex-sindicalista. Sua trajetória começou no movimento sindical do ABC paulista, ligada à organização dos trabalhadores metalúrgicos. Foi um dos fundadores do Partido dos Trabalhadores. Foi presidente da República entre 2003 e 2010 e voltou à Presidência em 2023. Em 2026, disputa a reeleição pelo PT.",
        statusTSE: "Validado",
        foto: "/static/imagens/presidentes/lula.png",
        propostas: {
            "Democracia": [
                "Ampliação da participação social na elaboração e acompanhamento das políticas públicas",
                "Fortalecimento dos serviços públicos digitais",
                "Ampliação das políticas de redução das desigualdades"
            ],
            "Saúde": ["Fortalecimento do SUS"],
            "Educação": ["Políticas de expansão e melhoria da educação"],
            "Trabalho e Economia": [
                "Valorização do trabalho e geração de empregos",
                "Desenvolvimento industrial"
            ],
            "Meio Ambiente e Energia": [
                "Transição energética",
                "Proteção ambiental",
                "Políticas para povos indígenas e comunidades tradicionais"
            ],
            "Política Externa": [
                "Fortalecimento da participação do Brasil em organismos e relações internacionais"
            ]
        }
    },
    {
        id: 2,
        nome: "Flávio Bolsonaro",
        nomeCompleto: "Flávio Nantes Bolsonaro",
        partido: "PL",
        partidoNome: "Partido Liberal",
        numero: 22,
        vice: "Alfredo Gaspar",
        vicePartido: "",
        coligacao: "",
        nascimento: "30/04/1981",
        naturalidade: "Brasileira Nata / RJ - Resende",
        profissao: "Senador",
        formacao: "Superior Completo",
        trajetoria: "Advogado e político. É filho do ex-presidente Jair Bolsonaro. Foi deputado estadual no Rio de Janeiro e posteriormente eleito senador pelo estado. Em 2026, concorre à Presidência pelo Partido Liberal.",
        statusTSE: "Deferido",
        foto: "/static/imagens/presidentes/flavio-bolsonaro.png",
        propostas: {
            "Segurança Pública": [
                "Combate ao crime organizado",
                "Bloqueio de recursos financeiros de organizações criminosas",
                "Investimentos em inteligência policial",
                "Utilização de tecnologia na segurança",
                "Fortalecimento do controle das fronteiras",
                "Construção de estruturas de segurança de alta proteção"
            ],
            "Economia": [
                "Medidas de desburocratização",
                "Estímulo ao empreendedorismo"
            ],
            "Educação": ["Políticas para educação"],
            "Desenvolvimento Social": [
                "Políticas direcionadas às mulheres e ao desenvolvimento social"
            ]
        }
    },
    {
        id: 3,
        nome: "Romeu Zema",
        nomeCompleto: "Romeu Zema Neto",
        partido: "NOVO",
        partidoNome: "Partido Novo",
        numero: 30,
        vice: "Eduardo Girão",
        vicePartido: "",
        coligacao: "",
        nascimento: "28/10/1964",
        naturalidade: "Brasileira Nata / MG - Araxá",
        profissao: "Empresário",
        formacao: "Superior Completo",
        trajetoria: "Empresário e político. Foi eleito governador de Minas Gerais em 2018 e reeleito em 2022. Em 2026, disputa a Presidência pelo Partido Novo.",
        statusTSE: "Deferido",
        foto: "/static/imagens/presidentes/romeu-zema.png",
        propostas: {
            "Segurança Pública": [
                "Combate ao crime organizado",
                "Construção de presídios de segurança máxima",
                "Fortalecimento das forças de segurança",
                "Mudanças na legislação penal",
                "Redução da maioridade penal para 16 anos"
            ],
            "Administração Pública": [
                "Combate à corrupção",
                "Combate a supersalários e privilégios",
                "Desburocratização"
            ],
            "Economia": [
                "Responsabilidade fiscal",
                "Estímulo à iniciativa privada"
            ],
            "Educação e Infraestrutura": ["Investimentos"]
        }
    },
    {
        id: 4,
        nome: "Ronaldo Caiado",
        nomeCompleto: "Ronaldo Ramos Caiado",
        partido: "PSD",
        partidoNome: "Partido Social Democrático",
        numero: 55,
        vice: "Gilberto Kassab",
        vicePartido: "",
        coligacao: "",
        nascimento: "25/09/1949",
        naturalidade: "Brasileira Nata / GO - Anápolis",
        profissao: "Médico",
        formacao: "Superior Completo",
        trajetoria: "Médico ortopedista e político. Foi governador de Goiás, eleito duas vezes. Sua trajetória inclui cinco mandatos como deputado federal e participação na política ligada ao setor agropecuário. Também disputou a Presidência em 1989. Em 2026, concorre pelo PSD.",
        statusTSE: "Deferido",
        foto: "/static/imagens/presidentes/ronaldo-caiado.png",
        propostas: {
            "Economia": [
                "Responsabilidade fiscal",
                "Estímulo ao investimento e à atividade econômica"
            ],
            "Administração": [
                "Combate à corrupção",
                "Combate a privilégios e supersalários"
            ],
            "Segurança Pública": [
                "Combate às organizações criminosas",
                "Construção de presídios de segurança máxima",
                "Mudanças na legislação penal"
            ],
            "Saúde": ["Propostas para saúde e redução de filas"],
            "Educação": ["Políticas educacionais"],
            "Infraestrutura": ["Investimentos em infraestrutura"],
            "Meio Ambiente": ["Políticas ambientais"]
        }
    },
    {
        id: 5,
        nome: "Samara Martins",
        nomeCompleto: "Samara Martins",
        partido: "UP",
        partidoNome: "Unidade Popular",
        numero: 80,
        vice: "Raquel Brício",
        vicePartido: "",
        coligacao: "",
        nascimento: "31/08/1987",
        naturalidade: "Brasileira Nata / MG - Belo Horizonte",
        profissao: "Odontóloga",
        formacao: "Superior Completo",
        trajetoria: "Candidata da Unidade Popular à Presidência da República. O partido apresenta uma plataforma baseada principalmente em políticas sociais, direitos trabalhistas e ampliação dos serviços públicos.",
        statusTSE: "Deferido",
        foto: "/static/imagens/presidentes/samara-martins.png",
        propostas: {
            "Trabalho": [
                "Fim da escala 6x1",
                "Redução da jornada de trabalho",
                "Aumento do salário mínimo",
                "Revogação das reformas trabalhista e previdenciária",
                "Regulamentação do trabalho por aplicativos"
            ],
            "Saúde": [
                "Fortalecimento do SUS",
                "Produção nacional de medicamentos e vacinas"
            ],
            "Habitação e Saneamento": [
                "Ampliação de políticas habitacionais",
                "Ampliação do saneamento"
            ],
            "Tributação": ["Tributação progressiva"],
            "Direitos": [
                "Políticas para mulheres, juventude, população negra e povos indígenas"
            ]
        }
    },
    {
        id: 6,
        nome: "Renan Santos",
        nomeCompleto: "Renan Antônio Ferreira dos Santos",
        partido: "MISSAO",
        partidoNome: "Partido Missão",
        numero: 14,
        vice: "Coronel Medina",
        vicePartido: "",
        coligacao: "",
        nascimento: "14/02/1984",
        naturalidade: "Brasileira Nata / SP - São Paulo",
        profissao: "Empresário",
        formacao: "Superior Incompleto",
        trajetoria: "Empresário e fundador e presidente do partido Missão. Sua trajetória política está ligada ao Movimento Brasil Livre (MBL), grupo que teve atuação destacada durante o processo de impeachment de Dilma Rousseff. Também trabalhou com o pai na recuperação de empresas em dificuldades financeiras. Em 2026, disputa pela primeira vez uma eleição como candidato.",
        statusTSE: "Deferido",
        foto: "/static/imagens/presidentes/renan-santos.png",
        propostas: {
            "Administração": [
                "Reforma administrativa",
                "Revisão de gastos públicos",
                "Combate a supersalários",
                "Reorganização da administração pública"
            ],
            "Social": ["Mudanças nos programas sociais"],
            "Economia": [
                "Geração de empregos",
                "Desenvolvimento industrial",
                "Soberania econômica e tecnológica"
            ],
            "Segurança Pública": [
                "Combate ao crime organizado",
                "Políticas de segurança"
            ],
            "Institucional": ["Mudanças institucionais"]
        }
    },
    {
        id: 7,
        nome: "Hertz Dias",
        nomeCompleto: "Hertz Dias",
        partido: "PSTU",
        partidoNome: "Partido Socialista dos Trabalhadores Unificado",
        numero: 16,
        vice: "Vanessa Portugal",
        vicePartido: "",
        coligacao: "",
        nascimento: "20/10/1970",
        naturalidade: "Brasileira Nata / MA - São José de Ribamar",
        profissao: "Professor de Ensino Fundamental",
        formacao: "Superior Completo",
        trajetoria: "Professor e militante político. Sua atuação está ligada ao movimento sindical e aos movimentos sociais. Em 2018, foi candidato ao Governo do Maranhão pelo PSTU. Em 2026, disputa a Presidência pelo PSTU.",
        statusTSE: "Deferido",
        foto: "/static/imagens/presidentes/hertz-dias.png",
        propostas: {
            "Trabalho": [
                "Fim da escala 6x1",
                "Redução da jornada de trabalho",
                "Aumento do salário mínimo",
                "Revogação das reformas trabalhista e previdenciária",
                "Regulamentação do trabalho por aplicativos"
            ],
            "Transporte": ["Tarifa zero no transporte público"],
            "Terras": ["Demarcação de terras indígenas e quilombolas"],
            "Meio Ambiente": ["Redução do uso de agrotóxicos"],
            "Segurança Pública": [
                "Câmeras corporais para agentes de segurança",
                "Funcionamento 24 horas das Delegacias da Mulher"
            ]
        }
    },
    {
        id: 8,
        nome: "Clariana Barão",
        nomeCompleto: "Clariana Barão",
        partido: "DC",
        partidoNome: "Democracia Cristã",
        numero: 27,
        vice: "Fabiana Torquato",
        vicePartido: "",
        coligacao: "",
        nascimento: "03/04/1987",
        naturalidade: "Brasileira Nata / MT - Cuiabá",
        profissao: "Advogada",
        formacao: "Superior Completo",
        trajetoria: "Candidata do partido Democracia Cristã (DC) à Presidência da República. Sua chapa tem Fabiana Torquato como candidata a vice-presidente.",
        statusTSE: "Deferido",
        foto: "/static/imagens/presidentes/clariana-barao.png",
        propostas: {
            "Economia": [
                "Desenvolvimento econômico",
                "Geração de emprego e renda",
                "Empreendedorismo"
            ],
            "Social": [
                "Educação",
                "Saúde",
                "Segurança",
                "Proteção ambiental",
                "Infraestrutura",
                "Políticas sociais"
            ]
        }
    },
    {
        id: 9,
        nome: "Edmilson Costa",
        nomeCompleto: "Edmilson Costa",
        partido: "PCB",
        partidoNome: "Partido Comunista Brasileiro",
        numero: 21,
        vice: "Cleusa Santos",
        vicePartido: "",
        coligacao: "",
        nascimento: "08/04/1950",
        naturalidade: "Brasileira Nata / MA - Pedreiras",
        profissao: "Aposentado (Exceto Servidor Público)",
        formacao: "Superior Completo",
        trajetoria: "Economista, professor e dirigente político ligado ao Partido Comunista Brasileiro (PCB). Em 2026, concorre à Presidência pelo PCB.",
        statusTSE: "Deferido",
        foto: "/static/imagens/presidentes/edmilson-costa.png",
        propostas: {
            "Democracia": [
                "Orçamento popular",
                "Participação direta da população nas decisões públicas",
                "Conselhos populares",
                "Mudanças na estrutura do Legislativo",
                "Democratização dos meios de comunicação"
            ],
            "Economia": [
                "Estatização de setores estratégicos",
                "Reforma agrária"
            ],
            "Serviços Públicos": [
                "Transporte público gratuito",
                "Fortalecimento dos serviços públicos",
                "Políticas de moradia",
                "Saneamento"
            ],
            "Meio Ambiente": ["Proteção ambiental"],
            "Trabalho": ["Ampliação dos direitos trabalhistas"]
        }
    },
    {
        id: 10,
        nome: "Augusto Cury",
        nomeCompleto: "Augusto Cury",
        partido: "AVANTE",
        partidoNome: "Partido Avante",
        numero: 70,
        vice: "Júlio Delgado",
        vicePartido: "",
        coligacao: "",
        nascimento: "02/10/1958",
        naturalidade: "Brasileira Nata / SP - Colina",
        profissao: "Escritor e Crítico",
        formacao: "Superior Completo",
        trajetoria: "Médico psiquiatra, pesquisador e escritor. Sua atuação profissional é principalmente relacionada à psiquiatria, psicologia e educação. Em 2026, concorre à Presidência pelo Avante.",
        statusTSE: "Deferido",
        foto: "/static/imagens/presidentes/augusto-cury.png",
        propostas: {
            "Educação": [
                "Mudanças no sistema educacional",
                "Desenvolvimento de habilidades socioemocionais",
                "Formação de professores"
            ],
            "Saúde": [
                "Atenção à saúde mental",
                "Políticas de inclusão de pessoas neurodivergentes"
            ],
            "Economia": [
                "Incentivo ao empreendedorismo",
                "Criação de mecanismos de financiamento para empreendedores",
                "Estímulo à inovação",
                "Desenvolvimento tecnológico",
                "Fortalecimento da indústria",
                "Incentivo às exportações"
            ]
        }
    },
    {
        id: 11,
        nome: "Rui Costa Pimenta",
        nomeCompleto: "Rui Costa Pimenta",
        partido: "PCO",
        partidoNome: "Partido da Causa Operária",
        numero: 29,
        vice: "Antônio Carlos",
        vicePartido: "",
        coligacao: "",
        nascimento: "25/06/1957",
        naturalidade: "Brasileira Nata / SP - São Paulo",
        profissao: "Jornalista e Redator",
        formacao: "Superior Completo",
        trajetoria: "Jornalista, escritor e dirigente político. É um dos principais dirigentes do Partido da Causa Operária (PCO). Em 2026, concorre novamente à Presidência pelo PCO.",
        statusTSE: "Deferido",
        foto: "/static/imagens/presidentes/rui-costa-pimenta.png",
        propostas: {
            "Trabalho": [
                "Aumento de salários",
                "Reposição das perdas salariais",
                "Redução da jornada de trabalho",
                "Políticas de proteção aos trabalhadores",
                "Proteção aos desempregados",
                "Passe livre para desempregados",
                "Ampliação dos direitos trabalhistas"
            ],
            "Social": ["Ampliação de programas de transferência de renda"],
            "Economia": ["Mudanças na organização econômica"]
        }
    },
    {
        id: 12,
        nome: "Wilson Grassi",
        nomeCompleto: "WILSON GRASSI JUNIOR",
        partido: "Democrata",
        partidoNome: "Partido Democrata",
        numero: 35,
        vice: "Suêd Haidar",
        vicePartido: "",
        coligacao: "",
        nascimento: "13/03/1970",
        naturalidade: "Brasileira Nata / SP - São Paulo",
        profissao: "Veterinário",
        formacao: "Superior Completo",
        trajetoria: "Candidato do partido Democrata à Presidência. Sua chapa tem Suêd Haidar como candidata a vice-presidente. O programa 'Brasil em Primeiro Lugar' aborda gestão pública, digitalização dos serviços, saúde, educação, segurança, infraestrutura, agricultura, meio ambiente, proteção animal, desenvolvimento econômico e defesa nacional.",
        statusTSE: "Deferido",
        foto: "/static/imagens/presidentes/wilson-grassi.png",
        propostas: {
            "Saúde": [
                "Criação de uma fila única nacional para cirurgias eletivas",
                "Integração de bases de dados públicas"
            ],
            "Infraestrutura": [
                "Investimentos em infraestrutura ferroviária",
                "Saneamento"
            ],
            "Agricultura": [
                "Políticas de rastreabilidade da produção agropecuária"
            ],
            "Outros": [
                "Gestão pública e digitalização dos serviços",
                "Educação",
                "Segurança",
                "Meio ambiente",
                "Proteção animal",
                "Desenvolvimento econômico",
                "Defesa nacional"
            ]
        }
    }
];
