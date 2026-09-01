import React, { createContext, useContext, useState } from 'react';

// Define the supported locales
export type Locale = 'en' | 'fr' | 'sw';

// Language configuration details
export const LANGUAGES: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'sw', label: 'Kiswahili', flag: '🇹🇿' },
];

// Dictionary of translations
const dictionary: Record<Locale, Record<string, any>> = {
  en: {
    nav: {
      home: 'Home',
      blog: 'Blog',
      tasks: 'Task Planner',
      whoami: 'Who Am I',
      admin: 'Admin',
    },
    hero: {
      title: 'Embedded Systems Developer',
      tagline: 'I design and build secure, optimized embedded systems, custom sensor architectures, and robust IoT solutions. Explore my latest projects below to view detailed case studies.',
      banner: 'Mechatronics & Automation Engineer',
      whoami: 'Who Am I',
      share: 'Share Public Portfolio',
      copied: 'Copied Public Link!',
    },
    projects: {
      title: 'Featured Projects',
      interactive_grid: 'Interactive Grid',
      view_case_study: 'View Case Study',
    },
    certifications: {
      title: 'Certifications',
      view_profile: 'View Full Credly Profile',
      badge_title_1: 'Certified 3DEXPERIENCE Project Planner - Associate',
      badge_title_2: 'Certified 3DEXPERIENCE 3DSwymer - Associate',
      view_credential: 'View Credential',
    },
    commits: {
      title: 'Latest GitHub Commits',
      tagline: 'Real-time developer log synced directly from my open-source repositories.',
      details: 'Details',
      refresh: 'Refresh Commit Log',
      loading: 'Fetching live commits...',
      error: 'Could not update live feed. Displaying offline records.',
      empty: 'No recent commits found.',
    },
    footer: {
      title: "Let's Work Together",
      tagline: "I'm always open to discussing new projects, creative hardware solutions, or opportunities to be part of your vision. Feel free to reach out!",
      copy_email: 'Copy Email',
      copy_linkedin: 'Copy LinkedIn Link',
      copy_portfolio: 'Copy Portfolio Link',
      copied: 'Copied!',
      copied_portfolio: 'Copied Portfolio Link!',
    },
    whoami: {
      meta_title: 'Who Am I | Javis - Mechatronics & Embedded Systems Engineer',
      meta_desc: 'Get to know Javis, a Mechatronics and Embedded Systems Engineer specializing in custom automation, IoT, and hardware design.',
      tag: 'Mechatronics & Automation Engineer',
      title: 'About Javis',
      tagline: 'Developing intelligent systems that combine electronics, mechanics, automation, and software to solve real-world challenges.',
      qualifications: 'Qualifications',
      bachelors: "Bachelor's Degree",
      bachelors_field: 'Mechatronics Engineering',
      hnd: 'Higher National Diploma (HND)',
      hnd_field: 'Industrial Computer Automation',
      cert_desc: 'Dassault Systèmes Certified 3DEXPERIENCE Project Planner (Associate) and 3DSwymer (Associate) with a strong foundation in mechanical structures, digital collaboration, motion control, and embedded telemetry.',
      verify_badge: 'Verify Dassault Credly Credentials →',
      journey_title: 'My Journey & Passion',
      journey_p1: "Hello! I'm Javis, a Mechatronics Engineer. I am deeply passionate about developing intelligent, highly responsive systems that bridge the gap between physical mechanics and digital logic.",
      journey_p2: 'My day-to-day expertise revolves around embedded systems development, Internet of Things (IoT) hubs, custom PCB layouts, and industrial automation networks. By integrating reliable components like Arduino and ESP32 with precise sensors, actuators, and standard communication modules, I build tailored hardware that performs under real-world conditions.',
      journey_p3: 'Over the years, I have successfully designed, built, and optimized systems ranging from smart IoT home telemetry units and dual-axis solar tracking arrays to precise energy monitors and robust embedded industrial control applications. These hands-on endeavors have forged strong competencies in hardware troubleshooting, low-level microcontrollers programming, and analytical systems analysis.',
      journey_p4: 'Beyond the lab, I dedicate my time to sharing engineering knowledge. I author rich technical columns, publish detailed project step-by-steps, and compile educational walkthroughs to help developers, academic researchers, and fellow engineers master the practical complexities of modern electronics and smart automation.',
      expertise_title: 'My Expertise',
      mission_title: 'My Mission',
      mission_quote: '"My mission is to design innovative, practical, and affordable engineering solutions while sharing knowledge that empowers others to learn, innovate, and build technology that makes a positive impact."',
      mission_p1: 'I firmly believe that engineering is fundamentally about resolving practical pain points, upgrading daily lives, and crafting micro-technologies that remain exceptionally efficient, durable, and universally accessible.',
      mission_p2: 'Whether you are a student seeking hardware guidance, an academic researcher engineering a custom prototype, or a business deploying smart embedded gateways, I am dedicated to offering elite technical craftsmanship and professional results.',
      mission_end: 'Thank you for visiting. I look forward to collaborating!',
      cta_title: "Let's Build Something Smarter Together",
      cta_desc: "Have an automation challenge, a research project, or a hardware design concept? Let's connect and design a durable solution!",
      email_me: 'Email Me',
    },
    chatbot: {
      title: "Ask Javis's AI Assistant",
      tagline: 'Instant answers regarding qualifications, embedded projects, and availability.',
      input_placeholder: 'Ask me about my microcontrollers experience...',
      welcome: "Hello! I'm Javis's interactive AI assistant. Ask me anything about my Mechatronics qualifications, ESP32/Arduino projects, EasyEDA board layouts, or custom automation networks!",
    },
    tasks: {
      title: 'Embedded Tasks Planner',
      tagline: 'Keep track of active hardware designs, firmware builds, and board debugging logs.',
      add: 'Add New Task',
      priority: 'Priority',
      status: 'Status',
    },
    admin: {
      title: 'Admin Dashboard',
      subtitle: 'Manage blog articles, view message telemetry, and handle system configurations.',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      blog: 'Blog',
      tasks: 'Tâches',
      whoami: 'Qui suis-je',
      admin: 'Admin',
    },
    hero: {
      title: 'Développeur de Systèmes Embarqués',
      tagline: 'Je conçois et construis des systèmes embarqués sécurisés et optimisés, des architectures de capteurs personnalisées et des solutions IoT robustes. Explorez mes derniers projets ci-dessous pour voir des études de cas détaillées.',
      banner: 'Ingénieur en Mécatronique & Automatisation',
      whoami: 'Qui suis-je',
      share: 'Partager le Portfolio',
      copied: 'Lien public copié !',
    },
    projects: {
      title: 'Projets Vedettes',
      interactive_grid: 'Grille Interactive',
      view_case_study: 'Voir l’étude de cas',
    },
    certifications: {
      title: 'Certifications',
      view_profile: 'Voir le profil Credly complet',
      badge_title_1: 'Certified 3DEXPERIENCE Project Planner - Associate',
      badge_title_2: 'Certified 3DEXPERIENCE 3DSwymer - Associate',
      view_credential: 'Voir le certificat',
    },
    commits: {
      title: 'Derniers Commits GitHub',
      tagline: 'Journal de développement en temps réel synchronisé directement depuis mes dépôts open source.',
      details: 'Détails',
      refresh: 'Actualiser le journal',
      loading: 'Récupération des commits...',
      error: 'Impossible de mettre à jour le flux. Affichage des données hors ligne.',
      empty: 'Aucun commit récent trouvé.',
    },
    footer: {
      title: 'Collaborons Ensemble',
      tagline: 'Je suis toujours ouvert à la discussion de nouveaux projets, de solutions matérielles créatives ou d’opportunités de faire partie de votre vision. N’hésitez pas à me contacter !',
      copy_email: 'Copier l’E-mail',
      copy_linkedin: 'Copier le lien LinkedIn',
      copy_portfolio: 'Copier le lien du portfolio',
      copied: 'Copié !',
      copied_portfolio: 'Lien du portfolio copié !',
    },
    whoami: {
      meta_title: 'Qui suis-je | Javis - Ingénieur en Mécatronique et Systèmes Embarqués',
      meta_desc: 'Découvrez Javis, ingénieur en mécatronique et systèmes embarqués, spécialisé dans l’automatisation personnalisée, l’IoT et la conception de matériel.',
      tag: 'Ingénieur en Mécatronique & Automatisation',
      title: 'À propos de Javis',
      tagline: 'Développer des systèmes intelligents combinant l’électronique, la mécanique, l’automatisation et le logiciel pour résoudre des défis réels.',
      qualifications: 'Diplômes & Certifications',
      bachelors: 'Diplôme de Licence',
      bachelors_field: 'Génie Mécatronique',
      hnd: 'Diplôme National Supérieur (HND)',
      hnd_field: 'Informatique Industrielle et Automatisme',
      cert_desc: 'Planificateur de projet certifié 3DEXPERIENCE et 3DSwymer (Associé) par Dassault Systèmes avec de solides compétences en collaboration numérique, structures mécaniques et télémétrie embarquée.',
      verify_badge: 'Vérifier les badges Credly de Dassault →',
      journey_title: 'Mon Parcours & Ma Passion',
      journey_p1: "Bonjour ! Je m'appelle Javis, ingénieur en mécatronique. Je suis profondément passionné par le développement de systèmes intelligents et réactifs qui font le pont entre la mécanique physique et la logique numérique.",
      journey_p2: 'Mon expertise quotidienne s’articule autour du développement de systèmes embarqués, des passerelles de l’Internet des objets (IoT), de la conception de cartes électroniques (PCB) personnalisées et des réseaux d’automatisation industrielle. En intégrant des composants fiables comme Arduino et ESP32 avec des capteurs précis, des actionneurs et des modules de communication standard, je construis du matériel adapté aux conditions réelles.',
      journey_p3: 'Au fil des années, j’ai conçu, construit et optimisé avec succès divers systèmes : des modules de télémétrie résidentielle IoT intelligente, des trackers solaires bi-axes, des moniteurs d’énergie précis et des applications de contrôle industriel embarqué robustes. Ces réalisations m’ont permis d’acquérir de solides compétences en dépannage matériel, programmation de microcontrôleurs de bas niveau et analyse de systèmes complexes.',
      journey_p4: 'Au-delà du laboratoire, je consacre mon temps à partager mes connaissances en ingénierie. Je rédige des chroniques techniques, publie des guides de projets étape par étape et réalise des tutoriels pédagogiques pour aider les développeurs, chercheurs et collègues ingénieurs à maîtriser la complexité pratique de l’électronique moderne.',
      expertise_title: 'Mes Domaines d’Expertise',
      mission_title: 'Ma Mission',
      mission_quote: '"Ma mission est de concevoir des solutions d’ingénierie innovantes, pratiques et abordables tout en partageant des connaissances qui permettent aux autres d’apprendre, d’innover et de créer une technologie ayant un impact positif."',
      mission_p1: 'Je crois fermement que l’ingénierie consiste fondamentalement à résoudre des problèmes concrets, à améliorer le quotidien et à concevoir des micro-technologies exceptionnellement efficaces, durables et universellement accessibles.',
      mission_p2: 'Que vous soyez un étudiant à la recherche de conseils matériels, un chercheur universitaire développant un prototype personnalisé ou une entreprise déployant des passerelles embarquées intelligentes, je m’engage à vous offrir un savoir-faire technique d’élite et des résultats professionnels.',
      mission_end: 'Merci pour votre visite. Au plaisir de collaborer avec vous !',
      cta_title: 'Bâtissons Quelque Chose d’Intelligent Ensemble',
      cta_desc: 'Vous avez un défi d’automatisation, un projet de recherche ou un concept de conception matérielle ? Connectons-nous pour concevoir une solution durable !',
      email_me: 'M’envoyer un E-mail',
    },
    chatbot: {
      title: 'Assistant IA de Javis',
      tagline: 'Réponses instantanées concernant mes qualifications, projets embarqués et disponibilités.',
      input_placeholder: 'Posez-moi une question sur mon expérience...',
      welcome: "Bonjour ! Je suis l’assistant IA interactif de Javis. Posez-moi vos questions sur mes diplômes en mécatronique, mes projets ESP32/Arduino, mes schémas sur EasyEDA ou mes réseaux d'automatisation !",
    },
    tasks: {
      title: 'Planificateur de Tâches',
      tagline: 'Suivez le développement de vos circuits, la compilation de vos micrologiciels et le débogage de vos cartes.',
      add: 'Ajouter une tâche',
      priority: 'Priorité',
      status: 'Statut',
    },
    admin: {
      title: 'Tableau de Bord',
      subtitle: 'Gérer les articles de blog, afficher la télémétrie des messages et configurer le système.',
    },
  },
  sw: {
    nav: {
      home: 'Nyumbani',
      blog: 'Blogu',
      tasks: 'Mpangaji Kazi',
      whoami: 'Mimi ni Nani',
      admin: 'Usimamizi',
    },
    hero: {
      title: 'Mundaji wa Mifumo Iliyopachikwa',
      tagline: 'Ninasanifu na kuunda mifumo salama na iliyoboreshwa ya kielektroniki, usanifu wa sensa maalum, na mifumo madhubuti ya IoT. Kuchunguza miradi yangu hapa chini kuona uchambuzi wa kina.',
      banner: 'Mhandisi wa Mekatroniki na Kiotomatishaji',
      whoami: 'Mimi ni Nani',
      share: 'Shiriki Tovuti Hii',
      copied: 'Kiungo kimenakiliwa!',
    },
    projects: {
      title: 'Miradi Iliyoangaziwa',
      interactive_grid: 'Gridi Inayoshirikiana',
      view_case_study: 'Angalia Uchambuzi',
    },
    certifications: {
      title: 'Vyeti na Tuzo',
      view_profile: 'Angalia Wasifu Kamili wa Credly',
      badge_title_1: 'Certified 3DEXPERIENCE Project Planner - Associate',
      badge_title_2: 'Certified 3DEXPERIENCE 3DSwymer - Associate',
      view_credential: 'Angalia Cheti',
    },
    commits: {
      title: 'Michango ya Hivi Karibuni ya GitHub',
      tagline: 'Logi ya msanidi programu ya muda halisi iliyosawazishwa moja kwa moja kutoka kwenye hazina zangu za nambari za wazi.',
      details: 'Maelezo',
      refresh: 'Sasisha Logi ya Commit',
      loading: 'Inapakia commits...',
      error: 'Haikuweza kusasisha logi. Inaonyesha rekodi za nje ya mtandao.',
      empty: 'Hakuna commits za hivi karibuni zilizopatikana.',
    },
    footer: {
      title: 'Tufanye Kazi Pamoja',
      tagline: 'Niko tayari kila wakati kujadili miradi mipya, suluhisho za ubunifu wa vifaa, au fursa za kuwa sehemu ya maono yako. Jisikie huru kuwasiliana nami!',
      copy_email: 'Nakili Barua Pepe',
      copy_linkedin: 'Nakili Kiungo cha LinkedIn',
      copy_portfolio: 'Nakili Kiungo cha Portfolio',
      copied: 'Imenakiliwa!',
      copied_portfolio: 'Kiungo cha Portfolio Kimenakiliwa!',
    },
    whoami: {
      meta_title: 'Mimi ni Nani | Javis - Mhandisi wa Mekatroniki na Mifumo Iliyopachikwa',
      meta_desc: 'Mfahamu Javis, Mhandisi wa Mekatroniki na Mifumo Iliyopachikwa anayehusika na kiotomatishaji maalum, IoT, na usanifu wa vifaa vya elektroniki.',
      tag: 'Mhandisi wa Mekatroniki na Kiotomatishaji',
      title: 'Kuhusu Javis',
      tagline: 'Kutengeneza mifumo yenye akili inayounganisha vifaa vya elektroniki, ufundi mitambo, automatisering, na programu ili kutatua changamoto za ulimwengu wa kweli.',
      qualifications: 'Sifa za Kitaaluma',
      bachelors: 'Shahada ya Kwanza',
      bachelors_field: 'Uhandisi wa Mekatroniki',
      hnd: 'Stashahada ya Juu ya Kitaifa (HND)',
      hnd_field: 'Kiotomatishaji cha Kompyuta ya Viwandani',
      cert_desc: 'Mshauri wa mradi aliyeidhinishwa wa 3DEXPERIENCE na 3DSwymer (Associate) na Dassault Systèmes mwenye msingi thabiti katika ushirikiano wa kidijitali, miundo ya kimitambo, na telemetry iliyopachikwa.',
      verify_badge: 'Thibitisha Vyeti vya Dassault Credly →',
      journey_title: 'Safari Yangu na Shauku',
      journey_p1: "Habari! Mimi ni Javis, Mhandisi wa Mekatroniki. Nina shauku kubwa ya kuunda mifumo ya akili inayounganisha ulimwengu wa kimitambo na mantiki ya kidijitali.",
      journey_p2: 'Utaalam wangu wa kila siku unajikita katika maendeleo ya mifumo iliyopachikwa, vitovu vya Mtandao wa Vitu (IoT), miundo maalum ya bodi za PCB, na mitandao ya automatisering ya viwandani. Kwa kuunganisha vipengele vinavyoaminika kama Arduino na ESP32 na sensa sahihi, viendeshaji, na moduli za mawasiliano ya kawaida, ninaunda vifaa maalum vinavyofanya kazi vizuri chini ya hali halisi ya ulimwengu.',
      journey_p3: 'Kwa miaka mingi, nimefanikiwa kusanifu, kujenga, na kuboresha mifumo mbalimbali kuanzia vifaa vya telemetry vya nyumbani vya IoT na mifumo ya kufuatilia jua ya mhimili miwili hadi vidhibiti sahihi vya nishati na mifumo thabiti ya udhibiti wa viwandani. Juhudi hizi zimeleta ujuzi mkubwa katika utatuzi wa vifaa, programu ya microcontrollers, na uchambuzi wa mifumo ya kiufundi.',
      journey_p4: 'Nje ya maabara, ninajitolea muda wangu kushiriki ujuzi wa uhandisi. Ninaandika makala tajiri za kiufundi, kuchapisha miongozo ya hatua kwa hatua ya miradi, na kukusanya mafunzo ya kielimu ili kusaidia wasanidi programu, watafiti wa kitaaluma, na wahandisi wenzangu kusimamia ugumu wa vifaa vya elektroniki vya kisasa na automatisering ya akili.',
      expertise_title: 'Maeneo Yangu ya Utaalam',
      mission_title: 'Dhamira Yangu',
      mission_quote: '"Dhamira yangu ni kusanifu suluhisho za kiufundi zenye ubunifu, vitendo, na za bei nafuu wakati nikishiriki ujuzi unaowawezesha wengine kujifunza, kuvumbua, na kujenga teknolojia inayofanya matokeo chanya."',
      mission_p1: 'Ninaamini kabisa kwamba uhandisi unahusika hasa na kutatua changamoto za vitendo, kuboresha maisha ya kila siku, na kuunda teknolojia ndogo ambazo zinafaa sana, zinadumu kwa muda mrefu, na zinapatikana kwa kila mtu.',
      mission_p2: 'Iwe wewe ni mwanafunzi unayetafuta mwongozo wa vifaa, mtafiti wa kitaaluma anayetengeneza mfano maalum, au biashara inayoweka mifumo ya akili, nimejitolea kutoa utaalamu wa hali ya juu na matokeo ya kitaalamu.',
      mission_end: 'Asante kwa kutembelea. Ninatarajia kushirikiana nawe!',
      cta_title: 'Tujenge Kitu Chenye Akili Zaidi Pamoja',
      cta_desc: 'Je, una changamoto ya automatisering, mradi wa utafiti, au wazo la muundo wa vifaa vya elektroniki? Hebu tuungane na kusanifu suluhisho thabiti na la kudumu!',
      email_me: 'Nitumie Barua Pepe',
    },
    chatbot: {
      title: 'Msaidizi wa AI wa Javis',
      tagline: 'Majibu ya haraka kuhusu sifa, miradi iliyopachikwa, na upatikanaji.',
      input_placeholder: 'Niulize kuhusu uzoefu wangu...',
      welcome: "Habari! Mimi ni msaidizi mwingiliano wa AI wa Javis. Niulize chochote kuhusu sifa zangu za Mekatroniki, miradi ya ESP32/Arduino, usanifu wa bodi za EasyEDA, au mitandao ya automatisering ya viwandani!",
    },
    tasks: {
      title: 'Mpangaji wa Kazi',
      tagline: 'Weka wimbo wa miundo yako ya bodi za elektroniki, ujenzi wa firmware, na logi za utatuzi.',
      add: 'Ongeza Kazi Mpya',
      priority: 'Umuhimu',
      status: 'Hali',
    },
    admin: {
      title: 'Dashboard ya Utawala',
      subtitle: 'Dhibiti nakala za blogu, angalia telemetry ya ujumbe, na ushughulikie mipangilio ya mfumo.',
    },
  },
};

// Create Context
interface I18nContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (keyPath: string) => string;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Read initial locale from localStorage, default to 'en'
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('locale');
    if (saved === 'fr' || saved === 'sw' || saved === 'en') {
      return saved as Locale;
    }
    return 'en';
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  // Translation function that resolves dot-notation (e.g., 'nav.home')
  const t = (keyPath: string): string => {
    const keys = keyPath.split('.');
    let current: any = dictionary[locale];

    for (const key of keys) {
      if (current === undefined || current === null) {
        return keyPath; // fallback to key path if not found
      }
      current = current[key];
    }

    if (typeof current === 'string') {
      return current;
    }

    return keyPath; // fallback if key resolved to object
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// Hook to use translation in any component
export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
