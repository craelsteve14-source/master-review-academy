// ═══════════════════════════════════════════════════════════════════
// SUPABASE CONFIG
// ═══════════════════════════════════════════════════════════════════
const SUPABASE_URL = "https://ztgtrvodalesxqbmrrqd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Z3RydodalGVzeHFibXJycWQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc0OTg2OTIyNiwiZXhwIjoyMDY1NDQ1MjI2fQ.eyJpc3MiOiJzdXBhYmFzZSJ9";

async function sbFetch(path, opts = {}) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      ...opts,
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
        ...(opts.headers || {})
      }
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : [];
  } catch { return null; }
}import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════
// MASTER REVIEW ACADEMY v3
// Professional Ethics: 200Q + 100Q
// Curriculum: 200Q + 100Q
// Methods & Strategies: 200Q + 100Q
// Master Board Exam: 350Q (sampled from all 600Q)
// Auth: Username/Password | Admin: Rating Sheet
// ═══════════════════════════════════════════════════════════════════

const ETHICS_200 = [
  // ══════════════════════════════ EASY (1–60) ══════════════════════════════
  {id:1,d:"easy",t:"Ethics Basics",q:"The word 'Ethics' comes from the Greek word ___.",
   c:["A. Logos","B. Nomos","C. Ethos","D. Pathos"],a:"C",
   e:"'Ethics' comes from the Greek word 'ETHOS' meaning 'customs' or 'moral.' Its Latin equivalent is 'mores.'"},
  {id:2,d:"easy",t:"Ethics Basics",q:"Ethics is the study of the morality of human acts and moral agents, what makes an act obligatory, and what makes a person ___.",
   c:["A. Successful","B. Intelligent","C. Accountable","D. Powerful"],a:"C",
   e:"Ethics studies morality of human acts and moral agents, what makes an act obligatory, and what makes a person ACCOUNTABLE."},
  {id:3,d:"easy",t:"Ethics Basics",q:"The Latin equivalent of the Greek word 'ethos' is ___.",
   c:["A. Logos","B. Mores","C. Agere","D. Ratio"],a:"B",
   e:"The Latin equivalent of the Greek 'ethos' is 'MORES,' which refers to society's patterns, standards, and rules of doing."},
  {id:4,d:"easy",t:"Act of Man vs Human Act",q:"Human Acts are those of which a man is a master — he has the power of doing or not doing as he ___.",
   c:["A. Is ordered","B. Is trained","C. Pleases","D. Is required"],a:"C",
   e:"Human Acts are done as the person PLEASES — deliberately, with full use of will, awareness, and freedom."},
  {id:5,d:"easy",t:"Act of Man vs Human Act",q:"Which of the following is an example of a Human Act?",
   c:["A. Perspiring","B. Blinking","C. Breathing","D. Tutoring slow learners"],a:"D",
   e:"Tutoring slow learners is a deliberately chosen action — it requires will and awareness. The others are automatic Acts of Man."},
  {id:6,d:"easy",t:"Act of Man vs Human Act",q:"Acts of Man are actions that happen WITHOUT the awareness of the mind or the control of the ___.",
   c:["A. Reason","B. Will","C. Heart","D. Conscience"],a:"B",
   e:"Acts of Man occur without the control of the WILL — they are automatic bodily actions like breathing, blinking, and perspiring."},
  {id:7,d:"easy",t:"Act of Man vs Human Act",q:"Which of the following is an example of an Act of Man?",
   c:["A. Preparing for the board exam","B. Observing a prescribed diet","C. Dilation of the pupils of the eyes","D. Tutoring slow learners"],a:"C",
   e:"Dilation of pupils is automatic — it happens without the control of the will. It is an Act of Man, not a Human Act."},
  {id:8,d:"easy",t:"Act of Man vs Human Act",q:"Three elements required for a Human Act are Will, Awareness, and ___.",
   c:["A. Intelligence","B. Freedom","C. Passion","D. Strength"],a:"B",
   e:"The three elements of a Human Act are: (W) Will, (A) Awareness, and (F) FREEDOM. These make a person morally accountable."},
  {id:9,d:"easy",t:"Branches of Ethics",q:"How many branches of Ethics are there?",
   c:["A. 2","B. 4","C. 3","D. 5"],a:"C",
   e:"There are 3 branches of Ethics: (1) Metaethics, (2) Normative Ethics, and (3) Applied Ethics."},
  {id:10,d:"easy",t:"Branches of Ethics",q:"Which branch of ethics studies the very foundation of morality itself?",
   c:["A. Applied Ethics","B. Normative Ethics","C. Descriptive Ethics","D. Metaethics"],a:"D",
   e:"METAETHICS studies the very foundation of morality itself — asking 'What is Morality?' and 'What is its nature?'"},
  {id:11,d:"easy",t:"Branches of Ethics",q:"Normative Ethics is also known as ___.",
   c:["A. Applied Ethics","B. Prescriptive Ethics","C. Descriptive Ethics","D. Meta Ethics"],a:"B",
   e:"Normative Ethics is known as PRESCRIPTIVE ETHICS — it prescribes norms and how one SHOULD act, setting out the rightness or wrongness of actions."},
  {id:12,d:"easy",t:"Branches of Ethics",q:"Applied Ethics deals with ethical questions specific to ___.",
   c:["A. Abstract philosophical questions","B. Historical moral cases","C. Practical fields and real-life moral issues","D. The foundation of morality"],a:"C",
   e:"Applied Ethics APPLIES ethical principles and moral theories to REAL-LIFE MORAL ISSUES and practical fields such as euthanasia, child labor, and abortion."},
  {id:13,d:"easy",t:"Branches of Ethics",q:"Which of the following is a Domain of Applied Ethics?",
   c:["A. Metaethics","B. Cultural Relativism","C. Clinical Ethics","D. Normative Ethics"],a:"C",
   e:"Domains of Applied Ethics include: Business Ethics, CLINICAL ETHICS, Organizational Ethics, and Social Ethics."},
  {id:14,d:"easy",t:"Moral Realism",q:"Moral Realism is the belief that there are moral facts, in the same way that there are ___.",
   c:["A. Legal standards","B. Cultural norms","C. Personal preferences","D. Scientific facts"],a:"D",
   e:"Moral Realism holds that MORAL FACTS exist just like SCIENTIFIC FACTS — any moral proposition can only be TRUE or FALSE."},
  {id:15,d:"easy",t:"Moral Realism",q:"In Moral Realism, any moral proposition can only be ___.",
   c:["A. Cultural or universal","B. True or False","C. Relative or absolute","D. Legal or illegal"],a:"B",
   e:"In Moral Realism, any moral proposition can only be TRUE OR FALSE — moral facts are objective like scientific facts."},
  {id:16,d:"easy",t:"Moral Absolutism",q:"Moral Absolutism states that there are ___ against which moral questions can be judged.",
   c:["A. Cultural standards","B. Personal codes","C. Absolute standards","D. Scientific proofs"],a:"C",
   e:"Moral Absolutism holds that there are ABSOLUTE STANDARDS against which moral questions can be judged — one basic moral fact that is universal."},
  {id:17,d:"easy",t:"Moral Standards",q:"Moral Standards are norms, prescriptions, or rules used in determining what ought to be done. Non-compliance with Moral Standards causes a sense of ___.",
   c:["A. Pride","B. Embarrassment","C. Shame","D. Guilt"],a:"D",
   e:"Non-compliance with Moral Standards causes a SENSE OF GUILT, unlike non-moral standards whose non-compliance causes shame or embarrassment."},
  {id:18,d:"easy",t:"Moral Standards",q:"Which of the following is an example of a Moral Standard?",
   c:["A. Wear black for mourning","B. No talking while your mouth is full","C. Do not commit adultery","D. Males should propose marriage"],a:"C",
   e:"'Do not commit adultery' is a MORAL STANDARD — a norm about right or wrong action. The others are Non-Moral Standards (Folkways)."},
  {id:19,d:"easy",t:"Non-Moral Standards",q:"In Sociology, non-moral standards or rules are called ___.",
   c:["A. Mores","B. Taboos","C. Folkways","D. Norms"],a:"C",
   e:"In Sociology, non-moral standards are called FOLKWAYS — guides of action unrelated to moral considerations, expected by society's social rules and etiquette."},
  {id:20,d:"easy",t:"Non-Moral Standards",q:"Non-Moral Standards are guides of action expected by SOCIETY's social rules, demands of etiquette, and ___.",
   c:["A. Legal mandates","B. Good manners","C. Divine laws","D. Cultural beliefs"],a:"B",
   e:"Non-Moral Standards are guides of action expected by society's social rules, demands of etiquette, and GOOD MANNERS."},
  {id:21,d:"easy",t:"Moral Agent",q:"The word 'Moral' comes from the Latin 'MORES' which refers to society's patterns, standards, and rules of ___.",
   c:["A. Thinking","B. Speaking","C. Believing","D. Doing"],a:"D",
   e:"'Moral' comes from Latin 'MORES' referring to society's PATTERNS, STANDARDS, and RULES OF DOING."},
  {id:22,d:"easy",t:"Moral Agent",q:"The word 'Agent' comes from the Latin word ___.",
   c:["A. ETHOS","B. LOGOS","C. AGERE","D. MORES"],a:"C",
   e:"'Agent' comes from the Latin 'AGERE' meaning 'to do act.' A moral agent is one who performs acts according to moral standards."},
  {id:23,d:"easy",t:"Moral Agent",q:"A Moral Agent is the ___ — one who acts morally.",
   c:["A. Moral Judge","B. Moral Actor","C. Moral Arbiter","D. Moral Observer"],a:"B",
   e:"A Moral Agent is the MORAL ACTOR — one who acts morally. Only a moral agent is capable of human acts."},
  {id:24,d:"easy",t:"Moral Agent",q:"Why is a dog NOT a moral agent?",
   c:["A. It has no soul","B. It cannot communicate","C. It cannot knowingly, freely, and voluntarily act","D. It is not made in God's image"],a:"C",
   e:"A dog is not a moral agent because it CANNOT KNOWINGLY, FREELY, AND VOLUNTARILY ACT — it cannot conform to moral standards."},
  {id:25,d:"easy",t:"Bases of Moral Accountability",q:"What are the three Bases of Moral Accountability?",
   c:["A. Intention, Freedom, Circumstances","B. Knowledge, Freedom, Voluntariness","C. Will, Awareness, Freedom","D. Object, End, Circumstances"],a:"B",
   e:"The three Bases of Moral Accountability are: (1) KNOWLEDGE (awareness), (2) FREEDOM, and (3) VOLUNTARINESS (willingness)."},
  {id:26,d:"easy",t:"Bases of Moral Accountability",q:"The degree of moral accountability depends on the degree or extent of knowledge, freedom, and ___.",
   c:["A. Intelligence","B. Voluntariness","C. Intention","D. Passion"],a:"B",
   e:"The degree of moral accountability depends on the degree or extent of KNOWLEDGE, FREEDOM, and VOLUNTARINESS."},
  {id:27,d:"easy",t:"Modifiers of Human Acts",q:"Which of the following is NOT a Modifier of Human Acts?",
   c:["A. Passion","B. Ignorance","C. Intelligence","D. Violence"],a:"C",
   e:"The four Modifiers of Human Acts are: (A) Ignorance, (B) Passion, (C) Fear, and (D) Violence. Intelligence is not one of them."},
  {id:28,d:"easy",t:"Modifiers of Human Acts",q:"Modifiers of Human Acts affect the mental or emotional state of a person to the extent that voluntariness is either ___.",
   c:["A. Created or destroyed","B. Increased or decreased","C. Ignored or applied","D. Defined or undefined"],a:"B",
   e:"Modifiers of Human Acts affect a person's mental or emotional state so that voluntariness is either INCREASED or DECREASED."},
  {id:29,d:"easy",t:"Ignorance",q:"Ignorance as a Modifier of Human Acts means ___.",
   c:["A. Lack of freedom","B. Use of physical force","C. Absence of knowledge","D. Presence of strong emotions"],a:"C",
   e:"IGNORANCE means the ABSENCE OF KNOWLEDGE — it is one of the four modifiers that affect the voluntariness of an act."},
  {id:30,d:"easy",t:"Ignorance",q:"What are the two degrees of Ignorance?",
   c:["A. Simple and Complex","B. Gross and Minor","C. Invincible and Vincible","D. Total and Partial"],a:"C",
   e:"The two degrees of Ignorance are: (1) INVINCIBLE and (2) VINCIBLE (which includes Supine/Gross/Crass and Affected)."},
  {id:31,d:"easy",t:"Ignorance",q:"Invincible Ignorance occurs when we do not know something that was ___ for us to know.",
   c:["A. Easy","B. Required","C. Impossible","D. Available"],a:"C",
   e:"Invincible Ignorance = when we DO NOT KNOW something that was IMPOSSIBLE FOR US TO KNOW. This removes moral responsibility."},
  {id:32,d:"easy",t:"Determinants of Morality",q:"How many Determinants of Morality are there?",
   c:["A. 2","B. 4","C. 5","D. 3"],a:"D",
   e:"There are THREE Determinants of Morality: (1) Object of the Act, (2) the End or Purpose, and (3) Its Circumstances."},
  {id:33,d:"easy",t:"Determinants of Morality",q:"The Object of the Act as a determinant of morality is ___.",
   c:["A. The intention of the actor","B. The time and place of the act","C. The act itself","D. The result of the act"],a:"C",
   e:"The Object of the Act is the ACT ITSELF — examples: praying, honoring parents, going to Mass, telling the truth."},
  {id:34,d:"easy",t:"Determinants of Morality",q:"The End or Purpose as a determinant of morality is the ___ of the acting subject.",
   c:["A. Consequence","B. Circumstance","C. Intention","D. Object"],a:"C",
   e:"The End or Purpose is the INTENTION of the acting subject — what inspires or motivates the person to act."},
  {id:35,d:"easy",t:"Virtue Ethics",q:"For Aristotle, the ethical person is virtuous — one who has developed good character or has ___.",
   c:["A. Great wealth","B. Developed virtues","C. High social status","D. Strong intellect"],a:"B",
   e:"For Aristotle, the ethical person is virtuous — one who has DEVELOPED GOOD CHARACTER or has DEVELOPED VIRTUES."},
  {id:36,d:"easy",t:"Virtue Ethics",q:"VIRTUE is the midpoint between two extremes which Aristotle called ___.",
   c:["A. Rights","B. Duties","C. Vices","D. Laws"],a:"C",
   e:"For Aristotle, VIRTUE is the MIDPOINT between two extremes which he called VICES — one vice of excess and one of deficiency."},
  {id:37,d:"easy",t:"Virtue Ethics",q:"The GOLDEN MEAN is ___.",
   c:["A. The highest achievable virtue","B. A divine commandment","C. The sweet spot between the extremes of excess and deficiency","D. A universal law given by reason"],a:"C",
   e:"The Golden Mean is the SWEET SPOT between the EXTREME OF EXCESS and the EXTREME OF DEFICIENCY — the virtuous middle path."},
  {id:38,d:"easy",t:"Virtue Ethics",q:"EUDAIMONIA means ___.",
   c:["A. Following universal duty","B. Maximizing happiness for all","C. A life well lived / human flourishing","D. Divine reward"],a:"C",
   e:"EUDAIMONIA means 'a life well lived' or HUMAN FLOURISHING — it comes from striving and achieving difficult things."},
  {id:39,d:"easy",t:"Virtue Ethics",q:"MORAL EXEMPLARS are ___.",
   c:["A. Rules that moral agents must follow","B. People who already possess virtues","C. The highest moral standards","D. Ethical theories about virtue"],a:"B",
   e:"Moral Exemplars are PEOPLE WHO ALREADY POSSESS VIRTUES — they serve as living role models of virtuous character."},
  {id:40,d:"easy",t:"Cardinal Moral Virtues",q:"Which of the following is NOT one of the four Cardinal Moral Virtues?",
   c:["A. Prudence","B. Justice","C. Humility","D. Fortitude"],a:"C",
   e:"The four Cardinal Moral Virtues are: Prudence, Justice, Temperance, and Fortitude. HUMILITY is not among them."},
  {id:41,d:"easy",t:"Cardinal Moral Virtues",q:"Temperance is the virtue of ___.",
   c:["A. Practical wisdom and sound judgment","B. Courage in adversity","C. Fairness and giving each person their due","D. Self-control and moderation"],a:"D",
   e:"TEMPERANCE is the virtue of SELF-CONTROL AND MODERATION — one of the four Cardinal Moral Virtues."},
  {id:42,d:"easy",t:"Cardinal Moral Virtues",q:"Justice is the virtue concerned with fairness, equality, and giving each person ___.",
   c:["A. Their rights under law","B. Their due","C. Equal portions","D. What they earn"],a:"B",
   e:"JUSTICE is the virtue of fairness, equality, and GIVING EACH PERSON THEIR DUE — one of the four Cardinal Moral Virtues."},
  {id:43,d:"easy",t:"Natural Law",q:"Thomas Aquinas was a philosopher and monk of which century?",
   c:["A. 11th","B. 12th","C. 14th","D. 13th"],a:"D",
   e:"Thomas Aquinas was an Italian Philosopher and Christian Monk of the 13TH CENTURY who developed Natural Law Ethics."},
  {id:44,d:"easy",t:"Natural Law",q:"According to Natural Law Theory, what is ETHICAL is that which the natural law commands us to do: ___.",
   c:["A. Follow universal rules","B. Do good and avoid evil","C. Maximize happiness","D. Act from duty alone"],a:"B",
   e:"Natural Law Ethics concludes: 'DO GOOD AND AVOID EVIL' — what is ethical is that which the natural law commands us to do."},
  {id:45,d:"easy",t:"Types of Law",q:"Eternal Law is the mind of God which ___.",
   c:["A. Is promulgated by persons","B. Is revealed through the Bible","C. Humans cannot know — it governs the universe","D. Directs our conscience to good"],a:"C",
   e:"Eternal Law is the MIND OF GOD which HUMANS CANNOT KNOW — it contains the laws that govern the universe."},
  {id:46,d:"easy",t:"Types of Law",q:"Divine Law is the Law of God revealed to people through the Bible and ___.",
   c:["A. Natural instinct","B. Human reason","C. The Ten Commandments","D. Cultural tradition"],a:"C",
   e:"Divine Law is revealed through the Bible and DECREED BY GOD IN THE TEN COMMANDMENTS."},
  {id:47,d:"easy",t:"Types of Law",q:"Natural Law directs our conscience and if applied with reason will lead to ___.",
   c:["A. Cultural relativism","B. Personal satisfaction","C. The right outcome","D. Social approval"],a:"C",
   e:"Natural Law 'Do good and avoid evil' — it directs our conscience and leads to THE RIGHT OUTCOME when applied with reason."},
  {id:48,d:"easy",t:"Types of Law",q:"Human Law or Positive Law consists of ___.",
   c:["A. God's revealed commandments","B. The laws governing the universe","C. Everyday rules promulgated by persons that govern our lives","D. The natural instincts given by God"],a:"C",
   e:"Human Law / Positive Law = EVERYDAY RULES PROMULGATED BY PERSONS that govern our lives — e.g., traffic laws and school policies."},
  {id:49,d:"easy",t:"Kant's Ethics",q:"Immanuel Kant was a ___ Century German Philosopher.",
   c:["A. 16th","B. 17th","C. 18th","D. 19th"],a:"C",
   e:"Immanuel Kant was an 18TH CENTURY German Philosopher who developed Deontological Ethics (The Duty Framework)."},
  {id:50,d:"easy",t:"Kant's Ethics",q:"Kant argued that to know what is right, you must use ___.",
   c:["A. Religion","B. Emotions","C. Cultural norms","D. Reason"],a:"D",
   e:"Kant argued that to know what is right, you must use REASON — 'what's RIGHT and WRONG is totally KNOWABLE just by using your INTELLECT.'"},
  {id:51,d:"easy",t:"Utilitarianism",q:"Utilitarianism was founded by which philosophers?",
   c:["A. Aristotle and Plato","B. Immanuel Kant and Thomas Aquinas","C. Jeremy Bentham and John Stuart Mill","D. Confucius and Buddha"],a:"C",
   e:"Utilitarianism was founded in the 18th Century by British Philosophers JEREMY BENTHAM and JOHN STUART MILL."},
  {id:52,d:"easy",t:"Utilitarianism",q:"Utilitarianism treats intentions as ___.",
   c:["A. The most important factor","B. Irrelevant","C. Secondary to rules","D. The only factor"],a:"B",
   e:"Utilitarianism focuses on RESULTS or CONSEQUENCES of actions and treats INTENTIONS AS IRRELEVANT."},
  {id:53,d:"easy",t:"Utilitarianism",q:"The Principle of Utility states: 'We should always act so as to produce the greatest good for the ___.'",
   c:["A. Individual","B. State","C. Majority","D. Greatest number"],a:"D",
   e:"The PRINCIPLE OF UTILITY: 'We should act always so as to produce the GREATEST GOOD FOR THE GREATEST NUMBER.'"},
  {id:54,d:"easy",t:"Love & Justice",q:"In the Love & Justice Framework, what is ethical is that which is just and that which is ___.",
   c:["A. Legal","B. Loving","C. Popular","D. Universal"],a:"B",
   e:"The Love & Justice Framework states: what is ethical is that which is JUST and that which is LOVING."},
  {id:55,d:"easy",t:"Love & Justice",q:"Which Greek concept of love refers to selfless love or charity?",
   c:["A. Erotic","B. Philia","C. Storge","D. Agape"],a:"D",
   e:"AGAPE is selfless love — charity. The three Greek concepts: (1) Agape, (2) Erotic (passionate sexual encounter), (3) Philia (affection between friends)."},
  {id:56,d:"easy",t:"Moral Dilemma",q:"A Moral Dilemma is also referred to as ___.",
   c:["A. False Dilemma","B. Ethical Dilemma","C. Moral Paradox","D. Ethical Conflict"],a:"B",
   e:"A Moral Dilemma is also referred to as an ETHICAL DILEMMA — it involves two morally obligatory options where choosing one violates the other."},
  {id:57,d:"easy",t:"Moral Dilemma",q:"In a Moral Dilemma, the persons involved are said to be in a ___.",
   c:["A. Resolution","B. Compromise","C. Deadlock","D. Victory"],a:"C",
   e:"The persons in a moral dilemma are in a DEADLOCK — 'Damn-if-you-do and Damn-if-you-don't.' The agent is condemned to moral failure."},
  {id:58,d:"easy",t:"Moral Dilemma",q:"How many levels of Moral Dilemma are there?",
   c:["A. 2","B. 4","C. 3","D. 5"],a:"C",
   e:"There are 3 levels of Moral Dilemma: (1) Individual, (2) Organizational, and (3) Structural."},
  {id:59,d:"easy",t:"Personhood",q:"PERSONHOOD is defined as ___.",
   c:["A. Being biologically human","B. The state or quality of being a person","C. Having human DNA","D. Being recognized by the law"],a:"B",
   e:"Personhood is THE STATE OR QUALITY OF BEING A PERSON — it is a moral term, not merely a biological one."},
  {id:60,d:"easy",t:"Personhood",q:"In the context of Moral Agent, 'Person' is a ___ term while 'Human' is a ___ term.",
   c:["A. Legal / Cultural","B. Scientific / Religious","C. Moral / Biological","D. Cultural / Scientific"],a:"C",
   e:"PERSON = MORAL TERM (being who is part of a moral community). HUMAN = BIOLOGICAL TERM. Person doesn't equal human."},

  // ═══════════════════════════ MODERATE (61–160) ═══════════════════════════
  {id:61,d:"moderate",t:"Metaethics",q:"Metaethics' key question is 'What is Morality and what is its ___?'",
   c:["A. Purpose","B. Origin","C. Nature","D. Standard"],a:"C",
   e:"Metaethics answers 'What is Morality?' and 'What is its NATURE?' — it studies the foundation of morality itself."},
  {id:62,d:"moderate",t:"Metaethics",q:"Which of the following BEST represents a Metaethical question?",
   c:["A. Should I lie to save someone's life?","B. Is euthanasia morally permissible?","C. What makes an action morally right in the first place?","D. How should doctors behave ethically?"],a:"C",
   e:"METAETHICS asks foundational questions — 'What makes an action morally right in the first place?' is a classic metaethical inquiry about the nature of moral rightness itself."},
  {id:63,d:"moderate",t:"Moral Realism",q:"Our gut intuition tells us that there are moral facts — some things are just wrong, and others are ___.",
   c:["A. Culturally dependent","B. Indisputably right","C. Legally mandated","D. Socially constructed"],a:"B",
   e:"Moral Realism holds that our gut intuition tells us moral facts exist — some things are just wrong and others are INDISPUTABLY RIGHT, like nurturing children."},
  {id:64,d:"moderate",t:"Moral Realism",q:"The Grounding Problem of Ethics refers to ___.",
   c:["A. The problem of applying ethics in real life","B. The conflict between moral relativism and absolutism","C. The search for a solid, clear, objective, and unmoving foundation for moral beliefs","D. The difficulty of creating universal moral laws"],a:"C",
   e:"The Grounding Problem is the search for a FOUNDATION for our moral beliefs — something that would make them SOLID, CLEAR, OBJECTIVE, and UNMOVING."},
  {id:65,d:"moderate",t:"Moral Relativism",q:"Moral Relativism holds that more than one moral position on a given topic can be ___.",
   c:["A. Universal","B. Correct","C. Incorrect","D. Scientific"],a:"B",
   e:"Moral Relativism holds that MORE THAN ONE MORAL POSITION on a given topic can be CORRECT — basis: more than one position."},
  {id:66,d:"moderate",t:"Cultural Relativism",q:"An example of Moral Relativism is ___.",
   c:["A. Moral Absolutism","B. Moral Subjectivism","C. Cultural Relativism","D. Natural Law"],a:"C",
   e:"The reviewer explicitly states that 'An example of Moral Relativism is CULTURAL RELATIVISM.'"},
  {id:67,d:"moderate",t:"Cultural Relativism",q:"Descriptive Cultural Relativism (DCR) states that people's ___ differ from culture to culture.",
   c:["A. Moral facts","B. Moral beliefs","C. Moral laws","D. Moral duties"],a:"B",
   e:"DCR states that people's MORAL BELIEFS differ from culture to culture — it is a descriptive observation about what different cultures actually believe."},
  {id:68,d:"moderate",t:"Cultural Relativism",q:"Normative Cultural Relativism (NCR) states that it is not your beliefs but ___ that differ from culture to culture.",
   c:["A. Moral perceptions","B. Moral preferences","C. Moral facts themselves","D. Moral traditions"],a:"C",
   e:"NCR goes further than DCR — it says the MORAL FACTS THEMSELVES differ from culture to culture, not just people's beliefs about them."},
  {id:69,d:"moderate",t:"Moral Antirealism",q:"Moral Antirealism is the belief that moral propositions don't refer to objective features of the world — therefore there are ___.",
   c:["A. Absolute moral truths","B. Cultural moral facts","C. No moral facts","D. Scientific moral truths"],a:"C",
   e:"Moral Antirealism holds there are NO MORAL FACTS — moral propositions don't refer to objective features of the world at all."},
  {id:70,d:"moderate",t:"Moral Subjectivism",q:"Moral Subjectivism holds that moral statements refer only to people's ___, rather than their actions.",
   c:["A. Universal laws","B. Divine commandments","C. Legal codes","D. Attitudes"],a:"D",
   e:"Moral Subjectivism holds that moral statements refer only to PEOPLE'S ATTITUDES rather than their actions. They key into personal attitudes, not objective moral facts."},
  {id:71,d:"moderate",t:"Moral Subjectivism",q:"Moral Subjectivism says that 'those preferences key into personal attitudes, but not actual, objective moral facts about the ___.'",
   c:["A. Self","B. Culture","C. World","D. Law"],a:"C",
   e:"Moral Subjectivism acknowledges attitudes but clarifies they are NOT 'actual, objective moral facts about the WORLD.'"},
  {id:72,d:"moderate",t:"Types of Standards",q:"Moral Standards are either Consequence Standards or ___.",
   c:["A. Personal Standards","B. Legal Standards","C. Non-Consequence Standards","D. Cultural Standards"],a:"C",
   e:"Moral Standards are either: (1) CONSEQUENCE STANDARDS (Teleological/Consequentialist) or (2) NON-CONSEQUENCE STANDARDS (Deontological)."},
  {id:73,d:"moderate",t:"Types of Standards",q:"Consequence Standards are also called Teleological or Consequentialist. The word 'Tele' means ___.",
   c:["A. Truth","B. End, Result, or Consequence","C. Law","D. Good"],a:"B",
   e:"'TELE' means END, RESULT, or CONSEQUENCE. Teleological standards depend on results or outcomes — 'the end justifies the means.'"},
  {id:74,d:"moderate",t:"Types of Standards",q:"Teleological/Consequentialist Standards hold that an act resulting in the ___ is moral.",
   c:["A. Least harm possible","B. General welfare and greatest good of the greatest number","C. Fulfillment of duty","D. Compliance with divine law"],a:"B",
   e:"Consequentialist Standards hold that an act resulting in the GENERAL WELFARE — in the GREATEST GOOD OF THE GREATEST NUMBER — is moral."},
  {id:75,d:"moderate",t:"Types of Standards",q:"Non-Consequence Standards (Deontological) hold that rightness depends on Duty, Natural Law, Virtue, and the Demand of the ___.",
   c:["A. Greatest number","B. Government","C. Situation or circumstances","D. Individual"],a:"C",
   e:"Deontological Standards hold that rightness depends on DUTY, NATURAL LAW, VIRTUE, and the DEMAND OF THE SITUATION OR CIRCUMSTANCES."},
  {id:76,d:"moderate",t:"Types of Standards",q:"Which of the following is a Deontological Moral Standard?",
   c:["A. Utilitarianism","B. Consequentialism","C. Situation Ethics","D. Act Utilitarianism"],a:"C",
   e:"The four Deontological Moral Standards are: Natural Law, Virtue Ethics, SITUATION ETHICS, and Sense of Duty."},
  {id:77,d:"moderate",t:"Conscience Types",q:"Right Conscience judges what is really good as good and evil as ___.",
   c:["A. Acceptable","B. Good","C. Uncertain","D. Evil"],a:"D",
   e:"Right Conscience judges what is really GOOD as GOOD and what is really EVIL as EVIL — it makes correct moral judgments."},
  {id:78,d:"moderate",t:"Conscience Types",q:"Erroneous Conscience judges what is bad as ___ and vice versa.",
   c:["A. Evil","B. Uncertain","C. Good","D. Illegal"],a:"C",
   e:"Erroneous Conscience judges what is BAD AS GOOD and vice versa — it is the opposite of Right Conscience."},
  {id:79,d:"moderate",t:"Conscience Types",q:"Pharisaical Conscience means that a person is a 'hypocrite' — saying ___ things but doing the opposite.",
   c:["A. False","B. Good","C. Legal","D. Popular"],a:"B",
   e:"A Pharisaical Conscience means the person says GOOD things but DOES THE OPPOSITE — a classic hypocrite."},
  {id:80,d:"moderate",t:"Conscience Types",q:"Certain Conscience refers to ___.",
   c:["A. Always being afraid of committing evil","B. Subjective assurance of the lawfulness or unlawfulness of certain actions","C. Suspending judgment on the lawfulness of an action","D. Tending to follow the easy way and find excuses"],a:"B",
   e:"CERTAIN CONSCIENCE = SUBJECTIVE ASSURANCE of the lawfulness or unlawfulness of certain actions to be done or to be admitted. You 'sure decide.'"},
  {id:81,d:"moderate",t:"Conscience Types",q:"Doubtful Conscience suspends judgment on the lawfulness of an action, and therefore (it is possible) the action should be ___.",
   c:["A. Performed immediately","B. Omitted","C. Reported to authority","D. Freely chosen"],a:"B",
   e:"Doubtful Conscience SUSPENDS JUDGMENT — therefore it is possible the action should be OMITTED. Best to 'assume' and hold back."},
  {id:82,d:"moderate",t:"Conscience Types",q:"Scrupulous Conscience is CONSTANTLY AFRAID of committing evil. This conscience is a result of a ___ character.",
   c:["A. Lax","B. Weak","C. Stubborn","D. Doubtful"],a:"C",
   e:"Scrupulous Conscience — constantly afraid of committing evil — is a result of a STUBBORN CHARACTER."},
  {id:83,d:"moderate",t:"Conscience Types",q:"Lax Conscience tends to follow the ___ and to find excuses for mistakes.",
   c:["A. Strict path","B. Universal law","C. Easy way","D. Cultural norm"],a:"C",
   e:"Lax Conscience follows the EASY WAY and finds excuses for mistakes — it avoids moral responsibility through rationalization."},
  {id:84,d:"moderate",t:"Conscience Types",q:"Guilty Conscience is a disturbed conscience trying to restore good relations with God by means of sorrow and ___.",
   c:["A. Good deeds only","B. Prayer and fasting","C. Following the law","D. Repentance"],a:"D",
   e:"Guilty Conscience is a DISTURBED CONSCIENCE trying to restore good relations with God by means of SORROW AND REPENTANCE."},
  {id:85,d:"moderate",t:"Conscience Types",q:"'Callous' as a descriptor of a type of conscience means ___.",
   c:["A. Always afraid of sin","B. Cruel and insensitive","C. Following easy excuses","D. Uncertain about moral action"],a:"B",
   e:"'CALLOUS' means CRUEL AND INSENSITIVE — it describes a conscience that has become hardened and unfeeling about moral obligations."},
  {id:86,d:"moderate",t:"Ignorance",q:"Vincible Ignorance occurs when we do not know something that WE OUGHT TO KNOW. It does NOT free us from ___.",
   c:["A. Knowledge requirements","B. Freedom","C. Responsibility","D. The act itself"],a:"C",
   e:"Vincible Ignorance does NOT free us from RESPONSIBILITY — the person ought to have known and failed to find out."},
  {id:87,d:"moderate",t:"Ignorance",q:"SUPINE/GROSS/CRASS Ignorance is when ___.",
   c:["A. A person deliberately avoids truth to sin freely","B. The knowledge was impossible to obtain","C. Scarcely any effort has been made to remove the ignorance","D. The person acts in perfectly good conscience"],a:"C",
   e:"Supine/Gross/Crass Ignorance = when SCARCELY ANY EFFORT HAS BEEN MADE to remove it. Minimum possible effort was exerted."},
  {id:88,d:"moderate",t:"Ignorance",q:"Affected Ignorance occurs when ___.",
   c:["A. A person does not know what is impossible to know","B. A person deliberately avoids enlightenment in order to sin more freely","C. A person is scarcely trying to learn","D. A person acts out of emotional distress"],a:"B",
   e:"AFFECTED IGNORANCE = when a person DELIBERATELY AVOIDS ENLIGHTENMENT IN ORDER TO SIN MORE FREELY — the most culpable form of ignorance."},
  {id:89,d:"moderate",t:"Passion",q:"Passion refers to POSITIVE emotions such as love, desire, delight, hope, and bravery AND NEGATIVE emotions such as ___.",
   c:["A. Joy, excitement, and calm","B. Hatred, horror, sadness, despair, fear, and anger","C. Contentment and serenity","D. Enthusiasm and motivation"],a:"B",
   e:"Passion includes both POSITIVE (love, desire, delight, hope, bravery) and NEGATIVE emotions (HATRED, HORROR, SADNESS, DESPAIR, FEAR, ANGER)."},
  {id:90,d:"moderate",t:"Passion",q:"Antecedent Passion refers to emotions that PRECEDE the act. Its effect on accountability is ___.",
   c:["A. It increases accountability","B. It eliminates voluntariness completely","C. It diminishes accountability for the resultant act","D. It has no effect on accountability"],a:"C",
   e:"Antecedent Passion (first emotion / sudden moment) PRECEDES the act. It DIMINISHES ACCOUNTABILITY for the resultant act."},
  {id:91,d:"moderate",t:"Passion",q:"Consequent Passion refers to emotions that are intentionally aroused and kept. Its effect on voluntariness and accountability is ___.",
   c:["A. It diminishes accountability","B. It destroys voluntariness","C. It does not lessen voluntariness but may INCREASE accountability","D. It removes responsibility completely"],a:"C",
   e:"CONSEQUENT PASSION = intentionally aroused and kept (last motion). It does NOT lessen voluntariness but may INCREASE ACCOUNTABILITY."},
  {id:92,d:"moderate",t:"Fear and Violence",q:"Fear as a Modifier of Human Acts is a disturbance of the mind due to an impending danger or harm to oneself or ___.",
   c:["A. Society","B. The government","C. Loved ones","D. The law"],a:"C",
   e:"Fear is a disturbance of mind due to an impending danger or harm to HIMSELF OR LOVED ONES. Acts done with fear are generally voluntary."},
  {id:93,d:"moderate",t:"Fear and Violence",q:"Violence as a Modifier of Human Acts refers to physical force exerted on a person to compel them to act against their ___.",
   c:["A. Conscience","B. Reason","C. Knowledge","D. Will"],a:"D",
   e:"Violence = physical force exerted to compel a person to act against their WILL. Such actions are INVOLUNTARY and NOT ACCOUNTABLE."},
  {id:94,d:"moderate",t:"Determinants of Morality",q:"For an act to be morally good, ALL THREE determinants must be without flaw — based on the axiom: ___.",
   c:["A. The end justifies the means","B. A thing to be good must wholly so; it is not vitiated by any defect","C. Do good and avoid evil","D. Act only according to universal law"],a:"B",
   e:"'A THING TO BE GOOD MUST WHOLLY SO; IT IS NOT VITIATED BY ANY DEFECT' — all three determinants (Object, End, Circumstances) must be good."},
  {id:95,d:"moderate",t:"Determinants of Morality",q:"Circumstances as a determinant of morality refer to the TIME, PLACE, PERSON, and ___ surrounding the moral act.",
   c:["A. Laws","B. Intentions","C. Consequences","D. Conditions"],a:"D",
   e:"Circumstances = TIME, PLACE, PERSON, and CONDITIONS surrounding the moral act. Example: giving drink to the thirsty may be evil if the drink is intoxicating."},
  {id:96,d:"moderate",t:"Determinants of Morality",q:"An evil END corrupts the action ___.",
   c:["A. Only if the circumstances are also bad","B. Even if the object is good in itself","C. Only if the person knows it is evil","D. Only when the act is publicly visible"],a:"B",
   e:"'An evil end corrupts the action EVEN IF THE OBJECT IS GOOD IN ITSELF' — e.g., praying and fasting in order to be seen of men."},
  {id:97,d:"moderate",t:"Moral Foundation of Education",q:"False Dilemma is a situation where the decision-maker has a moral duty to do one thing but is tempted or under pressure to do something else. It is a choice between ___.",
   c:["A. Wrong and wrong","B. Right and right","C. Right and wrong","D. Two impossible options"],a:"C",
   e:"A FALSE DILEMMA involves a choice between a RIGHT and a WRONG — not between two morally equal options. Example: a lawyer tempted to prioritize self-interest."},
  {id:98,d:"moderate",t:"Moral Foundation of Education",q:"The Principle of Double Effect recognizes that relieving a terminally ill patient's pain may also cause an effect one would normally be obliged to avoid. This means ___.",
   c:["A. Only bad effects are possible","B. Only good effects are possible","C. An action may have both good and bad effects","D. The good effect justifies any bad effect"],a:"C",
   e:"The Principle of Double Effect: some actions may have BOTH GOOD AND BAD EFFECTS — e.g., pain relief that may also slightly shorten life."},
  {id:99,d:"moderate",t:"Moral Foundation of Education",q:"The Choice of Lesser Evil states that when face with two unpleasant situations, one should choose ___.",
   c:["A. The most legal option","B. The least harmful option","C. The most popular option","D. The most socially acceptable option"],a:"B",
   e:"Choice of Lesser Evil: choose THE LEAST HARMFUL one — evil and evil, choose the less harmful one."},
  {id:100,d:"moderate",t:"Principles of Cooperation",q:"The Principle of Formal Cooperation involves a WILLING participation in the sinful act of the principal agent. In formal cooperation, the cooperating person ___ the evil done.",
   c:["A. Tolerates without intending","B. Is forced to participate in","C. Intends and participates in","D. Is unaware of"],a:"C",
   e:"Formal Cooperation: the person INTENDS the evil done and PARTICIPATES by advising, counseling, promoting, or condoning it."},
  {id:101,d:"moderate",t:"Principles of Cooperation",q:"Material Cooperation means cooperating in a way where one does NOT intend the evil but only permits or tolerates it for the sake of ___.",
   c:["A. Personal gain","B. Following orders","C. Gaining social approval","D. Avoiding even more serious evils"],a:"D",
   e:"Material Cooperation: one does not intend the evil but only permits or tolerates it FOR THE SAKE OF AVOIDING EVEN MORE SERIOUS EVILS."},
  {id:102,d:"moderate",t:"Good Moral Character",q:"The FOUR WAYS of describing good moral character are: Being Fully Human, Being a Loving Person, Being a Virtuous Person, and Being a ___.",
   c:["A. Morally Perfect Person","B. Religiously Devout Person","C. Morally Mature Person","D. Socially Responsible Person"],a:"C",
   e:"The four ways: (1) Being Fully Human, (2) Being a Loving Person, (3) Being a Virtuous Person, (4) Being a MORALLY MATURE PERSON."},
  {id:103,d:"moderate",t:"Good Moral Character",q:"Being a 'Loving Person' in the context of good moral character means caring and being unselfish and mature with yourself, other people, and ___.",
   c:["A. Society","B. The law","C. God","D. Nature"],a:"C",
   e:"Being a Loving Person means CARING AND UNSELFISH AND MATURE WITH YOURSELF, OTHER PEOPLE AND GOD."},
  {id:104,d:"moderate",t:"Good Moral Character",q:"Being a Virtuous Person means having acquired good habits and attitudes that you practice ___ in your daily life.",
   c:["A. Occasionally","B. Consistently","C. When convenient","D. Publicly"],a:"B",
   e:"Being a Virtuous Person means having ACQUIRED GOOD HABITS AND ATTITUDES and practicing them CONSISTENTLY in your daily life."},
  {id:105,d:"moderate",t:"Good Moral Character",q:"Being Fully Human means having realized substantially your ___ as a human person.",
   c:["A. Rights","B. Social status","C. Potential","D. Intellect"],a:"C",
   e:"Being FULLY HUMAN means having realized substantially your POTENTIAL as a human person."},
  {id:106,d:"moderate",t:"Virtue Ethics",q:"Virtue Theory emphasizes an individual's ___ rather than following a set of rules.",
   c:["A. Intelligence","B. Character","C. Legal compliance","D. Social standing"],a:"B",
   e:"Virtue Theory emphasizes an individual's CHARACTER rather than following a set of rules. If we focus on being good people, right actions follow effortlessly."},
  {id:107,d:"moderate",t:"Virtue Ethics",q:"The Virtue of Courage is the midpoint between Cowardice and ___.",
   c:["A. Bravery","B. Recklessness","C. Boldness","D. Fearlessness"],a:"B",
   e:"COURAGE is the Golden Mean between COWARDICE (deficiency) and RECKLESSNESS (excess). Cowardice is the deficiency; recklessness is the excess."},
  {id:108,d:"moderate",t:"Virtue Ethics",q:"Aristotle says that having virtue means doing the right thing at the right time, in the right way, in the right amount, toward the ___.",
   c:["A. Right purpose","B. Right law","C. Right outcome","D. Right people"],a:"D",
   e:"Aristotle's definition: virtue means doing the right thing at the right time, in the right way, in the right amount, toward the RIGHT PEOPLE."},
  {id:109,d:"moderate",t:"Virtue Ethics in Other Traditions",q:"In Confucian ethics, 'JEN' refers to ___.",
   c:["A. Manner and culture","B. Humaneness, human-heartedness, and compassion","C. Non-violence and truthfulness","D. Right speech and right action"],a:"B",
   e:"JEN (humaneness) = HUMAN-HEARTEDNESS AND COMPASSION in Confucian ethics. 'LI' (Propriety) refers to manner and culture."},
  {id:110,d:"moderate",t:"Virtue Ethics in Other Traditions",q:"Buddhism's Moral Virtues include Right Speech, Right Action, and ___.",
   c:["A. Right Mindfulness","B. Right Understanding","C. Right Livelihood","D. Right Intention"],a:"C",
   e:"Buddhism's Moral Virtues include: Right Speech, Right Action, and RIGHT LIVELIHOOD."},
  {id:111,d:"moderate",t:"Virtue Ethics in Other Traditions",q:"According to the reviewer, the virtues emphasized by Jesus Christ include Love, Mercy, Kindness, Compassion, Patience, Self-control, and ___.",
   c:["A. Fortitude","B. Wisdom","C. Gentleness","D. Humility"],a:"C",
   e:"Jesus Christ's virtues listed: Love, Mercy, Kindness, Compassion, Patience, Self-control, and GENTLENESS."},
  {id:112,d:"moderate",t:"Natural Law",q:"Thomas Aquinas believed that God made us 'preloaded with tools we need to know what's good.' This means ___.",
   c:["A. We need the Bible for morality","B. Church attendance is required for moral knowledge","C. Human nature and reason are sufficient to understand natural law","D. Only religious leaders can determine what is good"],a:"C",
   e:"Aquinas: 'We don't need the Bible, or religion class, or church to understand the natural law.' HUMAN NATURE AND REASON are sufficient."},
  {id:113,d:"moderate",t:"Natural Law",q:"The 7 Basic Goods in Natural Law Theory include Life, Reproduction, Educate one's offspring, Seek God, Live in society, Avoid offense, and ___.",
   c:["A. Follow divine law","B. Seek happiness","C. Shun ignorance","D. Obey authority"],a:"C",
   e:"The 7 Basic Goods: Life, Reproduction, Educate offspring, Seek God, Live in society, Avoid offense, and SHUN IGNORANCE."},
  {id:114,d:"moderate",t:"Natural Law",q:"In Natural Law Theory, for each negative law (prohibition) there is a corresponding positive one (positive injunction). For LIFE, 'Do not kill' is the prohibition and the positive injunction is ___.",
   c:["A. Seek God","B. Promote life","C. Avoid offense","D. Procreate"],a:"B",
   e:"For the basic good of LIFE: 'Do not kill' (prohibition) ↔ 'PROMOTE LIFE' (positive injunction)."},
  {id:115,d:"moderate",t:"Kant's Ethics",q:"Categorical Imperatives are commands you must follow regardless of your ___.",
   c:["A. Cultural context","B. Social standing","C. Desires","D. Knowledge"],a:"C",
   e:"Categorical Imperatives are COMMANDS you must follow, REGARDLESS OF YOUR DESIRES. Moral obligations come from pure reason."},
  {id:116,d:"moderate",t:"Kant's Ethics",q:"A MAXIM in Kant's ethics is ___.",
   c:["A. A divine commandment","B. A cultural norm","C. A rule or principle of action","D. A universal scientific law"],a:"C",
   e:"A MAXIM is simply a RULE OR PRINCIPLE OF ACTION. Kant's first formulation asks whether your maxim can become a universal law."},
  {id:117,d:"moderate",t:"Kant's Ethics",q:"Kant's First Formulation of the Categorical Imperative is also called ___.",
   c:["A. The Formula of Humanity","B. The Principle of Utility","C. The Universalizability Principle","D. The Golden Mean"],a:"C",
   e:"Kant's First Formulation is the UNIVERSALIZABILITY PRINCIPLE: 'Act only according to that maxim which you can at the same time will that it should become a universal law without contradiction.'"},
  {id:118,d:"moderate",t:"Kant's Ethics",q:"Kant's Second Formulation of the Categorical Imperative (Formula of Humanity) says to treat humanity always as an end, and never as a ___.",
   c:["A. Subject","B. Rational agent","C. Tool of God","D. Mere means"],a:"D",
   e:"Formula of Humanity: 'Act so that you treat humanity... always as an END, and NEVER AS A MERE MEANS.' Humans are ends-in-themselves."},
  {id:119,d:"moderate",t:"Love & Justice",q:"Justice means giving what is ___ to others, while Love means giving even ___ than what is due.",
   c:["A. Due / Less","B. Equal / Less","C. Due / More","D. Less / More"],a:"C",
   e:"JUSTICE = giving what is DUE to others. LOVE = giving even MORE THAN what is due to others — Love exceeds justice."},
  {id:120,d:"moderate",t:"Love & Justice",q:"Social Justice is the ___ of the common good.",
   c:["A. Enforcement","B. Promotion","C. Definition","D. Study"],a:"B",
   e:"SOCIAL JUSTICE is the PROMOTION OF THE COMMON GOOD — giving everyone equal access to wealth, opportunities, and privileges in society."},
  {id:121,d:"moderate",t:"Love & Justice",q:"Distributive Justice is concerned with the distribution of goods, duties, and privileges based on the merits of individuals and the ___.",
   c:["A. Equal shares for everyone","B. Government policies","C. Cultural norms","D. Best interests of society"],a:"D",
   e:"Distributive Justice distributes based on the MERITS OF INDIVIDUALS and the BEST INTERESTS OF SOCIETY."},
  {id:122,d:"moderate",t:"Utilitarianism",q:"Utilitarianism has philosophical ancestors in Ancient Greek thinkers such as ___.",
   c:["A. Aristotle","B. Plato","C. Epicurus","D. Socrates"],a:"C",
   e:"Utilitarianism has philosophical ancestors in Ancient Greek Thinkers such as EPICURUS."},
  {id:123,d:"moderate",t:"Utilitarianism",q:"Act Utilitarianism focuses on ___.",
   c:["A. Long-term rules that maximize utility","B. Any given situation, choosing the action producing the greatest good for the greatest number","C. Following duty regardless of consequences","D. Universal moral laws"],a:"B",
   e:"ACT UTILITARIANISM (short-term): in any given situation, choose the action producing the GREATEST GOOD FOR THE GREATEST NUMBER."},
  {id:124,d:"moderate",t:"Utilitarianism",q:"Rule Utilitarianism says we ought to live by rules that, in general, lead to the greatest good. It allows us to refrain from short-run utility-maximizing acts in favor of ___.",
   c:["A. Cultural norms","B. Divine law","C. Individual preferences","D. Rules that maximize utility for the majority of the time"],a:"D",
   e:"RULE UTILITARIANISM (long-term): follow RULES that MAXIMIZE UTILITY FOR THE MAJORITY OF THE TIME, not just immediate short-term utility."},
  {id:125,d:"moderate",t:"Personhood",q:"The COGNITIVE criterion of personhood includes Consciousness, reasoning, self-motivated activity, capacity to communicate, and ___.",
   c:["A. Human DNA","B. Being recognized by society","C. Self-awareness","D. Ability to feel pleasure and pain"],a:"C",
   e:"Cognitive criterion: Consciousness, REASONING, self-motivated activity, capacity to communicate, and SELF-AWARENESS."},
  {id:126,d:"moderate",t:"Personhood",q:"The SOCIAL criterion of personhood states that you are a person ___.",
   c:["A. If you have human DNA","B. Whenever society recognizes you as a person, or whenever someone cares about you","C. When you can reason and communicate","D. When you can feel pleasure and pain"],a:"B",
   e:"Social criterion: WHENEVER SOCIETY RECOGNIZES YOU AS A PERSON, or whenever SOMEONE CARES ABOUT YOU."},
  {id:127,d:"moderate",t:"Personhood",q:"SENTIENCE as a criterion of personhood refers to ___.",
   c:["A. Human DNA","B. Social recognition","C. The ability to feel pleasure and pain","D. Reasoning and self-awareness"],a:"C",
   e:"SENTIENCE criterion = the ABILITY TO FEEL PLEASURE AND PAIN."},
  {id:128,d:"moderate",t:"Personhood",q:"The GRADIENT THEORY of personhood states that personhood comes in degrees — you can have ___ of it.",
   c:["A. All or nothing","B. More or less","C. Legal or none","D. Social or biological"],a:"B",
   e:"Gradient Theory: personhood COMES IN DEGREES — you can have MORE OR LESS of it. It is not binary."},
  {id:129,d:"moderate",t:"Moral Dilemma",q:"In a Moral Dilemma, the agent is required to do each of two actions which are morally unacceptable, CAN do each action separately, but CANNOT ___.",
   c:["A. Perform either action","B. Choose freely","C. Do both","D. Be held accountable"],a:"C",
   e:"In a true moral dilemma: agent is required to do each of two morally unacceptable actions, can do each separately, but CANNOT DO BOTH."},
  {id:130,d:"moderate",t:"Moral Dilemma — Levels",q:"Individual Dilemma refers to personal dilemmas — it is an individual's ___.",
   c:["A. Organization vs. welfare conflict","B. Sector vs. institution conflict","C. Damn-if-you-do and damn-if-you-don't situation","D. Community vs. individual conflict"],a:"C",
   e:"Individual Dilemma = personal dilemmas. It is an individual's DAMN-IF-YOU-DO AND DAMN-IF-YOU-DON'T situation."},
  {id:131,d:"moderate",t:"Moral Dilemma — Levels",q:"Organizational Dilemma exists between personal interest and organization welfare OR between individual groups' interests and ___.",
   c:["A. Structural dilemmas","B. Government regulations","C. Organizational well-being","D. Cultural standards"],a:"C",
   e:"Organizational Dilemma: between personal interest and ORGANIZATION WELFARE, or between individual groups' interests and ORGANIZATIONAL WELL-BEING."},
  {id:132,d:"moderate",t:"Moral Dilemma — Levels",q:"Structural Dilemma is a conflict of perspective of sectors, groups, and institutions that may be affected by ___.",
   c:["A. Personal choices","B. The decision","C. Cultural norms","D. Individual bias"],a:"B",
   e:"Structural Dilemma = conflict of perspective of sectors, groups, and institutions that may be AFFECTED BY THE DECISION."},
  {id:133,d:"moderate",t:"Structural Dilemma",q:"Which of the following is an example of a Structural Dilemma?",
   c:["A. Individual vs. duty","B. Differentiation vs. Integration","C. Personal interest vs. organizational welfare","D. Moral duty vs. temptation"],a:"B",
   e:"Examples of Structural Dilemma include: DIFFERENTIATION vs. INTEGRATION, Gap vs. Overlap, Lack of Clarity vs. Lack of Creativity, etc."},
  {id:134,d:"moderate",t:"Structural Dilemma",q:"GAP vs. OVERLAP: A GAP leaves an important thing in an organization ___.",
   c:["A. Over-managed","B. Undone","C. Duplicated","D. Over-regulated"],a:"B",
   e:"GAPS leave an important thing UNDONE — nobody responds to a need because of unclear role assignment."},
  {id:135,d:"moderate",t:"Structural Dilemma",q:"OVERLAPS result in unnecessary and counterproductive, redundant procedures which lead to ___.",
   c:["A. Better outcomes","B. Waste of resources","C. More creativity","D. Increased efficiency"],a:"B",
   e:"OVERLAPS lead to WASTE OF RESOURCES — unnecessary, redundant, counterproductive procedures."},
  {id:136,d:"moderate",t:"Structural Dilemma",q:"Differentiation vs. Integration is characterized by DECENTRALIZATION, where local governments and schools become more DIFFERENTIATED and it becomes more difficult to ___.",
   c:["A. Make decisions locally","B. Apply uniform standards","C. Integrate them for a unified structure","D. Maintain autonomy"],a:"C",
   e:"Differentiation vs. Integration: schools become more DIFFERENTIATED, making it difficult to INTEGRATE them for a unified structure."},
  {id:137,d:"moderate",t:"Structural Dilemma",q:"Lack of Clarity occurs when employees are unclear about what they are supposed to do, leading them to tailor roles around ___.",
   c:["A. System-wide goals","B. Organizational welfare","C. Legal mandates","D. Personal preferences"],a:"D",
   e:"LACK OF CLARITY: employees are UNCLEAR about what they're supposed to do, frequently leading them to tailor roles around PERSONAL PREFERENCES instead of system-wide goals."},
  {id:138,d:"moderate",t:"Structural Dilemma",q:"Excessive Autonomy vs. Excessive Interdependence refers to being TOO ISOLATED versus ___.",
   c:["A. Too little cooperation","B. Too much coordination","C. Too much creativity","D. Too much authority"],a:"B",
   e:"Excessive Autonomy = TOO ISOLATED. Excessive Interdependence = TOO MUCH COORDINATION. Either extreme creates problems."},
  {id:139,d:"moderate",t:"Structural Dilemma",q:"In decentralized decision-making, organizations can respond to change rapidly because decision-makers are the people ___.",
   c:["A. With the most experience","B. With the highest authority","C. Closest to the situation","D. With the most resources"],a:"C",
   e:"In decentralized decision-making, organizations respond rapidly and effectively because decision-makers are the people CLOSEST TO THE SITUATION."},
  {id:140,d:"moderate",t:"Five Moral Frameworks",q:"What are the FIVE CLASSIFICATIONS of Moral Frameworks?",
   c:["A. Metaethics, Normative, Applied, Cultural, Religious","B. Virtue, Natural Law, Deontological, Utilitarianism, Love & Justice","C. Realism, Relativism, Antirealism, Subjectivism, Absolutism","D. Teleological, Deontological, Virtue, Love, Culture"],a:"B",
   e:"The Five Moral Frameworks: (1) Aristotle's Virtue Ethics, (2) Natural Law Ethics, (3) Kant's Deontological Ethics, (4) Utilitarianism, (5) Love & Justice Framework."},
  {id:141,d:"moderate",t:"Five Moral Frameworks",q:"St. Thomas' Natural Law Ethics is summarized as ___.",
   c:["A. Do good for the greatest number","B. Act only from universal duty","C. Do good and avoid evil","D. Follow the culture's moral facts"],a:"C",
   e:"Natural Law Ethics' core principle: DO GOOD AND AVOID EVIL."},
  {id:142,d:"moderate",t:"Five Moral Frameworks",q:"Kant's Deontological Ethics is also called ___.",
   c:["A. The Consequence Framework","B. The Character Framework","C. The Duty Framework","D. The Love Framework"],a:"C",
   e:"Kant's Deontological Ethics is also called THE DUTY FRAMEWORK — it emphasizes responsibility and duty derived from reason."},
  {id:143,d:"moderate",t:"Voluntary Act",q:"A Voluntary Act is one that is voluntarily intended when it is done with the aim, purpose, or goal of attaining a ___.",
   c:["A. Social approval","B. Result","C. Legal outcome","D. Cultural norm"],a:"B",
   e:"A Voluntary Act is done with the AIM, PURPOSE, or GOAL of attaining a RESULT."},
  {id:144,d:"moderate",t:"Voluntary Act",q:"A Voluntary Act can be either Intentional or ___.",
   c:["A. Forced","B. Negligent","C. Emotional","D. Cultural"],a:"B",
   e:"A Voluntary Act can be INTENTIONAL (intended/planned) or NEGLIGENT (done voluntarily without care or precaution in avoiding a foreseeable event)."},
  {id:145,d:"moderate",t:"Voluntary Act",q:"A Negligent Act is done voluntarily WITHOUT CARE or PRECAUTION in avoiding the happening of a ___ event.",
   c:["A. Random","B. Unexpected","C. Foreseeable","D. Deliberate"],a:"C",
   e:"A Negligent Act is done voluntarily without care or precaution in avoiding a FORESEEABLE EVENT."},
  {id:146,d:"moderate",t:"Virtue Ethics in Christian Tradition",q:"A life of eudaimonia is a life of STRIVING — it comes from achieving something really difficult rather than ___.",
   c:["A. Working hard","B. Being virtuous","C. Following rules","D. Having it handed to you"],a:"D",
   e:"Eudaimonia comes from striving and achieving difficult things, rather than HAVING IT HANDED TO YOU."},
  {id:147,d:"moderate",t:"Virtue Ethics in Christian Tradition",q:"Thomas Aquinas emphasized Faith, Hope, and ___.",
   c:["A. Charity","B. Love","C. Justice","D. Wisdom"],a:"B",
   e:"Thomas Aquinas' theological virtues: FAITH, HOPE, and LOVE."},
  {id:148,d:"moderate",t:"Hinduism in Ethics",q:"Hindu ethics emphasizes Non-violence, Truthfulness, Honesty, Chastity, and ___.",
   c:["A. Right livelihood","B. Freedom from Greed","C. Right mindfulness","D. Humaneness"],a:"B",
   e:"Hindu virtues: Non-violence, Truthfulness, Honesty, Chastity, and FREEDOM FROM GREED."},
  {id:149,d:"moderate",t:"Buddhism in Ethics",q:"Buddhism's Intellectual Virtues include Right Understanding and ___.",
   c:["A. Right action","B. Right speech","C. Right mindfulness","D. Right livelihood"],a:"C",
   e:"Buddhism's Intellectual Virtues include: RIGHT UNDERSTANDING and RIGHT MINDFULNESS."},
  {id:150,d:"moderate",t:"7 Basic Goods",q:"For the basic good of REPRODUCTION, 'Don't prevent reproduction' is the prohibition and the positive injunction is ___.",
   c:["A. Educate your offspring","B. Live in society","C. Procreate","D. Seek God"],a:"C",
   e:"For the basic good of REPRODUCTION: 'Don't prevent reproduction' (prohibition) ↔ 'PROCREATE' (positive injunction)."},
  {id:151,d:"moderate",t:"Kant's Ethics",q:"Kant argued that proper rational application of the Categorical Imperative will lead us to moral truth that is fixed and applicable to all moral agents — 'No ___ required.'",
   c:["A. Reason","B. Rules","C. Government","D. God"],a:"D",
   e:"Kant argued that the Categorical Imperative leads to fixed moral truth for all moral agents — 'NO GOD REQUIRED.' Morality is knowable by reason alone."},
  {id:152,d:"moderate",t:"Utilitarianism",q:"Utilitarianism was founded in the ___ Century.",
   c:["A. 16th","B. 17th","C. 19th","D. 18th"],a:"D",
   e:"Utilitarianism was founded in the 18TH CENTURY by Jeremy Bentham and John Stuart Mill."},
  {id:153,d:"moderate",t:"Moral Dilemma",q:"The classic example of Individual Dilemma is ___.",
   c:["A. The gap vs. overlap structural conflict","B. The decentralization problem","C. The Case of Heinz — steal the drug or let the wife die","D. Organizational conflict between personal and company interests"],a:"C",
   e:"The classic Individual Dilemma is THE CASE OF HEINZ — torn between two obligations: save wife (steal drug) or obey law (let her die)."},
  {id:154,d:"moderate",t:"Structural Dilemma",q:"Flexibility vs. Strict Adherence to Rules means you accommodate by ___ rules to help someone, or you STICK STRICTLY TO RULES no matter what.",
   c:["A. Enforcing","B. Bending","C. Creating","D. Ignoring"],a:"B",
   e:"Flexibility vs. Strict Adherence to Rules: you accommodate by BENDING RULES to help someone, or stick strictly to rules — either extreme creates problems."},
  {id:155,d:"moderate",t:"Structural Dilemma",q:"Lack of Creativity in organizations occurs when responsibilities are over-defined and people RIGIDLY FOLLOW job descriptions regardless of how much the service or product suffers — they end up ___.",
   c:["A. Being too flexible","B. Being too creative","C. Being uncreative","D. Being too autonomous"],a:"C",
   e:"LACK OF CREATIVITY: when over-defined responsibilities make people rigidly follow protocols in a bureaucratic way — they end up UNCREATIVE."},
  {id:156,d:"moderate",t:"Love & Justice",q:"Philia as a Greek concept of love refers to ___.",
   c:["A. Selfless love / charity","B. Passionate sexual encounter","C. Affection between friends","D. Love of God"],a:"C",
   e:"PHILIA = AFFECTION BETWEEN FRIENDS. The three Greek concepts: (1) Agape (selfless/charity), (2) Erotic (passionate), (3) Philia (friendship)."},
  {id:157,d:"moderate",t:"Love & Justice",q:"'Justice as moral framework, be it social or distributive justice, states that whatever ___ justice is the morally right thing to do.'",
   c:["A. Creates","B. Promotes","C. Defines","D. Measures"],a:"B",
   e:"'Justice as moral framework states that whatever PROMOTES JUSTICE is the morally right thing to do.'"},
  {id:158,d:"moderate",t:"Personhood",q:"The GENETIC criterion of personhood states that one is a person if one has ___.",
   c:["A. Self-awareness","B. Social recognition","C. Human DNA","D. Ability to feel pain"],a:"C",
   e:"GENETIC criterion: one is a person if one has HUMAN DNA; NOT a person without it."},
  {id:159,d:"moderate",t:"Moral Realism",q:"According to Moral Realism, examples of moral facts include 'Gratuitous Violence is always wrong' and '___.'",
   c:["A. Murder may sometimes be right","B. Nurturing children is always right","C. Stealing can be acceptable","D. Cultural norms define right and wrong"],a:"B",
   e:"Moral Realism's examples of moral facts: 'Gratuitous Violence is always wrong' and 'NURTURING CHILDREN IS ALWAYS RIGHT.'"},
  {id:160,d:"moderate",t:"Ethics Basics",q:"Morality studies the morality of human acts and moral agents, what makes an act obligatory, and what makes a person accountable. Its arrow points to ___.",
   c:["A. Legal standards","B. Human Act: Will, Awareness, Freedom","C. Cultural norms","D. Scientific facts"],a:"B",
   e:"The reviewer shows Morality → Human Act → (W) Will, (A) Awareness, (F) Freedom — these three elements define what makes a person morally accountable."},

  // ══════════════════════════ DIFFICULT (161–200) ══════════════════════════
  {id:161,d:"difficult",t:"Metaethics Application",q:"A philosopher argues: 'Moral claims are neither true nor false — they merely express the speaker's attitude.' This BEST represents which metaethical view?",
   c:["A. Moral Absolutism","B. Normative Cultural Relativism","C. Moral Realism","D. Moral Subjectivism"],a:"D",
   e:"MORAL SUBJECTIVISM holds that moral statements can be true and false — right or wrong — but they REFER ONLY TO PEOPLE'S ATTITUDES rather than their actions or objective facts about the world."},
  {id:162,d:"difficult",t:"Cultural Relativism Critique",q:"'If every culture is the sole arbiter of what's right for it, that means no culture can be actually wrong.' This critique makes Cultural Relativism lead to ___.",
   c:["A. Universal moral standards","B. Moral Absolutism","C. The impossibility of cultural reform and moral progress","D. Moral Realism as the only option"],a:"C",
   e:"NCR's logical conclusion: if what everyone does now is right relative to their culture, 'THERE'S NEVER ANY REASON TO CHANGE ANYTHING' — making cultural reform and moral progress conceptually impossible."},
  {id:163,d:"difficult",t:"Ignorance Application",q:"A teacher burns their students' test papers before grading them because they 'don't want to see bad grades.' Which type of ignorance does this represent?",
   c:["A. Invincible Ignorance","B. Supine Ignorance","C. Affected Ignorance","D. Vincible Ignorance"],a:"C",
   e:"AFFECTED IGNORANCE = deliberately avoids enlightenment to sin more freely. The teacher deliberately destroys evidence of bad grades to avoid confronting them — intentional avoidance."},
  {id:164,d:"difficult",t:"Determinants of Morality",q:"A politician donates to charity PUBLICLY specifically to gain votes. Object (charity) = good; End (gain votes) = evil. Therefore the act is ___.",
   c:["A. Good because charity is virtuous","B. Neutral because the effects balance out","C. Evil because an evil end corrupts the action even if the object is good","D. Acceptable under the Principle of Double Effect"],a:"C",
   e:"'An evil end corrupts the action EVEN IF THE OBJECT IS GOOD IN ITSELF.' All three determinants must be good — an evil END makes the entire act morally evil."},
  {id:165,d:"difficult",t:"Determinants of Morality",q:"A person gives a glass of water to a thirsty man — Object (giving water) = good; End (help the thirsty) = good; but the water turns out to be intoxicating. The Circumstances make this act ___.",
   c:["A. Fully morally good regardless","B. Acceptable because two of three determinants are good","C. Potentially evil because circumstances can corrupt otherwise good acts","D. A False Dilemma"],a:"C",
   e:"The reviewer explicitly uses this example: 'it is good to give a drink to the thirsty, but if the thirsty man is morally weak and the drink is intoxicating, the act may be EVIL.' Circumstances can corrupt the act."},
  {id:166,d:"difficult",t:"Kant vs. Utilitarianism",q:"A government harvests organs from one healthy person to save five dying patients, producing the greatest utility. A Kantian would reject this because ___.",
   c:["A. Five people's lives don't outweigh one","B. The consequences weren't calculated correctly","C. The healthy person was treated as a mere means and not as an end-in-themselves","D. The act lacked cultural justification"],a:"C",
   e:"Kant's Formula of Humanity: 'Act so that you treat humanity... always as an END, and NEVER AS A MERE MEANS.' Using the healthy person as a sacrifice violates human dignity — people are not objects."},
  {id:167,d:"difficult",t:"Rule Utilitarianism",q:"'A whole society where innocent people are taken off the street to harvest their organs is going to have a lot LESS utility than one where you don't have to live in constant fear.' This argument supports ___.",
   c:["A. Act Utilitarianism","B. Moral Absolutism","C. Kant's Deontological Ethics","D. Rule Utilitarianism"],a:"D",
   e:"RULE UTILITARIANISM: considers long-term societal utility — a rule permitting organ harvesting creates constant fear and less utility overall. Rule Uti allows us to refrain from short-run utility-maximizing acts."},
  {id:168,d:"difficult",t:"Modifiers — Complex Application",q:"A soldier is forced at gunpoint to reveal military secrets. His disclosure of secrets is ___.",
   c:["A. Fully voluntary and accountable","B. Involuntary and not accountable due to violence","C. A negligent act","D. A result of affected ignorance"],a:"B",
   e:"VIOLENCE = physical force exerted to compel a person to act against their will. 'Actions performed by a person subjected to violence or irresistible force are INVOLUNTARY and NOT ACCOUNTABLE.'"},
  {id:169,d:"difficult",t:"Formal vs. Material Cooperation",q:"A nurse is threatened with termination unless she assists in a procedure she finds unethical. She complies to keep her job and support her family. This BEST exemplifies ___.",
   c:["A. Formal Cooperation — she intends the evil","B. False Dilemma","C. Material Cooperation — she doesn't intend the evil but tolerates it to avoid greater harm","D. Affected Ignorance"],a:"C",
   e:"MATERIAL COOPERATION: one does NOT intend the evil but only PERMITS or TOLERATES it for the sake of AVOIDING EVEN MORE SERIOUS EVILS (losing income needed to support family)."},
  {id:170,d:"difficult",t:"Conscience Application",q:"A student who goes to confession multiple times daily, convinced they sinned even after trivial actions, BEST exemplifies which conscience?",
   c:["A. Guilty Conscience","B. Doubtful Conscience","C. Lax Conscience","D. Scrupulous Conscience"],a:"D",
   e:"SCRUPULOUS CONSCIENCE = constantly afraid of committing evil; a result of stubborn character. The student is excessively fearful of sin even when none objectively exists."},
  {id:171,d:"difficult",t:"Virtue Ethics Application",q:"A student never raises their hand (deficiency) while another dominates all discussions (excess). Aristotle's Golden Mean points to the virtue of ___.",
   c:["A. Following the Categorical Imperative","B. Maximizing classroom participation for the greatest good","C. The right level of participation at the right time, in the right way","D. Adapting to the teacher's cultural expectations"],a:"C",
   e:"The Golden Mean: virtue lies BETWEEN excess (dominating) and deficiency (never speaking). Virtue = doing the RIGHT THING at the RIGHT TIME, in the RIGHT WAY, in the RIGHT AMOUNT."},
  {id:172,d:"difficult",t:"Natural Law + 7 Basic Goods",q:"According to Natural Law Theory, our instinct shows us basic goods and ___ allows us to derive the natural law from them.",
   c:["A. Culture","B. Religion","C. Emotion","D. Reason"],a:"D",
   e:"'Our instinct shows us the basic goods and REASON allows us to derive the natural law from them.' Example: My life is valuable → Your life is like mine → I shouldn't kill you → Do not kill is a Natural Law."},
  {id:173,d:"difficult",t:"Kant's Universalizability",q:"'If you approve of stealing — you're UNIVERSALIZING that action — you're saying EVERYONE should always steal. It can't be universalized. Hence stealing is wrong.' This is an application of ___.",
   c:["A. Principle of Utility","B. Formula of Humanity","C. Kant's First Formulation — Universalizability Principle","D. Choice of Lesser Evil"],a:"C",
   e:"KANT'S FIRST FORMULATION — UNIVERSALIZABILITY PRINCIPLE: 'Act only according to that maxim which you can at the same time will that it should become a universal law without contradiction.' Stealing cannot be universalized."},
  {id:174,d:"difficult",t:"False Dilemma vs. True Moral Dilemma",q:"A school principal must choose between letting a cheating student pass (to avoid harming their future) or failing them (to uphold integrity). Both choices have moral weight on both sides. This is ___.",
   c:["A. False Dilemma — temptation vs. duty","B. A True Moral Dilemma — both choices are morally obligated and both violate something moral","C. A Structural Dilemma about organizational policy","D. Affected Ignorance — the principal chose not to investigate thoroughly"],a:"B",
   e:"This is a TRUE MORAL DILEMMA — a situation where the agent has moral obligation to BOTH choices (protect student / uphold integrity), cannot do both, and choosing either means violating the other. Damn-if-you-do and damn-if-you-don't."},
  {id:175,d:"difficult",t:"Eudaimonia Application",q:"A teacher who never prepares lessons, gives minimal feedback, and just 'goes through the motions' is FAILING at eudaimonia because ___.",
   c:["A. They are not following Kant's universal law","B. They are not maximizing utility","C. They are not realizing their substantial potential as a human person","D. They are violating natural law's prohibition against harm"],a:"C",
   e:"Eudaimonia requires STRIVING — 'Being Fully Human means realizing substantially your POTENTIAL as a human person.' A teacher who barely tries fails to achieve human flourishing."},
  {id:176,d:"difficult",t:"Integrated — All Determinants",q:"A nurse gives medication to a patient (Object = good), intending to help (End = good), but administers in the wrong dosage due to negligence (Circumstances = defective). Morally, the act is ___.",
   c:["A. Good because two out of three determinants are good","B. Neutral because the intention was good","C. Moral failure — all three determinants must be without flaw","D. Covered by Invincible Ignorance"],a:"C",
   e:"'A THING TO BE GOOD MUST WHOLLY SO; IT IS NOT VITIATED BY ANY DEFECT.' The defective CIRCUMSTANCE (wrong dosage through negligence) corrupts the act — all three must be good."},
  {id:177,d:"difficult",t:"Antecedent vs. Consequent Passion",q:"A person who deliberately watches violent movies to fuel their anger before confronting someone, then acts violently — which type of passion MOST increases their accountability?",
   c:["A. Antecedent Passion — it precedes the act","B. Invincible Ignorance — they couldn't know better","C. Consequent Passion — intentionally aroused and kept, it may increase accountability","D. Fear — they feared the confrontation"],a:"C",
   e:"CONSEQUENT PASSION = INTENTIONALLY AROUSED AND KEPT. Unlike antecedent passion (diminishes accountability), consequent passion 'DO NOT lessen voluntariness but may INCREASE ACCOUNTABILITY' — the person deliberately cultivated the anger."},
  {id:178,d:"difficult",t:"NCR vs. DCR Distinction",q:"An anthropologist observes that different cultures have different taboos about food. A philosopher argues that not only do cultures BELIEVE differently about food taboos, but the MORAL FACTS about them actually differ by culture. The philosopher holds ___.",
   c:["A. Descriptive Cultural Relativism","B. Moral Absolutism","C. Moral Realism","D. Normative Cultural Relativism"],a:"D",
   e:"The anthropologist's observation = DCR (beliefs differ). The philosopher goes further — MORAL FACTS THEMSELVES differ by culture = NORMATIVE CULTURAL RELATIVISM (NCR)."},
  {id:179,d:"difficult",t:"Grounding Problem",q:"A student asks: 'We say gratuitous violence is always wrong — but WHY? What makes it objectively wrong?' This question is BEST described as ___.",
   c:["A. A normative ethics question about how to act","B. An applied ethics question about real-life moral issues","C. A metaethical inquiry — specifically the Grounding Problem","D. A question about cultural relativism"],a:"C",
   e:"This is the GROUNDING PROBLEM — the search for a FOUNDATION for moral beliefs that is SOLID, CLEAR, OBJECTIVE, and UNMOVING. It is a metaethical inquiry."},
  {id:180,d:"difficult",t:"Distributive Justice + Love",q:"A school gives extra resources only to top students. Under DISTRIBUTIVE JUSTICE, this is problematic because ___.",
   c:["A. It violates the Categorical Imperative","B. It fails to distribute based on merits of individuals and best interests of society","C. It creates a Gap vs. Overlap dilemma","D. It violates Agape only"],a:"B",
   e:"DISTRIBUTIVE JUSTICE distributes based on THE MERITS OF INDIVIDUALS and THE BEST INTERESTS OF SOCIETY. Giving resources only to top students ignores merit-based need and social welfare."},
  {id:181,d:"difficult",t:"Confucian Ethics vs. Aristotle",q:"Confucius' JEN (humaneness) and LI (propriety) MOST closely resembles which moral framework?",
   c:["A. Utilitarianism","B. Kant's Deontological Ethics","C. Natural Law Theory","D. Aristotle's Virtue Ethics"],a:"D",
   e:"Confucian ethics emphasizes CHARACTER VIRTUES (JEN = humaneness; LI = propriety) — this closely resembles ARISTOTLE'S VIRTUE ETHICS, which focuses on character development rather than rules or consequences."},
  {id:182,d:"difficult",t:"Scrupulous vs. Lax Conscience",q:"Which pair of conscience types BEST represents the two opposite extremes of moral anxiety and moral carelessness?",
   c:["A. Right and Erroneous Conscience","B. Certain and Doubtful Conscience","C. Scrupulous and Lax Conscience","D. Guilty and Pharisaical Conscience"],a:"C",
   e:"SCRUPULOUS CONSCIENCE = extreme moral anxiety (constantly afraid of evil). LAX CONSCIENCE = extreme moral carelessness (follows the easy way, finds excuses). They are polar opposites."},
  {id:183,d:"difficult",t:"Structural Dilemma — Decentralization",q:"A barangay can respond to community needs faster because local leaders make decisions. However, the national government LOSES SOME CONTROL. This illustrates ___.",
   c:["A. Gap vs. Overlap","B. Flexibility vs. Strict Adherence","C. Lack of Clarity vs. Creativity","D. Centralized vs. Decentralized Decision Making"],a:"D",
   e:"CENTRALIZED vs. DECENTRALIZED: In DECENTRALIZATION, organizations respond rapidly because decision-makers are closest to the situation — but TOP MANAGERS MAY LOSE SOME CONTROL."},
  {id:184,d:"difficult",t:"Moral Dilemma — Deadlock",q:"A hospital has two patients dying who both need the same organ. The doctor can only save one. The doctor is in ___.",
   c:["A. A False Dilemma — one option is clearly better","B. An Organizational Dilemma","C. A True Moral Dilemma — condemned to moral failure no matter what","D. An Applied Ethics issue with a clear answer"],a:"C",
   e:"TRUE MORAL DILEMMA: agent is required to do each of two morally unacceptable acts, can do each separately, but CANNOT DO BOTH. The doctor is condemned to moral failure — 'damn-if-you-do and damn-if-you-don't.'"},
  {id:185,d:"difficult",t:"Five Frameworks Integrated",q:"A nurse must decide whether to tell the truth to a dying patient. Which moral framework would say 'Truth-telling is a universal duty regardless of consequences'?",
   c:["A. Utilitarianism","B. Aristotle's Virtue Ethics","C. Natural Law Theory","D. Kant's Deontological Ethics"],a:"D",
   e:"KANT'S DEONTOLOGICAL ETHICS (The Duty Framework): Categorical Imperatives are commands you must follow REGARDLESS OF YOUR DESIRES. Truth-telling is a universal moral duty derived from pure reason — consequences are irrelevant."},
  {id:186,d:"difficult",t:"Five Frameworks Integrated",q:"The same nurse from above thinks: 'If I tell the truth, the patient may lose hope and die faster. If I soften the news, the patient stays positive longer.' A ___ would focus on which action PRODUCES THE BEST OUTCOME.",
   c:["A. Kantian","B. Utilitarian","C. Virtue Ethicist","D. Natural Law theorist"],a:"B",
   e:"UTILITARIANISM focuses on RESULTS OR CONSEQUENCES — which action produces the greatest happiness or least suffering. A utilitarian would evaluate both options based on outcomes, treating intentions as irrelevant."},
  {id:187,d:"difficult",t:"Invincible Ignorance vs. Vincible",q:"A new teacher uses an outdated grading rubric because no one informed her of the updated one. A veteran teacher uses the old rubric despite knowing an update exists but never reading it. Regarding moral accountability ___.",
   c:["A. Both are equally accountable","B. The new teacher has less/no accountability (Invincible Ignorance); the veteran bears more (Vincible Ignorance)","C. Both are not accountable because they both didn't know","D. The veteran has less accountability because she is experienced"],a:"B",
   e:"NEW TEACHER = INVINCIBLE IGNORANCE (impossible to know) → removes moral responsibility. VETERAN TEACHER = VINCIBLE IGNORANCE (ought to have known, chose not to) → does NOT free from responsibility."},
  {id:188,d:"difficult",t:"Determinants Comprehensive",q:"A barangay captain uses personal funds to build a court (Object = good), but secretly chooses a location benefiting his own property (End = personal gain = evil), while the community benefits (Circumstances appear good). The act is ___.",
   c:["A. Good because two of three determinants are good","B. Neutral because community benefits balance personal gain","C. Evil — an evil End corrupts the entire act regardless of the good Object and Circumstances","D. Acceptable under the Principle of Double Effect"],a:"C",
   e:"'A THING TO BE GOOD MUST WHOLLY SO — NOT VITIATED BY ANY DEFECT.' An EVIL END (personal gain) CORRUPTS the entire act. Both Object and Circumstances must ALSO be good — failing any one determinant makes the act morally evil."},
  {id:189,d:"difficult",t:"Love & Justice Application",q:"A social worker gives food to all families equally regardless of need. Under DISTRIBUTIVE JUSTICE, this approach is ___.",
   c:["A. Perfectly just — equality is the standard","B. Problematic — distributive justice distributes based on merits and best interests, not flat equality","C. A perfect example of Agape love","D. The application of Utilitarianism's Principle of Utility"],a:"B",
   e:"DISTRIBUTIVE JUSTICE is not about equal shares — it distributes based on THE MERITS OF INDIVIDUALS and THE BEST INTERESTS OF SOCIETY. Flat equality ignores differential need and merit."},
  {id:190,d:"difficult",t:"Formula of Humanity Application",q:"An employer uses workers purely for profit, providing minimal wages and no support, treating them as production units. Kant would say this employer ___.",
   c:["A. Is acting correctly if it produces the most utility","B. Is violating the Formula of Humanity — treating workers as mere means, not as ends-in-themselves","C. Is following Natural Law","D. Is acting in accordance with ACT Utilitarianism"],a:"B",
   e:"Kant's FORMULA OF HUMANITY: 'Treat humanity... always as an END, and NEVER AS A MERE MEANS.' Workers have inherent dignity as rational, autonomous beings — using them purely as profit instruments violates this."},
  {id:191,d:"difficult",t:"Buddhist Ethics Application",q:"A teacher speaks respectfully to all students, earns honest income, and takes deliberate, ethically guided actions. From a Buddhist perspective, this teacher embodies ___.",
   c:["A. The Golden Mean of Courage","B. Cardinal Moral Virtues of Prudence and Justice","C. JEN and LI from Confucian ethics","D. Right Speech, Right Livelihood, and Right Action — Buddhist Moral Virtues"],a:"D",
   e:"Buddhism's MORAL VIRTUES: RIGHT SPEECH, RIGHT ACTION, and RIGHT LIVELIHOOD. The teacher speaks respectfully (right speech), earns honest income (right livelihood), and acts with ethical deliberation (right action)."},
  {id:192,d:"difficult",t:"Cooperation Principles Deep",q:"An accountant is forced by a supervisor to sign falsified financial documents under threat of termination. She signs but reports the matter to authorities. Her act of signing is BEST described as ___.",
   c:["A. Formal Cooperation — she willingly participated","B. A False Dilemma — she had an obvious right choice","C. Material Cooperation — she didn't intend the evil but tolerated it to avoid greater harm, AND mitigated it by reporting","D. Affected Ignorance"],a:"C",
   e:"MATERIAL COOPERATION: does NOT intend the evil but PERMITS or TOLERATES it for the sake of AVOIDING EVEN MORE SERIOUS EVILS (job loss under threat). Her reporting shows she does not intend the evil — she works to mitigate it."},
  {id:193,d:"difficult",t:"Moral Dilemma Levels Identification",q:"A teacher union advocates for better pay. The school administration wants to control costs. Individual teachers feel caught between loyalty to the union and loyalty to their school. This is BEST classified as ___.",
   c:["A. Individual Dilemma","B. Organizational Dilemma — exists between personal interest and organizational welfare, and between groups' interests within the organization","C. Structural Dilemma","D. False Dilemma"],a:"B",
   e:"ORGANIZATIONAL DILEMMA: exists between PERSONAL INTEREST and ORGANIZATIONAL WELFARE, OR between INDIVIDUAL GROUPS' INTERESTS and ORGANIZATIONAL WELL-BEING. Teachers torn between union loyalty and school loyalty is a classic organizational dilemma."},
  {id:194,d:"difficult",t:"Personhood Gradient Theory",q:"A premature infant has limited cognitive abilities and self-awareness. Under the GRADIENT THEORY of personhood, this infant ___.",
   c:["A. Is not a person because it lacks full cognitive ability","B. Has personhood in degrees — less of it currently, but personhood can grow","C. Is only a person under the Genetic criterion","D. Is fully a person because of human DNA alone"],a:"B",
   e:"GRADIENT THEORY: personhood comes in DEGREES — you can have MORE OR LESS of it. The premature infant has personhood in degrees — it is not all-or-nothing."},
  {id:195,d:"difficult",t:"Integrated Framework Comparison",q:"Which statement CORRECTLY compares Kant's ethics and Utilitarianism?",
   c:["A. Both judge actions solely by their consequences","B. Kant focuses on duty and universal maxims; Utilitarianism focuses on results and consequences, treating intentions as irrelevant","C. Both require consideration of intentions and outcomes","D. Utilitarianism uses the Categorical Imperative; Kant uses the Principle of Utility"],a:"B",
   e:"KANT = DUTY FRAMEWORK — actions judged by adherence to universal maxims derived from reason; intentions and duty matter. UTILITARIANISM = CONSEQUENTIALIST — actions judged solely by results/consequences; intentions are IRRELEVANT."},
  {id:196,d:"difficult",t:"Vincible Ignorance + Accountability",q:"A driver runs a red light claiming they 'didn't notice' it despite it being clearly visible. This BEST represents ___.",
   c:["A. Invincible Ignorance — they truly didn't know","B. Supine/Gross Ignorance — scarcely any effort was made to be aware","C. Affected Ignorance — they deliberately avoided knowing","D. Antecedent Passion — they were emotionally distracted"],a:"B",
   e:"SUPINE/GROSS/CRASS IGNORANCE = when SCARCELY ANY EFFORT HAS BEEN MADE to remove it. The traffic light was clearly visible — minimal effort to observe it was not made. This is different from deliberately ignoring it (Affected)."},
  {id:197,d:"difficult",t:"Natural Law Deep Application",q:"A person reasons: 'My life is valuable → Your life is like mine → Your life is valuable → I shouldn't kill you → Do not kill is a Natural Law.' This reasoning process illustrates ___.",
   c:["A. The Universalizability Principle","B. How instinct shows basic goods and REASON derives natural law from them","C. Consequentialist ethics applying outcomes to derive moral rules","D. Moral Subjectivism deriving rules from personal attitudes"],a:"B",
   e:"The reviewer explicitly uses this reasoning chain: 'Our instinct shows us the basic goods and REASON ALLOWS US TO DERIVE THE NATURAL LAW FROM THEM.' My life valuable → Your life like mine → Do not kill = Natural Law."},
  {id:198,d:"difficult",t:"False Dilemma Deep",q:"An accountant discovers his firm is committing fraud. He can report it (risk his job) or stay silent (protect his career but enable fraud). He thinks this is a moral dilemma, but this is BEST classified as a ___.",
   c:["A. True Moral Dilemma — both choices are morally obligatory","B. Structural Dilemma about organizational conflict","C. False Dilemma — one option is a clear moral duty (report) while the other is temptation (self-interest)","D. Organizational Dilemma"],a:"C",
   e:"FALSE DILEMMA: the decision-maker has a MORAL DUTY to do one thing (report fraud) but is TEMPTED OR UNDER PRESSURE to do something else (self-interest). It is a choice between RIGHT and WRONG — not two morally equivalent obligations."},
  {id:199,d:"difficult",t:"All Frameworks — Supreme Integration",q:"A doctor must decide whether to reveal a terminal diagnosis to a patient. Applying ALL FIVE MORAL FRAMEWORKS: Virtue Ethics (courage/compassion), Natural Law (do good/avoid evil), Kant (universal duty of truth), Utilitarianism (best outcomes), Love & Justice (what is loving and just) — which conclusion do MOST frameworks support?",
   c:["A. Always hide the diagnosis to protect feelings","B. Tell the truth with compassion — supported by virtue (courage/honesty), Kant (truth as universal duty), natural law (respect dignity), Love & Justice (loving truth)","C. Maximize happiness regardless of truth","D. Follow cultural norms about death disclosure"],a:"B",
   e:"Most frameworks converge: VIRTUE (courage + compassion in honest disclosure), KANT (truth-telling as categorical duty), NATURAL LAW (respect for human dignity), LOVE & JUSTICE (loving truth-telling). Only pure Act Utilitarianism might differ. The convergence strongly supports compassionate truth-telling."},
  {id:200,d:"difficult",t:"Ultimate Integration",q:"Which SINGLE statement BEST captures the core common thread across ALL FIVE Moral Frameworks in the reviewer?",
   c:["A. Follow the law and cultural norms in all situations","B. The greatest good for the greatest number is the ultimate standard","C. Duty, character, consequences, love, and justice all aim — from different angles — at human flourishing and doing what is genuinely good","D. Only reason can determine what is truly moral"],a:"C",
   e:"The five frameworks (Virtue/character, Natural Law/do good, Kant/duty, Utilitarianism/consequences, Love & Justice) approach from different angles but all aim at HUMAN FLOURISHING and DOING WHAT IS GENUINELY GOOD. They differ in method, not in their fundamental moral concern for human goodness."},

// Shuffle utility
];
const ETHICS_100 = [

  // ═══════════════════════════ EASY (30) ═══════════════════════════
  { id:1, d:"easy", t:"Ethics Basics",
    q:"The word 'Ethics' is derived from which Greek word?",
    c:["A. Logos","B. Ethos","C. Pathos","D. Nomos"], a:"B",
    e:"Ethics comes from the Greek word 'ethos' meaning 'customs' or 'moral.' Its Latin equivalent is 'mores.'" },
  { id:2, d:"easy", t:"Ethics Basics",
    q:"Ethics is the study of the morality of human acts and moral agents, what makes an act obligatory, and what makes a person ___.",
    c:["A. Intelligent","B. Accountable","C. Powerful","D. Successful"], a:"B",
    e:"Ethics studies morality of human acts and moral agents, what makes an act obligatory, and what makes a person ACCOUNTABLE." },
  { id:3, d:"easy", t:"Act of Man vs Human Act",
    q:"Human Acts are those which a man is a master of because he has the power of doing or not doing as he ___.",
    c:["A. Is commanded","B. Is trained","C. Pleases","D. Is expected"], a:"C",
    e:"Human Acts are those over which a person has willful control — done as he PLEASES, meaning with deliberate freedom." },
  { id:4, d:"easy", t:"Act of Man vs Human Act",
    q:"Which of the following is an example of a Human Act?",
    c:["A. Blinking","B. Breathing","C. Observing a prescribed diet","D. Perspiring"], a:"C",
    e:"Observing a prescribed diet is deliberately chosen — it requires will and awareness. The others are Acts of Man happening without conscious control." },
  { id:5, d:"easy", t:"Act of Man vs Human Act",
    q:"Acts of Man are actions that happen WITHOUT the awareness of the mind or the control of the ___.",
    c:["A. Heart","B. Will","C. Conscience","D. Reason"], a:"B",
    e:"Acts of Man occur without control of the WILL — they are automatic bodily actions like breathing, blinking, or perspiring." },
  { id:6, d:"easy", t:"Act of Man vs Human Act",
    q:"Which of the following is an example of an Act of Man?",
    c:["A. Tutoring slow learners","B. Preparing for the board exam","C. Dilation of the pupils of the eyes","D. Observing a prescribed diet"], a:"C",
    e:"Dilation of pupils is automatic — it happens without the control of the will. The others require deliberate choice." },
  { id:7, d:"easy", t:"Branches of Ethics",
    q:"How many branches of Ethics are there according to the reviewer?",
    c:["A. 2","B. 3","C. 4","D. 5"], a:"B",
    e:"There are 3 Branches of Ethics: (1) Metaethics, (2) Normative Ethics, and (3) Applied Ethics." },
  { id:8, d:"easy", t:"Branches of Ethics",
    q:"Which branch of ethics is also called Prescriptive Ethics?",
    c:["A. Applied Ethics","B. Metaethics","C. Normative Ethics","D. Descriptive Ethics"], a:"C",
    e:"Normative Ethics is known as PRESCRIPTIVE ETHICS — it deals with norms and how one SHOULD act, prescribing the rightness or wrongness of actions." },
  { id:9, d:"easy", t:"Branches of Ethics",
    q:"Applied Ethics attempts to apply ethical principles to ___.",
    c:["A. Abstract philosophical questions","B. Real-life moral issues","C. Historical events","D. Scientific experiments"], a:"B",
    e:"Applied Ethics attempts to APPLY ethical principles and moral theories to REAL-LIFE MORAL ISSUES such as euthanasia, child labor, and abortion." },
  { id:10, d:"easy", t:"Moral Realism",
    q:"Moral Realism is the belief that there are moral facts in the same way that there are ___.",
    c:["A. Cultural norms","B. Personal preferences","C. Scientific facts","D. Legal standards"], a:"C",
    e:"Moral Realism holds that MORAL FACTS exist just like SCIENTIFIC FACTS — any moral proposition can be TRUE or FALSE." },
  { id:11, d:"easy", t:"Moral Standards",
    q:"Moral Standards are norms, prescriptions, or rules used in determining what ought to be done or what is right or wrong action. Non-compliance causes ___.",
    c:["A. Embarrassment","B. Shame","C. Sense of Guilt","D. Pride"], a:"C",
    e:"Non-compliance with Moral Standards causes a SENSE OF GUILT — unlike non-moral standards whose non-compliance causes shame or embarrassment." },
  { id:12, d:"easy", t:"Moral Standards",
    q:"Which of the following is an example of a Moral Standard?",
    c:["A. No talking while your mouth is full","B. Do not kill","C. Wear black for mourning","D. Males should propose marriage"], a:"B",
    e:"'Do not kill' is a Moral Standard — a norm about right or wrong action. The others are Non-Moral Standards (Folkways)." },
  { id:13, d:"easy", t:"Non-Moral Standards",
    q:"In Sociology, non-moral standards or rules are called ___.",
    c:["A. Taboos","B. Norms","C. Folkways","D. Mores"], a:"C",
    e:"In Sociology, non-moral standards are called FOLKWAYS — guides of action unrelated to moral considerations, expected by society's social rules and etiquette." },
  { id:14, d:"easy", t:"Moral Agent",
    q:"The word 'Moral' comes from the Latin 'MORES' which refers to society's patterns, standards, and rules of ___.",
    c:["A. Thinking","B. Doing","C. Believing","D. Speaking"], a:"B",
    e:"'Moral' comes from Latin 'MORES' referring to society's PATTERNS, STANDARDS, and RULES OF DOING." },
  { id:15, d:"easy", t:"Moral Agent",
    q:"The word 'Agent' comes from the Latin word ___.",
    c:["A. MORES","B. ETHOS","C. AGERE","D. LOGOS"], a:"C",
    e:"'Agent' comes from the Latin 'AGERE' meaning 'to do act.' A moral agent is one who performs acts according to moral standards." },
  { id:16, d:"easy", t:"Moral Agent",
    q:"A Moral Agent is also known as the ___.",
    c:["A. Moral Judge","B. Moral Actor","C. Moral Arbiter","D. Moral Observer"], a:"B",
    e:"A Moral Agent is the MORAL ACTOR — one who acts morally. Only a moral agent is capable of human acts." },
  { id:17, d:"easy", t:"Bases of Moral Accountability",
    q:"Which of the following is NOT one of the three Bases of Moral Accountability?",
    c:["A. Knowledge","B. Freedom","C. Voluntariness","D. Intelligence"], a:"D",
    e:"The three Bases of Moral Accountability are KNOWLEDGE, FREEDOM, and VOLUNTARINESS. Intelligence is not listed as a separate base." },
  { id:18, d:"easy", t:"Modifiers of Human Acts",
    q:"How many Modifiers of Human Acts are there?",
    c:["A. 2","B. 3","C. 4","D. 5"], a:"C",
    e:"There are 4 Modifiers of Human Acts: (A) Ignorance, (B) Passion, (C) Fear, and (D) Violence." },
  { id:19, d:"easy", t:"Modifiers of Human Acts",
    q:"Ignorance as a modifier of human acts means ___.",
    c:["A. Lack of freedom","B. Absence of knowledge","C. Presence of fear","D. Use of force"], a:"B",
    e:"IGNORANCE means the ABSENCE OF KNOWLEDGE. It affects the voluntariness involved in an act." },
  { id:20, d:"easy", t:"Determinants of Morality",
    q:"How many Determinants of Morality are there?",
    c:["A. 2","B. 3","C. 4","D. 5"], a:"B",
    e:"There are THREE Determinants of Morality: (1) Object of the Act, (2) the End or Purpose, and (3) Its Circumstances." },
  { id:21, d:"easy", t:"Determinants of Morality",
    q:"The Object of the Act as a determinant of morality refers to ___.",
    c:["A. The intention of the actor","B. The time and place of the act","C. The act itself","D. The consequences of the act"], a:"C",
    e:"The Object of the Act is the ACT ITSELF — for example: praying, honoring one's parents, going to Mass, telling the truth." },
  { id:22, d:"easy", t:"Virtue Ethics",
    q:"For Aristotle, the ethical person is virtuous — one who has developed ___.",
    c:["A. Strong intellect","B. Good character or virtues","C. Great wealth","D. High social status"], a:"B",
    e:"For Aristotle, the ethical person is virtuous — one who has developed GOOD CHARACTER or has DEVELOPED VIRTUES." },
  { id:23, d:"easy", t:"Virtue Ethics",
    q:"Moral Exemplars are people who ___.",
    c:["A. Follow the law strictly","B. Already possess virtues","C. Study ethics professionally","D. Teach moral philosophy"], a:"B",
    e:"Moral Exemplars are PEOPLE WHO ALREADY POSSESS VIRTUES — they are role models of virtuous living." },
  { id:24, d:"easy", t:"Virtue Ethics",
    q:"What does EUDAIMONIA mean?",
    c:["A. Following duty","B. A life well lived / human flourishing","C. The greatest good for all","D. Divine law"], a:"B",
    e:"EUDAIMONIA means 'a life well lived' or HUMAN FLOURISHING — it comes from striving and achieving difficult things." },
  { id:25, d:"easy", t:"Cardinal Moral Virtues",
    q:"Prudence is the virtue of ___.",
    c:["A. Courage and strength","B. Self-control and moderation","C. Fairness and giving each person their due","D. Practical wisdom and sound judgment"], a:"D",
    e:"PRUDENCE is the virtue of PRACTICAL WISDOM and SOUND JUDGMENT — one of the four Cardinal Moral Virtues." },
  { id:26, d:"easy", t:"Cardinal Moral Virtues",
    q:"Fortitude is the virtue of ___.",
    c:["A. Practical wisdom","B. Self-control","C. Courage and strength in the face of adversity","D. Fairness and equality"], a:"C",
    e:"FORTITUDE is the virtue of COURAGE AND STRENGTH IN THE FACE OF ADVERSITY — the fourth Cardinal Moral Virtue." },
  { id:27, d:"easy", t:"Natural Law",
    q:"Thomas Aquinas was a philosopher of which century?",
    c:["A. 11th","B. 12th","C. 13th","D. 14th"], a:"C",
    e:"Thomas Aquinas was an Italian Philosopher and Christian Monk of the 13TH CENTURY who developed Natural Law Ethics." },
  { id:28, d:"easy", t:"Utilitarianism",
    q:"Utilitarianism treats intentions as ___.",
    c:["A. The most important factor","B. Irrelevant","C. The only factor","D. Secondary to rules"], a:"B",
    e:"Utilitarianism is a moral theory that focuses on the RESULTS or CONSEQUENCES of actions and treats INTENTIONS AS IRRELEVANT." },
  { id:29, d:"easy", t:"Moral Dilemma",
    q:"A Moral Dilemma is also referred to as ___.",
    c:["A. False Dilemma","B. Ethical Paradox","C. Ethical Dilemma","D. Moral Conflict"], a:"C",
    e:"A Moral Dilemma is also referred to as an ETHICAL DILEMMA — a situation requiring a choice between two morally obligatory options where choosing one violates the other." },
  { id:30, d:"easy", t:"Moral Dilemma",
    q:"In a Moral Dilemma, the persons involved are in a ___.",
    c:["A. Compromise","B. Deadlock","C. Resolution","D. Victory"], a:"B",
    e:"The persons in a moral dilemma are in a DEADLOCK — 'Damn-if-you-do and Damn-if-you-don't.' The agent is condemned to moral failure no matter what." },

  // ═══════════════════════════ MODERATE (50) ═══════════════════════════
  { id:31, d:"moderate", t:"Metaethics",
    q:"Metaethics studies the very foundation of morality itself. Its key question is ___.",
    c:["A. How should we act?","B. What is Morality and what is its nature?","C. What real-life issues need ethical solutions?","D. Who should make moral decisions?"], a:"B",
    e:"Metaethics answers 'WHAT is Morality?' and 'What is its NATURE?' — it studies the foundation of morality itself, not how to act." },
  { id:32, d:"moderate", t:"Moral Realism",
    q:"Which of the following BEST illustrates Moral Realism?",
    c:["A. Stealing is wrong in some cultures but right in others","B. Whether stealing is wrong depends on your feelings","C. Gratuitous violence is always wrong, regardless of opinion","D. Morality cannot be proven scientifically"], a:"C",
    e:"Moral Realism holds that there are OBJECTIVE MORAL FACTS — 'Gratuitous violence is always wrong' is a moral fact that is TRUE regardless of anyone's opinion." },
  { id:33, d:"moderate", t:"Moral Absolutism",
    q:"Moral Absolutism states that there are ___ against which moral questions can be judged.",
    c:["A. Cultural standards","B. Absolute standards","C. Personal preferences","D. Legal codes"], a:"B",
    e:"Moral Absolutism holds that there are ABSOLUTE STANDARDS against which moral questions can be judged — one basic moral fact that is universal." },
  { id:34, d:"moderate", t:"Moral Relativism",
    q:"Moral Relativism holds that more than one moral position on a given topic can be ___.",
    c:["A. Scientific","B. Incorrect","C. Correct","D. Universal"], a:"C",
    e:"Moral Relativism holds that MORE THAN ONE MORAL POSITION on a given topic can be CORRECT. Its basis is: more than one position." },
  { id:35, d:"moderate", t:"Cultural Relativism",
    q:"Descriptive Cultural Relativism (DCR) states that people's ___ differ from culture to culture.",
    c:["A. Moral facts","B. Moral beliefs","C. Moral laws","D. Moral duties"], a:"B",
    e:"DCR states that people's MORAL BELIEFS differ from culture to culture — it is a descriptive observation about what different cultures actually believe." },
  { id:36, d:"moderate", t:"Cultural Relativism",
    q:"Normative Cultural Relativism (NCR) states that it is not your beliefs but ___ that differ from culture to culture.",
    c:["A. Moral perceptions","B. Moral preferences","C. Moral facts themselves","D. Moral traditions"], a:"C",
    e:"NCR goes further than DCR — it says the MORAL FACTS THEMSELVES differ from culture to culture, not just people's beliefs about them." },
  { id:37, d:"moderate", t:"Moral Antirealism",
    q:"Moral Antirealism is the belief that moral propositions don't refer to objective features of the world. Therefore there are ___.",
    c:["A. Absolute moral truths","B. No moral facts","C. Cultural moral facts","D. Scientific moral facts"], a:"B",
    e:"Moral Antirealism holds there are NO MORAL FACTS — moral propositions don't refer to objective features of the world at all." },
  { id:38, d:"moderate", t:"Moral Subjectivism",
    q:"Moral Subjectivism holds that moral statements refer only to ___.",
    c:["A. Universal moral laws","B. Divine commandments","C. People's attitudes rather than their actions","D. Objective features of the world"], a:"C",
    e:"Moral Subjectivism holds that moral statements refer only to PEOPLE'S ATTITUDES rather than their actions. They key into personal attitudes, not objective moral facts." },
  { id:39, d:"moderate", t:"Types of Standards",
    q:"Consequence Standards are also called ___.",
    c:["A. Normative Standards","B. Teleological/Consequentialist Standards","C. Deontological Standards","D. Moral Standards"], a:"B",
    e:"Consequence Standards are also called TELEOLOGICAL or CONSEQUENTIALIST standards — from 'TELE' meaning END, RESULT, or CONSEQUENCE. The end justifies the means." },
  { id:40, d:"moderate", t:"Types of Standards",
    q:"Non-Consequence Standards are also called ___.",
    c:["A. Utilitarianism","B. Consequentialist","C. Deontological","D. Teleological"], a:"C",
    e:"Non-Consequence Standards are DEONTOLOGICAL — they hold that rightness depends on DUTY, NATURAL LAW, VIRTUE, and the DEMAND OF THE SITUATION, not consequences." },
  { id:41, d:"moderate", t:"Types of Standards",
    q:"Deontological Standards hold that 'The end does NOT justify the ___.'",
    c:["A. Act","B. Means","C. Person","D. Law"], a:"B",
    e:"Deontological ethics holds: 'The end does NOT justify the MEANS.' This contrasts with Teleological ethics where 'the end justifies the means.'" },
  { id:42, d:"moderate", t:"Deontological Standards",
    q:"Which of the following is a Deontological Moral Standard?",
    c:["A. Utilitarianism","B. Virtue Ethics","C. Cultural Relativism","D. Moral Subjectivism"], a:"B",
    e:"The four Deontological Moral Standards are: Natural Law, Virtue Ethics, Situation Ethics, and Sense of Duty. Virtue Ethics is deontological." },
  { id:43, d:"moderate", t:"Applied Ethics",
    q:"Which of the following is a Domain of Applied Ethics?",
    c:["A. Metaethics","B. Business Ethics","C. Cultural Relativism","D. Normative Ethics"], a:"B",
    e:"The Domains of Applied Ethics include: Business Ethics, Clinical Ethics, Organizational Ethics, and Social Ethics." },
  { id:44, d:"moderate", t:"False Dilemma",
    q:"A False Dilemma is a situation where the decision-maker has a moral duty to do one thing but is tempted or under pressure to do something else. It involves a choice between ___.",
    c:["A. Wrong and wrong","B. Right and right","C. Right and wrong","D. Two impossible options"], a:"C",
    e:"A False Dilemma involves a choice between a RIGHT and a WRONG — not between two morally equal options. Example: a lawyer tempted to prioritize self-interest over a client's." },
  { id:45, d:"moderate", t:"Moral Foundation",
    q:"The Principle of Double Effect states that relieving a terminally ill patient's pain may also cause an effect one would normally be obliged to avoid. This means good actions may have ___.",
    c:["A. Only good effects","B. Both good and bad effects","C. Only bad effects","D. No moral significance"], a:"B",
    e:"The Principle of Double Effect recognizes that some actions may have BOTH GOOD AND BAD EFFECTS — e.g., pain relief that may also slightly shorten life (sedation)." },
  { id:46, d:"moderate", t:"Moral Foundation",
    q:"The Choice of Lesser Evil states that when facing two unpleasant situations, one should choose ___.",
    c:["A. The most popular option","B. The most legal option","C. The least harmful option","D. The most socially acceptable option"], a:"C",
    e:"The Choice of Lesser Evil: when facing two unpleasant situations, choose THE LEAST HARMFUL one — choose the lesser of two evils." },
  { id:47, d:"moderate", t:"Principles of Cooperation",
    q:"The Principle of Formal Cooperation involves a WILLING participation on the part of the cooperative agent in the sinful act of the principal agent. This means the cooperating person ___.",
    c:["A. Acts without knowing the evil","B. Intends the evil done and participates in it","C. Tolerates evil to prevent greater harm","D. Is forced to cooperate against their will"], a:"B",
    e:"In Formal Cooperation, the person INTENDS the evil that is done and participates in the evil-doing by advising, counseling, promoting, or condoning it." },
  { id:48, d:"moderate", t:"Principles of Cooperation",
    q:"The Principle of Material Cooperation involves cooperation where one does NOT intend the evil but only permits or tolerates it for the sake of ___.",
    c:["A. Personal gain","B. Avoiding even more serious evils","C. Following orders","D. Gaining social approval"], a:"B",
    e:"Material Cooperation: one does not intend the evil but only permits or tolerates it FOR THE SAKE OF AVOIDING EVEN MORE SERIOUS EVILS." },
  { id:49, d:"moderate", t:"Good Moral Character",
    q:"Being a 'Morally Mature Person' means you have reached a level of maturity in the ___.",
    c:["A. Physical and cognitive levels only","B. Spiritual, emotional, intellectual, and social levels","C. Legal and professional levels","D. Academic and career levels"], a:"B",
    e:"Being a Morally Mature Person means reaching a level of maturity in the SPIRITUAL, EMOTIONAL, INTELLECTUAL, and SOCIAL levels." },
  { id:50, d:"moderate", t:"Good Moral Character",
    q:"Being a 'Virtuous Person' in the context of good moral character means ___.",
    c:["A. Having good intentions only","B. Following rules strictly","C. Having acquired good habits and attitudes practiced consistently in daily life","D. Being recognized by society as morally superior"], a:"C",
    e:"Being a Virtuous Person means having ACQUIRED GOOD HABITS AND ATTITUDES and practicing them CONSISTENTLY in your daily life." },
  { id:51, d:"moderate", t:"Conscience Types",
    q:"Right Conscience judges what is really good as ___ and what is really evil as ___.",
    c:["A. Bad / Good","B. Good / Evil","C. Uncertain / Certain","D. Relative / Absolute"], a:"B",
    e:"Right Conscience judges what is really GOOD as GOOD and what is really EVIL as EVIL — it makes correct moral judgments." },
  { id:52, d:"moderate", t:"Conscience Types",
    q:"Scrupulous Conscience means ___.",
    c:["A. Always finding excuses for mistakes","B. Being uncertain about moral decisions","C. Constantly being afraid of committing evil, resulting from stubborn character","D. Judging bad as good and vice versa"], a:"C",
    e:"Scrupulous Conscience means being CONSTANTLY AFRAID OF COMMITTING EVIL — it is a result of a stubborn character." },
  { id:53, d:"moderate", t:"Conscience Types",
    q:"Lax Conscience tends to ___.",
    c:["A. Suspend judgment on moral decisions","B. Follow the easy way and find excuses for mistakes","C. Restore good relations with God through repentance","D. Judge good as bad and vice versa"], a:"B",
    e:"Lax Conscience FOLLOWS THE EASY WAY and tends to FIND EXCUSES FOR MISTAKES — it avoids moral responsibility." },
  { id:54, d:"moderate", t:"Conscience Types",
    q:"Guilty Conscience is a disturbed conscience that tries to restore good relations with God by means of ___.",
    c:["A. Prayer and fasting","B. Good deeds only","C. Sorrow and repentance","D. Following the law strictly"], a:"C",
    e:"Guilty Conscience is a DISTURBED CONSCIENCE trying to restore good relations with God by means of SORROW AND REPENTANCE." },
  { id:55, d:"moderate", t:"Ignorance",
    q:"Invincible Ignorance removes moral responsibility because ___.",
    c:["A. The person chose not to know","B. The knowledge was impossible for the person to obtain","C. The person was afraid to find out","D. The person deliberately avoided the truth"], a:"B",
    e:"Invincible Ignorance removes moral responsibility because the knowledge was IMPOSSIBLE FOR THE PERSON TO OBTAIN — it is entirely involuntary." },
  { id:56, d:"moderate", t:"Ignorance",
    q:"SUPINE/GROSS/CRASS Ignorance is when ___.",
    c:["A. A person deliberately avoids enlightenment to sin freely","B. Scarcely any effort has been made to remove the ignorance","C. A person knows something but pretends not to","D. The ignorance is completely impossible to overcome"], a:"B",
    e:"Supine/Gross/Crass Ignorance is when SCARCELY ANY EFFORT HAS BEEN MADE to remove it — the minimum possible effort was exerted." },
  { id:57, d:"moderate", t:"Passion",
    q:"Passion refers to positive emotions such as love, desire, and bravery, AND negative emotions such as ___.",
    c:["A. Joy, excitement, and hope","B. Sadness, despair, hatred, and anger","C. Contentment and serenity","D. Enthusiasm and motivation"], a:"B",
    e:"Passion refers to both POSITIVE EMOTIONS (love, desire, delight, hope, bravery) and NEGATIVE EMOTIONS (hatred, horror, sadness, despair, fear, anger)." },
  { id:58, d:"moderate", t:"Passion",
    q:"Antecedent Passion refers to emotions that precede the act. Its effect on accountability is ___.",
    c:["A. It increases accountability","B. It eliminates voluntariness completely","C. It diminishes accountability for the resultant act","D. It has no effect on accountability"], a:"C",
    e:"Antecedent Passion (first emotion) precedes the act. It does not always destroy voluntariness but DIMINISHES ACCOUNTABILITY for the resultant act." },
  { id:59, d:"moderate", t:"Fear and Violence",
    q:"Acts done with INTENSE or UNCONTROLLABLE FEAR or PANIC are ___.",
    c:["A. Fully voluntary and accountable","B. Involuntary","C. Morally good","D. Acts of Man"], a:"B",
    e:"Acts done with fear are generally voluntary, but acts done with INTENSE or UNCONTROLLABLE FEAR or PANIC are INVOLUNTARY." },
  { id:60, d:"moderate", t:"Fear and Violence",
    q:"VIOLENCE as a modifier of human acts refers to physical force exerted to compel a person to act against their WILL. Actions performed under irresistible force are ___.",
    c:["A. Voluntary and accountable","B. Human Acts","C. Involuntary and NOT accountable","D. Acts of passion"], a:"C",
    e:"Actions performed by a person subjected to violence or irresistible force are INVOLUNTARY and NOT ACCOUNTABLE." },
  { id:61, d:"moderate", t:"Determinants of Morality",
    q:"For an act to be morally good, ALL THREE determinants must be without flaw. This is based on the axiom: ___.",
    c:["A. The end justifies the means","B. A thing to be good must wholly so; it is not vitiated by any defect","C. Do good and avoid evil","D. Act only according to universal law"], a:"B",
    e:"The axiom states: 'A THING TO BE GOOD MUST WHOLLY SO; IT IS NOT VITIATED BY ANY DEFECT' — all three determinants (Object, End, Circumstances) must be good." },
  { id:62, d:"moderate", t:"Determinants of Morality",
    q:"Circumstances as a determinant of morality refer to the TIME, PLACE, PERSON, and ___ surrounding the moral act.",
    c:["A. Laws","B. Conditions","C. Consequences","D. Intentions"], a:"B",
    e:"Circumstances refer to the TIME, PLACE, PERSON, and CONDITIONS surrounding the moral act — e.g., giving a drink to the thirsty may be evil if the drink is intoxicating." },
  { id:63, d:"moderate", t:"Virtue Ethics",
    q:"Virtue Theory emphasizes an individual's character rather than following a set of rules. Its core belief is ___.",
    c:["A. The end justifies the means","B. Follow universal laws always","C. If we focus on being good people, the right actions will follow effortlessly","D. Intentions determine morality"], a:"C",
    e:"Virtue Theory holds: 'If we can just focus on BEING GOOD PEOPLE, the RIGHT ACTIONS will FOLLOW, effortlessly.'" },
  { id:64, d:"moderate", t:"Virtue Ethics",
    q:"Having virtue means doing the right thing, at the right time, in the right way, in the right amount, toward the ___.",
    c:["A. Right purpose","B. Right law","C. Right people","D. Right outcome"], a:"C",
    e:"Aristotle's definition of virtue involves doing the right thing at the right time, in the right way, in the right amount, toward the RIGHT PEOPLE." },
  { id:65, d:"moderate", t:"Natural Law",
    q:"According to Aquinas, God made us 'preloaded with tools we need to know what's good.' This means ___.",
    c:["A. We need the Bible to understand morality","B. Church attendance is required for morality","C. We don't need religion or church to understand natural law — human nature and reason are sufficient","D. Only priests can determine what is morally right"], a:"C",
    e:"Aquinas said: 'We don't need the Bible, or religion class, or church in order to understand the natural law.' HUMAN NATURE AND REASON are sufficient." },
  { id:66, d:"moderate", t:"Types of Law",
    q:"Eternal Law is the mind of God which ___.",
    c:["A. Humans can fully know","B. Humans cannot know — it contains laws that govern the universe","C. Is revealed through the Bible","D. Is promulgated by persons"], a:"B",
    e:"Eternal Law is the MIND OF GOD which HUMANS CANNOT KNOW — it contains the laws that govern the universe." },
  { id:67, d:"moderate", t:"Types of Law",
    q:"Divine Law is the Law of God revealed to people through the Bible and ___.",
    c:["A. Natural instinct","B. Human reason","C. The Ten Commandments","D. Cultural traditions"], a:"C",
    e:"Divine Law is the Law of God REVEALED to people through the Bible and DECREED BY GOD IN THE TEN COMMANDMENTS." },
  { id:68, d:"moderate", t:"Types of Law",
    q:"Natural Law directs our conscience and if applied with reason to a situation will lead to ___.",
    c:["A. Cultural relativism","B. The right outcome","C. Personal satisfaction","D. Social approval"], a:"B",
    e:"Natural Law 'Do good and avoid evil' — it directs our conscience and if applied with reason, will lead to THE RIGHT OUTCOME." },
  { id:69, d:"moderate", t:"Kant's Ethics",
    q:"Kant argued that in order to know what is right, you have to use ___.",
    c:["A. Religion","B. Emotions","C. Reason","D. Cultural norms"], a:"C",
    e:"Kant argued that to know what is right, you must use REASON. 'What's RIGHT and WRONG is totally KNOWABLE just by using your INTELLECT.'" },
  { id:70, d:"moderate", t:"Kant's Ethics",
    q:"Categorical Imperatives are commands you must follow regardless of ___.",
    c:["A. Cultural context","B. Your desires","C. The consequences","D. Social norms"], a:"B",
    e:"Categorical Imperatives are COMMANDS you must FOLLOW, REGARDLESS OF YOUR DESIRES. Moral obligations are derived from pure reason." },
  { id:71, d:"moderate", t:"Kant's Ethics",
    q:"A MAXIM in Kant's ethics is ___.",
    c:["A. A universal scientific law","B. A divine commandment","C. A rule or principle of action","D. A cultural norm"], a:"C",
    e:"A MAXIM is just a RULE OR PRINCIPLE OF ACTION. The Universal Law is something that must always be done in similar situations." },
  { id:72, d:"moderate", t:"Love & Justice",
    q:"In the Love & Justice Framework, Justice means giving what is ___ to others, while Love means giving even ___ than what is due.",
    c:["A. Due / Less","B. Due / More","C. Equal / Less","D. Less / More"], a:"B",
    e:"Justice = giving what is DUE to others. Love = giving even MORE THAN what is due to others — Love goes beyond justice." },
  { id:73, d:"moderate", t:"Love & Justice",
    q:"Which Greek concept of love refers to selfless love or charity?",
    c:["A. Erotic","B. Philia","C. Agape","D. Storge"], a:"C",
    e:"AGAPE is selfless love — charity. The three Greek concepts are: (1) Agape (selfless/charity), (2) Erotic (passionate sexual encounter), (3) Philia (affection between friends)." },
  { id:74, d:"moderate", t:"Love & Justice",
    q:"Distributive Justice has to do with the distribution of goods, duties, and privileges based on ___.",
    c:["A. Equal shares for everyone","B. Government policies","C. The merits of individuals and the best interests of society","D. Cultural norms"], a:"C",
    e:"Distributive Justice is about the distribution based on THE MERITS OF INDIVIDUALS and THE BEST INTERESTS OF SOCIETY." },
  { id:75, d:"moderate", t:"Utilitarianism",
    q:"For Utilitarians, actions should be measured in terms of the happiness or pleasure they ___.",
    c:["A. Reflect","B. Intend","C. Produce","D. Follow"], a:"C",
    e:"For Utilitarians, actions should be measured in terms of the HAPPINESS or PLEASURE that they PRODUCE — outcomes are what matter." },
  { id:76, d:"moderate", t:"Utilitarianism",
    q:"Rule Utilitarianism says we ought to live by rules that, in general, lead to the greatest good. It allows us to refrain from acts that maximize utility in the short run in favor of ___.",
    c:["A. Cultural norms","B. Divine law","C. Rules that maximize utility for the majority of the time","D. Individual preferences"], a:"C",
    e:"Rule Utilitarianism (long-term) says follow rules that MAXIMIZE UTILITY FOR THE MAJORITY OF THE TIME, not just immediate short-term utility." },
  { id:77, d:"moderate", t:"Personhood",
    q:"In the context of Moral Agent, 'Person' is a ___ term, while 'Human' is a ___ term.",
    c:["A. Biological / Moral","B. Moral / Biological","C. Legal / Cultural","D. Cultural / Scientific"], a:"B",
    e:"PERSON is a MORAL TERM — being who is part of a moral community. HUMAN is a BIOLOGICAL TERM. Person doesn't equal human." },
  { id:78, d:"moderate", t:"Personhood",
    q:"The COGNITIVE criterion of personhood includes ___.",
    c:["A. Human DNA","B. Being cared about by society","C. Ability to feel pleasure and pain","D. Consciousness, reasoning, self-motivated activity, capacity to communicate, and self-awareness"], a:"D",
    e:"The COGNITIVE criterion includes: Consciousness, REASONING, SELF-MOTIVATED ACTIVITY, CAPACITY TO COMMUNICATE, and SELF-AWARENESS." },
  { id:79, d:"moderate", t:"Personhood",
    q:"The GRADIENT THEORY of personhood states that personhood ___.",
    c:["A. Is only for humans with DNA","B. Requires society's recognition","C. Comes in degrees — you can have more or less of it","D. Depends on consciousness alone"], a:"C",
    e:"Gradient Theory states that PERSONHOOD COMES IN DEGREES — you can have MORE OR LESS of it. It's not binary." },
  { id:80, d:"moderate", t:"Levels of Moral Dilemma",
    q:"Individual Dilemma refers to personal dilemmas — an individual's damn-if-you-do and damn-if-you-don't situation. The classic example is ___.",
    c:["A. The gap vs. overlap structural problem","B. The Case of Heinz — steal the drug or let the wife die","C. Organizational conflict between personal and company interests","D. Decentralization of government services"], a:"B",
    e:"The classic Individual Dilemma is THE CASE OF HEINZ — torn between two obligations: save his wife (steal the drug) or obey the law (and let her die)." },

  // ═══════════════════════════ DIFFICULT (20) ═══════════════════════════
  { id:81, d:"difficult", t:"Metaethics & Moral Realism",
    q:"The Grounding Problem of ethics is the search for a foundation for moral beliefs that is solid, clear, objective, and unmoving. This problem is MOST directly associated with which metaethical view?",
    c:["A. Moral Antirealism","B. Moral Subjectivism","C. Moral Realism","D. Cultural Relativism"], a:"C",
    e:"The Grounding Problem is MOST associated with MORAL REALISM — if moral facts exist like scientific facts, then what is the FOUNDATION that makes them objectively true? This is the central challenge Moral Realism must answer." },
  { id:82, d:"difficult", t:"Cultural Relativism",
    q:"The conclusion 'If every culture is the sole arbiter of what's right for it, that means no culture can be actually wrong' is a critique that makes ___.",
    c:["A. Cultural reform and moral progress conceptually impossible","B. Moral absolutism the only viable option","C. Cultural relativism scientifically proven","D. Ethics irrelevant in multicultural societies"], a:"A",
    e:"NCR's conclusion makes CULTURAL REFORM AND MORAL PROGRESS CONCEPTUALLY IMPOSSIBLE — 'if what everyone is doing now is right relative to their culture, there's never any reason to change anything.'" },
  { id:83, d:"difficult", t:"Modifiers of Human Acts",
    q:"A student knows the exam requires original work but deliberately avoids reading the academic integrity policy 'so they don't feel guilty about copying.' This BEST illustrates ___.",
    c:["A. Invincible Ignorance","B. Supine Ignorance","C. Affected Ignorance","D. Antecedent Passion"], a:"C",
    e:"AFFECTED IGNORANCE occurs when a person DELIBERATELY AVOIDS ENLIGHTENMENT IN ORDER TO SIN MORE FREELY — the student intentionally remained uninformed to avoid feeling guilty." },
  { id:84, d:"difficult", t:"Determinants of Morality",
    q:"A politician prays loudly in public specifically to gain votes. The Object (prayer) is good. But the End (to be seen of men) is evil. Therefore, the act is ___.",
    c:["A. Morally good because prayer is inherently virtuous","B. Morally neutral because the object and end cancel out","C. Morally evil because an evil end corrupts the action","D. Acceptable under the Principle of Double Effect"], a:"C",
    e:"The reviewer states: 'An evil end corrupts the action, EVEN IF THE OBJECT IS GOOD IN ITSELF (such as praying and fasting in order to be seen of men).' All three determinants must be good." },
  { id:85, d:"difficult", t:"Kant vs. Utilitarianism",
    q:"A city official sacrifices a small neighborhood's water supply to benefit 90% of the city's population. A Kantian would object on the grounds that ___.",
    c:["A. The consequences weren't calculated correctly","B. The greatest number was not truly served","C. The neighborhood residents were treated as mere means and not as ends-in-themselves","D. The act lacked sufficient cultural justification"], a:"C",
    e:"Kant's Formula of Humanity: 'Act so that you treat humanity... always as an end, and NEVER AS A MERE MEANS.' Using the neighborhood as a sacrifice violates this — they are not objects to be used for others' benefit." },
  { id:86, d:"difficult", t:"Utilitarianism",
    q:"Under ACT Utilitarianism, harvesting organs from one healthy person to save five dying patients could theoretically be justified. RULE Utilitarianism would reject this because ___.",
    c:["A. It violates Kant's categorical imperative","B. A society living under such a rule would suffer far more utility loss (constant fear) than utility gain","C. The five patients are not worth more than one","D. Natural Law prohibits it"], a:"B",
    e:"Rule Utilitarianism considers long-term effects: 'A whole society where innocent people are taken off the street to be harvested for their organs is going to have a lot LESS utility than one where you don't have to live in constant fear.' The rule loses utility overall." },
  { id:87, d:"difficult", t:"Formal vs. Material Cooperation",
    q:"A pharmacist is coerced by an armed criminal to provide drugs that will be used in a crime. The pharmacist complies to avoid being shot. This BEST exemplifies ___.",
    c:["A. Principle of Formal Cooperation","B. Principle of Double Effect","C. Principle of Material Cooperation","D. Choice of Lesser Evil combined with Formal Cooperation"], a:"C",
    e:"Material Cooperation: one does NOT intend the evil but only PERMITS or TOLERATES it FOR THE SAKE OF AVOIDING EVEN MORE SERIOUS EVILS (being shot). The pharmacist doesn't intend the crime — they tolerate complying to preserve their life." },
  { id:88, d:"difficult", t:"Conscience Types",
    q:"A person goes to confession every day, convinced they have committed terrible sins even when they have not. This BEST illustrates ___.",
    c:["A. Guilty Conscience","B. Doubtful Conscience","C. Scrupulous Conscience","D. Erroneous Conscience"], a:"C",
    e:"SCRUPULOUS CONSCIENCE means CONSTANTLY AFRAID OF COMMITTING EVIL — it is a result of a STUBBORN CHARACTER. The person is excessively fearful of sin even when none exists." },
  { id:89, d:"difficult", t:"Virtue Ethics / Golden Mean",
    q:"A student never speaks up in class (deficiency) but another student interrupts constantly (excess). According to the Golden Mean, the virtuous path is ___.",
    c:["A. Following the cultural norm of the classroom","B. Applying the Categorical Imperative to determine the universal rule","C. Speaking at the right time, in the right amount, and in the right way — the virtue of proper assertiveness","D. Maximizing contributions for the greatest good of the class"], a:"C",
    e:"The Golden Mean is the MIDPOINT between excess and deficiency — both vices. The virtue lies between constant silence (deficiency) and constant interruption (excess). 'Having virtue means doing the right thing at the RIGHT TIME, in the RIGHT WAY, in the RIGHT AMOUNT.'" },
  { id:90, d:"difficult", t:"Natural Law / 7 Basic Goods",
    q:"According to Natural Law Theory, for every NEGATIVE LAW (prohibition) there is a corresponding POSITIVE one (positive injunction). For the basic good of REPRODUCTION, 'Don't prevent reproduction' is the prohibition. The corresponding positive injunction is ___.",
    c:["A. Educate your offspring","B. Live in society","C. Procreate","D. Seek God"], a:"C",
    e:"For the basic good of REPRODUCTION: 'Don't prevent reproduction' (prohibition) ↔ 'PROCREATE' (positive injunction). The reviewer explicitly states this as the example." },
  { id:91, d:"difficult", t:"Moral Dilemma Types",
    q:"The Philippine DepEd issues centralized curriculum mandates, but local schools have different community needs, making full compliance impossible without harming students. This BEST illustrates which structural dilemma?",
    c:["A. Gap vs. Overlap","B. Lack of Clarity vs. Lack of Creativity","C. Differentiation vs. Integration","D. Excessive Autonomy vs. Excessive Interdependence"], a:"C",
    e:"DIFFERENTIATION vs. INTEGRATION: Local schools become MORE DIFFERENTIATED (different needs/contexts) making it difficult to INTEGRATE them for a unified structure — this is the core tension in decentralization." },
  { id:92, d:"difficult", t:"Moral Dilemma Types",
    q:"A hospital assigns patient call-button responses to one department, but the rule specifies WHO responds without ensuring someone actually does — so patients are left unattended. This is ___.",
    c:["A. Flexibility vs. Strict Adherence to Rules","B. Excessive Autonomy","C. Gap vs. Overlap","D. Lack of Creativity"], a:"C",
    e:"GAP: 'There is a GAP as to WHO according to the RULE is supposed to respond to the buzzer' — something important is left UNDONE because of unclear or unenforceable role assignment." },
  { id:93, d:"difficult", t:"Virtue Ethics in Other Traditions",
    q:"In Confucian ethics, 'JEN' (humaneness) refers to human-heartedness and compassion. 'LI' (Propriety) refers to manner and culture. Which framework does Confucian ethics MOST CLOSELY resemble?",
    c:["A. Utilitarianism","B. Kant's Deontological Ethics","C. Aristotle's Virtue Ethics","D. Natural Law Theory"], a:"C",
    e:"Confucian ethics emphasizes CHARACTER VIRTUES (JEN = humaneness, compassion; LI = propriety, manner) — this closely resembles ARISTOTLE'S VIRTUE ETHICS, which also focuses on character development rather than rules or consequences." },
  { id:94, d:"difficult", t:"Integrated Application",
    q:"A teacher gives a failing grade to a student knowing the student will be expelled — which brings the student genuine distress. The teacher's intention is to uphold academic integrity. Under ALL THREE DETERMINANTS OF MORALITY, the act is ___.",
    c:["A. Morally evil because the student suffers","B. Morally good only if circumstances support it","C. Morally evaluated by object (giving grade = good), end (uphold integrity = good), and circumstances (student failing = factual condition) — all three align as good","D. A false dilemma requiring the choice of lesser evil"], a:"C",
    e:"All three determinants must be evaluated: OBJECT (giving an earned grade) = good; END (uphold academic integrity) = good; CIRCUMSTANCES (student actually failed) = factual, morally appropriate. All three align = the act is MORALLY GOOD, despite the distressing outcome." },
  { id:95, d:"difficult", t:"Kant's Ethics",
    q:"'If you approve of stealing — you're UNIVERSALIZING that action — you're saying EVERYONE should always steal. It can't be universalized. Hence stealing is wrong.' This argument employs ___.",
    c:["A. The Principle of Utility","B. The Formula of Humanity","C. The Universalizability Principle — First Formulation of the Categorical Imperative","D. The Choice of Lesser Evil"], a:"C",
    e:"This is KANT'S FIRST FORMULATION — the UNIVERSALIZABILITY PRINCIPLE: 'Act only according to that maxim which you can at the same time will that it should become a universal law without contradiction.' Stealing cannot be universalized." },
  { id:96, d:"difficult", t:"False Dilemma vs. True Moral Dilemma",
    q:"An accountant is offered a bribe to falsify company records. Which CORRECTLY classifies this situation?",
    c:["A. True Moral Dilemma — because both options are morally obligatory","B. False Dilemma — because one option (accepting the bribe) is a temptation away from a clear moral duty (honesty)","C. Structural Dilemma — because it involves organizational welfare","D. Individual Dilemma — because both choices are morally equal wrongs"], a:"B",
    e:"This is a FALSE DILEMMA — 'a situation where the decision-maker has a moral duty to do one thing (honesty) but is TEMPTED OR UNDER PRESSURE to do something else (take the bribe).' It is a CHOICE BETWEEN RIGHT AND WRONG, not right vs. right or wrong vs. wrong." },
  { id:97, d:"difficult", t:"Modifiers + Determinants Integration",
    q:"A nurse administers the wrong medication dose because she was not trained on a new drug protocol (she couldn't have known). A patient is harmed. Her moral accountability is ___.",
    c:["A. Full — she should have known","B. Reduced or absent — Invincible Ignorance removes moral responsibility because the knowledge was impossible for her to have","C. Reduced — because of Affected Ignorance","D. Full — because Vincible Ignorance does not free us from responsibility"], a:"B",
    e:"INVINCIBLE IGNORANCE: 'When we DO NOT KNOW something that was IMPOSSIBLE FOR US TO KNOW.' The nurse had NO WAY of knowing about an untaught protocol — this is INVINCIBLE IGNORANCE, which 'removes moral responsibility' (entirely involuntary)." },
  { id:98, d:"difficult", t:"Virtue Ethics + Eudaimonia",
    q:"Aristotle says 'A life of eudaimonia is a life of STRIVING — it comes from achieving something really difficult rather than having it handed to you.' A teacher who barely puts effort into lessons and just follows textbooks is FAILING at eudaimonia because ___.",
    c:["A. They are not following Kant's universal law","B. They are not maximizing utility for students","C. They are not realizing their substantial potential as a human person — not being 'fully human'","D. They are violating the principle of Natural Law"], a:"C",
    e:"Eudaimonia requires STRIVING — 'BEING FULLY HUMAN means realized substantially your POTENTIAL as a human person.' A teacher who barely tries is not realizing their potential, failing to achieve human flourishing." },
  { id:99, d:"difficult", t:"Love & Justice + Distributive Justice",
    q:"A school gives additional academic support resources only to high-achieving students while struggling students receive nothing. Under DISTRIBUTIVE JUSTICE, this policy is problematic because ___.",
    c:["A. It violates the Categorical Imperative","B. It fails to distribute based on the merits of individuals and the best interests of society","C. It creates a gap vs. overlap structural dilemma","D. It violates Agape love principles only"], a:"B",
    e:"DISTRIBUTIVE JUSTICE has to do with the distribution of goods based on THE MERITS OF INDIVIDUALS and THE BEST INTERESTS OF SOCIETY. Giving resources only to those who already excel ignores merit-based need and the best interests of society (developing all learners)." },
  { id:100, d:"difficult", t:"Integrated Ethics Application",
    q:"A barangay captain uses personal funds to build a basketball court for the community, but secretly chooses a location that benefits his own properties nearby. Evaluating ALL THREE DETERMINANTS: Object (building a court = good), End (hidden personal gain = evil), Circumstances (community benefits = good). The act is ___.",
    c:["A. Morally good because two out of three determinants are good","B. Morally neutral because the good and evil balance out","C. Morally evil because an evil End corrupts the act — all three must be without flaw","D. Morally acceptable under the Principle of Double Effect"], a:"C",
    e:"'For an act to be morally good, ALL THREE DETERMINANTS must be WITHOUT FLAW — a thing to be good must wholly so; it is NOT vitiated by ANY defect.' An EVIL END (personal gain) CORRUPTS the entire act, even if the Object and Circumstances appear good." },];
const CURRICULUM_200 = [
// ══════════════ EASY (1-60) ══════════════
{id:1,d:"easy",t:"Definitions of Curriculum",q:"Which of the following is a TRADITIONAL definition of curriculum?",c:["A. Sum total of all learning experiences inside and outside the school","B. Entire range of experiences concerned with the unfolding of individual abilities","C. A set of courses constituting an area of specialization","D. Set of learning experiences for students to attain the aims of education"],a:"C",e:"The TRADITIONAL definition views curriculum as a set of courses constituting an area of specialization — limited to inside the school and classroom, ordinary and limited."},
{id:2,d:"easy",t:"Definitions of Curriculum",q:"The PROGRESSIVE definition of curriculum views it as the sum total of all learning experiences ___.",c:["A. Inside the school only","B. Inside and outside the school","C. Found in textbooks and syllabi","D. Prescribed by the government"],a:"B",e:"The PROGRESSIVE definition views curriculum as the sum total of all learning experiences INSIDE AND OUTSIDE THE SCHOOL — broader and more inclusive."},
{id:3,d:"easy",t:"Definitions of Curriculum",q:"In the traditional view, curriculum is described as ___.",c:["A. Enriched and broad","B. Ordinary and limited","C. Planned and progressive","D. Experienced and enriched"],a:"B",e:"Traditional curriculum is ORDINARY (O) and LIMITED (L) — confined inside the school and classroom."},
{id:4,d:"easy",t:"Definitions of Curriculum",q:"The progressive definition describes curriculum as ___.",c:["A. Ordinary and limited","B. Traditional and planned","C. Enriched and broad","D. Simple and ordinary"],a:"C",e:"The progressive definition describes curriculum as ENRICHED (E) and BROAD (B) — covering inside and outside the school."},
{id:5,d:"easy",t:"Types of Curricula",q:"Which type of curriculum includes recommendations from government agencies such as TESDA, CHED, and UNESCO?",c:["A. Written curriculum","B. Taught curriculum","C. Recommended curriculum","D. Assessed curriculum"],a:"C",e:"The RECOMMENDED curriculum consists of recommendations in the form of memoranda or policy, standards, and guidelines that came from government agencies such as TESDA, CHED, and UNESCO."},
{id:6,d:"easy",t:"Types of Curricula",q:"Which type of curriculum includes documents such as lesson plans and syllabi?",c:["A. Recommended curriculum","B. Written curriculum","C. Supported curriculum","D. Hidden curriculum"],a:"B",e:"The WRITTEN curriculum includes documents based on the recommended curriculum — examples: lesson plans (LP) and syllabi."},
{id:7,d:"easy",t:"Types of Curricula",q:"The type of curriculum that is put into life by the teacher and learners is the ___ curriculum.",c:["A. Written","B. Supported","C. Assessed","D. Taught"],a:"D",e:"The TAUGHT curriculum is when the teacher and learners put life to the written curriculum. Skills of the teacher, instructional materials, and facilities are necessary."},
{id:8,d:"easy",t:"Types of Curricula",q:"Which type of curriculum refers to support materials like print and non-print learning materials?",c:["A. Written curriculum","B. Assessed curriculum","C. Supported curriculum","D. Taught curriculum"],a:"C",e:"The SUPPORTED curriculum consists of support materials that the teacher needs — print materials and non-print materials (learning materials)."},
{id:9,d:"easy",t:"Types of Curricula",q:"The curriculum that is evaluated after it has been taught is the ___ curriculum.",c:["A. Learned","B. Supported","C. Hidden","D. Assessed"],a:"D",e:"The ASSESSED curriculum is evaluated after it has been taught."},
{id:10,d:"easy",t:"Types of Curricula",q:"Which curriculum is measured through tools in assessment that indicate cognitive, affective, and psychomotor outcomes?",c:["A. Taught curriculum","B. Assessed curriculum","C. Learned curriculum","D. Supported curriculum"],a:"C",e:"The LEARNED curriculum is measured by tools in assessment, indicating cognitive (knowledge), affective (values), and psychomotor (skills) outcomes."},
{id:11,d:"easy",t:"Types of Curricula",q:"The Hidden/Implicit curriculum is also called the ___ curriculum.",c:["A. Learned","B. Unplanned","C. Assessed","D. Supported"],a:"B",e:"The HIDDEN/IMPLICIT curriculum is also called the UNPLANNED curriculum — it includes peer influence, school environment, media, parental pressures, and societal changes."},
{id:12,d:"easy",t:"Roles of a Curricularist",q:"A teacher who implements a new curriculum with open mindedness and full belief that it will enhance learning is playing the role of ___.",c:["A. Innovator","B. Evaluator","C. Initiator","D. Knower"],a:"C",e:"The INITIATOR role requires the open mindedness of the teacher and the full belief that the curriculum will enhance learning."},
{id:13,d:"easy",t:"Roles of a Curricularist",q:"A teacher whose creativity and innovations are hallmarks of excellent teaching plays the role of ___.",c:["A. Implementer","B. Innovator","C. Evaluator","D. Initiator"],a:"B",e:"The INNOVATOR role — creativity and innovations are hallmarks of an excellent teacher (unique and out-of-the-box strategies)."},
{id:14,d:"easy",t:"Roles of a Curricularist",q:"An Implementer as a role of a curricularist gives ___ to the curriculum plan.",c:["A. Evaluation","B. Documentation","C. Life","D. Goals"],a:"C",e:"The IMPLEMENTER gives LIFE to the curriculum plan — where teaching, guiding, and facilitating skills of the teacher are expected at the highest level."},
{id:15,d:"easy",t:"Roles of a Curricularist",q:"The role of Evaluator in curriculum determines if ___.",c:["A. The curriculum is written correctly","B. The desired learning outcomes have been achieved","C. The teacher has sufficient skills","D. Government guidelines are followed"],a:"B",e:"The EVALUATOR determines if the desired learning outcomes have been achieved."},
{id:16,d:"easy",t:"Roles of a Curricularist",q:"A teacher who masters what is included in the curriculum plays the role of ___.",c:["A. Innovator","B. Initiator","C. Knower","D. Planner"],a:"C",e:"The KNOWER — as a teacher, one has to master what is included in the curriculum (through training, seminars, Masters & PhD)."},
{id:17,d:"easy",t:"Roles of a Curricularist",q:"A teacher who takes records of knowledge, concepts, subject matter, or content is playing the role of ___.",c:["A. Planner","B. Initiator","C. Writer","D. Knower"],a:"C",e:"The WRITER — a classroom teacher takes records/records of knowledge, concepts, subject matter or content of the curriculum."},
{id:18,d:"easy",t:"Roles of a Curricularist",q:"The role of Planner involves making ___ or ___ or ___ plan of the curriculum.",c:["A. Weekly, monthly, or daily","B. Yearly, monthly, or daily","C. Quarterly, semestral, or annual","D. Unit, lesson, or course"],a:"B",e:"The PLANNER makes YEARLY, MONTHLY, or DAILY plans of the curriculum which serve as guides in implementation."},
{id:19,d:"easy",t:"Factors in Planning",q:"Which of the following is NOT one of the five factors to consider in planning a curriculum?",c:["A. The learner","B. Support materials","C. Teacher's salary","D. The desired outcomes"],a:"C",e:"The five factors are: (1) The learner, (2) Support materials, (3) Time, (4) Subject matter or content, (5) The desired outcomes. Teacher's salary is not a factor."},
{id:20,d:"easy",t:"Views of Curriculum",q:"Robert Hutchins holds which view of curriculum?",c:["A. Progressive view","B. Traditional view","C. Experience-centered view","D. Child-centered view"],a:"B",e:"Robert Hutchins holds the TRADITIONAL VIEW — he views curriculum as 'permanent studies' focused on grammar, reading, rhetoric, logic, and math."},
{id:21,d:"easy",t:"Views of Curriculum",q:"John Dewey holds which view of curriculum?",c:["A. Traditional view","B. Subject-centered view","C. Progressive view","D. Discipline-focused view"],a:"C",e:"John Dewey holds the PROGRESSIVE VIEW — he believes education is experiencing and that reflective thinking unifies curricular elements tested by application."},
{id:22,d:"easy",t:"Traditional View — Proponents",q:"Robert Hutchins viewed curriculum as ___.",c:["A. Purposeful activities that are child-centered","B. Permanent studies where rules of grammar, reading, rhetoric, logic, and math are emphasized","C. Discipline-focused subject areas only","D. All experiences children have under teacher guidance"],a:"B",e:"Robert Hutchins viewed curriculum as 'PERMANENT STUDIES' where rules of grammar, reading, rhetoric, logic, and math are emphasized — called Perennialism."},
{id:23,d:"easy",t:"Traditional View — Proponents",q:"Arthur Bestor believed that the mission of the school should be ___.",c:["A. Child development and growth","B. Social relationships and small group instruction","C. Intellectual training including Math, Science, History, and Foreign Language","D. Learning through purposeful activities"],a:"C",e:"Arthur Bestor believed the mission of the school should be INTELLECTUAL TRAINING, which includes Math, Science, History, and Foreign Language."},
{id:24,d:"easy",t:"Traditional View — Proponents",q:"Joseph Schwab believed that the SOLE SOURCE of curriculum is ___.",c:["A. Child development","B. Government mandates","C. Discipline","D. Experience"],a:"C",e:"Joseph Schwab believed the SOLE SOURCE of curriculum is DISCIPLINE — he coined the word 'discipline' as a ruling doctrine for curriculum development."},
{id:25,d:"easy",t:"Traditional View — Proponents",q:"Phillip Phenix believed that curriculum should consist entirely of knowledge which comes from ___.",c:["A. Government agencies","B. Social functions","C. Child experiences","D. Various disciplines"],a:"D",e:"Phillip Phenix believed curriculum should consist entirely of KNOWLEDGE FROM VARIOUS DISCIPLINES."},
{id:26,d:"easy",t:"Progressive View — Proponents",q:"John Dewey believed that education is ___.",c:["A. Discipline-focused","B. Experiencing; reflective thinking unifies curricular elements","C. Permanent studies of grammar and math","D. Subject-centered and teacher-led"],a:"B",e:"John Dewey believed EDUCATION IS EXPERIENCING — reflective thinking is a means to unify curricular elements that are tested by application. Teachers are facilitators."},
{id:27,d:"easy",t:"Progressive View — Proponents",q:"Hollis Caswell and Kenn Campbell viewed curriculum as all experiences children have under the ___.",c:["A. Supervision of parents","B. Guidance of teachers","C. Direction of the government","D. Influence of community"],a:"B",e:"Caswell and Campbell viewed curriculum as all experiences children have under the GUIDANCE OF TEACHERS."},
{id:28,d:"easy",t:"Progressive View — Proponents",q:"Colin Marsh and George Willis viewed curriculum as all experiences in the classroom which are planned and enacted by the teacher and also ___ by the students.",c:["A. Observed","B. Evaluated","C. Learned","D. Documented"],a:"C",e:"Colin Marsh and George Willis viewed curriculum as experiences PLANNED and enacted by the teacher and also LEARNED by the students."},
{id:29,d:"easy",t:"Three Ways of Approaching Curriculum",q:"Curriculum as a Content or Body of Knowledge focuses on ___.",c:["A. How to teach","B. Output of learners","C. What to teach","D. Learning activities"],a:"C",e:"Curriculum as a CONTENT OR BODY OF KNOWLEDGE focuses on WHAT TO TEACH — the knowledge to be transmitted."},
{id:30,d:"easy",t:"Three Ways of Approaching Curriculum",q:"Curriculum as a Process focuses on ___.",c:["A. What to teach","B. Learning outcomes","C. How to teach","D. Evaluation results"],a:"C",e:"Curriculum as a PROCESS focuses on HOW TO TEACH — what actually happens in the classroom when the curriculum is practiced."},
{id:31,d:"easy",t:"Three Ways of Approaching Curriculum",q:"Curriculum as a Product focuses on ___.",c:["A. How to teach","B. What to teach","C. Government guidelines","D. Learning outcomes desired by learners"],a:"D",e:"Curriculum as a PRODUCT focuses on LEARNING OUTCOMES desired by learners — the output."},
{id:32,d:"easy",t:"Principles of Curriculum Content",q:"The acronym for the Principles of Curriculum Content is ___.",c:["A. BASICS","B. BISCA","C. BACIS","D. BASICS"],a:"A",e:"The Principles of Curriculum Content are: Balance (B), Articulation (A), Sequence (S), Integration (I), Continuity (C), and Scope (S) — BASICS."},
{id:33,d:"easy",t:"Principles of Curriculum Content",q:"SCOPE in curriculum refers to ___.",c:["A. Logical arrangement of content","B. Vertical repetition of content","C. Coverage or boundaries of curriculum","D. Interconnection of subjects"],a:"C",e:"SCOPE refers to the COVERAGE or BOUNDARIES of the curriculum — how much is included."},
{id:34,d:"easy",t:"Principles of Curriculum Content",q:"SEQUENCE in curriculum refers to ___.",c:["A. Coverage or boundaries","B. Logical arrangement of content from simple to complex","C. Smooth connections between grades","D. Integration of two or more subjects"],a:"B",e:"SEQUENCE is the LOGICAL ARRANGEMENT of content — from SIMPLE TO COMPLEX."},
{id:35,d:"easy",t:"Principles of Curriculum Content",q:"CONTINUITY in curriculum refers to ___.",c:["A. Coverage or boundaries of curriculum","B. Connections between grades","C. Vertical repetition and recurring approaches of content","D. Equitable assignment of content and time"],a:"C",e:"CONTINUITY is the VERTICAL REPETITION and RECURRING APPROACHES of content — it endures time (perennial) and is interdisciplinary and transdisciplinary."},
{id:36,d:"easy",t:"Principles of Curriculum Content",q:"BALANCE in curriculum refers to ___.",c:["A. Coverage or boundaries","B. Logical arrangement from simple to complex","C. Integration of two or more subjects","D. Equitable assignment of content, time, experiences, and other elements"],a:"D",e:"BALANCE is the EQUITABLE ASSIGNMENT of content, time, experiences, and other elements."},
{id:37,d:"easy",t:"Curriculum Development",q:"Curriculum development is a ___ process involving many different people and procedures.",c:["A. Static","B. Dynamic","C. Linear","D. Simple"],a:"B",e:"Curriculum development is a DYNAMIC process involving many different people and procedures."},
{id:38,d:"easy",t:"Four Phases of Curriculum Development",q:"What is the FIRST/INITIAL step in curriculum development?",c:["A. Designing","B. Implementing","C. Evaluating","D. Planning"],a:"D",e:"PLANNING is the INITIAL STEP in curriculum development — it includes vision, mission, goals, learning outcomes, and the end product is a written document (lesson plan, syllabus, etc.)."},
{id:39,d:"easy",t:"Four Phases of Curriculum Development",q:"Which phase of curriculum development involves the selection and organization of content, activities, assessments, and resources?",c:["A. Planning","B. Implementing","C. Evaluating","D. Designing"],a:"D",e:"DESIGNING involves the SELECTION and ORGANIZATION of content, activities, assessments, and resources."},
{id:40,d:"easy",t:"Four Phases of Curriculum Development",q:"Which phase of curriculum development continues AFTER planning and puts the plan into action?",c:["A. Evaluating","B. Designing","C. Implementing","D. Assessing"],a:"C",e:"IMPLEMENTING continues AFTER PLANNING — it puts into action the plan, all learning activities that transpire in the classroom."},
{id:41,d:"easy",t:"Four Phases of Curriculum Development",q:"The Evaluating phase FOLLOWS ___ and determines the extent to which learning outcomes have been achieved.",c:["A. Planning","B. Designing","C. Implementing","D. Writing"],a:"C",e:"EVALUATING FOLLOWS IMPLEMENTATION — it determines the extent to which the learning outcomes have been achieved."},
{id:42,d:"easy",t:"Curriculum Development Models",q:"Ralph Tyler is known as the Father of ___ and the Grandfather of ___.",c:["A. Progressive Education / Curriculum Evaluation","B. Behavioral Objectives / Curriculum Design","C. Social Studies / Curriculum Implementation","D. Child-Centered Learning / Curriculum Content"],a:"B",e:"Ralph Tyler is the FATHER OF BEHAVIORAL OBJECTIVES and the GRANDFATHER OF CURRICULUM DESIGN."},
{id:43,d:"easy",t:"Curriculum Development Models",q:"Ralph Tyler's model uses which approach?",c:["A. Bottom-up/Grassroots approach","B. Experience-centered approach","C. Top-down/Deductive approach","D. Child-centered approach"],a:"C",e:"Ralph Tyler's model uses the TOP-DOWN (DEDUCTIVE) approach — going from general to specific. It is an Objective-Centered Model."},
{id:44,d:"easy",t:"Curriculum Development Models",q:"Hilda Taba's approach to curriculum development is known as the ___ approach.",c:["A. Top-down","B. Deductive","C. Subject-centered","D. Grassroots/Bottom-up"],a:"D",e:"Hilda Taba uses the GRASSROOTS/BOTTOM-UP APPROACH — inductive, going from specific to general. Teachers are most important."},
{id:45,d:"easy",t:"Curriculum Development Models",q:"How many major steps does Hilda Taba's curriculum model have?",c:["A. 4","B. 5","C. 6","D. 7"],a:"D",e:"Hilda Taba's model has SEVEN MAJOR STEPS in curriculum."},
{id:46,d:"easy",t:"Foundations of Curriculum",q:"Historical foundations of curriculum refer to the ___ development of curriculum along a timeline.",c:["A. Sociological","B. Philosophical","C. Chronological","D. Psychological"],a:"C",e:"Historical foundations are the CHRONOLOGICAL DEVELOPMENT of curriculum along a timeline."},
{id:47,d:"easy",t:"Historical Foundations",q:"Franklin Bobbit is considered the FIRST curriculum developer. He believed curriculum prepares learners for ___.",c:["A. College life","B. Social roles","C. Adult life","D. Professional careers"],a:"C",e:"Franklin Bobbit was FIRST — he believed curriculum prepares learners for ADULT LIFE and is a science that emphasizes students' needs."},
{id:48,d:"easy",t:"Historical Foundations",q:"William Kilpatrick introduced the ___ method where teacher and student plan activities together.",c:["A. Direct instruction","B. Project method","C. Problem-solving method","D. Cooperative learning method"],a:"B",e:"William Kilpatrick introduced the PROJECT METHOD — where teacher and student plan the activities. Curricula are purposeful activities which are child-centered."},
{id:49,d:"easy",t:"Historical Foundations",q:"Harold Rugg emphasized ___ studies and suggested that the teacher plans curriculum in advance.",c:["A. Science","B. Mathematics","C. Social","D. Language"],a:"C",e:"Harold Rugg emphasized SOCIAL STUDIES and suggested that the teacher plans curriculum in advance. Curriculum should develop the WHOLE CHILD (holistic)."},
{id:50,d:"easy",t:"Historical Foundations",q:"Ralph Tyler believed curriculum is a science and always related to instruction with subject matter organized in terms of knowledge, skills, and values. The process emphasizes ___.",c:["A. Discipline","B. Social relationships","C. Memorization","D. Problem solving"],a:"D",e:"Ralph Tyler believed the process emphasizes PROBLEM SOLVING — curriculum aims to educate GENERALISTS (multi-skilled) not specialists (uni-skilled)."},
{id:51,d:"easy",t:"Sociological Foundations",q:"In sociological foundations, schools serve as agents of ___.",c:["A. Knowledge","B. Tradition","C. Change","D. Discipline"],a:"C",e:"In sociological foundations: Society as a source of CHANGE, SCHOOLS as AGENTS OF CHANGE, and Knowledge as an agent of change."},
{id:52,d:"easy",t:"Sociological Foundations",q:"Alvin Toffler wrote the book ___.",c:["A. Democracy and Education","B. Future Shock","C. Curriculum Theory","D. The Pedagogy of the Oppressed"],a:"B",e:"Alvin Toffler wrote FUTURE SHOCK — he believed knowledge should prepare students for the future. The future is about learning, relearning, and unlearning."},
{id:53,d:"easy",t:"Sociological Foundations",q:"Paolo Freire is associated with which educational approach?",c:["A. Direct Instruction","B. Perennialism","C. Critical Pedagogy","D. Discipline-based curriculum"],a:"C",e:"Paolo Freire is associated with CRITICAL PEDAGOGY — education as a means of shaping the person and society through critical reflections and 'conscientization.' Teachers use questioning and problem posing."},
{id:54,d:"easy",t:"Curriculum Design Models",q:"Which of the following is a SUBJECT-CENTERED curriculum design?",c:["A. Child-centered design","B. Experience-centered design","C. Humanistic design","D. Subject design"],a:"D",e:"Subject-centered designs include: Subject design, Discipline design, Correlation design, and Broadfield design."},
{id:55,d:"easy",t:"Curriculum Design Models",q:"Which curriculum design is anchored on the NEEDS AND INTERESTS of the child?",c:["A. Subject design","B. Humanistic design","C. Child-centered design","D. Core problem design"],a:"C",e:"CHILD-CENTERED DESIGN is anchored on the NEEDS AND INTERESTS of the CHILD."},
{id:56,d:"easy",t:"Curriculum Design Models",q:"In Experience-centered design, ___ of the learners become the starting point of the curriculum.",c:["A. Needs","B. Disciplines","C. Experiences","D. Problems"],a:"C",e:"EXPERIENCE-CENTERED DESIGN: EXPERIENCES of the learners become the STARTING POINT of the curriculum."},
{id:57,d:"easy",t:"Curriculum Design Models",q:"Humanistic design's ultimate objective is ___.",c:["A. Social problem solving","B. Mastery of discipline","C. Development of self","D. Government compliance"],a:"C",e:"HUMANISTIC DESIGN: the DEVELOPMENT OF SELF is the ultimate objective of learning — personality development, self-actualization, holistic development."},
{id:58,d:"easy",t:"Categories of Curriculum Change",q:"SUBSTITUTION as a category of curriculum change means ___.",c:["A. Introducing minor modifications","B. Responding to shifts in the vision/mission","C. Replacing the present with an entirely new one","D. Introducing major modifications of the current curriculum"],a:"C",e:"SUBSTITUTION: changes a new tool/book entirely to a new one — REPLACING the present with a new one (complete overhaul)."},
{id:59,d:"easy",t:"Stakeholders",q:"Teachers are considered the ___ movers of the curriculum.",c:["A. Secondary","B. Primary","C. Final","D. Passive"],a:"B",e:"TEACHERS are the PRIMARY MOVERS — they are the curricularists who plan, design, teach, implement, and evaluate the curriculum."},
{id:60,d:"easy",t:"Stakeholders",q:"Learners are considered the ___ of the curriculum.",c:["A. Primary movers","B. Curriculum managers","C. Core of the curriculum and primary beneficiaries","D. Significant school partners"],a:"C",e:"LEARNERS are the PRIMARY BENEFICIARIES and the CORE of the curriculum."},

// ══════════════ MODERATE (61-160) ══════════════
{id:61,d:"moderate",t:"Definitions of Curriculum",q:"A teacher says: 'Curriculum includes not just what is taught in classrooms, but also what students learn through field trips, community involvement, and extracurricular activities.' This reflects which definition?",c:["A. Traditional definition","B. Ordinary and limited view","C. Progressive definition","D. Written curriculum definition"],a:"C",e:"PROGRESSIVE DEFINITION: curriculum as the sum total of all learning experiences INSIDE AND OUTSIDE the school — enriched and broad."},
{id:62,d:"moderate",t:"Definitions of Curriculum",q:"'Curriculum is a means of attaining the aims or philosophy of education.' This is a ___.",c:["A. Progressive definition","B. Traditional definition","C. Sociological foundation","D. Psychological foundation"],a:"B",e:"TRADITIONAL DEFINITIONS of curriculum include: 'a means of attaining the aims or philosophy of education' — focused on goals, courses, and planned learning experiences."},
{id:63,d:"moderate",t:"Types of Curricula",q:"A teacher uses textbooks, modules, and audio-visual materials in class. These constitute the ___ curriculum.",c:["A. Written","B. Recommended","C. Supported","D. Assessed"],a:"C",e:"SUPPORTED CURRICULUM = support materials that the teacher needs: print materials and non-print materials (learning materials)."},
{id:64,d:"moderate",t:"Types of Curricula",q:"Students' behavior is shaped not by what is formally taught but by the peer groups, social media, and school atmosphere. This refers to the ___ curriculum.",c:["A. Assessed","B. Learned","C. Hidden/Implicit","D. Recommended"],a:"C",e:"HIDDEN/IMPLICIT (UNPLANNED) CURRICULUM: the unwritten curriculum including peer influence, school environment, media, parental pressures, and societal changes."},
{id:65,d:"moderate",t:"Types of Curricula",q:"After a series of lessons, the teacher administers unit tests and performance tasks to measure student outcomes. This is an example of the ___ curriculum.",c:["A. Taught","B. Learned","C. Supported","D. Assessed"],a:"D",e:"ASSESSED CURRICULUM: the curriculum that is EVALUATED after it has been taught — includes all assessments given."},
{id:66,d:"moderate",t:"Types of Curricula",q:"A teacher submits a lesson plan aligned with the K–12 curriculum guide. This lesson plan belongs to which type of curriculum?",c:["A. Taught curriculum","B. Recommended curriculum","C. Written curriculum","D. Assessed curriculum"],a:"C",e:"WRITTEN CURRICULUM includes DOCUMENTS based on the recommended curriculum — lesson plans (LP), syllabi, and similar documents."},
{id:67,d:"moderate",t:"Roles of a Curricularist",q:"A teacher uses interactive games, VR simulations, and creative projects instead of traditional lectures. Which role is this teacher exemplifying?",c:["A. Evaluator","B. Planner","C. Knower","D. Innovator"],a:"D",e:"INNOVATOR: creativity and innovations are HALLMARKS of an excellent teacher — unique and out-of-the-box strategies."},
{id:68,d:"moderate",t:"Roles of a Curricularist",q:"After a semester, a teacher reviews if the objectives were met and collects data on student performance. Which role is being demonstrated?",c:["A. Initiator","B. Knower","C. Evaluator","D. Planner"],a:"C",e:"EVALUATOR: determines if the DESIRED LEARNING OUTCOMES have been achieved."},
{id:69,d:"moderate",t:"Three Ways of Approaching Curriculum",q:"A teacher differentiates content by providing varied reading materials at different levels for different students. This is an example of differentiating ___.",c:["A. Process","B. Product","C. Learning style","D. Content"],a:"D",e:"DIFFERENTIATING CONTENT: defines the essential principles that all students must understand and adjusts the COMPLEXITY OF INFORMATION as needed — using reading materials/books appropriate for the learner's various reading levels."},
{id:70,d:"moderate",t:"Three Ways of Approaching Curriculum",q:"A teacher uses group work for one group while using direct instruction for another. This is an example of differentiating ___.",c:["A. Content","B. Product","C. Assessment","D. Process"],a:"D",e:"DIFFERENTIATING PROCESS refers to ACTIVITIES that students engage in order to understand and master the topic — using direct instruction for one group while group work for another."},
{id:71,d:"moderate",t:"Three Ways of Approaching Curriculum",q:"A teacher allows students to demonstrate learning through exams, projects, written work, or presentations. This exemplifies differentiating ___.",c:["A. Content","B. Process","C. Product","D. Environment"],a:"C",e:"DIFFERENTIATING PRODUCT: can take the form of exams, activities, projects, written work, etc. It allows teachers to construct lessons relevant and customized to any learner by modifying depth, amount, or independence."},
{id:72,d:"moderate",t:"Principles of Curriculum Content",q:"Social Studies in Grade 6 is taught at the same time as Science in Grade 6. This represents which principle?",c:["A. Sequence","B. Vertical Alignment","C. Horizontal Alignment","D. Continuity"],a:"C",e:"HORIZONTAL ALIGNMENT (under Articulation): arranges learning outcomes ACROSS SUBJECTS PER GRADE — like Social Studies in Grade 6 related to Science in Grade 6."},
{id:73,d:"moderate",t:"Principles of Curriculum Content",q:"Grade 3 content on fractions is designed to prepare students for Grade 4 fraction operations. This represents which principle?",c:["A. Scope","B. Horizontal Alignment","C. Balance","D. Vertical Alignment"],a:"D",e:"VERTICAL ALIGNMENT (under Articulation): content in a lower level is connected to the next level — what students learn in one grade prepares them for the next."},
{id:74,d:"moderate",t:"Principles of Curriculum Content",q:"ARTICULATION in curriculum is described as ___.",c:["A. Coverage or boundaries of curriculum","B. Logical arrangement from simple to complex","C. Vertical repetition of content over time","D. Curriculum arranged vertically or horizontally with smooth connections"],a:"D",e:"ARTICULATION: curriculum arranged VERTICALLY or HORIZONTALLY to create SMOOTH CONNECTIONS — no overlap between grade levels."},
{id:75,d:"moderate",t:"Principles of Curriculum Content",q:"INTEGRATION in curriculum means ___.",c:["A. Sequential arrangement of content","B. Coverage and boundaries of curriculum","C. Curriculum is integrated and interconnected — two or more subjects","D. Equitable assignment of content and time"],a:"C",e:"INTEGRATION: curriculum is INTEGRATED and INTERCONNECTED — involves TWO OR MORE SUBJECTS; relates to interdisciplinary, transdisciplinary approaches."},
{id:76,d:"moderate",t:"Curriculum Development Models — Ralph Tyler",q:"Ralph Tyler's model is also known as ___.",c:["A. Grassroots Approach","B. Tyler's Rationale or Linear Model","C. Bottom-up Inductive Model","D. Experience-Centered Model"],a:"B",e:"Ralph Tyler's model is also known as TYLER'S RATIONALE or the LINEAR MODEL — it is objective-centered and emphasizes the PLANNING PHASE."},
{id:77,d:"moderate",t:"Curriculum Development Models — Ralph Tyler",q:"What are Tyler's Four Basic Principles in order?",c:["A. Purpose, Experiences, Organization, Evaluation","B. Goals, Objectives, Designing, Evaluation","C. Diagnosis, Objectives, Selection, Organization","D. Planning, Designing, Implementing, Evaluating"],a:"A",e:"Tyler's FOUR BASIC PRINCIPLES: (1) Purpose of the School, (2) Educational Experiences related to the Purpose, (3) Organization of the Experiences, (4) Evaluation of the Experiences — P, E, O, E."},
{id:78,d:"moderate",t:"Curriculum Development Models — Hilda Taba",q:"Which is the FIRST step in Hilda Taba's 7-step model?",c:["A. Formulation of Learning Objectives","B. Selection of Learning Contents","C. Diagnosis of Learners' Needs","D. Organization of Learning Contents"],a:"C",e:"Hilda Taba's first step is DIAGNOSIS OF LEARNERS' NEEDS — the grassroots approach starts from the bottom (students' needs)."},
{id:79,d:"moderate",t:"Curriculum Development Models — Hilda Taba",q:"What is the LAST step in Hilda Taba's 7-step curriculum model?",c:["A. Organization of learning experiences","B. Selection of learning experiences","C. Organization of learning contents","D. Determination of what to evaluate and the means of doing it"],a:"D",e:"The LAST step (7) in Hilda Taba's model is: DETERMINATION OF WHAT TO EVALUATE AND THE MEANS OF DOING IT."},
{id:80,d:"moderate",t:"Curriculum Development Models — Saylor & Alexander",q:"Saylor and Alexander described curriculum as a 'plan for providing sets of learning opportunities to achieve board educational goals and related specific objectives for an identifiable population served by a single school center.' Their model's four components begin with ___.",c:["A. Goals, Objectives, and Domains","B. Diagnosis of needs","C. Purpose of the school","D. Planning phase"],a:"A",e:"Saylor and Alexander's model: (1) Goals, Objectives, and Domains (GOD), (2) Curriculum Designing, (3) Curriculum Implementation, (4) Evaluation."},
{id:81,d:"moderate",t:"Historical Foundations",q:"Hollis Caswell viewed curriculum as organized around social functions of themes organized knowledge and learner's interest. Curriculum, instruction, and learning are ___.",c:["A. Separate and distinct","B. Interrelated","C. Sequential","D. Independent processes"],a:"B",e:"Hollis Caswell: curriculum is a set of EXPERIENCES; curriculum, instruction, and learning are INTERRELATED. Subject matter developed around social functions and learners' interests."},
{id:82,d:"moderate",t:"Historical Foundations",q:"Peter Oliva described curriculum change as a COOPERATIVE ENDEAVOR where teachers and curriculum specialists constitute the professional ___.",c:["A. Core of learners","B. Government agency","C. Core of planners","D. Board of education"],a:"C",e:"Peter Oliva: teachers and curriculum specialists constitute the PROFESSIONAL CORE OF PLANNERS. Significant improvement is achieved through GROUP ACTIVITY."},
{id:83,d:"moderate",t:"Historical Foundations",q:"William Pinar believed curriculum should be studied from historical, racial, gendered, phenomenological, postmodern, theological, and international perspectives. His approach aims to ___.",c:["A. Reduce the scope of curriculum","B. Broaden the conception of curriculum to enrich the practice","C. Enforce subject-centered learning","D. Limit curriculum to government standards"],a:"B",e:"William Pinar: BROADEN the conception of curriculum to ENRICH the practice — curriculum involves MULTIPLE DISCIPLINES."},
{id:84,d:"moderate",t:"Sociological Foundations",q:"John Dewey considered two fundamental elements — schools and civil society — to be major topics needing reconstruction to encourage ___.",c:["A. Permanent studies","B. Discipline-focused learning","C. Experimental intelligence and plurality","D. Social conformity"],a:"C",e:"John Dewey wanted reconstruction to encourage EXPERIMENTAL INTELLIGENCE (creative intelligence — knowledge in situation) and PLURALITY."},
{id:85,d:"moderate",t:"Sociological Foundations",q:"John Goodlad emphasized ___.",c:["A. Permanent studies focused on grammar","B. Curriculum as a science emphasizing students' needs","C. Active learning, critical thinking, and student involvement in curriculum planning","D. The project method with teacher-student collaboration"],a:"C",e:"John Goodlad: curriculum organized around NEEDS OF SOCIETY AND STUDENTS; reduce student conformity; constant need for school improvement; EMPHASIS ON ACTIVE LEARNING AND CRITICAL THINKING; INVOLVEMENT OF STUDENTS in planning."},
{id:86,d:"moderate",t:"Oliva's 10 Axioms",q:"Peter Oliva created the 10 Axioms for Curriculum Designers. Axioms are principles that practitioners can use as ___.",c:["A. Laws of education","B. Government mandates","C. Guidelines or a frame of reference","D. Behavioral objectives"],a:"C",e:"Axioms are PRINCIPLES that practitioners as curriculum designers can use as GUIDELINES or a FRAME OF REFERENCE."},
{id:87,d:"moderate",t:"Oliva's 10 Axioms",q:"Oliva's Axiom 1 states: 'Curriculum change is inevitable, necessary, and desirable.' This is because societal development and knowledge revolution come so fast and require new curriculum designs — curriculum is ___.",c:["A. Static and permanent","B. Dynamic","C. Traditional","D. Fixed"],a:"B",e:"Axiom 1: curriculum change is inevitable, necessary, and desirable because curriculum is DYNAMIC — societal development and knowledge revolution require new designs."},
{id:88,d:"moderate",t:"Oliva's 10 Axioms",q:"Axiom 2: 'Curriculum is the product of its time.' This means curriculum is TIMELESS which means it responds to changes from ___.",c:["A. Individual teachers' preferences","B. Ancient educational traditions","C. Current social forces, educational reforms, etc.","D. Students' test scores only"],a:"C",e:"Axiom 2: TIMELESS — curriculum responds to changes from CURRENT SOCIAL FORCES, EDUCATIONAL REFORMS, etc. — it is always responsive to its time."},
{id:89,d:"moderate",t:"Oliva's 10 Axioms",q:"Axiom 4 states: 'Curriculum change depends on the people who will implement the change.' It is best that ___ design and own the changes.",c:["A. Government agencies","B. University professors","C. Parents","D. Teachers"],a:"D",e:"Axiom 4: TEACHERS should design and OWN THE CHANGES — curriculum change depends on the TEACHER (people who implement)."},
{id:90,d:"moderate",t:"Oliva's 10 Axioms",q:"Axiom 5: 'Curriculum change is a cooperative group activity.' Group decisions in curriculum development are suggested, and consultations with ___ will add a sense of ownership.",c:["A. Foreign experts","B. Stakeholders","C. Only subject specialists","D. School principals alone"],a:"B",e:"Axiom 5: COOPERATIVE GROUP ACTIVITY — consultations with STAKEHOLDERS, when possible, will add a SENSE OF OWNERSHIP."},
{id:91,d:"moderate",t:"Oliva's 10 Axioms",q:"Axiom 6: 'Curriculum Development is a decision-making process made from choices of alternatives.' A curriculum developer/designer must decide what CONTENT to teach and what ___ or strategies to use.",c:["A. Salary range","B. Government funding","C. Methods or strategies","D. School schedule"],a:"C",e:"Axiom 6: DECISION-MAKING from choices of alternatives — must decide what content to teach and what METHODS OR STRATEGIES TO USE (IMs, assessment, procedure)."},
{id:92,d:"moderate",t:"Oliva's 10 Axioms",q:"Axiom 7: 'Curriculum development is an ongoing process.' This is because as needs of learners change, as society changes, and as new knowledge and technology appear, the curriculum ___.",c:["A. Should be replaced entirely","B. Must change","C. Should remain stable","D. Is kept as is"],a:"B",e:"Axiom 7: ONGOING PROCESS — as learners change, society changes, and technology appears, the curriculum MUST CHANGE — continuously reviewed, updated, improved."},
{id:93,d:"moderate",t:"Oliva's 10 Axioms",q:"Axiom 8: 'Curriculum development is more effective if it is a comprehensive process rather than a piecemeal.' A curriculum design must be based on careful planning with intended outcomes ___.",c:["A. Left open-ended","B. Determined by teachers alone","C. Clearly established","D. Based on tradition only"],a:"C",e:"Axiom 8: COMPREHENSIVE rather than piecemeal — based on careful planning with intended outcomes CLEARLY ESTABLISHED."},
{id:94,d:"moderate",t:"Oliva's 10 Axioms",q:"Axiom 9: 'Curriculum development is more effective when it follows a systematic process.' A curriculum design should always be ___.",c:["A. Flexible and unstructured","B. SMART: subject matter, procedure, resources, evaluation process","C. Based only on government requirements","D. Created from scratch each year"],a:"B",e:"Axiom 9: SYSTEMATIC PROCESS — design should always be SMART (subject matter, procedure, resources, evaluation process)."},
{id:95,d:"moderate",t:"Oliva's 10 Axioms",q:"Axiom 10: 'Curriculum development starts from where the curriculum is.' This means an existing design is a good starting point — no need to ___.",c:["A. Evaluate outcomes","B. Consult stakeholders","C. Go back to zero","D. Plan ahead"],a:"C",e:"Axiom 10: start from where the curriculum IS — an existing design is a GOOD STARTING POINT for any teacher who plans to enhance and enrich. NO BACK TO ZERO."},
{id:96,d:"moderate",t:"Components of Curriculum Design",q:"A lesson plan is considered a ___ curriculum.",c:["A. Macro","B. Mega","C. Miniscule","D. Complete"],a:"C",e:"A LESSON PLAN is considered a MINISCULE CURRICULUM — it is the smallest unit of curriculum design."},
{id:97,d:"moderate",t:"Major Components of Curriculum",q:"What does SMART stand for in relation to behavioral components/objectives?",c:["A. Simple, Manageable, Achievable, Relevant, Time-bound","B. Specific, Measurable, Attainable, Result-oriented, Time-bound","C. Systematic, Measurable, Attainable, Relevant, Terminal","D. Specific, Motivating, Achievable, Reliable, Time-bound"],a:"B",e:"Objectives should be SMART: SPECIFIC, MEASURABLE, ATTAINABLE, RESULT-ORIENTED, and TIME-BOUND (Terminal)."},
{id:98,d:"moderate",t:"Major Components of Curriculum",q:"Which major component of curriculum is the subject matter that should be relevant to the OUTCOMES of the curriculum?",c:["A. Behavioral Components","B. Teaching and Learning Methods","C. Assessment/Evaluation","D. Content/Subject Matter"],a:"D",e:"CONTENT/SUBJECT MATTER: subject matter should be RELEVANT TO THE OUTCOMES of the curriculum."},
{id:99,d:"moderate",t:"Teaching & Learning Methods",q:"Which teaching and learning activity is BEST for a DIVERSE group of students?",c:["A. Independent learning activities","B. Competitive activities","C. Cooperative learning activities","D. Direct instruction"],a:"C",e:"COOPERATIVE LEARNING ACTIVITIES: BEST for DIVERSE groups (heterogeneous). Students work together; teacher guides learners."},
{id:100,d:"moderate",t:"Teaching & Learning Methods",q:"Which learning activity is MOST appropriate for FAST LEARNERS in a homogeneous group?",c:["A. Cooperative learning activities","B. Direct instruction","C. Guided practice","D. Independent learning activities"],a:"D",e:"INDEPENDENT LEARNING ACTIVITIES: BEST for HOMOGENEOUS groups of fast learners — develops personal responsibility; degree of independence to learn."},
{id:101,d:"moderate",t:"Teaching & Learning Methods",q:"Competitive activities allow students to test their competencies, perform to their maximum, and mostly become ___.",c:["A. Better team players","B. More dependent on teachers","C. Survivors in a very competitive world","D. More academically gifted"],a:"C",e:"COMPETITIVE ACTIVITIES: mostly become SURVIVORS IN A VERY COMPETITIVE WORLD — tested in a healthy manner."},
{id:102,d:"moderate",t:"Direct Instruction",q:"Who is the proponent of Direct Instruction?",c:["A. Madeline Hunter","B. JH Block and Lorin Anderson","C. Thomas Good and Jere Brophy","D. Barak Rosenshine"],a:"D",e:"DIRECT INSTRUCTION proponent: BARAK ROSENSHINE Model — it is the traditional method of teaching."},
{id:103,d:"moderate",t:"Direct Instruction",q:"Direct Instruction begins with stating the objectives (1), review (2), presenting new materials (3), explain (4), practice (5), guide (6), check for understanding (7), provide feedback (8), assess performance (9), and ___.",c:["A. Give homework","B. Review and test (10)","C. Reteach if necessary (10)","D. Independent practice (10)"],a:"B",e:"Direct Instruction ends with: REVIEW AND TEST (10) — it has 10 steps beginning with objectives and ending with review and test."},
{id:104,d:"moderate",t:"Direct Instruction",q:"The success rate of Direct Instruction is ___.",c:["A. 100% in all settings","B. 70% during practice sessions","C. 80% or more during practice sessions","D. 75% of students must pass"],a:"C",e:"Direct Instruction success rate: 80% OR MORE DURING PRACTICE SESSIONS."},
{id:105,d:"moderate",t:"Guided Instruction",q:"Who is the proponent of Guided Instruction?",c:["A. Barak Rosenshine","B. Thomas Good and Jere Brophy","C. JH Block and Lorin Anderson","D. Madeline Hunter"],a:"D",e:"GUIDED INSTRUCTION proponent: MADELINE HUNTER MODEL."},
{id:106,d:"moderate",t:"Guided Instruction",q:"Guided Instruction begins with Review (1) of previous lesson, followed by Anticipatory Set (2) to get interest of students, and Stating of Objectives (3). Its performance is based on ___.",c:["A. Teacher observation","B. Independent practice","C. Peer assessment","D. Group work"],a:"B",e:"Guided Instruction (Madeline Hunter): performance is based on INDEPENDENT PRACTICE — ends with Independent Practice (8) where students do the task on their own."},
{id:107,d:"moderate",t:"Mastery Learning",q:"Who are the proponents of Mastery Learning?",c:["A. Barak Rosenshine","B. Thomas Good and Jere Brophy","C. JH Block and Lorin Anderson","D. Madeline Hunter"],a:"C",e:"MASTERY LEARNING proponents: JH BLOCK and LORIN ANDERSON Model."},
{id:108,d:"moderate",t:"Mastery Learning",q:"In Mastery Learning, what activity is given to the Mastery Group after the pre-test?",c:["A. Corrective Drill","B. Post-test","C. Enrichment Activity","D. Re-teaching"],a:"C",e:"MASTERY GROUP receives an ENRICHMENT ACTIVITY; NON-MASTERY GROUP receives CORRECTIVE DRILL — then a post-test is given to the Non-Mastery Group."},
{id:109,d:"moderate",t:"Mastery Learning",q:"The pre-test results in Mastery Learning are based on a score of ___.",c:["A. 100% for mastery","B. 80% based on score","C. 75% for all students","D. 90% for mastery group"],a:"B",e:"Pre-test Results: MASTERY GROUP = 80% BASED ON SCORE; Non-mastery Group is below 80%."},
{id:110,d:"moderate",t:"Mastery Learning",q:"The post-test success rate in Mastery Learning requires ___.",c:["A. 100% of students","B. At least 90% of students","C. At least 75% of students","D. At least 80% of students"],a:"C",e:"Post-test Results: AT LEAST 75% OF STUDENTS for success rate — if not successful, RETEACH."},
{id:111,d:"moderate",t:"Systematic Instruction",q:"Who are the proponents of Systematic Instruction?",c:["A. Madeline Hunter","B. JH Block and Lorin Anderson","C. Barak Rosenshine","D. Thomas Good and Jere Brophy"],a:"D",e:"SYSTEMATIC INSTRUCTION proponents: THOMAS GOOD and JERE BROPHY — it is lecture-based."},
{id:112,d:"moderate",t:"Systematic Instruction",q:"Systematic Instruction begins with ___.",c:["A. Stating the objectives","B. Presenting new materials","C. Review (using homework and previous exercises)","D. Clarification of goals"],a:"C",e:"SYSTEMATIC INSTRUCTION begins with REVIEW (using homework and previous exercises) — then Development, Assess comprehension, Seatwork, Accountability, Homework, Special reviews."},
{id:113,d:"moderate",t:"Systematic Instruction",q:"In Systematic Instruction, SEATWORK is characterized by providing ___ seatwork.",c:["A. Competitive","B. Group-based","C. Uninterrupted","D. Online"],a:"C",e:"SEATWORK in Systematic Instruction: UNINTERRUPTED seatwork — get everyone involved, sustain momentum."},
{id:114,d:"moderate",t:"Criteria for Selecting Teaching Methods",q:"ADEQUACY as a criterion for selecting teaching-learning methods refers to ___.",c:["A. Cost effectiveness","B. Chronological age of learners","C. Operational and instructional effectiveness","D. Actual learning space or classrooms (facilities)"],a:"D",e:"ADEQUACY: refers to the ACTUAL LEARNING SPACE or classrooms — space, light, ventilation, technology available (facilities)."},
{id:115,d:"moderate",t:"Criteria for Selecting Teaching Methods",q:"SUITABILITY as a criterion for selecting teaching-learning methods considers ___.",c:["A. Cost effectiveness","B. Actual learning space","C. Chronological and developmental ages of learners","D. Instructional effectiveness only"],a:"C",e:"SUITABILITY: relates to planned activities — considers CHRONOLOGICAL and DEVELOPMENTAL AGES OF LEARNERS (bagay/appropriate)."},
{id:116,d:"moderate",t:"Criteria for Selecting Teaching Methods",q:"EFFICIENCY in selecting teaching methods refers to ___.",c:["A. Cost effectiveness","B. Actual facilities","C. Learner developmental needs","D. Operational and instructional effectiveness"],a:"D",e:"EFFICIENCY: refers to OPERATIONAL and INSTRUCTIONAL EFFECTIVENESS."},
{id:117,d:"moderate",t:"Criteria for Selecting Teaching Methods",q:"ECONOMY in selecting teaching methods refers to ___.",c:["A. Number of students in class","B. Cost effectiveness","C. Instructional materials available","D. Teacher qualifications"],a:"B",e:"ECONOMY: refers to COST EFFECTIVENESS."},
{id:118,d:"moderate",t:"DepEd Orders",q:"According to DepEd Order No. 70 s. 2012, teachers with ___ teaching experience shall be required to prepare Daily Lesson Plans.",c:["A. More than 5 years","B. Less than 3 years","C. Less than 2 years","D. More than 2 years"],a:"C",e:"DepEd Order No. 70 s. 2012: Teachers with LESS THAN 2 YEARS teaching experience shall be REQUIRED to prepare DAILY LESSON PLANS. Teachers of all public schools will NOT be required to prepare detailed lesson plans."},
{id:119,d:"moderate",t:"Curriculum Design Models",q:"Subject Design stresses so much on content that it forgets students' natural tendencies, interests, and experiences. The drawback is that learning is sometimes ___.",c:["A. Too child-centered","B. Compartmentalized","C. Too problem-focused","D. Experience-based"],a:"B",e:"SUBJECT DESIGN: stresses content so much that it forgets students' natural tendencies. Drawback: learning is sometimes COMPARTMENTALIZED."},
{id:120,d:"moderate",t:"Curriculum Design Models",q:"Discipline Design refers to specific knowledge and method which scholars use to study a specific content. It moves from subject-centered to discipline when students are ___.",c:["A. In elementary school","B. Mature and moving towards their career path","C. Engaged in cooperative learning","D. Learning basic literacy skills"],a:"B",e:"DISCIPLINE DESIGN: moves from subject-centered to discipline when students are MATURE and already MOVING TOWARDS THEIR CAREER PATH or discipline."},
{id:121,d:"moderate",t:"Curriculum Design Models",q:"Correlation Design comes from a core, correlated curriculum that links separate subject designs to reduce fragmentation. Subjects are related to one another but each subject ___.",c:["A. Loses its identity","B. Is merged into one subject","C. Maintains its identity","D. Is replaced by broad fields"],a:"C",e:"CORRELATION DESIGN: links separate subject designs to reduce fragmentation — subjects related to one another but EACH SUBJECT MAINTAINS ITS IDENTITY."},
{id:122,d:"moderate",t:"Curriculum Design Models",q:"Broadfield Design (Holistic Curriculum) is made to prevent ___ of subjects and integrate contents related to each other.",c:["A. Interdisciplinary learning","B. Compartmentalization","C. Experiential learning","D. Social learning"],a:"B",e:"BROADFIELD DESIGN (Holistic Curriculum): prevents COMPARTMENTALIZATION of subjects and integrates contents that are related to each other — Social Studies and Language Arts."},
{id:123,d:"moderate",t:"Curriculum Design Models",q:"Problem-Centered Design draws on social problems, needs, interests, and abilities. Its two sub-types are ___.",c:["A. Subject design and discipline design","B. Child-centered and humanistic design","C. Life-situation design and core problem design","D. Experience-centered and broadfield design"],a:"C",e:"PROBLEM-CENTERED DESIGN sub-types: (1) LIFE-SITUATION DESIGN (uses immediate problems of society and students' existing concerns) and (2) CORE PROBLEM DESIGN (centers on general education and common human activities)."},
{id:124,d:"moderate",t:"Curriculum Mapping",q:"Curriculum Mapping is a model for ___.",c:["A. Planning lesson objectives only","B. Designing, refining, upgrading, and reviewing the curriculum","C. Selecting teaching methods","D. Evaluating teacher performance"],a:"B",e:"CURRICULUM MAPPING: a model for DESIGNING, REFINING, UPGRADING, and REVIEWING the curriculum — provides form, focus, and function."},
{id:125,d:"moderate",t:"Curriculum Mapping",q:"Curriculum Mapping addresses ___ or repetitions in the curriculum and connects all initiatives from instruction, pedagogies, assessment, and professional development.",c:["A. Student learning styles","B. Teacher salaries","C. Gaps","D. Government funding"],a:"C",e:"Curriculum Mapping: addresses GAPS or REPETITIONS in the curriculum and connects all initiatives."},
{id:126,d:"moderate",t:"Curriculum Quality Audit",q:"Curriculum Quality Audit (CQA) is a process of mapping the curricular program or syllabus against established ___.",c:["A. Teacher preferences","B. School budgets","C. Parent expectations","D. Standards"],a:"D",e:"CQA is a process of mapping the curricular program or syllabus against established STANDARDS."},
{id:127,d:"moderate",t:"Curriculum Quality Audit",q:"CQA requires a written curriculum and the tested curriculum linked to both the ___ and the ___ curricula.",c:["A. Hidden and assessed","B. Taught and written","C. Supported and recommended","D. Learned and recommended"],a:"B",e:"CQA requires: written curriculum and tested curriculum linked to both the TAUGHT and the WRITTEN CURRICULA."},
{id:128,d:"moderate",t:"Curriculum Quality Audit",q:"One purpose of CQA is to ensure alignment of learning outcomes, activities, and assessment to the standards — this is called ___.",c:["A. Formative alignment","B. Constructive alignment","C. Summative alignment","D. Vertical alignment"],a:"B",e:"CQA ensures CONSTRUCTIVE ALIGNMENT of learning outcomes, activities, and assessment to the standards."},
{id:129,d:"moderate",t:"Standards Use in CQA",q:"Philippine Professional Standards for Teachers (PPST) is Department of Education Order No. ___.",c:["A. No. 70, s. 2012","B. No. 46, s. 2016","C. No. 42, s. 2017","D. No. 74, s. 2017"],a:"C",e:"PPST = Department of Education Order No. 42, s. 2017."},
{id:130,d:"moderate",t:"Standards Use in CQA",q:"CMO 74, s. 2017 covers ___.",c:["A. Bachelor of Secondary Education","B. Bachelor of Early Childhood Education","C. Bachelor of Elementary Education","D. Bachelor of Special Needs Education"],a:"C",e:"CMO 74, S. 2017 = BEED (Bachelor of Elementary Education)."},
{id:131,d:"moderate",t:"Curriculum Implementation as Change",q:"Kurt Lewin is known as the father of ___.",c:["A. Curriculum design","B. Behavioral objectives","C. Social psychology and action research","D. Progressive education"],a:"C",e:"Kurt Lewin is the FATHER OF SOCIAL PSYCHOLOGY AND ACTION RESEARCH — his model 'Force Field Theory' explains the curriculum change process."},
{id:132,d:"moderate",t:"Curriculum Implementation as Change",q:"In Kurt Lewin's Force Field Theory, Government Intervention, Society's Value, Technological Changes, Knowledge Explosion, and Administrative Support are ___.",c:["A. Restraining forces (pull factors)","B. Balanced forces","C. Driving forces (push factors)","D. Equilibrium factors"],a:"C",e:"DRIVING FORCES (PUSH FACTORS): Government Intervention, Society's Value, Technological Changes, Knowledge Explosion, Administrative Support — they PUSH/CONTRIBUTE to change."},
{id:133,d:"moderate",t:"Curriculum Implementation as Change",q:"In Kurt Lewin's Force Field Theory, Fear of the Unknown, Negative Attitude to Change, Tradition Values, Limited Resources, and Obsolete Equipment are ___.",c:["A. Driving forces","B. Push factors","C. Equilibrium forces","D. Restraining forces (pull factors)"],a:"D",e:"RESTRAINING FORCES (PULL FACTORS): Fear of Unknown, Negative Attitude to Change, Tradition Values, Limited Resources, Obsolete Equipment — they PROHIBIT/INHIBIT change."},
{id:134,d:"moderate",t:"Categories of Curriculum Change",q:"ALTERATION as a category of curriculum change involves ___.",c:["A. Replacing the present with a completely new one","B. Responding to shift in vision/mission","C. Major modifications of the current curriculum","D. Introducing minor changes or modification on the current one"],a:"D",e:"ALTERATION: introduces MINOR CHANGES or modification on the CURRENT one — like using a ballpen instead of pencil (small change)."},
{id:135,d:"moderate",t:"Categories of Curriculum Change",q:"RESTRUCTURING as a category of curriculum change involves ___.",c:["A. Replacing the entire curriculum","B. Minor changes on the current one","C. Sudden changes within a fairly short time","D. Major modification of the current curriculum"],a:"D",e:"RESTRUCTURING: introduces MAJOR MODIFICATION of the current curriculum — from RBEC to K to R (K to 12)."},
{id:136,d:"moderate",t:"Categories of Curriculum Change",q:"PERTURBATION as a category of curriculum change is characterized by ___.",c:["A. Complete replacement of the current curriculum","B. Minor modifications","C. Sudden changes happening within a fairly short time","D. Major modification responding to vision/mission"],a:"C",e:"PERTURBATION: SUDDEN CHANGES — like online and modular learning, shortened class schedule — happening within a FAIRLY SHORT TIME."},
{id:137,d:"moderate",t:"Categories of Curriculum Change",q:"VALUE ORIENTATION as a category of curriculum change responds to ___.",c:["A. Technology changes","B. Student performance data","C. Major modifications in structure","D. Shift in emphasis within the vision/mission of the school"],a:"D",e:"VALUE ORIENTATION: responds to SHIFT IN EMPHASIS within the VISION/MISSION of the school."},
{id:138,d:"moderate",t:"Stakeholders",q:"School Leaders/Administrators play the role of ___.",c:["A. Primary movers","B. Core of the curriculum","C. Curriculum managers","D. Primary beneficiaries"],a:"C",e:"SCHOOL LEADERS/ADMINISTRATORS are the CURRICULUM MANAGERS — they check and balance."},
{id:139,d:"moderate",t:"Stakeholders",q:"Parents are considered the significant ___ of the school.",c:["A. Curriculum managers","B. Core of the curriculum","C. Primary movers","D. School partners"],a:"D",e:"PARENTS are the SIGNIFICANT SCHOOL PARTNERS."},
{id:140,d:"moderate",t:"Stakeholders",q:"The Community serves as ___.",c:["A. Primary movers of curriculum","B. Core of the curriculum","C. Curriculum resource and learning environment","D. Curriculum managers"],a:"C",e:"COMMUNITY serves as CURRICULUM RESOURCE and LEARNING ENVIRONMENT."},
{id:141,d:"moderate",t:"Stakeholders",q:"Other Stakeholders include government agencies such as ___.",c:["A. Learners and parents","B. School administrators and teachers","C. LGUs, DepEd, TESDA, CHED, PRC, CSC, and non-government agencies","D. Community organizations only"],a:"C",e:"OTHER STAKEHOLDERS: government agencies — LGUs, DepEd, TESDA, CHED, PRC, CSC and non-government agencies."},
{id:142,d:"moderate",t:"Curriculum Evaluation",q:"Curriculum Program Evaluation focuses on the OVERALL ASPECT of the curriculum. It refers to ___.",c:["A. Micro-level/specific evaluation","B. Separate evaluation of achieved learning outcomes","C. Macro-level/big curriculum program","D. Evaluation of instructional materials only"],a:"C",e:"CURRICULUM PROGRAM EVALUATION: MACRO-LEVEL — focuses on the overall aspect; refers to BIG curriculum program."},
{id:143,d:"moderate",t:"Curriculum Evaluation",q:"Curriculum Program Component Evaluation is a MICRO-LEVEL/SPECIFIC evaluation that includes separate evaluation of (a) ___, (b) curriculum process, and (c) instructional materials.",c:["A. Teacher performance","B. Achieved learning outcomes","C. School budget","D. Government compliance"],a:"B",e:"CURRICULUM PROGRAM COMPONENT EVALUATION: MICRO-LEVEL — includes (a) ACHIEVED LEARNING OUTCOMES, (b) curriculum process, and (c) instructional materials."},
{id:144,d:"moderate",t:"Process of Evaluation",q:"NEEDS ASSESSMENT as a process of evaluation identifies the ___ of an existing curriculum.",c:["A. Methods and strategies","B. Teacher qualifications","C. Strengths and weaknesses","D. Budget requirements"],a:"C",e:"NEEDS ASSESSMENT: identifies the STRENGTHS AND WEAKNESSES of an existing curriculum."},
{id:145,d:"moderate",t:"Process of Evaluation",q:"MONITORING as a process of evaluation will tell if the designed or implemented curriculum can produce or is producing the desired results — asking: ___.",c:["A. Did it work?","B. Is it working?","C. What needs to change?","D. Who should implement it?"],a:"B",e:"MONITORING: tells if the curriculum IS WORKING — 'IS IT WORKING?' (present/ongoing)."},
{id:146,d:"moderate",t:"Process of Evaluation",q:"TERMINAL ASSESSMENT guides whether the results have equaled or exceeded the standards — asking: ___.",c:["A. Is it working?","B. Who should implement it?","C. Did it work?","D. What are the weaknesses?"],a:"C",e:"TERMINAL ASSESSMENT: guides whether results equaled or exceeded standards — 'DID IT WORK?' (past/completed)."},
{id:147,d:"moderate",t:"Process of Evaluation",q:"DECISION MAKING as a process of evaluation provides information necessary for teachers, school managers, and curriculum specialists for ___.",c:["A. Creating new lesson plans","B. Setting teacher salaries","C. Policy recommendations — retain, revise, or reject","D. Updating textbooks only"],a:"C",e:"DECISION MAKING: provides information for policy recommendations — RETAIN, REVISE, OR REJECT the curriculum."},
{id:148,d:"moderate",t:"Views of Curriculum",q:"The Traditional View of curriculum is also called ___.",c:["A. Experience-centered","B. Child-centered","C. Subject-centered","D. Problem-centered"],a:"C",e:"TRADITIONAL VIEW = SUBJECT-CENTERED — focused on subject matter, disciplines, and academic content."},
{id:149,d:"moderate",t:"Views of Curriculum",q:"The Progressive View of curriculum is also called ___.",c:["A. Subject-centered","B. Discipline-centered","C. Knowledge-centered","D. Experience-centered"],a:"D",e:"PROGRESSIVE VIEW = EXPERIENCE-CENTERED — focused on learner experiences, activities, and real-world applications."},
{id:150,d:"moderate",t:"Historical Foundations",q:"Hilda Taba contributed to the theoretical and pedagogical foundations of concepts development and critical thinking in ___.",c:["A. Science curriculum","B. Social studies curriculum","C. Mathematics curriculum","D. Language curriculum"],a:"B",e:"Hilda Taba contributed to the theoretical and pedagogical foundations of concepts development and CRITICAL THINKING in SOCIAL STUDIES CURRICULUM. She helped lay the foundation for DIVERSE STUDENT POPULATION (inclusive education)."},
{id:151,d:"moderate",t:"Historical Foundations",q:"Werret Charters, like Bobbit, believed curriculum is science and emphasizes students' needs. Objectives and activities should ___.",c:["A. Be prescribed by government","B. Match: subject matter relates to objectives","C. Focus on discipline only","D. Be planned only by teachers"],a:"B",e:"Werret Charters: objectives and activities should MATCH — subject matter or content relates to objectives (O-S-A match)."},
{id:152,d:"moderate",t:"Historical Foundations",q:"Harold Rugg believed curriculum should develop the WHOLE CHILD — this approach is called ___.",c:["A. Perennialism","B. Essentialism","C. Holistic approach","D. Experimentalism"],a:"C",e:"Harold Rugg: curriculum should develop the WHOLE CHILD — HOLISTIC approach. Emphasized social studies and teacher planning curriculum in advance."},
{id:153,d:"moderate",t:"Traditional View",q:"Robert Hutchins emphasized that the 3Rs should be emphasized in basic education while ___ education should be emphasized in college.",c:["A. Technical","B. Vocational","C. Liberal","D. Professional"],a:"C",e:"Robert Hutchins: 3Rs (Reading, Writing, Arithmetic) emphasized in BASIC EDUCATION; LIBERAL EDUCATION emphasized in COLLEGE."},
{id:154,d:"moderate",t:"Traditional View",q:"Joseph Schwab coined the word '___' as a ruling doctrine for curriculum development.",c:["A. Experience","B. Generalist","C. Permanence","D. Discipline"],a:"D",e:"Joseph Schwab coined DISCIPLINE as a ruling doctrine for curriculum development. Academic disciplines in college include humanities, sciences, languages, mathematics."},
{id:155,d:"moderate",t:"Progressive View",q:"Othaniel Smith, William Stanley, and Harlan Shore defined curriculum as a sequence of potential experiences, set up in schools for the purpose of disciplining children and youth in ___ ways of thinking and acting.",c:["A. Individual","B. Group","C. Cultural","D. Academic"],a:"B",e:"Smith, Stanley, and Shore: curriculum as a sequence of potential experiences for disciplining children and youth in GROUP ways of thinking and acting."},
{id:156,d:"moderate",t:"Curriculum as Process",q:"Differentiating Process refers to ACTIVITIES that students engage in to understand and master the topic. An example of this is ___.",c:["A. Using textbooks of various reading levels","B. Assigning projects of different complexity","C. Using direct instruction for one group while group work for another","D. Allowing students to choose their output format"],a:"C",e:"DIFFERENTIATING PROCESS: using DIRECT INSTRUCTION in one group while GROUP WORK for another — activities differ based on learners' needs."},
{id:157,d:"moderate",t:"Curriculum Mapping",q:"Curriculum Mapping connects all initiatives from instruction, pedagogies, assessment, and professional development. It provides answers to what is TAUGHT, HOW IT IS TAUGHT, and HOW IT IS ___.",c:["A. Planned","B. Written","C. Assessed","D. Funded"],a:"C",e:"Curriculum Mapping answers: what is taught, HOW IT IS TAUGHT, and HOW IT IS ASSESSED — providing form, focus, and function."},
{id:158,d:"moderate",t:"Standards in CQA",q:"CMO 75, s. 2017 covers Bachelor of Secondary Education with majors in English, Mathematics, Science, Filipino, Social Studies, and ___.",c:["A. Physical Education","B. Music and Arts","C. Values Education","D. Technology and Livelihood"],a:"C",e:"CMO 75, S. 2017 = BSED with majors in English, Mathematics, Science, Filipino, Social Studies, VALUES EDUCATION."},
{id:159,d:"moderate",t:"Standards in CQA",q:"CMO 83, s. 2017 covers ___.",c:["A. Bachelor of Culture of Arts Education","B. Bachelor of Physical Education","C. Bachelor of Special Needs Education","D. Post-Baccalaureate Diploma in Alternative Learning System"],a:"D",e:"CMO 83, S. 2017 = POST-BACCALAUREATE DIPLOMA IN ALTERNATIVE LEARNING SYSTEM (ALS)."},
{id:160,d:"moderate",t:"Sociological Foundations",q:"Paolo Freire emphasized that teachers use ___ and ___ approach to raise students' consciousness.",c:["A. Lecture and memorization","B. Questioning and problem posing","C. Direct instruction and drill","D. Cooperative and independent learning"],a:"B",e:"Paolo Freire: teachers use QUESTIONING and PROBLEM POSING approach to raise students' consciousness — Critical Pedagogy/conscientization/dialogue."},

// ══════════════ DIFFICULT (161-200) ══════════════
{id:161,d:"difficult",t:"Definitions & Types",q:"A teacher says: 'My curriculum goes beyond textbooks — I include community service, guest speakers, nature walks, and even students' personal reflections.' Which perspective does this BEST represent?",c:["A. Traditional definition — ordinary and limited","B. Progressive definition — sum total of all experiences inside and outside school","C. Recommended curriculum from government agencies","D. Taught curriculum emphasizing teacher skills"],a:"B",e:"PROGRESSIVE DEFINITION: curriculum as the SUM TOTAL OF ALL LEARNING EXPERIENCES INSIDE AND OUTSIDE the school — enriched and broad, including community and experiential activities."},
{id:162,d:"difficult",t:"Types of Curricula",q:"A student says: 'I learned that being late is acceptable because no teacher ever addresses it, even though the school rule says otherwise.' This is an example of the ___ curriculum.",c:["A. Assessed curriculum","B. Supported curriculum","C. Hidden/Implicit curriculum","D. Recommended curriculum"],a:"C",e:"HIDDEN/IMPLICIT (UNPLANNED) CURRICULUM: the unwritten curriculum — school environment and unspoken norms shape student behavior even without formal instruction."},
{id:163,d:"difficult",t:"Three Ways — Differentiation",q:"A teacher notices that some students are struggling with fractions. She gives them visual manipulatives while advanced students work with abstract problems. This BEST illustrates differentiating ___.",c:["A. Product","B. Process","C. Assessment","D. Content"],a:"D",e:"DIFFERENTIATING CONTENT: defines essential principles and ADJUSTS COMPLEXITY OF INFORMATION as needed — visual manipulatives for struggling students, abstract for advanced students."},
{id:164,d:"difficult",t:"Three Ways — Differentiation",q:"A teacher assigns some students to write an essay, others to create a video, and others to build a model to demonstrate their learning. This BEST illustrates differentiating ___.",c:["A. Process","B. Content","C. Environment","D. Product"],a:"D",e:"DIFFERENTIATING PRODUCT: can take the form of exams, activities, projects, written work, etc. — allows teachers to construct lessons RELEVANT AND CUSTOMIZED to any learner by modifying depth, amount, or independence."},
{id:165,d:"difficult",t:"Curriculum Development Models",q:"A curriculum committee starts by analyzing what students need, then formulates objectives before selecting content. This follows which curriculum development model?",c:["A. Ralph Tyler's Top-down Model","B. Saylor and Alexander's GOD Model","C. Hilda Taba's Grassroots/Bottom-up Model","D. Peter Oliva's Cooperative Model"],a:"C",e:"HILDA TABA's GRASSROOTS/BOTTOM-UP model starts with DIAGNOSIS OF LEARNERS' NEEDS — inductive, specific to general. Teachers are most important."},
{id:166,d:"difficult",t:"Curriculum Development Models",q:"A school principal mandates all teachers to follow a pre-designed curriculum aligned to government objectives without teacher input in designing it. This follows which model?",c:["A. Hilda Taba's grassroots approach","B. Peter Oliva's cooperative endeavor","C. Ralph Tyler's top-down/deductive model","D. Saylor and Alexander's cooperative model"],a:"C",e:"RALPH TYLER's TOP-DOWN (DEDUCTIVE) MODEL: objective-centered, general to specific — emphasizes PLANNING PHASE. Top management prescribes; teachers implement."},
{id:167,d:"difficult",t:"Oliva's Axioms Applied",q:"A new principal wants to replace the entire curriculum from scratch. A curriculum consultant advises against this, citing Axiom ___.",c:["A. Axiom 5 — cooperative group activity","B. Axiom 7 — ongoing process","C. Axiom 10 — starts from where the curriculum is","D. Axiom 4 — depends on people who implement"],a:"C",e:"AXIOM 10: curriculum development starts from WHERE THE CURRICULUM IS — an EXISTING DESIGN is a good starting point. NO BACK TO ZERO."},
{id:168,d:"difficult",t:"Oliva's Axioms Applied",q:"A school implements a new reading program but old reading program materials are still being used alongside new ones. This exemplifies Axiom ___.",c:["A. Axiom 1 — change is inevitable","B. Axiom 3 — changes made earlier can coexist with newer changes","C. Axiom 8 — comprehensive process","D. Axiom 10 — starts from where curriculum is"],a:"B",e:"AXIOM 3: Curriculum changes made earlier can EXIST CONCURRENTLY WITH NEWER curriculum changes — revision starts and ends slowly."},
{id:169,d:"difficult",t:"Principles of Curriculum Content",q:"A teacher connects Math concepts to Science and Social Studies in one lesson. Which principle of curriculum content is BEST exemplified?",c:["A. Sequence","B. Scope","C. Integration","D. Continuity"],a:"C",e:"INTEGRATION: curriculum is INTEGRATED and INTERCONNECTED — TWO OR MORE SUBJECTS are connected. Relates to interdisciplinary and transdisciplinary approaches."},
{id:170,d:"difficult",t:"Principles of Curriculum Content",q:"A school ensures that Grade 3 topics on plants connect directly to Grade 4 topics on ecosystems, with no gaps or repetitions. This exemplifies ___.",c:["A. Horizontal Alignment","B. Balance","C. Sequence","D. Vertical Alignment / Articulation"],a:"D",e:"VERTICAL ALIGNMENT (under ARTICULATION): content in a lower level is CONNECTED TO THE NEXT LEVEL — what students learn in one grade PREPARES them for the next. No gaps, no overlaps."},
{id:171,d:"difficult",t:"Teaching & Learning Methods Applied",q:"A teacher groups students randomly, assigning different roles in solving a math problem. Students of varying abilities work together. Which teaching method is MOST appropriate here?",c:["A. Independent learning activities","B. Competitive activities","C. Direct instruction","D. Cooperative learning activities"],a:"D",e:"COOPERATIVE LEARNING ACTIVITIES: BEST for DIVERSE/HETEROGENEOUS groups — students guided to work together; teacher guides learners (facilitator role)."},
{id:172,d:"difficult",t:"Teaching & Learning Methods Applied",q:"A teacher gives advanced students self-directed projects with minimal guidance, allowing them to explore topics at their own pace. Which method is MOST appropriate?",c:["A. Cooperative learning activities","B. Competitive activities","C. Independent learning activities","D. Direct instruction"],a:"C",e:"INDEPENDENT LEARNING ACTIVITIES: BEST for HOMOGENEOUS groups of FAST LEARNERS — develops PERSONAL RESPONSIBILITY; appropriate for fast, capable learners."},
{id:173,d:"difficult",t:"Instruction Models Applied",q:"A teacher begins by reviewing previous lessons using homework, then develops the lesson, asks comprehension questions, gives seatwork, checks student work, assigns homework, and provides weekly reviews. Which instructional model is this?",c:["A. Direct Instruction (Rosenshine)","B. Guided Instruction (Madeline Hunter)","C. Mastery Learning (Block & Anderson)","D. Systematic Instruction (Good & Brophy)"],a:"D",e:"SYSTEMATIC INSTRUCTION (THOMAS GOOD & JERE BROPHY): begins with Review (homework & previous exercises), then Development, Assess comprehension, Seatwork, Accountability, Homework, Special reviews. Provides WEEKLY REVIEWS."},
{id:174,d:"difficult",t:"Instruction Models Applied",q:"A teacher gives a pre-test, separates the mastery group for enrichment, and gives the non-mastery group corrective drills, then a post-test — retesting until 75% success. This is ___.",c:["A. Direct Instruction","B. Systematic Instruction","C. Mastery Learning","D. Guided Instruction"],a:"C",e:"MASTERY LEARNING (JH BLOCK & LORIN ANDERSON): pre-test → Mastery Group (Enrichment) / Non-Mastery Group (Corrective Drill) → Post-test for Non-Mastery Group → Reteach if not successful. Post-test: AT LEAST 75%."},
{id:175,d:"difficult",t:"Instruction Models Applied",q:"A teacher begins the class with REVIEW of previous lesson, then motivates students with an ANTICIPATORY SET, states OBJECTIVES, provides INPUT, uses MODELING, checks UNDERSTANDING, gives GUIDED PRACTICE, and finally INDEPENDENT PRACTICE. This is ___.",c:["A. Systematic Instruction","B. Mastery Learning","C. Guided Instruction (Madeline Hunter)","D. Direct Instruction (Rosenshine)"],a:"C",e:"GUIDED INSTRUCTION (MADELINE HUNTER MODEL): Review (1) → Anticipatory Set (2) → Stating Objectives (3) → Input (4) → Modeling (5) → Check for Understanding (6) → Guided Practice (7) → Independent Practice (8). Performance based on INDEPENDENT PRACTICE."},
{id:176,d:"difficult",t:"Curriculum Design Models Applied",q:"A school develops a curriculum by bringing together Math, Science, English, and Social Studies concepts under a unified theme of 'Sustainability.' This is an example of ___.",c:["A. Subject Design","B. Discipline Design","C. Correlation Design","D. Broadfield Design"],a:"D",e:"BROADFIELD DESIGN (HOLISTIC CURRICULUM): integrates contents related to each other — prevents COMPARTMENTALIZATION. Combines Social Studies, Language Arts, etc. under unified themes."},
{id:177,d:"difficult",t:"Curriculum Design Models Applied",q:"A school links Math and Science in one curriculum design, allowing subjects to relate to each other while each subject retains its own identity. This is ___.",c:["A. Broadfield design","B. Subject design","C. Core problem design","D. Correlation design"],a:"D",e:"CORRELATION DESIGN: links separate subject designs to REDUCE FRAGMENTATION — subjects RELATED TO ONE ANOTHER but EACH SUBJECT MAINTAINS ITS IDENTITY."},
{id:178,d:"difficult",t:"Curriculum Design Models Applied",q:"A Grade 12 curriculum focuses on students' specializations in STEM, ABM, HUMSS, etc., where students engage with knowledge specific to their chosen field. This BEST reflects ___.",c:["A. Child-centered design","B. Core problem design","C. Broadfield design","D. Discipline design"],a:"D",e:"DISCIPLINE DESIGN: specific knowledge and method scholars use to study specific content — moves HIGHER from subject-centered when students are MATURE and MOVING TOWARDS CAREER PATH/DISCIPLINE."},
{id:179,d:"difficult",t:"Force Field Theory Applied",q:"A school wants to implement a new technology-based curriculum. Teachers are resistant because of fear of the unknown and lack of training. In Kurt Lewin's Force Field Theory, this resistance is a ___.",c:["A. Driving force","B. Push factor","C. Restraining force","D. Contributing factor"],a:"C",e:"RESTRAINING FORCES (PULL FACTORS): Fear of the Unknown, Negative Attitude to Change — they PROHIBIT/INHIBIT curriculum change. Must be overcome for change to happen."},
{id:180,d:"difficult",t:"Categories of Curriculum Change Applied",q:"During the pandemic, DepEd shifted from face-to-face to online and modular distance learning within weeks. This is an example of which category of curriculum change?",c:["A. Restructuring","B. Alteration","C. Value Orientation","D. Perturbation"],a:"D",e:"PERTURBATION: SUDDEN CHANGES that happen within a FAIRLY SHORT TIME — like online/modular learning, shortened class schedule. The pandemic shift is a classic example."},
{id:181,d:"difficult",t:"Categories of Curriculum Change Applied",q:"The shift from RBEC (Revised Basic Education Curriculum) to the K to 12 Basic Education Program represents which category of curriculum change?",c:["A. Substitution","B. Alteration","C. Value Orientation","D. Restructuring"],a:"D",e:"RESTRUCTURING: introduces MAJOR MODIFICATION of the current curriculum — FROM RBEC TO K TO R (K to 12) is a classic example of RESTRUCTURING."},
{id:182,d:"difficult",t:"Evaluation Processes Applied",q:"A curriculum team conducts a survey before implementing a new program to find out what is already working and what needs improvement. This is ___.",c:["A. Terminal assessment","B. Monitoring","C. Decision making","D. Needs assessment"],a:"D",e:"NEEDS ASSESSMENT: identifies the STRENGTHS AND WEAKNESSES of an EXISTING curriculum — conducted BEFORE or to assess current state."},
{id:183,d:"difficult",t:"Evaluation Processes Applied",q:"During implementation of a new curriculum, the principal conducts classroom visits and reviews teacher logs weekly to check if the desired results are being produced. This is ___.",c:["A. Terminal assessment","B. Decision making","C. Monitoring","D. Needs assessment"],a:"C",e:"MONITORING: tells if the DESIGNED or IMPLEMENTED curriculum CAN PRODUCE or IS PRODUCING the DESIRED RESULTS — IS IT WORKING? (ongoing)."},
{id:184,d:"difficult",t:"Stakeholders Applied",q:"A school's curriculum team consists of teachers, department heads, the principal, and parents. The TEACHERS in this team function as ___.",c:["A. Curriculum managers","B. Primary beneficiaries","C. School partners","D. Curricularists who plan, design, teach, implement, and evaluate"],a:"D",e:"TEACHERS are PRIMARY MOVERS — CURRICULARISTS who PLAN, DESIGN, TEACH, IMPLEMENT, and EVALUATE the curriculum."},
{id:185,d:"difficult",t:"Stakeholders Applied",q:"A school holds a townhall meeting where parents, local officials, and NGOs are asked for input on the new curriculum. The participation of local officials and NGOs represents which stakeholder group?",c:["A. School Leaders/Administrators","B. Community","C. Other Stakeholders (LGUs, DepEd, CHED, non-government agencies)","D. Parents"],a:"C",e:"OTHER STAKEHOLDERS: government agencies (LGUs, DepEd, TESDA, CHED, PRC, CSC) and NON-GOVERNMENT AGENCIES — they provide broader societal and policy perspectives."},
{id:186,d:"difficult",t:"Curriculum Quality Audit Applied",q:"A school maps its K–12 curriculum against PPST standards to check if all outcomes are covered, no topics are repeated unnecessarily, and learning activities align with assessments. This is ___.",c:["A. Curriculum Development","B. Curriculum Mapping only","C. Curriculum Quality Audit (CQA)","D. Terminal Assessment"],a:"C",e:"CURRICULUM QUALITY AUDIT (CQA): mapping the curricular program/syllabus against ESTABLISHED STANDARDS — identifies gaps, underrepresentation, ensures constructive alignment, achieves internationally comparable curriculum."},
{id:187,d:"difficult",t:"Instruction Models — Comparative",q:"A student says: 'My teacher always starts with a fun activity that catches my attention, then explains the lesson, demonstrates it, and lets me practice on my own.' Which model is the teacher using?",c:["A. Systematic Instruction","B. Mastery Learning","C. Direct Instruction","D. Guided Instruction (Madeline Hunter)"],a:"D",e:"GUIDED INSTRUCTION (Madeline Hunter): Review → ANTICIPATORY SET (gets interest/motivation) → Objectives → Input → MODELING (demonstration) → Check Understanding → Guided Practice → INDEPENDENT PRACTICE (students do on their own)."},
{id:188,d:"difficult",t:"Foundations — Applied",q:"A teacher says: 'Students don't just need academic content — they need to be critical thinkers, active citizens, and agents of social change.' This educator is MOST aligned with which educational thinker?",c:["A. Robert Hutchins — Perennialism","B. Arthur Bestor — Intellectual Training","C. Paolo Freire — Critical Pedagogy","D. Philip Phenix — Knowledge from Disciplines"],a:"C",e:"PAOLO FREIRE — CRITICAL PEDAGOGY: education as a means of shaping the PERSON AND SOCIETY through critical reflections, conscientization, questioning, and problem posing. Creates CRITICAL THINKERS, ACTIVE CITIZENS, and AGENTS OF SOCIAL CHANGE."},
{id:189,d:"difficult",t:"Traditional vs. Progressive Applied",q:"A teacher strictly follows a textbook, focuses on grammar, math, and logic, and prepares students for standardized college entrance exams. This teacher's philosophy MOST aligns with ___.",c:["A. John Dewey — Progressive View","B. Hollis Caswell — Experience-centered","C. Robert Hutchins — Traditional/Perennialist View","D. Harold Rugg — Holistic approach"],a:"C",e:"ROBERT HUTCHINS — PERENNIALISM (Traditional View): curriculum as PERMANENT STUDIES emphasizing grammar, reading, rhetoric, logic, and math. 3Rs in basic ed; Liberal Education in college."},
{id:190,d:"difficult",t:"Historical Foundations — Applied",q:"A curriculum team uses cooperative planning where BOTH the teacher AND students design activities together. This approach is credited to ___.",c:["A. Hilda Taba","B. Ralph Tyler","C. Hollis Caswell","D. William Kilpatrick"],a:"D",e:"WILLIAM KILPATRICK: introduced the PROJECT METHOD where TEACHER AND STUDENT PLAN THE ACTIVITIES TOGETHER — curricula are PURPOSEFUL ACTIVITIES which are child-centered and develop social relationships."},
{id:191,d:"difficult",t:"Comprehensive Integration",q:"A teacher integrates Math and Science in a lesson, uses cooperative learning for diverse students, ensures content connects to Grade 4 topics, and evaluates using rubrics of varying complexity. Which COMBINATION of curriculum concepts is demonstrated?",c:["A. Scope, Sequence, Continuity","B. Integration, Cooperative learning, Vertical Alignment, Differentiated Product","C. Broadfield, Direct Instruction, Balance, Scope","D. Correlation, Independent learning, Horizontal Alignment, Mastery Learning"],a:"B",e:"INTEGRATION (Math+Science), COOPERATIVE LEARNING (diverse students), VERTICAL ALIGNMENT (connects to Grade 4), DIFFERENTIATED PRODUCT (rubrics of varying complexity) — these four curriculum concepts are simultaneously demonstrated."},
{id:192,d:"difficult",t:"Oliva's Axioms — Deep Application",q:"A curriculum team is consulting teachers, parents, administrators, and community members before finalizing the new science curriculum. Which TWO axioms are MOST directly applied?",c:["A. Axiom 1 and Axiom 10","B. Axiom 3 and Axiom 9","C. Axiom 4 and Axiom 5","D. Axiom 7 and Axiom 8"],a:"C",e:"AXIOM 4: change depends on TEACHERS (who implement) — teachers should design and OWN the changes. AXIOM 5: COOPERATIVE GROUP ACTIVITY — consultations with STAKEHOLDERS add a SENSE OF OWNERSHIP."},
{id:193,d:"difficult",t:"Evaluation — Deep Analysis",q:"After three years of implementing the K–12 program, the government evaluates whether the program's overall goals have been met, reviewing all components nationally. This is ___.",c:["A. Curriculum Program Component Evaluation (micro-level)","B. Monitoring (ongoing process check)","C. Curriculum Program Evaluation (macro-level)","D. Needs Assessment"],a:"C",e:"CURRICULUM PROGRAM EVALUATION: MACRO-LEVEL — focuses on the OVERALL ASPECT of the curriculum; refers to BIG curriculum program. National-level review of K-12 overall goals = macro-level."},
{id:194,d:"difficult",t:"Curriculum Change — Complex",q:"A school adopts a new grading system, gradually introducing it while continuing to use the old system for currently enrolled students until they graduate. This exemplifies ___.",c:["A. Axiom 1 — change is inevitable","B. Restructuring — major modification","C. Axiom 3 — earlier changes coexisting with newer changes","D. Perturbation — sudden change in short time"],a:"C",e:"AXIOM 3: curriculum changes made earlier CAN EXIST CONCURRENTLY WITH NEWER curriculum changes — REVISION STARTS AND ENDS SLOWLY. Old and new systems coexist during transition."},
{id:195,d:"difficult",t:"Design Models — Deep",q:"A curriculum designer says: 'Our curriculum needs to solve real-world community issues. Students will tackle actual local problems like waste management, food security, and poverty.' This BEST describes ___.",c:["A. Subject design","B. Experience-centered design","C. Life-situation design (Problem-centered)","D. Humanistic design"],a:"C",e:"LIFE-SITUATION DESIGN (Problem-centered): uses the IMMEDIATE PROBLEMS OF THE SOCIETY and the students' EXISTING CONCERNS — connects curriculum to real-world community issues."},
{id:196,d:"difficult",t:"Comprehensive — Views and Foundations",q:"Which pairing of educator and their KEY CONTRIBUTION is INCORRECT?",c:["A. Franklin Bobbit — First to start curriculum development movement; curriculum prepares for adult life","B. Alvin Toffler — Wrote Future Shock; knowledge should prepare students for the future","C. Peter Oliva — Grassroots approach; teachers are most important","D. Hollis Caswell — Curriculum as social functions; curriculum, instruction, and learning are interrelated"],a:"C",e:"INCORRECT PAIRING: Peter Oliva is NOT associated with the Grassroots Approach — that is HILDA TABA. Peter Oliva described curriculum change as a COOPERATIVE ENDEAVOR where teachers and curriculum specialists constitute the professional CORE OF PLANNERS, with significant improvement through GROUP ACTIVITY."},
{id:197,d:"difficult",t:"Comprehensive — Instruction Models",q:"Which statement CORRECTLY differentiates Direct Instruction from Mastery Learning?",c:["A. Both begin with clarification of goals","B. Direct Instruction uses pre-tests while Mastery Learning uses objectives","C. Direct Instruction is teacher-led (Rosenshine) with 10 steps; Mastery Learning (Block & Anderson) uses pre/post tests with mastery and non-mastery groupings","D. Mastery Learning has a success rate of 80% during practice while Direct Instruction requires 75% of students to pass"],a:"C",e:"DIRECT INSTRUCTION (Rosenshine): 10-step teacher-led method, 80%+ success during practice. MASTERY LEARNING (Block & Anderson): begins with goals, pre-test, mastery/non-mastery groups, post-test, reteach if needed — 75% of students for success rate."},
{id:198,d:"difficult",t:"Force Field Theory — Deep",q:"A school district wants to implement e-learning. Government intervention, society's tech adoption, and administrative support are strong, but teachers fear technology and have limited resources. According to Force Field Theory, for change to happen ___.",c:["A. Only driving forces matter; restraining forces are irrelevant","B. Driving forces and restraining forces must both be eliminated","C. Driving forces must STRENGTHEN and/or restraining forces must WEAKEN to DISTURB BALANCE","D. The curriculum must first be completely replaced"],a:"C",e:"KURT LEWIN's FORCE FIELD THEORY: for CHANGE (disturbing the balance) — DRIVING FORCES (push) must be STRONGER and/or RESTRAINING FORCES (pull) must be WEAKER. Both forces work on the balance — pushing vs. inhibiting."},
{id:199,d:"difficult",t:"Comprehensive — All Topics",q:"A curriculum team uses Taba's 7-step model, follows Oliva's Axiom 5, applies BASICS principles, and designs the curriculum to address local community problems. Which COMBINATION is correctly described?",c:["A. Top-down approach; cooperative group activity; Balance, Articulation, Sequence; Subject design","B. Bottom-up approach; stakeholder consultation; Balance, Articulation, Sequence, Integration, Continuity, Scope; Life-situation design","C. Deductive approach; cooperative activity; Scope and Sequence only; Core problem design","D. Linear model; stakeholder consultation; Integration and Continuity; Experience-centered design"],a:"B",e:"TABA = BOTTOM-UP/GRASSROOTS; AXIOM 5 = stakeholder consultation (cooperative group); BASICS = Balance, Articulation, Sequence, Integration, Continuity, Scope; local community problems = LIFE-SITUATION DESIGN (Problem-centered). All four correctly described in Option B."},
{id:200,d:"difficult",t:"Comprehensive — Ultimate Integration",q:"Which statement MOST COMPREHENSIVELY captures the relationship between curriculum DEVELOPMENT, DESIGN, IMPLEMENTATION, and EVALUATION?",c:["A. They are separate, independent stages with no connection to each other","B. Development is only for curriculum specialists; design and implementation are for teachers; evaluation is for administrators","C. They are four sequential but interconnected phases: Planning→Designing→Implementing→Evaluating, forming a dynamic cycle where evaluation feeds back into planning","D. Evaluation is optional if implementation was successful"],a:"C",e:"Curriculum development is a DYNAMIC PROCESS: PLANNING (initial step, written documents) → DESIGNING (selection/organization) → IMPLEMENTING (putting into action AFTER planning) → EVALUATING (FOLLOWS implementation, determines achievement of learning outcomes). These four phases form an INTERCONNECTED CYCLE — evaluation feeds back into the next planning phase."},

];
const CURRICULUM_100 = [

// ══════════════ EASY (1-30) ══════════════
{id:1,d:"easy",t:"Definitions of Curriculum",
 q:"According to the TRADITIONAL definition, curriculum is described as 'planned learning experiences' and a 'list of subjects and courses.' These descriptions suggest curriculum is ___.",
 c:["A. Broad and outside the classroom","B. Ordinary and limited — inside the school/classroom","C. Enriched by real-life experiences","D. Directed by the learner's interests"],
 a:"B",e:"Traditional definitions are ORDINARY and LIMITED — confined inside the school and classroom. The progressive view is enriched and broad."},

{id:2,d:"easy",t:"Types of Curricula",
 q:"The Recommended Curriculum is described as 'ideal' and 'proposed.' It comes from government agencies such as TESDA, CHED, and UNESCO in the form of ___.",
 c:["A. Lesson plans and syllabi","B. Assessment tools and rubrics","C. Memoranda, policies, standards, and guidelines","D. Textbooks and modules"],
 a:"C",e:"RECOMMENDED CURRICULUM = recommendations in the form of MEMORANDA, POLICY, STANDARDS, and GUIDELINES from government agencies like TESDA, CHED, UNESCO."},

{id:3,d:"easy",t:"Types of Curricula",
 q:"The Learned Curriculum is measured by tools in assessment which can indicate cognitive, affective, and psychomotor outcomes. In the reviewer, these are noted as ___.",
 c:["A. Knowledge, Values, Skills","B. Goals, Objectives, Domains","C. Input, Process, Output","D. Content, Methods, Evaluation"],
 a:"A",e:"LEARNED CURRICULUM: cognitive = KNOWLEDGE, affective = VALUES, psychomotor = SKILLS."},

{id:4,d:"easy",t:"Roles of a Curricularist",
 q:"Which role of a curricularist requires the OPEN MINDEDNESS of the teacher and the full belief that the curriculum will enhance learning?",
 c:["A. Innovator","B. Planner","C. Initiator","D. Knower"],
 a:"C",e:"INITIATOR: implementation of a new curriculum requires the OPEN MINDEDNESS of the teacher and the full belief that the curriculum will enhance learning."},

{id:5,d:"easy",t:"Roles of a Curricularist",
 q:"A teacher who records knowledge, concepts, subject matter, or content of the curriculum and uses research books, notes, and plug-ins is playing the role of ___.",
 c:["A. Evaluator","B. Planner","C. Initiator","D. Writer"],
 a:"D",e:"WRITER: a classroom teacher takes/records knowledge, concepts, subject matter or content — uses research books, notes, plug-ins as record."},

{id:6,d:"easy",t:"Factors in Planning",
 q:"The five factors to consider in planning a curriculum include: the learner, support materials, time, subject matter or content, and ___.",
 c:["A. Teacher qualifications","B. The desired outcomes","C. Government mandates","D. Class size"],
 a:"B",e:"The 5 Factors in Planning a Curriculum: (1) The learner, (2) Support materials, (3) Time, (4) Subject matter or content, (5) THE DESIRED OUTCOMES."},

{id:7,d:"easy",t:"Traditional View — Proponents",
 q:"Robert Hutchins is associated with PERENNIALISM. He believed the 3Rs (Reading, Writing, Arithmetic) should be emphasized in ___.",
 c:["A. College education","B. Graduate school","C. Basic education","D. Vocational training"],
 a:"C",e:"Robert Hutchins — Perennialism: 3Rs should be emphasized in BASIC EDUCATION while LIBERAL EDUCATION should be emphasized in college."},

{id:8,d:"easy",t:"Traditional View — Proponents",
 q:"Arthur Bestor's key belief is that the mission of the school should be INTELLECTUAL TRAINING, which includes Math, Science, History, and ___.",
 c:["A. Physical Education","B. Foreign Language","C. Values Education","D. Music and Arts"],
 a:"B",e:"Arthur Bestor — Intellectual Training: mission of school = intellectual training which includes MATH, SCIENCE, HISTORY, and FOREIGN LANGUAGE."},

{id:9,d:"easy",t:"Progressive View — Proponents",
 q:"Hollis Caswell and Kenn Campbell viewed curriculum as all experiences children have under the guidance of teachers. This falls under the ___.",
 c:["A. Traditional/Subject-centered view","B. Discipline-focused view","C. Progressive/Experience-centered view","D. Perennialist view"],
 a:"C",e:"Caswell & Campbell = PROGRESSIVE/EXPERIENCE-CENTERED VIEW — curriculum as all experiences under TEACHER GUIDANCE."},

{id:10,d:"easy",t:"Three Ways of Approaching Curriculum",
 q:"'Curriculum as a Content or Body of Knowledge' uses the letter K in the reviewer. Its FOCUS is on ___.",
 c:["A. How to teach","B. Output of learners","C. What to teach","D. Learning activities"],
 a:"C",e:"CURRICULUM AS CONTENT (K): Focus = WHAT TO TEACH — the knowledge to be transmitted."},

{id:11,d:"easy",t:"Principles of Curriculum Content",
 q:"Which principle of curriculum content refers to the SMOOTH CONNECTIONS between grade levels — no overlapping?",
 c:["A. Sequence","B. Scope","C. Continuity","D. Articulation"],
 a:"D",e:"ARTICULATION: curriculum arranged vertically or horizontally with SMOOTH CONNECTIONS — no overlapping between grade levels."},

{id:12,d:"easy",t:"Four Phases of Curriculum Development",
 q:"The END PRODUCT of the PLANNING PHASE in curriculum development is a ___.",
 c:["A. Completed assessment tool","B. Written document (lesson plan, unit plan, syllabus, etc.)","C. Trained teaching staff","D. Set of implemented activities"],
 a:"B",e:"PLANNING PHASE end product = a WRITTEN DOCUMENT — examples: lesson plans, unit plans, syllabi, course design, modules, books, instructional guides."},

{id:13,d:"easy",t:"Curriculum Development Models",
 q:"Ralph Tyler's model emphasizes which phase of curriculum development?",
 c:["A. Evaluating","B. Designing","C. Implementing","D. Planning"],
 a:"D",e:"Ralph Tyler's model (Tyler's Rationale/Linear Model) emphasizes the PLANNING PHASE — it is objective-centered and top-down."},

{id:14,d:"easy",t:"Curriculum Development Models",
 q:"Hilda Taba's approach starts from the bottom — from the specific to the general. This is called the ___ approach.",
 c:["A. Top-down/Deductive","B. Linear/Objective-centered","C. Grassroots/Bottom-up/Inductive","D. Cooperative/Stakeholder"],
 a:"C",e:"Hilda Taba = GRASSROOTS / BOTTOM-UP / INDUCTIVE approach — specific to general. TEACHERS are most important."},

{id:15,d:"easy",t:"Historical Foundations",
 q:"Franklin Bobbit was the FIRST person to start the curriculum development movement. He believed curriculum is a SCIENCE that ___.",
 c:["A. Focuses on discipline and academic training","B. Emphasizes students' needs and prepares them for adult life","C. Views learning as experiencing through reflective thinking","D. Centers on social functions and learners' interests"],
 a:"B",e:"Franklin Bobbit (FIRST): curriculum is a science that EMPHASIZES STUDENTS' NEEDS and PREPARES LEARNERS FOR ADULT LIFE."},

{id:16,d:"easy",t:"Historical Foundations",
 q:"Harold Rugg believed curriculum should develop the WHOLE CHILD. He also emphasized social studies and suggested that the teacher ___.",
 c:["A. Follows student interests exclusively","B. Uses project method with students","C. Plans curriculum in advance","D. Focuses on discipline as sole source"],
 a:"C",e:"Harold Rugg: curriculum develops the WHOLE CHILD (holistic); emphasized SOCIAL STUDIES; teacher PLANS CURRICULUM IN ADVANCE."},

{id:17,d:"easy",t:"Sociological Foundations",
 q:"In the sociological foundations of curriculum, which of the following serves as an AGENT OF CHANGE?",
 c:["A. Textbooks","B. Schools","C. Lesson plans","D. Syllabi"],
 a:"B",e:"Sociological foundations: Society = SOURCE of change; SCHOOLS = AGENTS OF CHANGE; Knowledge = agent of change."},

{id:18,d:"easy",t:"Sociological Foundations",
 q:"Alvin Toffler believed that knowledge should prepare students for the future. His view is captured in three words: ___.",
 c:["A. Think, Rethink, Unthink","B. Know, Apply, Create","C. Learn, Relearn, Unlearn","D. Study, Practice, Evaluate"],
 a:"C",e:"Alvin Toffler (Future Shock): the future is about LEARN, RELEARN, and UNLEARN."},

{id:19,d:"easy",t:"Curriculum Design Models",
 q:"Which curriculum design is described as HOLISTIC — made to prevent compartmentalization of subjects and integrate contents related to each other?",
 c:["A. Correlation design","B. Subject design","C. Discipline design","D. Broadfield design"],
 a:"D",e:"BROADFIELD DESIGN (Holistic Curriculum): prevents COMPARTMENTALIZATION and INTEGRATES contents related to each other (Social Studies and Language Arts)."},

{id:20,d:"easy",t:"Curriculum Design Models",
 q:"Humanistic design states that the DEVELOPMENT OF SELF is the ultimate objective of learning. This is also associated with ___.",
 c:["A. Social problem solving","B. Discipline mastery","C. Personality development, self-actualization, holistic development","D. Government standards compliance"],
 a:"C",e:"HUMANISTIC DESIGN: ultimate objective = DEVELOPMENT OF SELF — personality development, self-actualization, holistic development."},

{id:21,d:"easy",t:"Categories of Curriculum Change",
 q:"Which category of curriculum change involves REPLACING the present curriculum with an entirely new one (complete overhaul)?",
 c:["A. Alteration","B. Restructuring","C. Perturbation","D. Substitution"],
 a:"D",e:"SUBSTITUTION: REPLACES the present with a NEW ONE — complete overhaul. Example: changing to an entirely new textbook/tool."},

{id:22,d:"easy",t:"Stakeholders",
 q:"In curriculum, LEARNERS are described as the ___.",
 c:["A. Primary movers","B. Curriculum managers","C. Core of the curriculum and primary beneficiaries","D. Significant school partners"],
 a:"C",e:"LEARNERS = PRIMARY BENEFICIARIES and the CORE of the curriculum."},

{id:23,d:"easy",t:"Stakeholders",
 q:"Other stakeholders in curriculum include government agencies. Which of the following is listed in the reviewer?",
 c:["A. DOLE, DTI, DOH, DBM","B. LGUs, DepEd, TESDA, CHED, PRC, CSC","C. Schools, Communities, Parents, Alumni","D. NGOs, Media, Private Sector, International Organizations"],
 a:"B",e:"OTHER STAKEHOLDERS: government agencies — LGUs, DepEd, TESDA, CHED, PRC, CSC and non-government agencies."},

{id:24,d:"easy",t:"Curriculum Evaluation",
 q:"Which process of curriculum evaluation asks 'Is it working?' — telling if the designed or implemented curriculum is producing the desired results?",
 c:["A. Needs assessment","B. Terminal assessment","C. Decision making","D. Monitoring"],
 a:"D",e:"MONITORING: tells if the curriculum IS WORKING — 'IS IT WORKING?' (ongoing/present)."},

{id:25,d:"easy",t:"Curriculum Quality Audit",
 q:"Curriculum Quality Audit (CQA) is described as a FORM OF ___.",
 c:["A. Needs assessment","B. Curriculum mapping","C. Curriculum design","D. Curriculum implementation"],
 a:"B",e:"CQA is a FORM OF CURRICULUM MAPPING — it maps the curricular program or syllabus against established standards."},

{id:26,d:"easy",t:"Oliva's 10 Axioms",
 q:"Peter Oliva created the 10 Axioms for Curriculum Designers. Axioms are described as PRINCIPLES that practitioners can use as ___.",
 c:["A. Legal requirements","B. Government mandates","C. Assessment tools","D. Guidelines or a frame of reference"],
 a:"D",e:"Axioms are PRINCIPLES that practitioners as curriculum designers can use as GUIDELINES or a FRAME OF REFERENCE."},

{id:27,d:"easy",t:"Components of Curriculum Design",
 q:"Curriculum Design means the ORGANIZATION OF ___.",
 c:["A. Teaching staff and schedules","B. Curriculum components","C. Government standards and policies","D. Student assessment data"],
 a:"B",e:"CURRICULUM DESIGN = the ORGANIZATION OF CURRICULUM COMPONENTS — can be: lesson plan, syllabus, unit plan, or course design."},

{id:28,d:"easy",t:"Major Components of Curriculum",
 q:"Which major component of curriculum states that the OBJECTIVES should be SMART: Specific, Measurable, Attainable, Result-oriented, and Time-bound?",
 c:["A. Content/Subject Matter","B. Teaching and Learning Methods","C. Assessment/Evaluation","D. Behavioral Components"],
 a:"D",e:"BEHAVIORAL COMPONENTS: objectives should be SMART — Specific, Measurable, Attainable, Result-oriented, and Time-bound (Terminal)."},

{id:29,d:"easy",t:"DepEd Orders",
 q:"According to DepEd Order No. 70 s. 2012, teachers of ALL PUBLIC elementary and secondary schools will NOT be required to prepare ___.",
 c:["A. Yearly Curriculum Maps","B. Detailed Lesson Plans","C. Portfolio Assessments","D. Summative Tests"],
 a:"B",e:"DepEd Order No. 70 s. 2012: teachers of all public elementary and secondary schools will NOT be required to prepare DETAILED LESSON PLANS. Only teachers with less than 2 years experience must prepare Daily Lesson Plans."},

{id:30,d:"easy",t:"Curriculum Implementation as Change",
 q:"Kurt Lewin is known as the father of Social Psychology and Action Research. His model that explains the curriculum change process is called ___.",
 c:["A. The Grassroots Theory","B. The Cooperative Model","C. The Force Field Theory","D. The Linear Model"],
 a:"C",e:"Kurt Lewin = father of SOCIAL PSYCHOLOGY and ACTION RESEARCH. His FORCE FIELD THEORY explains the curriculum change process — balance of driving and restraining forces."},

// ══════════════ MODERATE (31-80) ══════════════
{id:31,d:"moderate",t:"Definitions of Curriculum",
 q:"'Curriculum is an entire range of experiences, undirected and directed, concerned with the unfolding of the individual's abilities.' This is a ___ definition because it includes experiences ___ the school.",
 c:["A. Traditional / only inside","B. Progressive / inside and outside","C. Traditional / outside only","D. Limited / inside the classroom only"],
 a:"B",e:"PROGRESSIVE DEFINITION: concerns the UNFOLDING OF INDIVIDUAL ABILITIES through experiences both INSIDE AND OUTSIDE the school — enriched and broad."},

{id:32,d:"moderate",t:"Types of Curricula",
 q:"A teacher uses science laboratory equipment, printed modules, and digital learning apps. These materials constitute which type of curriculum?",
 c:["A. Recommended curriculum","B. Written curriculum","C. Supported curriculum","D. Assessed curriculum"],
 a:"C",e:"SUPPORTED CURRICULUM: support MATERIALS that the teacher needs — PRINT materials and NON-PRINT materials (learning materials). Equipment, modules, and apps are all supported curriculum."},

{id:33,d:"moderate",t:"Types of Curricula",
 q:"A parent notices that her child started using social media vocabulary and peer behaviors not taught in any formal class. This learning is part of the ___.",
 c:["A. Learned curriculum","B. Taught curriculum","C. Hidden/Implicit curriculum","D. Assessed curriculum"],
 a:"C",e:"HIDDEN/IMPLICIT (UNPLANNED) CURRICULUM: the unwritten curriculum — peer influence, school environment, MEDIA, parental pressures, societal changes shape learning informally."},

{id:34,d:"moderate",t:"Views of Curriculum",
 q:"The TRADITIONAL VIEW of curriculum is subject-centered. Its four proponents and their KEY IDEAS are correctly matched EXCEPT ___.",
 c:["A. Hutchins — Permanent studies, grammar, reading, logic, math","B. Bestor — Intellectual training (Math, Science, History, Foreign Language)","C. Schwab — Discipline as the sole source of curriculum","D. Phenix — All experiences children have under teacher guidance"],
 a:"D",e:"INCORRECT: 'All experiences children have under teacher guidance' is HOLLIS CASWELL & KENN CAMPBELL (Progressive View). PHILIP PHENIX's key idea is: curriculum should consist entirely of KNOWLEDGE FROM VARIOUS DISCIPLINES."},

{id:35,d:"moderate",t:"Progressive View — Deep",
 q:"Othaniel Smith, William Stanley, and Harlan Shore defined curriculum as a SEQUENCE OF POTENTIAL EXPERIENCES set up in schools for the purpose of disciplining children and youth in GROUP ways of ___.",
 c:["A. Teaching and assessing","B. Thinking and acting","C. Learning and memorizing","D. Cooperating and competing"],
 a:"B",e:"Smith, Stanley & Shore: curriculum = sequence of potential experiences for disciplining children/youth in GROUP WAYS OF THINKING AND ACTING."},

{id:36,d:"moderate",t:"Three Ways — Differentiation",
 q:"A teacher gives the same reading text but adjusts the questions — basic comprehension for struggling students and critical analysis for advanced students. This is differentiating ___.",
 c:["A. Product","B. Process","C. Environment","D. Content"],
 a:"D",e:"DIFFERENTIATING CONTENT: defines essential principles all students must understand and ADJUSTS THE COMPLEXITY of information — same text but different depth of questioning."},

{id:37,d:"moderate",t:"Three Ways — Differentiation",
 q:"'Differentiating Process refers to activities that students engage in order to UNDERSTAND AND MASTER THE TOPIC.' Which example BEST illustrates this?",
 c:["A. Providing books of varying reading levels","B. Allowing students to choose their final output format","C. Some groups do hands-on experiments while others watch a video demonstration","D. Giving students rubrics of different complexity"],
 a:"C",e:"DIFFERENTIATING PROCESS = activities differ for different learners — hands-on experiments vs. video demonstration are DIFFERENT PROCESSES to master the same topic."},

{id:38,d:"moderate",t:"Principles of Curriculum Content",
 q:"'Curriculum is integrated and interconnected — involving two or more subjects, relating to interdisciplinary and transdisciplinary approaches.' This describes which principle?",
 c:["A. Continuity","B. Sequence","C. Scope","D. Integration"],
 a:"D",e:"INTEGRATION: curriculum is INTEGRATED and INTERCONNECTED — involves TWO OR MORE SUBJECTS; interdisciplinary, transdisciplinary; relates to reality."},

{id:39,d:"moderate",t:"Principles of Curriculum Content",
 q:"In the reviewer, CONTINUITY is described as 'vertical repetition and recurring approaches of content — perennial, it endures time.' This also involves ___.",
 c:["A. Coverage or boundaries of curriculum","B. Equitable assignment of content, time, and experiences","C. Interdisciplinary and transdisciplinary approaches","D. Smooth connections between grades with no overlap"],
 a:"C",e:"CONTINUITY: vertical repetition and recurring approaches — PERENNIAL (endures time). It involves INTERDISCIPLINARY, TRANSDISCIPLINARY, and CHROMADISCIPLINARY approaches."},

{id:40,d:"moderate",t:"Four Phases of Curriculum Development",
 q:"The DESIGNING phase of curriculum development involves selection and organization of ___.",
 c:["A. Vision, mission, goals, and learning outcomes","B. Content, activities, assessments, and resources","C. Teaching strategies only","D. Government standards and mandates"],
 a:"B",e:"DESIGNING phase: SELECTION and ORGANIZATION of CONTENT, ACTIVITIES, ASSESSMENTS, and RESOURCES."},

{id:41,d:"moderate",t:"Tyler's Model — Four Basic Principles",
 q:"Tyler's Four Basic Principles in order are: Purpose of the School, Educational Experiences related to the Purpose, Organization of the Experiences, and ___.",
 c:["A. Selection of learning contents","B. Diagnosis of learners' needs","C. Evaluation of the Experiences","D. Formulation of Learning Objectives"],
 a:"C",e:"Tyler's FOUR BASIC PRINCIPLES (P-E-O-E): (1) Purpose of School, (2) Educational Experiences related to Purpose, (3) Organization of Experiences, (4) EVALUATION OF THE EXPERIENCES."},

{id:42,d:"moderate",t:"Taba's 7 Steps",
 q:"What is STEP 3 in Hilda Taba's 7-step curriculum model?",
 c:["A. Organization of learning contents","B. Formulation of Learning Objectives","C. Selection of Learning Contents","D. Diagnosis of Learners' Needs"],
 a:"C",e:"Hilda Taba's steps: (1) Diagnosis of needs, (2) Formulation of Learning Objectives, (3) SELECTION OF LEARNING CONTENTS, (4) Organization of contents, (5) Selection of learning experiences, (6) Organization of experiences, (7) Determination of evaluation."},

{id:43,d:"moderate",t:"Saylor & Alexander",
 q:"Saylor and Alexander's curriculum model starts with Goals, Objectives, and Domains (GOD). What comes NEXT in their model?",
 c:["A. Curriculum Evaluation","B. Curriculum Implementation","C. Curriculum Designing","D. Diagnosis of needs"],
 a:"C",e:"Saylor & Alexander's model: (1) Goals, Objectives, and Domains, (2) CURRICULUM DESIGNING, (3) Curriculum Implementation, (4) Evaluation."},

{id:44,d:"moderate",t:"Historical Foundations — Hollis Caswell",
 q:"Hollis Caswell is associated with HAVARDING KANLIPURAN (social roles). He organized curriculum around social functions, themes, and learner's interest. He also stated that curriculum is a SET OF EXPERIENCES in which subject matter is developed around ___.",
 c:["A. Discipline and academic rigor","B. Government mandates and standards","C. Social functions and learners' interests","D. Individual student talents"],
 a:"C",e:"Hollis Caswell: curriculum = set of experiences; subject matter developed around SOCIAL FUNCTIONS and LEARNERS' INTERESTS. Curriculum, instruction, and learning are interrelated."},

{id:45,d:"moderate",t:"Historical Foundations — Ralph Tyler",
 q:"In the Historical Foundations, Ralph Tyler (different from the curriculum model Ralph Tyler) believed that curriculum is a science and an extension of the school's philosophy. The process emphasizes PROBLEM SOLVING, and curriculum aims to educate ___.",
 c:["A. Specialists (uni-skilled)","B. Generalists (multi-skilled)","C. Discipline experts","D. Social workers"],
 a:"B",e:"Ralph Tyler (Historical): curriculum emphasizes PROBLEM SOLVING — aims to educate GENERALISTS (multi-skilled), not SPECIALISTS (uni-skilled)."},

{id:46,d:"moderate",t:"Historical Foundations — Peter Oliva",
 q:"Peter Oliva described curriculum change as a COOPERATIVE ENDEAVOR. Teachers and curriculum specialists constitute the professional CORE OF PLANNERS, and significant improvement is achieved through ___.",
 c:["A. Individual teacher initiative","B. Government mandates","C. Group activity","D. Technology adoption"],
 a:"C",e:"Peter Oliva: curriculum change = COOPERATIVE ENDEAVOR; teachers + curriculum specialists = professional CORE OF PLANNERS; significant improvement through GROUP ACTIVITY."},

{id:47,d:"moderate",t:"Sociological Foundations — Paolo Freire",
 q:"Paolo Freire's 'Critical Pedagogy' views education as a means of shaping the person and society through critical reflections and 'conscientization.' Teachers use questioning and problem posing to raise ___.",
 c:["A. Academic performance","B. Test scores","C. Students' consciousness","D. Teacher evaluations"],
 a:"C",e:"Paolo Freire — Critical Pedagogy: education shapes person and society through critical reflections and conscientization. Teachers use QUESTIONING and PROBLEM POSING to raise STUDENTS' CONSCIOUSNESS."},

{id:48,d:"moderate",t:"Sociological Foundations — John Goodlad",
 q:"John Goodlad emphasized the constant need for school improvement and the INVOLVEMENT OF STUDENTS in ___.",
 c:["A. Government policy-making","B. Planning, curriculum content, and instructional activities","C. Teacher training and evaluation","D. Budget allocation and resource management"],
 a:"B",e:"John Goodlad: constant need for school improvement; INVOLVEMENT OF STUDENTS in PLANNING, CURRICULUM CONTENT, and INSTRUCTIONAL ACTIVITIES; emphasis on active learning and critical thinking."},

{id:49,d:"moderate",t:"Oliva's 10 Axioms",
 q:"Axiom 3 states: 'Curriculum changes made earlier can exist concurrently with newer curriculum changes.' This means revision ___.",
 c:["A. Should be done all at once","B. Starts and ends slowly — old and new can coexist","C. Must replace all previous curricula immediately","D. Only occurs with government approval"],
 a:"B",e:"Axiom 3: REVISION STARTS AND ENDS SLOWLY — old and new curriculum changes can COEXIST and OVERLAP."},

{id:50,d:"moderate",t:"Oliva's 10 Axioms",
 q:"Axiom 6: 'Curriculum development is a decision-making process made from choices of alternatives.' The curriculum developer must decide on CONTENT to teach and also on ___.",
 c:["A. Teacher salaries","B. School architecture","C. Methods or strategies, IMs, assessment, and procedure","D. Government funding sources"],
 a:"C",e:"Axiom 6: DECISION-MAKING — decide what CONTENT to teach AND what METHODS/STRATEGIES to use (IMs, assessment, procedure)."},

{id:51,d:"moderate",t:"Teaching & Learning Methods",
 q:"Cooperative learning activities are BEST for which type of student grouping?",
 c:["A. Homogeneous / fast learners","B. Least heterogeneous / slow learners","C. Diverse / heterogeneous groups","D. Advanced / gifted learners only"],
 a:"C",e:"COOPERATIVE LEARNING: BEST for DIVERSE/HETEROGENEOUS groups — students guided to work together; teacher guides learners."},

{id:52,d:"moderate",t:"Teaching & Learning Methods",
 q:"Competitive activities allow students to test their competencies against another in a HEALTHY MANNER, allowing learning to perform to their maximum. They mostly become ___.",
 c:["A. Better team collaborators","B. Survivors in a very competitive world","C. More dependent on teachers","D. Better at standardized testing"],
 a:"B",e:"COMPETITIVE ACTIVITIES: students test competencies in a HEALTHY MANNER — mostly become SURVIVORS IN A VERY COMPETITIVE WORLD."},

{id:53,d:"moderate",t:"Direct Instruction",
 q:"Direct Instruction (Barak Rosenshine) is described as the TRADITIONAL METHOD of teaching. It begins with stating the objectives (1) and ends with ___.",
 c:["A. Independent Practice (8)","B. Reteach if not successful","C. Review and Test (10)","D. Post-test for Non-mastery Group"],
 a:"C",e:"Direct Instruction (Rosenshine): 10 steps — begins with OBJECTIVES (1) and ends with REVIEW AND TEST (10). Success rate: 80% or more during practice sessions."},

{id:54,d:"moderate",t:"Guided Instruction",
 q:"In the Guided Instruction model (Madeline Hunter), the ANTICIPATORY SET at step 2 is designed to ___.",
 c:["A. Assess prior knowledge","B. Get the interest of students","C. State the lesson objectives","D. Model the new skill for students"],
 a:"B",e:"Guided Instruction (Madeline Hunter): ANTICIPATORY SET (2) = to GET THE INTEREST OF STUDENTS (motivation). Performance based on independent practice."},

{id:55,d:"moderate",t:"Guided Instruction",
 q:"In Guided Instruction (Madeline Hunter), MODELING at step 5 refers to ___.",
 c:["A. Peer tutoring","B. Student demonstration of skills","C. Teacher demonstration","D. Video presentation"],
 a:"C",e:"Guided Instruction: MODELING (5) = TEACHER DEMONSTRATION — the teacher models the skill/concept being taught."},

{id:56,d:"moderate",t:"Mastery Learning",
 q:"In Mastery Learning (JH Block and Lorin Anderson), after the pre-test, the NON-MASTERY GROUP receives ___.",
 c:["A. Enrichment Activity","B. Post-test","C. Independent Practice","D. Corrective Drill"],
 a:"D",e:"MASTERY LEARNING: after pre-test — MASTERY GROUP gets Enrichment Activity; NON-MASTERY GROUP gets CORRECTIVE DRILL. Then post-test for Non-mastery Group."},

{id:57,d:"moderate",t:"Mastery Learning",
 q:"In Mastery Learning, if the post-test is NOT SUCCESSFUL, the teacher should ___.",
 c:["A. Move on to the next lesson","B. Give a different assessment","C. Reteach","D. Refer to guidance counselor"],
 a:"C",e:"MASTERY LEARNING: if post-test is NOT SUCCESSFUL → RETEACH. Post-test success = at least 75% of students."},

{id:58,d:"moderate",t:"Systematic Instruction",
 q:"Systematic Instruction (Thomas Good and Jere Brophy) begins with REVIEW using homework and previous exercises. Its SEATWORK component requires providing ___ seatwork.",
 c:["A. Group-based","B. Competitive","C. Timed","D. Uninterrupted"],
 a:"D",e:"SYSTEMATIC INSTRUCTION: SEATWORK = UNINTERRUPTED seatwork — get everyone involved, sustain momentum. Provides WEEKLY REVIEWS."},

{id:59,d:"moderate",t:"Criteria for Selecting Teaching Methods",
 q:"Which criterion for selecting teaching-learning methods relates to the CHRONOLOGICAL and DEVELOPMENTAL AGES of learners?",
 c:["A. Adequacy","B. Efficiency","C. Suitability","D. Economy"],
 a:"C",e:"SUITABILITY: relates to planned activities — considers CHRONOLOGICAL and DEVELOPMENTAL AGES of learners (bagay/appropriate)."},

{id:60,d:"moderate",t:"Curriculum Design Models",
 q:"Subject Design's drawback is that learning is sometimes COMPARTMENTALIZED — it stresses so much on content that it forgets students' natural ___.",
 c:["A. Grades and academic performance","B. Government requirements","C. Tendencies, interests, and experiences","D. Discipline and academic rigor"],
 a:"C",e:"SUBJECT DESIGN drawback: stresses content so much it FORGETS STUDENTS' NATURAL TENDENCIES, INTERESTS, and EXPERIENCES — learning becomes compartmentalized."},

{id:61,d:"moderate",t:"Curriculum Design Models",
 q:"In Problem-Centered design, LIFE-SITUATION DESIGN uses the IMMEDIATE PROBLEMS OF THE SOCIETY and students' EXISTING CONCERNS. CORE PROBLEM DESIGN centers on general education and problems based on ___.",
 c:["A. Individual student aspirations","B. Government policy issues","C. Common human activities","D. Cultural and racial differences"],
 a:"C",e:"CORE PROBLEM DESIGN: centers on GENERAL EDUCATION and problems based on COMMON HUMAN ACTIVITIES (common problems)."},

{id:62,d:"moderate",t:"Curriculum Mapping",
 q:"Curriculum Mapping provides FORM, FOCUS, and FUNCTION. It connects all initiatives from instruction, pedagogies, assessment, and ___.",
 c:["A. Student evaluation only","B. Government mandates only","C. Professional development","D. Parent consultations"],
 a:"C",e:"Curriculum Mapping: connects all initiatives from INSTRUCTION, PEDAGOGIES, ASSESSMENT, and PROFESSIONAL DEVELOPMENT."},

{id:63,d:"moderate",t:"Curriculum Quality Audit",
 q:"CQA ensures alignment of learning outcomes, activities, and assessment to the standards — called CONSTRUCTIVE ALIGNMENT. It also achieves an ___ curriculum as standards become the basis of curriculum analysis.",
 c:["A. Locally relevant","B. Internationally comparable","C. Nationally standardized","D. Culturally responsive"],
 a:"B",e:"CQA: ensures CONSTRUCTIVE ALIGNMENT and achieves an INTERNATIONALLY COMPARABLE CURRICULUM as standards become the basis of curriculum analysis."},

{id:64,d:"moderate",t:"Standards in CQA",
 q:"CMO 77, s. 2017 covers ___.",
 c:["A. Bachelor of Elementary Education","B. Bachelor of Early Childhood Education","C. Bachelor of Special Needs Education","D. Bachelor of Technology and Livelihood Education"],
 a:"C",e:"CMO 77, S. 2017 = BSNEd — BACHELOR OF SPECIAL NEEDS EDUCATION."},

{id:65,d:"moderate",t:"Standards in CQA",
 q:"CMO 76, s. 2017 covers ___.",
 c:["A. Bachelor of Elementary Education","B. Bachelor of Secondary Education","C. Bachelor of Early Childhood Education","D. Bachelor of Physical Education"],
 a:"C",e:"CMO 76, S. 2017 = BECEd — BACHELOR OF EARLY CHILDHOOD EDUCATION."},

{id:66,d:"moderate",t:"Force Field Theory",
 q:"In Kurt Lewin's Force Field Theory, KNOWLEDGE EXPLOSION is a ___ force while FEAR OF THE UNKNOWN is a ___ force.",
 c:["A. Restraining / Driving","B. Driving / Restraining","C. Pull / Push","D. Inhibiting / Contributing"],
 a:"B",e:"DRIVING FORCES (PUSH): Government Intervention, Society's Value, Technological Changes, KNOWLEDGE EXPLOSION, Administrative Support. RESTRAINING FORCES (PULL): FEAR OF THE UNKNOWN, Negative Attitude to Change, Tradition Values, Limited Resources, Obsolete Equipment."},

{id:67,d:"moderate",t:"Categories of Curriculum Change",
 q:"RESTRUCTURING introduces MAJOR MODIFICATION of the current curriculum. The reviewer gives the example of ___.",
 c:["A. Shifting from pencil to ballpen","B. Changing from online to face-to-face suddenly","C. Responding to a shift in school vision/mission","D. Shifting from RBEC to K to R (K to 12)"],
 a:"D",e:"RESTRUCTURING: major modification — example: FROM RBEC TO K TO R (K to 12). This was a major structural change in Philippine education."},

{id:68,d:"moderate",t:"Categories of Curriculum Change",
 q:"VALUE ORIENTATION as a category of curriculum change responds to SHIFT IN EMPHASIS within the ___.",
 c:["A. Government curriculum standards","B. Individual teacher's philosophy","C. Vision/mission of the school","D. Student population demographics"],
 a:"C",e:"VALUE ORIENTATION: responds to SHIFT IN EMPHASIS within the VISION/MISSION OF THE SCHOOL."},

{id:69,d:"moderate",t:"Stakeholders",
 q:"Which stakeholder group is described as the PRIMARY MOVERS who plan, design, teach, implement, and evaluate the curriculum?",
 c:["A. Learners","B. School Leaders/Administrators","C. Parents","D. Teachers"],
 a:"D",e:"TEACHERS = PRIMARY MOVERS — they are the CURRICULARISTS who PLAN, DESIGN, TEACH, IMPLEMENT, and EVALUATE the curriculum."},

{id:70,d:"moderate",t:"Curriculum Evaluation",
 q:"TERMINAL ASSESSMENT as a process of evaluation guides whether results have EQUALED or EXCEEDED the ___.",
 c:["A. Teacher's expectations","B. Student's potential","C. Standards","D. Budget allocations"],
 a:"C",e:"TERMINAL ASSESSMENT: guides whether results EQUALED or EXCEEDED the STANDARDS — 'DID IT WORK?' (past/completed)."},

{id:71,d:"moderate",t:"Curriculum Evaluation",
 q:"DECISION MAKING as a process of evaluation provides information necessary for teachers, school managers, and curriculum specialists for policy recommendations. The three options are ___.",
 c:["A. Accept, Modify, Reject","B. Retain, Revise, or Reject","C. Adopt, Adapt, or Abandon","D. Keep, Change, or Replace"],
 a:"B",e:"DECISION MAKING: provides information for policy recommendations — RETAIN, REVISE, or REJECT the curriculum."},

{id:72,d:"moderate",t:"Curriculum Evaluation — Two Ways",
 q:"Curriculum Program Evaluation is MACRO-LEVEL — it focuses on the overall aspect (big curriculum program). Curriculum Program Component Evaluation is MICRO-LEVEL — it includes separate evaluation of achieved learning outcomes, curriculum process, and ___.",
 c:["A. Teacher performance","B. Student behavior","C. Instructional materials","D. Government compliance"],
 a:"C",e:"CURRICULUM PROGRAM COMPONENT EVALUATION (MICRO-LEVEL): separate evaluation of (a) ACHIEVED LEARNING OUTCOMES, (b) CURRICULUM PROCESS, and (c) INSTRUCTIONAL MATERIALS."},

{id:73,d:"moderate",t:"William Pinar",
 q:"William Pinar believed curriculum should be studied from multiple perspectives including historical, racial, gendered, phenomenological, postmodern, theological, and international. His goal was to ___.",
 c:["A. Reduce curriculum to core academic subjects","B. Standardize curriculum globally","C. Broaden the conception of curriculum to enrich the practice","D. Focus curriculum on student test performance"],
 a:"C",e:"William Pinar: BROADEN the conception of curriculum to ENRICH THE PRACTICE — understand the nature of the educational experience; curriculum involves MULTIPLE DISCIPLINES."},

{id:74,d:"moderate",t:"Assessment/Evaluation Component",
 q:"According to the reviewer, learning occurs most effectively when students receive ___.",
 c:["A. High grades","B. Feedback","C. Competitive activities","D. Government-prescribed materials"],
 a:"B",e:"Assessment/Evaluation component: 'Learning occurs most effectively when students receive FEEDBACK.' Types include: self-assessment, peer assessment, teacher assessment."},

{id:75,d:"moderate",t:"John Dewey — Sociological",
 q:"John Dewey considered two fundamental elements — schools and CIVIL SOCIETY — to be major topics needing attention and reconstruction to encourage EXPERIMENTAL INTELLIGENCE and ___.",
 c:["A. Academic discipline","B. Permanent studies","C. Plurality","D. Conformity"],
 a:"C",e:"John Dewey (Sociological): reconstruction to encourage EXPERIMENTAL INTELLIGENCE (creative intelligence — knowledge in situation) and PLURALITY."},

{id:76,d:"moderate",t:"Oliva's Axioms — Applied",
 q:"A school district holds consultations with teachers, parents, community leaders, and government officials before revising the science curriculum. This BEST exemplifies Axiom ___ of Oliva's 10 Axioms.",
 c:["A. Axiom 4 — depends on teachers who implement","B. Axiom 5 — cooperative group activity","C. Axiom 8 — comprehensive process","D. Axiom 10 — starts from where the curriculum is"],
 a:"B",e:"AXIOM 5: COOPERATIVE GROUP ACTIVITY — consultations with STAKEHOLDERS add a SENSE OF OWNERSHIP. Group decisions in some aspects of curriculum development are suggested."},

{id:77,d:"moderate",t:"Curriculum Development — Deep",
 q:"The end product of the PLANNING PHASE includes lesson plans, unit plans, syllabi, course designs, modules, books, and instructional guides. This aligns with which Axiom?",
 c:["A. Axiom 9 — systematic process","B. Axiom 3 — coexistence of old and new","C. Axiom 8 — comprehensive process","D. Axiom 7 — ongoing process"],
 a:"C",e:"AXIOM 8: COMPREHENSIVE rather than piecemeal — must be based on CAREFUL PLANNING with INTENDED OUTCOMES CLEARLY ESTABLISHED. Thorough documentation (lesson plans, syllabi, etc.) reflects comprehensive planning."},

{id:78,d:"moderate",t:"Historical Foundations — Werret Charters",
 q:"Werret Charters, like Bobbit, believed curriculum is science and emphasizes students' needs. His key contribution is that OBJECTIVES, SUBJECT MATTER, and ACTIVITIES should ___.",
 c:["A. Be prescribed by government","B. Focus on permanent studies","C. Match — subject matter relates to objectives","D. Center on disciplinary knowledge"],
 a:"C",e:"Werret Charters: objectives and activities should MATCH — O-S-A match: OBJECTIVES, SUBJECT MATTER, and ACTIVITIES should relate to each other."},

{id:79,d:"moderate",t:"Historical Foundations — Hilda Taba",
 q:"Hilda Taba contributed to the theoretical and pedagogical foundations of concepts development and critical thinking in SOCIAL STUDIES curriculum. She helped lay the foundation for ___.",
 c:["A. Discipline-based curriculum","B. Diverse student population — Inclusive Education","C. Permanent studies in basic education","D. Problem-solving as the sole curriculum focus"],
 a:"B",e:"Hilda Taba (Historical): contributed to SOCIAL STUDIES curriculum and CRITICAL THINKING. She helped lay the foundation for DIVERSE STUDENT POPULATION = INCLUSIVE EDUCATION."},

{id:80,d:"moderate",t:"Three Ways — Product Applied",
 q:"A teacher allows students to choose their final assessment: some create a video documentary, others write a research paper, and others build a model. This BEST illustrates Differentiating PRODUCT because it ___.",
 c:["A. Provides the same output for all learners","B. Adjusts only the complexity of the content","C. Uses different activities to master the same topic","D. Allows teachers to construct lessons relevant and customized to any learner by modifying depth, amount, or independence"],
 a:"D",e:"DIFFERENTIATING PRODUCT: can take form of exams, activities, projects, written work — allows teachers to construct lessons RELEVANT AND CUSTOMIZED to any learner by modifying DEPTH, AMOUNT, or INDEPENDENCE of the product."},

// ══════════════ DIFFICULT (81-100) ══════════════
{id:81,d:"difficult",t:"Definitions & Types — Integration",
 q:"A teacher says: 'I teach more than what's in the textbook — I include community outreach, peer collaboration, and student reflections on media. My students also learn from each other's cultural backgrounds.' Which combination of curriculum types is MOST present?",
 c:["A. Recommended + Written + Assessed","B. Progressive definition + Learned + Hidden/Implicit","C. Traditional definition + Taught + Supported","D. Written + Supported + Assessed"],
 a:"B",e:"PROGRESSIVE DEFINITION (experiences inside and outside school) + LEARNED (cognitive, affective, psychomotor outcomes) + HIDDEN/IMPLICIT (peer influence, cultural backgrounds, media) — all three are present in this rich learning environment."},

{id:82,d:"difficult",t:"Views — Applied Critical",
 q:"A school administrator insists that the curriculum must focus ONLY on grammar, mathematics, logic, and classics. A teacher argues that curriculum should also include students' experiences, community problems, and real-world applications. The administrator holds the ___ view while the teacher holds the ___ view.",
 c:["A. Progressive / Traditional","B. Experience-centered / Subject-centered","C. Traditional / Progressive","D. Humanistic / Perennialist"],
 a:"C",e:"ADMINISTRATOR = TRADITIONAL/SUBJECT-CENTERED view (Hutchins-like: permanent studies, grammar, math). TEACHER = PROGRESSIVE/EXPERIENCE-CENTERED view (includes real-world experiences, community, application)."},

{id:83,d:"difficult",t:"Curriculum Development Models — Comparison",
 q:"A curriculum committee is composed of classroom teachers who identify students' needs first, then build objectives, select content, and organize experiences. A different school uses a committee of administrators and curriculum experts who set objectives then inform teachers to implement. The FIRST follows ___ while the SECOND follows ___.",
 c:["A. Ralph Tyler / Hilda Taba","B. Hilda Taba / Ralph Tyler","C. Saylor & Alexander / Hilda Taba","D. Ralph Tyler / Peter Oliva"],
 a:"B",e:"FIRST = HILDA TABA (grassroots/bottom-up — starts with diagnosis of learners' needs, teachers most important). SECOND = RALPH TYLER (top-down/deductive — objective-centered, administrators set direction, teachers implement)."},

{id:84,d:"difficult",t:"Oliva's Axioms — Deep Analysis",
 q:"A school is evaluating its new K–12 implementation. They find that Grade 4 Science topics overlap with Grade 3 topics, and Grade 5 Math skips essential foundational concepts. Which TWO principles of curriculum content are being VIOLATED?",
 c:["A. Scope and Balance","B. Integration and Continuity","C. Articulation (Vertical Alignment) and Sequence","D. Balance and Scope"],
 a:"C",e:"ARTICULATION (VERTICAL ALIGNMENT) VIOLATED: Grade 3 and Grade 4 overlap (smooth connections not maintained). SEQUENCE VIOLATED: Grade 5 Math skips foundational concepts (logical arrangement from simple to complex is disrupted)."},

{id:85,d:"difficult",t:"Instruction Models — Complex Comparison",
 q:"A teacher examines three instruction models. Model X begins with clarification of goals, gives a pre-test, separates mastery and non-mastery groups, and requires 75% of students for success. Model Y begins with objectives and ends with review and test (10 steps) with 80% success rate. Model Z begins with review using homework and provides weekly reviews. Correctly identify Models X, Y, and Z.",
 c:["A. X=Direct Instruction, Y=Mastery Learning, Z=Systematic Instruction","B. X=Guided Instruction, Y=Direct Instruction, Z=Mastery Learning","C. X=Mastery Learning, Y=Direct Instruction, Z=Systematic Instruction","D. X=Systematic Instruction, Y=Guided Instruction, Z=Mastery Learning"],
 a:"C",e:"X = MASTERY LEARNING (Block & Anderson): pre-test, 75% success. Y = DIRECT INSTRUCTION (Rosenshine): 10 steps, objectives to review and test, 80%+ success. Z = SYSTEMATIC INSTRUCTION (Good & Brophy): begins with review of homework, weekly reviews."},

{id:86,d:"difficult",t:"Curriculum Design — Applied Analysis",
 q:"A school integrates Math, Science, Social Studies, and Language Arts under a single theme of 'Sustainable Communities' where each subject contributes to the theme but maintains its individual identity and course structure. This BEST describes ___.",
 c:["A. Broadfield Design — prevents compartmentalization, integrates all into one","B. Correlation Design — links subjects to reduce fragmentation but each maintains identity","C. Discipline Design — specific knowledge of one career-oriented field","D. Core Problem Design — centers on common human activities"],
 a:"B",e:"CORRELATION DESIGN: comes from a core, correlated curriculum that LINKS SEPARATE SUBJECT DESIGNS to reduce fragmentation — subjects RELATED TO ONE ANOTHER but EACH SUBJECT MAINTAINS ITS IDENTITY."},

{id:87,d:"difficult",t:"Force Field Theory — Applied",
 q:"A school district wants to implement a full digital curriculum. Supporting this are: government intervention, administrative support, and knowledge explosion. Opposing it are: teacher resistance (fear of technology), lack of funds, and outdated equipment. According to Force Field Theory, for curriculum change to SUCCESSFULLY occur ___.",
 c:["A. Only driving forces need to increase","B. Only restraining forces need to decrease","C. Both driving forces must strengthen AND/OR restraining forces must weaken to disturb the current balance","D. A complete curriculum replacement must happen first"],
 a:"C",e:"FORCE FIELD THEORY: for CHANGE — DRIVING FORCES (push/contribute) must STRENGTHEN and/or RESTRAINING FORCES (pull/inhibit) must WEAKEN to DISTURB THE BALANCE. Both sides influence whether change happens."},

{id:88,d:"difficult",t:"Categories of Curriculum Change — Applied",
 q:"During the COVID-19 pandemic, DepEd implemented online and modular learning WITHIN WEEKS, also shortening class schedules. Two years later, some schools still use modular materials alongside new face-to-face materials. Which TWO categories of curriculum change are demonstrated?",
 c:["A. Substitution and Restructuring","B. Alteration and Value Orientation","C. Perturbation and Axiom 3 (coexistence of old and new changes)","D. Restructuring and Value Orientation"],
 a:"C",e:"PERTURBATION: SUDDEN CHANGES in a FAIRLY SHORT TIME (online/modular within weeks, shortened schedule). AXIOM 3 (coexistence): old modular materials and new face-to-face materials COEXIST — revision starts and ends slowly."},

{id:89,d:"difficult",t:"Comprehensive — Stakeholders & Evaluation",
 q:"A school's curriculum team evaluates their program. The TEACHERS plan revisions; SCHOOL LEADERS check alignment with standards; PARENTS provide feedback on student welfare; the COMMUNITY suggests relevance to local needs; and GOVERNMENT AGENCIES set standards through CMOs. After gathering data, they decide to revise the science curriculum. Which PROCESS OF EVALUATION led to the decision to revise?",
 c:["A. Monitoring — checking if it is currently working","B. Terminal Assessment — whether results equaled or exceeded standards","C. Decision Making — information for retain, revise, or reject policy recommendation","D. Needs Assessment — identifying strengths and weaknesses"],
 a:"C",e:"DECISION MAKING: provides information necessary for teachers, school managers, and curriculum specialists for POLICY RECOMMENDATIONS — specifically to RETAIN, REVISE, or REJECT. The team decided to REVISE = decision making process."},

{id:90,d:"difficult",t:"Historical Proponents — Deep Analysis",
 q:"Which statement CORRECTLY differentiates William Kilpatrick from Harold Rugg?",
 c:["A. Kilpatrick emphasized social studies; Rugg introduced the project method","B. Kilpatrick introduced project method with teacher-student co-planning; Rugg developed the whole child holistically with emphasis on social studies and advance planning","C. Both emphasized discipline as the sole source of curriculum","D. Both believed curriculum should be experience-centered with teacher-only planning"],
 a:"B",e:"KILPATRICK: introduced PROJECT METHOD — teacher AND STUDENT plan activities together; develops social relationships and small group instruction. RUGG: curriculum develops the WHOLE CHILD (holistic); emphasized SOCIAL STUDIES; teacher plans curriculum IN ADVANCE. Key difference: Kilpatrick = co-planning; Rugg = teacher plans ahead."},

{id:91,d:"difficult",t:"Curriculum Design — Learner-Centered Applied",
 q:"Three teachers discuss curriculum design. Teacher A: 'Our curriculum must start from what students experience and know.' Teacher B: 'The development of the whole person — self-actualization — is the highest goal.' Teacher C: 'We need to anchor everything on what children need and are interested in.' Which designs are A, B, and C advocating, respectively?",
 c:["A. Child-centered / Humanistic / Experience-centered","B. Experience-centered / Child-centered / Humanistic","C. Humanistic / Experience-centered / Child-centered","D. Experience-centered / Humanistic / Child-centered"],
 a:"D",e:"Teacher A = EXPERIENCE-CENTERED (experiences of learners are the starting point). Teacher B = HUMANISTIC (development of self is the ultimate objective). Teacher C = CHILD-CENTERED (anchored on the needs and interests of the child)."},

{id:92,d:"difficult",t:"Oliva's Axioms — Comprehensive",
 q:"A veteran teacher says: 'We don't need to start from scratch. Let's look at what we have, improve what works, and change what doesn't.' This BEST aligns with which TWO Axioms?",
 c:["A. Axiom 1 and Axiom 7","B. Axiom 5 and Axiom 8","C. Axiom 10 and Axiom 3","D. Axiom 4 and Axiom 9"],
 a:"C",e:"AXIOM 10: 'starts from where the curriculum is' — existing design is a good starting point, NO BACK TO ZERO. AXIOM 3: 'earlier changes can coexist with newer changes' — revision starts and ends slowly. Both support the teacher's approach of improving what exists."},

{id:93,d:"difficult",t:"Comprehensive — All Principles",
 q:"A curriculum audit reveals: (1) Grade 3 topics are repeated unnecessarily in Grade 4; (2) Math, Science, and Health are taught in isolation with no connections; (3) The curriculum covers too many topics leaving no time to explore any deeply. Which THREE principles of curriculum content are VIOLATED?",
 c:["A. Sequence, Balance, Scope","B. Articulation, Integration, Scope","C. Continuity, Sequence, Balance","D. Balance, Continuity, Integration"],
 a:"B",e:"(1) Grade 3 topics repeated in Grade 4 = ARTICULATION VIOLATED (smooth connections/no overlap). (2) Math, Science, Health in isolation = INTEGRATION VIOLATED (not interconnected). (3) Too many topics, no depth = SCOPE VIOLATED (coverage/boundaries not appropriately set)."},

{id:94,d:"difficult",t:"Instruction Methods — Applied Scenario",
 q:"A teacher differentiates her class: Group 1 (diverse, mixed ability) works together on a problem-solving activity with the teacher circulating; Group 2 (advanced, fast learners) works independently on a self-directed research project; Group 3 (competitive students) debates against each other to solve a math challenge. This teacher is SIMULTANEOUSLY using ___.",
 c:["A. Direct Instruction, Mastery Learning, Systematic Instruction","B. Cooperative Learning, Independent Learning, Competitive Activities","C. Guided Instruction, Direct Instruction, Cooperative Learning","D. Mastery Learning, Cooperative Learning, Systematic Instruction"],
 a:"B",e:"Group 1 = COOPERATIVE LEARNING (diverse/heterogeneous, teacher guides). Group 2 = INDEPENDENT LEARNING ACTIVITIES (homogeneous/fast learners, self-directed). Group 3 = COMPETITIVE ACTIVITIES (test competencies in healthy manner). All three teaching-learning activities simultaneously."},

{id:95,d:"difficult",t:"CQA — Deep Application",
 q:"A school maps its BEED curriculum against CMO 74 s. 2017 standards. They find some learning outcomes have NO corresponding assessment, some topics are repeated across courses, and some standards are not covered at all. In CQA terms, these issues are described as ___.",
 c:["A. Lack of curriculum development, poor teacher training, and administrative failure","B. Misalignment of methods, poor content selection, and outdated textbooks","C. Gaps, over-representation, and under-representation of curriculum based on standards","D. Poor articulation, lack of continuity, and weak scope"],
 a:"C",e:"CQA: IDENTIFIES GAPS (standards not covered), UNDER-REPRESENTATION (insufficient coverage), and OVER-REPRESENTATION (redundant topics) of the curriculum BASED ON STANDARDS. CMO 74 s. 2017 = BEED."},

{id:96,d:"difficult",t:"Sociological Foundations — Comparison",
 q:"Which statement CORRECTLY differentiates Paolo Freire from John Goodlad?",
 c:["A. Freire emphasized reducing student conformity; Goodlad focused on conscientization through questioning","B. Freire focused on critical pedagogy, conscientization, and questioning to raise consciousness; Goodlad emphasized active learning, critical thinking, and student involvement in curriculum planning","C. Both emphasized the project method and student-teacher collaborative planning","D. Both focused on permanent studies and intellectual training"],
 a:"B",e:"FREIRE: Critical Pedagogy — education shapes person and society through critical reflections, CONSCIENTIZATION, QUESTIONING, and PROBLEM POSING to raise students' CONSCIOUSNESS. GOODLAD: reduce student conformity, ACTIVE LEARNING, CRITICAL THINKING, STUDENT INVOLVEMENT in planning, curriculum content, and instructional activities."},

{id:97,d:"difficult",t:"Ultimate Integration — All Models",
 q:"A curriculum team wants to create a new curriculum. They: (1) consult teachers as primary planners; (2) start from the school's existing curriculum; (3) make decisions as a group with all stakeholders; (4) follow a systematic, comprehensive process; and (5) recognize it as an ongoing, dynamic process. Which COMBINATION of Oliva's Axioms BEST describes their approach?",
 c:["A. Axioms 1, 2, 3, 4, 5","B. Axioms 4, 5, 7, 8, 9, 10","C. Axioms 4, 10, 5, 9, 7","D. Axioms 1, 6, 7, 8, 9"],
 a:"C",e:"(1) Teachers as primary planners = AXIOM 4. (2) Start from existing = AXIOM 10. (3) Group with stakeholders = AXIOM 5. (4) Systematic, comprehensive = AXIOMS 9 and 8. (5) Ongoing, dynamic = AXIOM 7. The BEST combination matching ALL five actions = Axioms 4, 10, 5, 9, 7."},

{id:98,d:"difficult",t:"Comprehensive — Roles & Views",
 q:"A CURRICULUM SPECIALIST who (a) uses creative VR lessons (Innovator), (b) evaluates if outcomes are met (Evaluator), (c) makes monthly lesson plans (Planner), (d) conducts research for content (Writer), and (e) accepts a new program with an open mind (Initiator) — is demonstrating HOW MANY roles of a curricularist simultaneously?",
 c:["A. 3 roles","B. 4 roles","C. 5 roles","D. All 8 roles"],
 a:"C",e:"The scenario describes EXACTLY 5 ROLES: (a) INNOVATOR — VR/creative lessons, (b) EVALUATOR — checks if outcomes are met, (c) PLANNER — monthly lesson plans, (d) WRITER — research for content, (e) INITIATOR — open-mindedness to new program. Total = 5 roles."},

{id:99,d:"difficult",t:"Curriculum Change — Complex Scenario",
 q:"DepEd replaces the old NSAT (National Secondary Achievement Test) with a new assessment tool (Substitution). They also introduce the MTB-MLE (Mother Tongue Based Multilingual Education) which is a MAJOR change to the language curriculum (Restructuring). Some schools implement MTB-MLE immediately while others still use English as medium of instruction for older enrolled students (Axiom 3). Which categories are CORRECTLY identified?",
 c:["A. Substitution=NSAT replaced; Restructuring=MTB-MLE introduced; Axiom 3=coexistence of old and new","B. Perturbation=NSAT replaced; Alteration=MTB-MLE; Axiom 10=no back to zero","C. Alteration=NSAT; Perturbation=MTB-MLE; Value Orientation=coexistence","D. Restructuring=NSAT; Substitution=MTB-MLE; Axiom 5=stakeholder group activity"],
 a:"A",e:"SUBSTITUTION: NSAT REPLACED with new assessment tool (replacing present with new one). RESTRUCTURING: MTB-MLE = MAJOR MODIFICATION of current curriculum. AXIOM 3: MTB-MLE and old English medium COEXIST during transition — revision starts and ends slowly."},

{id:100,d:"difficult",t:"Master Integration — All Topics",
 q:"Which statement MOST COMPREHENSIVELY and ACCURATELY captures the relationship among CURRICULUM DEFINITIONS, TYPES, DEVELOPMENT, DESIGN, IMPLEMENTATION, EVALUATION, and STAKEHOLDERS?",
 c:["A. Curriculum is a static document created by government agencies that teachers follow precisely and evaluate annually","B. Curriculum is a dynamic, ongoing system — defined broadly (traditional to progressive), manifested in multiple types, developed through planning→designing→implementing→evaluating phases, designed in various models, implemented through change processes, evaluated for improvement, and shaped by all stakeholders","C. Curriculum is primarily a written document containing objectives, content, and activities that the teacher delivers to students","D. Curriculum development is a one-time event that produces a fixed program for schools to implement unchanged"],
 a:"B",e:"MOST COMPREHENSIVE: curriculum is a DYNAMIC, ONGOING SYSTEM — defined from traditional (limited) to progressive (broad); exists in 7 types; developed through 4 phases; designed in subject/learner/problem-centered models; implemented through change (Lewin's Force Field); evaluated (macro and micro levels) for retain/revise/reject; shaped by ALL STAKEHOLDERS (teachers, learners, administrators, parents, community, others). It is never static or one-time."},];
const METHODS_200 = [
// ═══════════════════ EASY (1–30) ═══════════════════
{id:1,d:"easy",t:"PQF",q:"The Philippine Qualifications Framework (PQF) is provided by law under which Republic Act?",c:["A. RA 10533","B. RA 10968","C. RA 10533","D. RA 9155"],a:"B",e:"The PQF is provided by law under RA 10968, s. 2018. It was adopted as part of ASEAN convergence to provide national standards and levels for outcomes in education."},
{id:2,d:"easy",t:"PQF",q:"PQF Level 6 describes the career path for which type of degree programs?",c:["A. Doctoral degree programs","B. Post-baccalaureate degree programs","C. Baccalaureate degree programs including teacher education","D. Technical and vocational programs"],a:"C",e:"PQF Level 6 describes the career path for BACCALAUREATE DEGREE PROGRAMS, including teacher education degrees. All baccalaureate graduates are expected to exhibit outcomes described in PQF Level 6."},
{id:3,d:"easy",t:"PPST",q:"PPST stands for ___.",c:["A. Philippine Professional Standards for Teachers","B. Philippine Program Standards for Teaching","C. Philippine Professional Strategies for Teachers","D. Philippine Program for School Teachers"],a:"A",e:"PPST stands for PHILIPPINE PROFESSIONAL STANDARDS FOR TEACHERS, implemented through Department Order 42, s. 2017."},
{id:4,d:"easy",t:"PPST",q:"How many domains does the PPST have?",c:["A. 5","B. 6","C. 7","D. 8"],a:"C",e:"The PPST has SEVEN (7) DOMAINS. The 7 domains collectively comprise 37 strands that refer to more specific dimensions of teaching."},
{id:5,d:"easy",t:"PPST",q:"How many strands do the 7 Domains of PPST collectively comprise?",c:["A. 27","B. 35","C. 37","D. 42"],a:"C",e:"The 7 Domains of PPST collectively comprise 37 STRANDS that refer to more specific dimensions of teaching."},
{id:6,d:"easy",t:"PPST — Domain 1",q:"Domain 1 of PPST is Content Knowledge and Pedagogy. How many strands does it contain?",c:["A. 5","B. 6","C. 7","D. 8"],a:"C",e:"Domain 1 (Content Knowledge and Pedagogy) is composed of SEVEN STRANDS including content knowledge, research-based knowledge, positive use of ICT, literacy and numeracy strategies, HOTS, mother tongue, and classroom communication."},
{id:7,d:"easy",t:"PPST — Domain 2",q:"Domain 2, Learning Environment, consists of how many strands?",c:["A. 4","B. 5","C. 6","D. 7"],a:"C",e:"Domain 2 (Learning Environment) consists of SIX strands: learner safety, fair learning environment, management of classroom structure, support for learner participation, purposive learning, and management of learner behavior."},
{id:8,d:"easy",t:"PPST — Domains",q:"Which PPST Domain focuses on Personal Growth and Professional Development?",c:["A. Domain 5","B. Domain 6","C. Domain 7","D. Domain 4"],a:"C",e:"DOMAIN 7 is Personal Growth and Professional Development, containing five strands: philosophy of teaching, dignity of teaching, professional links, professional reflection, and professional development goals."},
{id:9,d:"easy",t:"Career Stages",q:"How many Career Stages of a Teacher are described in the document?",c:["A. 3","B. 4","C. 5","D. 6"],a:"B",e:"There are FOUR Career Stages: (1) Beginning Teachers, (2) Proficient Teachers, (3) Highly Proficient Teachers, and (4) Distinguished Teachers."},
{id:10,d:"easy",t:"Career Stages",q:"Career Stage 1 teachers are also called ___.",c:["A. Proficient Teachers","B. Highly Proficient Teachers","C. Distinguished Teachers","D. Beginning Teachers"],a:"D",e:"Career Stage 1 are BEGINNING TEACHERS — they have gained qualifications for entry into the teaching profession, have strong understanding of their subjects, and seek advice from experienced colleagues."},
{id:11,d:"easy",t:"Classroom Management",q:"Classroom management refers to the process of organizing and conducting the business of the classroom relatively free of ___.",c:["A. Student participation","B. Behavior problems","C. Teaching strategies","D. Assessment activities"],a:"B",e:"Classroom management is the process of organizing and conducting the business of the classroom relatively FREE OF BEHAVIOR PROBLEMS. It relates to preservation of order and maintenance of control."},
{id:12,d:"easy",t:"5 Types of Teacher Power",q:"Which type of teacher power is exercised when a teacher gives students a sense of belonging and acceptance?",c:["A. Expert Power","B. Legitimate Power","C. Referent Power","D. Coercive Power"],a:"C",e:"REFERENT POWER — giving students a sense of BELONGING AND ACCEPTANCE. Expert Power comes from knowledge; Legitimate Power comes from authority ('loco parentis'); Reward Power gives rewards; Coercive Power gives punishments."},
{id:13,d:"easy",t:"5 Types of Teacher Power",q:"'Loco parentis' is associated with which type of teacher power?",c:["A. Expert Power","B. Reward Power","C. Referent Power","D. Legitimate Power"],a:"D",e:"LEGITIMATE POWER — persons in authority. 'Loco parentis' means 'in place of a parent' — teachers assume parental-like authority in the classroom."},
{id:14,d:"easy",t:"Types of Classroom Manager",q:"A teacher who is 'demanding yet warm' is classified as which type of classroom manager?",c:["A. Authoritarian","B. Permissive","C. Uninvolved","D. Authoritative/Democratic"],a:"D",e:"AUTHORITATIVE/DEMOCRATIC classroom manager = DEMANDING YET WARM. They clearly and fairly communicate standards for discipline and performance, and are kind, caring, warm, but also firm."},
{id:15,d:"easy",t:"Multiple Intelligences",q:"Multiple Intelligences theory was created by ___.",c:["A. Jean Piaget","B. Howard Gardner","C. Benjamin Bloom","D. Lev Vygotsky"],a:"B",e:"The theory of Multiple Intelligences was created by HOWARD GARDNER, suggesting abilities cluster in nine different areas."},
{id:16,d:"easy",t:"Multiple Intelligences",q:"A student who is 'word smart,' enjoys reading, writing, and discussing is demonstrating which intelligence?",c:["A. Logical-Mathematical Skills","B. Verbal-Linguistic Skills","C. Interpersonal Abilities","D. Intrapersonal Abilities"],a:"B",e:"VERBAL-LINGUISTIC SKILLS = 'word smart' — enjoys reading, writing, discussing. Activities include: write a story, write a poem, create ads, keep a journal."},
{id:17,d:"easy",t:"Multiple Intelligences",q:"Which intelligence is described as 'number smart/logic smart' involving concept of time, quantity, cause and effect?",c:["A. Visual-Spatial","B. Bodily-Kinesthetic","C. Logical-Mathematical","D. Musical"],a:"C",e:"LOGICAL-MATHEMATICAL SKILLS = 'number smart/logic smart' — involves concept of time, quantity, cause and effect. Activities: problem-solving, mental calculations, science experiments, number games."},
{id:18,d:"easy",t:"Multiple Intelligences",q:"'Nature smart' with a love for nature is associated with which of Gardner's intelligences?",c:["A. Existential Intelligence","B. Musical Abilities","C. Naturalistic Abilities","D. Intrapersonal Abilities"],a:"C",e:"NATURALISTIC ABILITIES = 'nature smart' — love for nature, nature study, care for animals."},
{id:19,d:"easy",t:"Learning Styles",q:"Learning Style refers to the preferred way an individual ___.",c:["A. Scores on examinations","B. Processes information","C. Interacts with teachers","D. Completes assignments"],a:"B",e:"Learning Style refers to the PREFERRED WAY an individual PROCESSES INFORMATION — describes a person's typical mode of thinking, remembering, or problem solving."},
{id:20,d:"easy",t:"Laws of Learning",q:"The Law of Exercise states that things most often repeated are ___.",c:["A. Most easily forgotten","B. Best remembered","C. Most likely to be questioned","D. Least effective for learning"],a:"B",e:"LAW OF EXERCISE: things most often REPEATED are BEST REMEMBERED — this is why drills are used in teaching."},
{id:21,d:"easy",t:"Laws of Learning",q:"The Law of Primacy states that ___.",c:["A. Things most recently learned are best remembered","B. Things freely learned are best learned","C. Things learned first create a strong impression — what is taught must be right the first time","D. Learning is strengthened with a pleasant feeling"],a:"C",e:"LAW OF PRIMACY: things LEARNED FIRST create a STRONG IMPRESSION. What is taught must be RIGHT THE FIRST TIME — first impressions are lasting."},
{id:22,d:"easy",t:"Bloom's Taxonomy",q:"In the Revised Bloom's Taxonomy (Krathwohl, 2002), which level replaces 'Synthesis' in the old taxonomy?",c:["A. Evaluating","B. Applying","C. Analyzing","D. Creating"],a:"D",e:"In the REVISED TAXONOMY: old 'Synthesis' becomes 'CREATING' (putting things together — construct, combine, compose, formulate). Old 'Evaluation' becomes 'Evaluating.'"},
{id:23,d:"easy",t:"Bloom's Taxonomy",q:"In Bloom's Revised Taxonomy, 'Remembering' involves retrieving knowledge from ___.",c:["A. Short-term memory","B. Working memory","C. Long-term memory","D. Procedural memory"],a:"C",e:"REMEMBERING: retrieving relevant knowledge from LONG-TERM MEMORY. Sub-processes: recall, recognize, define, identify."},
{id:24,d:"easy",t:"Teaching Approaches",q:"In Teacher-Centered Approach, the learner is considered a ___.",c:["A. Active constructor of knowledge","B. Passive recipient of instruction","C. Collaborative partner in learning","D. Self-directed learner"],a:"B",e:"In TEACHER-CENTERED APPROACH, the learner is a PASSIVE RECIPIENT OF INSTRUCTION. The teacher is the only reliable source of information; teaching consists of telling and prescribing."},
{id:25,d:"easy",t:"Teaching Approaches",q:"The Deductive Method moves from ___.",c:["A. Specific to general","B. Simple to complex","C. General to specific","D. Easy to difficult"],a:"C",e:"DEDUCTIVE METHOD moves from GENERAL TO SPECIFIC. The teacher starts discussing a rule then ends with giving examples. It is associated with LOTS (lower-order thinking skills) and less interaction."},
{id:26,d:"easy",t:"Teaching Approaches",q:"The Inductive Method is also referred to as ___.",c:["A. Direct instruction","B. Deductive method","C. Indirect instruction","D. Lecture method"],a:"C",e:"The INDUCTIVE METHOD is also referred to as INDIRECT INSTRUCTION — it begins from specific to general, starting with questions, problems, and details and ending up with answers, generalizations, and conclusions."},
{id:27,d:"easy",t:"Cooperative Learning",q:"In Cooperative Learning, teams are made up of students with ___.",c:["A. Same ability levels","B. High ability only","C. Mixed abilities — high, average, and low achievers","D. Low ability only"],a:"C",e:"COOPERATIVE LEARNING teams are made up of MIXED ABILITIES — high, average, and low achievers. Reward systems are group-oriented rather than individually-oriented."},
{id:28,d:"easy",t:"Effective Teacher Characteristics",q:"A teacher who does not waste instructional time and starts on time demonstrates which characteristic of an effective teacher?",c:["A. Positive","B. Prepared","C. Creative","D. Fair"],a:"B",e:"PREPARED effective teachers: come to class each day ready to teach, always ready in class, don't waste instructional time and start on time. 'Time flies in their classes because students are engaged in learning.'"},
{id:29,d:"easy",t:"Mager's Objective Components",q:"Mager's Three Main Components of an Effective Objective include Performance, Condition, and ___.",c:["A. Content","B. Assessment","C. Acceptable Performance/Criterion of Success","D. Learning Outcome"],a:"C",e:"MAGER'S THREE COMPONENTS: (1) PERFORMANCE — what the student should be able to do; (2) CONDITION — conditions under which the performance will occur; (3) ACCEPTABLE PERFORMANCE/CRITERION OF SUCCESS — the criteria by which performance will be judged."},
{id:30,d:"easy",t:"Classroom Management Principles",q:"'Routines are the backbone of daily classroom life.' This is one of the key ___.",c:["A. Laws of Learning","B. Principles of Classroom Management","C. Characteristics of an Effective Teacher","D. Types of Classroom Manager"],a:"B",e:"This is one of the PRINCIPLES OF CLASSROOM MANAGEMENT — establishing routines for all daily tasks and needs saves valuable classroom time and makes it easier for students to learn and achieve more."},

// ═══════════════════ MODERATE (31–80) ═══════════════════
{id:31,d:"moderate",t:"PQF",q:"Which of the following is NOT listed as a purpose of the PQF?",c:["A. Assists individuals to move easily between different education and training sectors and the labor market","B. Aligns international qualifications for full recognition of Philippine qualifications","C. Provides direct employment to graduates of teacher education","D. Used as basis for accrediting certificates and licenses"],a:"C",e:"PQF purposes: (1) legal document adopting national standards; (2) assists movement between education sectors and labor market; (3) aligns international qualifications; (4) basis for accrediting certificates and licenses. Providing direct employment is NOT listed."},
{id:32,d:"moderate",t:"PPST",q:"The old NCBTS was institutionalized through which DepEd order?",c:["A. CHED Memorandum Order No. 42, s. 2017","B. Department Order 42, s. 2017","C. CHED Memorandum Order No. 52, s. 2007 and DepEd Order No. 32, s. 2009","D. Republic Act 10533"],a:"C",e:"NCBTS (National Competency-Based Teacher Standards) was institutionalized through CHED Memorandum Order No. 52, s. 2007 and DepEd Order No. 32, s. 2009. The new PPST is implemented through DO 42, s. 2017."},
{id:33,d:"moderate",t:"PPST — Domain 5",q:"Domain 5, Assessment and Reporting, is composed of five strands. Which of the following is NOT one of those strands?",c:["A. Design, selection, organization and utilization of assessment strategies","B. Monitoring and evaluation of learner progress and achievement","C. Management of classroom structure and activities","D. Use of assessment data to enhance teaching and learning practices"],a:"C",e:"'Management of classroom structure and activities' is a strand of DOMAIN 2 (Learning Environment), NOT Domain 5. Domain 5 strands include: design of assessment strategies, monitoring learner progress, feedback to improve learning, communication to stakeholders, and use of assessment data."},
{id:34,d:"moderate",t:"PPST — Domain 6",q:"Domain 6, Community Linkages and Professional Engagement, consists of how many strands?",c:["A. 3","B. 4","C. 5","D. 6"],a:"B",e:"Domain 6 consists of FOUR strands: (1) Establishment of learning environments responsive to community contexts; (2) Engagement of parents and wider school community; (3) Professional ethics; (4) School policies and procedures."},
{id:35,d:"moderate",t:"Career Stages",q:"Career Stage 2 (Proficient Teachers) are described as INDIVIDUALLY ___.",c:["A. Seeking advice from experienced colleagues","B. Professionally independent in the application of skills vital to teaching","C. Displaying the highest standard for teaching grounded in global best practices","D. Manifesting sophisticated understanding of teaching and learning"],a:"B",e:"Career Stage 2 (Proficient Teachers): are PROFESSIONALLY INDEPENDENT in the application of skills vital to teaching. They provide focused teaching programs, display skills in planning, implementing, and managing learning programs."},
{id:36,d:"moderate",t:"Career Stages",q:"Career Stage 3 (Highly Proficient Teachers) are characterized as ___.",c:["A. Beginning stage — seeking advice from senior teachers","B. Leaders in education who embody the highest global standards","C. Consistently displaying high level of performance in teaching practice and are mentors","D. Professionally independent and reflective practitioners"],a:"C",e:"Career Stage 3 (HIGHLY PROFICIENT TEACHERS) = MENTORS — consistently display HIGH LEVEL OF PERFORMANCE in teaching; have high education-focused situation cognition; provide support and mentoring to colleagues."},
{id:37,d:"moderate",t:"Career Stages",q:"Career Stage 4 teachers are described as LEADERS IN EDUCATION. Which characteristic is UNIQUE to Career Stage 4?",c:["A. They seek advice from experienced colleagues","B. They provide focused teaching programs meeting curriculum requirements","C. They embody the highest standard for teaching grounded in global best practices","D. They display high-level performance in teaching"],a:"C",e:"CAREER STAGE 4 (DISTINGUISHED TEACHERS): embody the HIGHEST STANDARD for teaching GROUNDED IN GLOBAL BEST PRACTICES; exhibit exceptional capacity to improve their own and others' practice; recognized as leaders in education."},
{id:38,d:"moderate",t:"Classroom Management",q:"The principle 'Resolve minor inattention and disruption before they become major disruption' is an example of which concept?",c:["A. Ripple Effect","B. With-it-ness","C. Proactive discipline","D. Pygmalion Effect"],a:"C",e:"This is one of the PRINCIPLES OF CLASSROOM MANAGEMENT — specifically related to PROACTIVE DISCIPLINE. Proactive means anticipating and preventing behavior problems (rules set at day 1 of class, anticipatory, inventive)."},
{id:39,d:"moderate",t:"Types of Classroom Manager",q:"An Authoritarian classroom manager is characterized by which phrase?",c:["A. Warm but not demanding","B. Neither demanding nor warm","C. Demanding but not warm","D. Demanding yet warm"],a:"C",e:"AUTHORITARIAN = DEMANDING BUT NOT WARM. Characterized by power, domination, pressure, and criticism. The authoritarian teacher uses pressure, a sharp voice, and fear in forcing class decisions."},
{id:40,d:"moderate",t:"Approaches to Classroom Management",q:"The Business Academic Approach was developed by ___.",c:["A. Jacob Kounin","B. Duke and Mechei","C. Evertson and Emmer","D. Robert Mager"],a:"C",e:"BUSINESS ACADEMIC APPROACH was developed by EVERTSON AND EMMER. It emphasizes the organization and management of students as they engage in academic work — clear communication of assignments and work requirements, monitoring student work, and feedback."},
{id:41,d:"moderate",t:"Approaches to Classroom Management",q:"The Group Managerial Approach is based on whose research?",c:["A. Evertson and Emmer","B. Jacob Kounin","C. Duke and Mechei","D. Howard Gardner"],a:"B",e:"GROUP MANAGERIAL APPROACH is based on JACOB KOUNIN's research. It emphasizes the importance of responding immediately to group student behavior that might be inappropriate in order to prevent problems."},
{id:42,d:"moderate",t:"Effects in Classroom",q:"'The greater the expectation placed upon people, the better they perform.' This defines which effect?",c:["A. Hawthorne Effect","B. John Henry Effect","C. Placebo Effect","D. Pygmalion/Rosenthal Effect"],a:"D",e:"PYGMALION/ROSENTHAL EFFECT — the phenomenon whereby the GREATER THE EXPECTATION placed upon people, the BETTER THEY PERFORM. Higher teacher expectations lead to higher student achievement."},
{id:43,d:"moderate",t:"Effects in Classroom",q:"The Hawthorne Effect (also called Observer Effect) is described as ___.",c:["A. A control group gets no intervention but competes with the experimental group","B. Individuals modify or improve an aspect of their behavior in response to their awareness of being observed","C. Greater expectation leads to better performance","D. A fake treatment improves a patient's condition based on belief"],a:"B",e:"HAWTHORNE EFFECT (OBSERVER EFFECT): individuals MODIFY or IMPROVE an aspect of their BEHAVIOR in RESPONSE TO THEIR AWARENESS OF BEING OBSERVED."},
{id:44,d:"moderate",t:"Effects in Classroom",q:"The John Henry Effect is the opposite of which effect?",c:["A. Pygmalion Effect","B. Placebo Effect","C. Hawthorne Effect","D. Halo Effect"],a:"C",e:"JOHN HENRY EFFECT is the OPPOSITE OF THE HAWTHORNE EFFECT — it is when a CONTROL GROUP that gets no intervention compares themselves to the experimental group and through EXTRA EFFORT gets the same effects or results."},
{id:45,d:"moderate",t:"Effects in Classroom",q:"The Halo Effect is described as ___.",c:["A. A cognitive bias where overall impression of a person influences thoughts about their character","B. A control group competing with an experimental group","C. Behavior change due to being observed","D. Students performing better due to teacher expectations"],a:"A",e:"HALO EFFECT: a COGNITIVE BIAS in which an observer's OVERALL IMPRESSION OF A PERSON (company, brand, or product) INFLUENCES the observer's FEELINGS AND THOUGHTS about that entity's character or properties."},
{id:46,d:"moderate",t:"Group Focus Techniques",q:"'With-it-ness' is described as the skill to ___.",c:["A. Respond when appropriate by pointing out misconduct","B. Know what is going on in all parts of the classroom at all times — nothing is missed","C. Place the teacher's presence close to a misbehaving student","D. Use a child's name in an example"],a:"B",e:"WITH-IT-NESS: the skill to KNOW WHAT IS GOING ON IN ALL PARTS OF THE CLASSROOM AT ALL TIMES; nothing is missed. The teacher has 'eyes in the back of their head.'"},
{id:47,d:"moderate",t:"Group Focus Techniques",q:"'Flip-flop' in Kounin's analysis refers to ___.",c:["A. A teacher moving at a brisk pace through lessons","B. A teacher involving the whole class using alerting techniques","C. A teacher who terminates one activity, goes to another, then returns to the previously terminated activity — lacks clear direction","D. A teacher responding immediately to group misbehavior"],a:"C",e:"FLIP-FLOP: the teacher TERMINATES ONE ACTIVITY, goes to ANOTHER, then RETURNS to the previously terminated activity. The teacher LACKS CLEAR DIRECTION and sequence of activities."},
{id:48,d:"moderate",t:"Group Focus Techniques",q:"'Antiseptic Bouncing' refers to ___.",c:["A. Ignoring a student's action done for attention","B. Asking a student to leave the room if uncontrollably misbehaving","C. Using humor to release tension in a tensed situation","D. Placing the teacher's presence close to a misbehaving student"],a:"B",e:"ANTISEPTIC BOUNCING: ASKING A STUDENT TO LEAVE THE ROOM if he or she is uncontrollably giggling or misbehaving that affects the majority of the class."},
{id:49,d:"moderate",t:"Multiple Intelligences",q:"A student who works best independently, keeps journals and diaries, and works on self-paced projects demonstrates which intelligence?",c:["A. Interpersonal Abilities","B. Musical Abilities","C. Intrapersonal Abilities","D. Naturalistic Abilities"],a:"C",e:"INTRAPERSONAL ABILITIES = 'self-smart' — works independently, keeps journals and diaries, works alone, does self-paced projects, reflecting and having space."},
{id:50,d:"moderate",t:"Multiple Intelligences",q:"Existential Intelligence is associated with ___.",c:["A. Body smart — manipulating what is learned","B. Spirit smart — asking big questions, thinking philosophy, 'Who am I?'","C. People smart — group work and team work","D. Music smart — ear for good music"],a:"B",e:"EXISTENTIAL INTELLIGENCE = 'spirit smart' — 'Who am I?' — asks deep questions, thinks philosophy, looks at the big picture, seeks meaningful learning."},
{id:51,d:"moderate",t:"Learning Styles",q:"A Visual-Iconic learner is MOST described by which characteristic?",c:["A. Comfortable with abstract symbolism such as mathematical formulae","B. Prefers to read a book than a map","C. More interested in visual imagery such as film, graphic displays, or pictures — has 'picture memory'","D. Learns best through verbal lectures"],a:"C",e:"VISUAL-ICONIC learners: more interested in VISUAL IMAGERY such as film, graphic displays, or pictures to solidify learning. Have 'picture memory' (iconic memory) and prefer maps to books."},
{id:52,d:"moderate",t:"Learning Styles",q:"Visual-Symbolic learners are characterized by ___.",c:["A. Interest in film, graphic displays, and pictures","B. Preferring to read a map rather than a book","C. Comfort with abstract symbolism such as mathematical formulae or the written word — good abstract thinkers","D. Learning best by listening to lectures"],a:"C",e:"VISUAL-SYMBOLIC learners: feel COMFORTABLE WITH ABSTRACT SYMBOLISM such as mathematical formulae or the WRITTEN WORD. Prefer to read a book than a map. Tend to be good ABSTRACT THINKERS."},
{id:53,d:"moderate",t:"Roger Sperry's Model",q:"In Roger Sperry's Model, the Left Brain (Analytic) is characterized by which of the following?",c:["A. Visual processing, responds to tone of voice, random, processes in varied order","B. Verbal, responds to word meaning, sequential, processes information linearly, responds to logic","C. Impulsive, responds to emotion, gestures when speaking","D. Prefers sound/music background while studying"],a:"B",e:"LEFT BRAIN (ANALYTIC): VERBAL, responds to WORD MEANING, SEQUENTIAL, PROCESSES INFORMATION LINEARLY, RESPONDS TO LOGIC, plans ahead, recalls names, speaks with few gestures, PUNCTUAL, prefers formal study design and bright lights."},
{id:54,d:"moderate",t:"Roger Sperry's Model",q:"The Right Brain (Global) learner prefers ___.",c:["A. Sequential processing and formal study design","B. Responding to word meaning and logic","C. Sound/music background while studying and processes information in varied order","D. Verbal communication and bright lights while studying"],a:"C",e:"RIGHT BRAIN (GLOBAL): visual, responds to TONE OF VOICE, RANDOM, processes information in VARIED ORDER, responds to emotion, IMPULSIVE, recalls faces, GESTURES WHEN SPEAKING, LESS PUNCTUAL, PREFERS SOUND/MUSIC background while studying."},
{id:55,d:"moderate",t:"Differentiated Instruction",q:"Differentiated Instruction (DI) is a teaching theory based on the premise that ___.",c:["A. All students should receive identical instruction","B. Instructional approaches should vary and be adapted in relation to individual and diverse students","C. The teacher is the primary source of all learning","D. Content should be standardized across all classrooms"],a:"B",e:"DIFFERENTIATED INSTRUCTION (DI): teaching theory based on the premise that INSTRUCTIONAL APPROACHES SHOULD VARY AND BE ADAPTED in RELATION TO INDIVIDUAL AND DIVERSE STUDENTS in the classroom."},
{id:56,d:"moderate",t:"Principles of Learning",q:"'Learning is the discovery of the personal meaning and relevance of ideas.' Which Principle of Learning does this represent?",c:["A. Learning is a cooperative and collaborative process","B. The process of learning is emotional as well as intellectual","C. Learning is the discovery of the personal meaning and relevance of ideas","D. Learning is sometimes a painful process"],a:"C",e:"This is PRINCIPLE 2 of the Principles of Learning: 'Learning is the DISCOVERY OF THE PERSONAL MEANING AND RELEVANCE OF IDEAS.' Making your class RELATABLE helps learners discover why what they learn matters."},
{id:57,d:"moderate",t:"Laws of Learning",q:"The Law of Readiness states that individuals learn best when they are ___.",c:["A. Most recently exposed to the information","B. Physically, mentally, and emotionally ready to learn","C. Experiencing pleasant feelings during learning","D. Frequently repeating the material"],a:"B",e:"LAW OF READINESS: individuals learn best when they are PHYSICALLY, MENTALLY, AND EMOTIONALLY READY to learn. They do learn well if they see NO REASON FOR LEARNING (motivated)."},
{id:58,d:"moderate",t:"Laws of Learning",q:"The Law of Recency states that ___.",c:["A. The more intense the material taught, the more it is likely learned","B. Things freely learned are best learned","C. Things most recently learned are best remembered","D. Things most often repeated are best remembered"],a:"C",e:"LAW OF RECENCY: things MOST RECENTLY LEARNED are BEST REMEMBERED. This supports the use of reviews and summaries at the end of lessons."},
{id:59,d:"moderate",t:"Cognitive Structures — Charles Lettieri",q:"'The ability to select relevant or important information without being distracted or confused by irrelevant secondary information' — this defines which of Lettieri's 7 Cognitive Structures?",c:["A. Analysis (field dependence-independence)","B. Comparative Analysis (reflective-impulsivity)","C. Narrowing (breadth of categorization)","D. Focusing (scanning/concentration)"],a:"D",e:"FOCUSING (SCANNING/CONCENTRATION): the ability to SELECT RELEVANT OR IMPORTANT INFORMATION WITHOUT BEING DISTRACTED or confused by irrelevant secondary information."},
{id:60,d:"moderate",t:"Cognitive Structures — Charles Lettieri",q:"Which cognitive structure involves 'the ability to integrate complex information into existing cognitive structures (long-term memory)'?",c:["A. Sharpening (sharpening-leveling)","B. Analysis (field dependence-independence)","C. Complex Cognitive (complexity-simplicity)","D. Tolerance (tolerant-intolerant)"],a:"C",e:"COMPLEX COGNITIVE (COMPLEXITY-SIMPLICITY): the ability to INTEGRATE COMPLEX INFORMATION INTO EXISTING COGNITIVE STRUCTURES — connecting past to present (long-term memory)."},
{id:61,d:"moderate",t:"Bloom's Taxonomy — Knowledge Dimension",q:"Which Knowledge Dimension category involves 'knowledge of cognition in general and awareness of one's own cognition — thinking about thinking'?",c:["A. Factual Knowledge","B. Conceptual Knowledge","C. Procedural Knowledge","D. Metacognitive Knowledge"],a:"D",e:"METACOGNITIVE KNOWLEDGE: knowledge of COGNITION IN GENERAL, AWARENESS of one's own cognition — THINKING ABOUT THINKING. Includes knowledge of strategies, cognitive tasks, and self-knowledge."},
{id:62,d:"moderate",t:"Bloom's Taxonomy",q:"In the Revised Bloom's Taxonomy, 'Evaluating' involves making judgments based on criteria and standards. The sub-processes include ___.",c:["A. Recall, recognize, define, identify","B. Use, employ, apply","C. Break down, categorize, group","D. Check, critique, rate, judge"],a:"D",e:"EVALUATING: making judgments based on criteria and standards. Sub-processes: CHECK, CRITIQUE, RATE, JUDGE. Example: judging whether a solution meets required criteria."},
{id:63,d:"moderate",t:"Affective Domain",q:"In David Krathwohl's Affective Domain, a student who shows 'willingness to attend to particular classroom stimuli or phenomenon in the environment' is at which level?",c:["A. Responding","B. Valuing","C. Receiving","D. Organization"],a:"C",e:"RECEIVING: the student shows WILLINGNESS TO ATTEND to particular classroom stimuli or phenomenon. Example: watching a video about climate change. This is the first level of the Affective Domain."},
{id:64,d:"moderate",t:"Affective Domain",q:"A student who arranges a union in school to help the environment and provide awareness on climate change is demonstrating which affective level?",c:["A. Receiving","B. Valuing","C. Responding","D. Organization"],a:"D",e:"ORGANIZATION: the student has INTEGRATED A NEW VALUE into his general set of values and can give it its proper place in a priority system. Example: arranging a union in school — showing commitment beyond individual valuing."},
{id:65,d:"moderate",t:"Psychomotor Domain",q:"In Anita Harrow's Psychomotor Domain, movements that students have innately formed from a combination of reflex movements (like walking, running, pushing) are classified as ___.",c:["A. Reflex movements","B. Basic fundamental movement","C. Perceptual abilities","D. Physical activities"],a:"B",e:"BASIC FUNDAMENTAL MOVEMENT: students have INNATE MOVEMENT PATTERNS formed from a COMBINATION OF REFLEX MOVEMENTS. Examples: walking, running, pushing, twisting, gripping, grasping, manipulating."},
{id:66,d:"moderate",t:"Psychomotor Domain — Moore",q:"In Moore's 3 Levels of Learning Psychomotor Domain, the HIGHEST level is ___.",c:["A. Imitation","B. Manipulation","C. Precision","D. Automaticity"],a:"C",e:"PRECISION is the HIGHEST LEVEL in Moore's 3 Levels — students can perform the skill accurately, efficiently, and effortlessly. AUTOMATICITY (ability to perform with unconscious effort) is associated with precision."},
{id:67,d:"moderate",t:"Content Selection Qualities",q:"'Validity' in content selection means ___.",c:["A. The content responds to the needs and interests of learners","B. Content covers facts, skills, and values","C. Teaching the content we ought to teach according to the national standards in the Basic Education Curriculum","D. The content can be covered in time available"],a:"C",e:"VALIDITY: means TEACHING THE CONTENT THAT WE OUGHT TO TEACH ACCORDING TO THE NATIONAL STANDARDS in the Basic Education Curriculum. It aligns content to official standards."},
{id:68,d:"moderate",t:"Content Selection Qualities",q:"'Self-sufficiency' in content selection refers to ___.",c:["A. Content that responds to learner needs","B. Content should cover the essentials of the lesson — 'a mile wide and an inch deep'","C. Content includes facts, skills, and values","D. Content can be covered in the time available for instruction"],a:"B",e:"SELF-SUFFICIENCY: content should cover the ESSENTIALS OF THE LESSON and NOT 'a mile wide and an inch deep' — quality over quantity in content coverage."},
{id:69,d:"moderate",t:"Cognitive Content — Day 5",q:"'A categorization of events, places, people, ideas' defines which component of cognitive content?",c:["A. Fact","B. Hypothesis","C. Principle","D. Concept"],a:"D",e:"CONCEPT: CATEGORIZATION OF EVENTS, PLACES, PEOPLE, IDEAS. It is a category or mental grouping. Compare: Fact = verifiable idea/action; Principle = relationship between facts and concepts; Hypothesis = educated guess."},
{id:70,d:"moderate",t:"Thinking Skills — Day 5",q:"'Fluent thinking, flexible thinking, original thinking, and elaborative thinking' are all components of ___.",c:["A. Convergent thinking","B. Critical thinking","C. Metaphoric thinking","D. Divergent thinking"],a:"D",e:"DIVERGENT THINKING contains: FLUENT THINKING (generation of lots of ideas), FLEXIBLE THINKING (variety of types of ideas), ORIGINAL THINKING (away from the obvious), ELABORATIVE THINKING (uses prior knowledge to expand)."},
{id:71,d:"moderate",t:"Teaching Approaches",q:"The Banking Approach views students as ___.",c:["A. Active constructors of knowledge","B. Empty receptacles waiting to be filled (tabula rasa)","C. Partners in collaborative learning","D. Self-directed learners"],a:"B",e:"BANKING APPROACH: teacher deposits knowledge into 'empty minds' of students. Students are EMPTY RECEPTACLES WAITING TO BE FILLED — 'tabula rasa.' Associated with John Locke. Similar to Freire's critique of traditional education."},
{id:72,d:"moderate",t:"Teaching Approaches",q:"The Constructivist Approach views learning as ___.",c:["A. A passive reception of teacher-transmitted knowledge","B. An active process that results from self-constructed meanings with a meaningful connection between prior and present knowledge","C. A process of depositing facts into student memory","D. A process of following prescribed procedures"],a:"B",e:"CONSTRUCTIVIST APPROACH: LEARNING IS AN ACTIVE PROCESS that results from SELF-CONSTRUCTED MEANINGS. A meaningful connection is established between PRIOR KNOWLEDGE and the PRESENT LEARNING ACTIVITY. Teacher's role is to FACILITATE the learning environment."},
{id:73,d:"moderate",t:"Integrated Approach",q:"When teachers organize the curriculum around students' questions and concerns, teaching using real-life context, this is called ___.",c:["A. Intradisciplinary","B. Interdisciplinary","C. Transdisciplinary","D. Multidisciplinary"],a:"C",e:"TRANSDISCIPLINARY: teachers organize the curriculum around STUDENTS' QUESTIONS AND CONCERNS, teaching using REAL-LIFE CONTEXT. Compare: Intradisciplinary = within one subject; Interdisciplinary = between two different subjects."},
{id:74,d:"moderate",t:"Direct Instruction Components",q:"In Direct Instruction, 'Consolidation (Extension)' is the component where ___.",c:["A. Teachers and students work together on a skill or task","B. Students complete assignments by themselves first in class, then at home","C. The teacher helps students consider a skill in relation to several examples to determine when the skill should or should not be used","D. The teacher asks students to apply the skill in a new problem"],a:"C",e:"CONSOLIDATION (EXTENSION): the teacher HELPS STUDENTS CONSIDER A SKILL in relation to SEVERAL EXAMPLES and to DETERMINE WHETHER THE SKILLS SHOULD OR SHOULD NOT BE USED — deepening understanding of when to apply a skill."},
{id:75,d:"moderate",t:"Cooperative Learning Elements",q:"Which of the following is NOT one of the five elements of the Cooperative Learning Model?",c:["A. Positive Interdependence","B. Face-to-Face Interaction","C. Individual and Group Accountability","D. Teacher-Centered Instruction"],a:"D",e:"The 5 elements of Cooperative Learning: (1) POSITIVE INTERDEPENDENCE, (2) FACE-TO-FACE INTERACTION, (3) INDIVIDUAL AND GROUP ACCOUNTABILITY, (4) INTERPERSONAL AND SMALL GROUP SKILLS, (5) GROUP PROCESSING. Teacher-centered instruction is not an element."},
{id:76,d:"moderate",t:"Student Problem Types",q:"A student who says 'you can't make me,' resists verbally, and contradicts the teacher is MOST likely which type of problem student?",c:["A. Withdrawn","B. Passive Aggressive","C. Hyperactive","D. Defiant"],a:"D",e:"DEFIANT students: RESIST AUTHORITY, carry on a POWER STRUGGLE with the teacher. Signs: resists verbally with 'you can't make me,' derogatory statements, resists non-verbally with frowns, deliberately does what teacher says not to do."},
{id:77,d:"moderate",t:"Student Problem Types",q:"A student who has low potential or lack of readiness rather than poor motivation — has difficulty following directions, poor retention, progresses slowly — is a ___.",c:["A. Distractible student","B. Underachiever","C. Low Achiever","D. Failure Syndrome student"],a:"C",e:"LOW ACHIEVER: have difficulty even though they may be WILLING TO WORK. Their problem is LOW POTENTIAL OR LACK OF READINESS RATHER THAN POOR MOTIVATION. Signs: difficulty following directions, completing work, poor retention, progresses slowly."},
{id:78,d:"moderate",t:"4 Mistaken Goals",q:"A student who disrupts the classroom, asks for favors, tattles on others, and refuses to work — seeking to 'keep others busy or get special service' — has which mistaken goal?",c:["A. Goal to Seek Power","B. Goal to Seek Revenge","C. Goal to Seek Attention","D. Goal to Isolate Oneself"],a:"C",e:"GOAL TO SEEK ATTENTION: 'to keep others busy or to get special service.' Child's belief: 'I count (belong) only when I'm being noticed or getting special service.' Teacher response: Notice Me–Involve Me."},
{id:79,d:"moderate",t:"4 Mistaken Goals",q:"For a child whose goal is to Seek Revenge, what does the child need?",c:["A. Notice Me–Involve Me","B. Let Me Help–Give Me Choices","C. Have Faith in Me–Don't Give Up On Me","D. Help Me–I'm Hurting"],a:"D",e:"GOAL TO SEEK REVENGE: child's belief — 'I can't be liked or loved, so I'll hurt others as I feel hurt.' Child needs: HELP ME–I'M HURTING. Adults: apologize, avoid punishment and retaliation, show you care."},
{id:80,d:"moderate",t:"Tutoring Arrangements",q:"'Monitorial tutoring' refers to ___.",c:["A. Older students helping younger ones on a one-to-one basis","B. The class divided into groups with monitors assigned to lead each group","C. Children acting as interactive pairs for same-age tutoring","D. A combination of unstructured and structured tutoring"],a:"B",e:"MONITORIAL TUTORING: the CLASS MAY BE DIVIDED INTO GROUPS and MONITORS ARE ASSIGNED TO LEAD EACH GROUP. Compare: Instructional tutoring = older helps younger; Same-age tutoring = interactive pairs; Semi-structured = combination of unstructured and structured."},

// ═══════════════════ DIFFICULT (81–100) ═══════════════════
{id:81,d:"difficult",t:"Integrated Application — PQF & PPST",q:"A teacher education institution graduates a student with PQF 6 qualifications. According to the document, this student should ALSO master ___.",c:["A. The NCBTS framework","B. The PPST — Beginning Teacher Standards","C. Department Order 32, s. 2009","D. The PPSSH"],a:"B",e:"Teacher education institutions have the responsibility of graduating students with PQF 6 qualifications AND to MASTER THE PPST — specifically the BEGINNING TEACHER STANDARDS, which are the expectation of the teaching industry in basic education."},
{id:82,d:"difficult",t:"Career Stages — Analysis",q:"A teacher is 'professionally independent,' provides focused teaching programs, is a reflective practitioner consolidating Career Stage 1 knowledge, and actively engages in collaborative learning with the professional community. This teacher is MOST accurately at which career stage?",c:["A. Career Stage 1 — Beginning Teachers","B. Career Stage 2 — Proficient Teachers","C. Career Stage 3 — Highly Proficient Teachers","D. Career Stage 4 — Distinguished Teachers"],a:"B",e:"CAREER STAGE 2 (PROFICIENT): professionally INDEPENDENT, provides FOCUSED TEACHING PROGRAMS, reflective practitioners who consolidate Career Stage 1 knowledge, actively engage in COLLABORATIVE LEARNING with stakeholders for mutual growth."},
{id:83,d:"difficult",t:"Classroom Management Effects — Analysis",q:"A teacher tells students that Santa Claus is coming with gifts ONLY for well-behaved students. Students begin behaving well. Which effect BEST explains this behavior change?",c:["A. Hawthorne Effect","B. Pygmalion Effect","C. Halo Effect","D. Placebo Effect"],a:"D",e:"PLACEBO EFFECT: an inactive substance or FALSE BELIEF/EXPECTATION improves behavior because the PERSON BELIEVES it will work. The teacher conditioned children to BELIEVE Santa is coming — they behave based on that belief/expectation, not actual intervention."},
{id:84,d:"difficult",t:"Domain Analysis — PPST",q:"A teacher designs lessons aligned with learning competencies, uses ICT to enrich practice, and ensures professional collaboration with colleagues. These actions PRIMARILY reflect which PPST Domain?",c:["A. Domain 2 — Learning Environment","B. Domain 1 — Content Knowledge and Pedagogy","C. Domain 4 — Curriculum and Planning","D. Domain 7 — Personal Growth and Professional Development"],a:"C",e:"DOMAIN 4 (CURRICULUM AND PLANNING) strands: (1) Planning and management of teaching and learning process; (2) Learning outcomes aligned with learning competencies; (3) Relevance and responsiveness of learning programs; (4) PROFESSIONAL COLLABORATION to enrich teaching practice; (5) Teaching and learning resources including ICT."},
{id:85,d:"difficult",t:"Bloom's Taxonomy — Application",q:"A student is asked to 'Design a solution to reduce plastic waste in your community using the engineering design process.' Which cell in the Revised Bloom's Taxonomy BEST represents this task?",c:["A. Remembering — Factual Knowledge","B. Understanding — Conceptual Knowledge","C. Creating — Procedural Knowledge","D. Analyzing — Metacognitive Knowledge"],a:"C",e:"CREATING (highest cognitive level) + PROCEDURAL KNOWLEDGE (how things work, step-by-step actions, methods). Designing a solution is CREATING; using the engineering design process is PROCEDURAL. This is the highest-order, most complex cell."},
{id:86,d:"difficult",t:"Teaching Approaches — Deep Analysis",q:"A teacher using the Metacognitive Approach allows students to think aloud about their own thought processes while solving a problem. A teacher using the Constructivist Approach facilitates a learning environment where students connect prior knowledge to new concepts. What is the KEY DIFFERENCE between these two approaches?",c:["A. Both approaches have the same underlying philosophy","B. Metacognitive focuses on MONITORING THOUGHT PROCESSES while thinking; Constructivist focuses on BUILDING MEANING through the connection of prior and present knowledge","C. Constructivist is teacher-centered; Metacognitive is student-centered","D. Metacognitive uses banking approach; Constructivist uses inquiry"],a:"B",e:"KEY DIFFERENCE: METACOGNITIVE = thinking about thinking, MONITORING THOUGHT PROCESSES, going beyond cognition, allowing students to THINK ALOUD. CONSTRUCTIVIST = learning as ACTIVE PROCESS, SELF-CONSTRUCTED MEANINGS, connection of PRIOR KNOWLEDGE to present learning activity. Both are student-centered but address different aspects of learning."},
{id:87,d:"difficult",t:"Inductive vs. Deductive — Analysis",q:"A teacher introduces a grammar lesson by giving students several example sentences containing the passive voice, then asks students to figure out the rule. Which approach is being used, and what are its TWO MAIN ADVANTAGES according to the document?",c:["A. Deductive Method — uses generalization first, develops LOTS","B. Inductive Method — learners are more engaged, learning becomes more interesting because it begins with experiences, and develops HOTS","C. Direct Instruction — teacher directed, used for facts and principles","D. Demonstration Method — shows how a process is done while students observe"],a:"B",e:"INDUCTIVE METHOD (specific→general): begins with EXAMPLES then leads to the RULE. Advantages: (1) LEARNERS ARE MORE ENGAGED; (2) LEARNING BECOMES MORE INTERESTING because it begins with experiences of the learners; (3) DEVELOPS HOTS (Higher-Order Thinking Skills)."},
{id:88,d:"difficult",t:"Student Problem Types — Case Analysis",q:"A student who repeatedly says 'I can't do it,' gives up easily, is easily frustrated, and expects to fail even after succeeding MOST LIKELY demonstrates which student problem type?",c:["A. Low Achiever — has low potential or lack of readiness","B. Underachiever — does the minimum to get by","C. Failure Syndrome — convinced they cannot do their work and expect to fail even after succeeding","D. Perfectionist — unrealistically high self-imposed standards"],a:"C",e:"FAILURE SYNDROME: children are CONVINCED THAT THEY CANNOT DO THEIR WORK. They EXPECT TO FAIL EVEN AFTER SUCCEEDING. Signs: easily frustrated, easily gives up, says 'I can't do it.' Unlike Low Achiever (lacks ability), Failure Syndrome students may have the ability but are psychologically blocked."},
{id:89,d:"difficult",t:"4 Mistaken Goals — Deep Analysis",q:"A child who retreats further when confronted, shows no improvement or response, and needs to convince the teacher of their disability in order to be left alone — has which mistaken goal? What does this child need?",c:["A. Seek Attention — needs Notice Me–Involve Me","B. Seek Power — needs Let Me Help–Give Me Choices","C. Isolate Oneself (assumed inadequacy) — needs Have Faith in Me–Don't Give Up On Me","D. Seek Revenge — needs Help Me–I'm Hurting"],a:"C",e:"GOAL TO ISOLATE ONESELF (ASSUMED INADEQUACY): 'to give up and be left alone.' Child needs to CONVINCE TEACHER OF DISABILITY to be left alone. NO IMPROVEMENT, NO RESPONSE, RETREATS FURTHER. Child needs: HAVE FAITH IN ME–DON'T GIVE UP ON ME. Teacher: take small steps, make task easier until child experiences success."},
{id:90,d:"difficult",t:"Cognitive Structures — Application",q:"A student who can deal with ambiguous or unclear information without getting frustrated, and can monitor and modify their thinking, demonstrates which of Lettieri's cognitive structures?",c:["A. Sharpening (sharpening-leveling)","B. Complex Cognitive (complexity-simplicity)","C. Tolerance (tolerant-intolerant)","D. Focusing (scanning/concentration)"],a:"C",e:"TOLERANCE (TOLERANT-INTOLERANT): the ability to MONITOR AND MODIFY THINKING, the ability to DEAL WITH AMBIGUOUS OR UNCLEAR INFORMATION WITHOUT GETTING FRUSTRATED. This is key for adaptable, resilient learners."},
{id:91,d:"difficult",t:"Comprehensive Integration — Multiple Intelligences & Learning Styles",q:"A student who prefers group work, talking to people, and cooperating — while also being right-brained (responds to emotion, processes information in varied order, prefers sound while studying) — would MOST BENEFIT from which teaching activity?",c:["A. Individual written reflections with quiet formal study setting","B. Sequential, step-by-step lecture with bright lights","C. Abstract symbolic problem-solving with mathematical formulae","D. Collaborative musical project with group singing and creating jingles"],a:"D",e:"This student has: INTERPERSONAL ABILITIES (people smart, group work, cooperating) + RIGHT BRAIN (responds to emotion, random, prefers sound/music). BEST ACTIVITY: collaborative musical project — uses interpersonal intelligence through group collaboration AND musical intelligence through jingles AND appeals to right-brain's preference for music and emotional/varied processing."},
{id:92,d:"difficult",t:"Laws of Learning — Critical Application",q:"A student who studied Chapter 5 of a textbook last night scores highest on those questions in today's quiz. However, they had studied Chapter 1 first, and it was the most exciting. Which TWO laws BEST explain this student's performance pattern?",c:["A. Law of Exercise and Law of Primacy","B. Law of Recency and Law of Effect","C. Law of Recency (best on Chapter 5 studied last) and Law of Intensity (Chapter 1 — most exciting/intense = more likely learned)","D. Law of Freedom and Law of Readiness"],a:"C",e:"LAW OF RECENCY: THINGS MOST RECENTLY LEARNED are best remembered — explains scoring highest on Chapter 5 (studied last night/most recently). LAW OF INTENSITY: THE MORE INTENSE THE MATERIAL TAUGHT, THE MORE IT IS LIKELY LEARNED — explains remembering Chapter 1 (most exciting). Both laws operate simultaneously."},
{id:93,d:"difficult",t:"Deep Analysis — Classroom Management Approaches",q:"A teacher increases rewards for good behavior and applies consistent consequences for inappropriate behavior. Which classroom management approach is this?",c:["A. Assertive Approach — specifies rules and consequences","B. Behavior Modification Approach — increases appropriate behavior through rewards and reduces inappropriate behavior through punishments","C. Business Academic Approach — emphasizes academic work and clear communication","D. Group Managerial Approach — based on Kounin's research"],a:"B",e:"BEHAVIOR MODIFICATION APPROACH: STRIVES TO INCREASE THE OCCURRENCE OF APPROPRIATE BEHAVIOR through a system of REWARDS and REDUCE LIKELIHOOD OF INAPPROPRIATE BEHAVIOR through PUNISHMENTS. Based on behavioral psychology — good/bad stimulus responses."},
{id:94,d:"difficult",t:"Synthesis — Teaching Methods",q:"A science teacher asks students to investigate 'What makes bread mold faster?' Students design their own experiment, collect data, and present findings. This BEST reflects which method and what is its defining characteristic?",c:["A. Demonstration Method — teacher shows while students observe","B. Project Method — self-directed study presenting results in concrete form","C. Inquiry Method — modeled after investigative processes of scientists, sometimes called discovery, heuristic, or problem solving","D. Deductive Method — teacher presents the rule first"],a:"C",e:"INQUIRY METHOD: sometimes termed 'DISCOVERY,' 'HEURISTIC,' and 'PROBLEM SOLVING.' DEFINED AS a teaching method MODELLED AFTER THE INVESTIGATIVE PROCESSES OF SCIENTISTS. Students investigate a question, collect data, and construct knowledge — exactly what scientists do."},
{id:95,d:"difficult",t:"Assessment — Affective & Psychomotor Integration",q:"A student who can perform a complex dance routine accurately, efficiently, and effortlessly — and simultaneously expresses the emotion of the dance through body movements and facial expressions — has reached which levels in Harrow's Psychomotor and Krathwohl's Affective domains?",c:["A. Psychomotor: Imitation; Affective: Receiving","B. Psychomotor: Basic Fundamental Movement; Affective: Responding","C. Psychomotor: Precision (with Automaticity); Affective: Characterization","D. Psychomotor: Physical Activities; Affective: Valuing"],a:"C",e:"PSYCHOMOTOR: PRECISION (highest Moore level) — performing accurately, efficiently, effortlessly — with AUTOMATICITY (unconscious effort, frees student to focus on expression). AFFECTIVE: CHARACTERIZATION (highest Krathwohl level) — student ACTS CONSISTENTLY ACCORDING TO THE VALUE and is FIRMLY COMMITTED — their artistry IS who they are."},
{id:96,d:"difficult",t:"PPST Domain 7 — Critical Analysis",q:"A school head requires all teachers to write personal teaching philosophies, join professional networks, participate in reflective teaching workshops, and set professional development goals. Which Domain and strands are DIRECTLY addressed?",c:["A. Domain 4 — Professional Collaboration and Teaching Resources","B. Domain 6 — Professional Ethics and School Policies","C. Domain 7 — Philosophy of Teaching, Professional Links, Professional Reflection, Professional Development Goals","D. Domain 5 — Feedback to Improve Learning"],a:"C",e:"DOMAIN 7 (PERSONAL GROWTH AND PROFESSIONAL DEVELOPMENT): (1) PHILOSOPHY OF TEACHING — writing personal teaching philosophies; (2) PROFESSIONAL LINKS with colleagues — joining professional networks; (3) PROFESSIONAL REFLECTION and learning to improve practice — reflective workshops; (5) PROFESSIONAL DEVELOPMENT GOALS — setting goals. Four of five Domain 7 strands are directly addressed."},
{id:97,d:"difficult",t:"Comprehensive — Content Structure",q:"A student can accurately recite the boiling point of water (100°C). This is an example of which type of cognitive content, and at which Knowledge Dimension in Bloom's Revised Taxonomy?",c:["A. Principle — Procedural Knowledge","B. Theory — Conceptual Knowledge","C. Fact — Factual Knowledge","D. Concept — Metacognitive Knowledge"],a:"C",e:"FACT (cognitive content structure): an IDEA OR ACTION THAT CAN BE VERIFIED; BASIC UNIT OF COGNITIVE SUBJECT MATTER CONTENT. FACTUAL KNOWLEDGE (Knowledge Dimension): IDEAS, SPECIFIC DATA OR INFORMATION — terminology, specific details, and elements. Boiling point is a specific, verifiable datum = Fact + Factual Knowledge."},
{id:98,d:"difficult",t:"Scenario — Student Problem Type + Mistaken Goal",q:"Marcus constantly challenges the teacher, argues about everything, has temper tantrums, and intensifies behavior when the teacher gets upset. He seems to 'win' when the teacher reacts with anger. What is his PROBLEM TYPE and MISTAKEN GOAL?",c:["A. Problem type: Withdrawn; Goal: Seek Attention","B. Problem type: Defiant; Goal: Seek Power (to be boss)","C. Problem type: Passive Aggressive; Goal: Seek Revenge","D. Problem type: Failure Syndrome; Goal: Isolate Oneself"],a:"B",e:"DEFIANT (problem type): resists authority, carries on power struggle with teacher, wants own way. MISTAKEN GOAL: SEEK POWER (TO BE BOSS) — characteristics: argues, contradicts, has temper tantrums, attempts to upset teacher. FEELS HE'S WON WHEN PARENTS/TEACHERS ARE UPSET. Child's belief: 'I belong only when I'm boss or proving no one can boss me.'"},
{id:99,d:"difficult",t:"Key Elements for Effective Classroom Management",q:"'It refers to the systematic arrangement of files and records and keeping them organized always and ready for use.' Which Key Element for Effective Classroom Management does this describe?",c:["A. Scheduling","B. Classroom Design","C. Rules","D. Organization"],a:"D",e:"ORGANIZATION: refers to the SYSTEMATIC ARRANGEMENT OF FILES AND RECORDS and KEEPING THEM ORGANIZED ALWAYS AND READY FOR USE. The 7 Key Elements: (1) Classroom Design, (2) Rules, (3) Discipline, (4) Scheduling, (5) Organization, (6) Instructional Techniques, (7) Communication."},
{id:100,d:"difficult",t:"Master Synthesis — All Topics",q:"A teacher is a Career Stage 3 professional who applies Inductive Method (HOTS) in a Constructivist learning environment, differentiates instruction for diverse learners, uses Cooperative Learning, and reflects on practice to grow professionally. Which combination of PPST Domains is MOST DIRECTLY reflected in this teacher's practice?",c:["A. Domains 1, 2, 3, 4, 7","B. Domains 2, 5, 6, 7 only","C. Domains 1 and 4 only","D. Domains 3, 5, 6 only"],a:"A",e:"This teacher reflects: DOMAIN 1 (Content Knowledge — Inductive Method develops HOTS, strand 5); DOMAIN 2 (Learning Environment — Constructivist approach creates conducive learning, strand 3); DOMAIN 3 (Diversity of Learners — differentiates instruction for diverse learners); DOMAIN 4 (Curriculum and Planning — cooperative learning, learning programs); DOMAIN 7 (Personal Growth — professional reflection, Career Stage 3). Five domains are directly reflected."},

{id:101,d:"easy",t:"PPST — Domain 3",q:"Domain 3, Diversity of Learners, consists of how many strands?",c:["A. 3","B. 4","C. 5","D. 6"],a:"C",e:"Domain 3 (Diversity of Learners) consists of FIVE strands: learners' gender/needs/strengths, linguistic/cultural/socioeconomic backgrounds, learners with disabilities/giftedness, learners in difficult circumstances, and learners from indigenous groups."},
{id:102,d:"easy",t:"PPST — Domain 4",q:"Domain 4, Curriculum and Planning, includes how many strands?",c:["A. 4","B. 5","C. 6","D. 7"],a:"B",e:"Domain 4 (Curriculum and Planning) includes FIVE strands: planning/management of teaching-learning, learning outcomes aligned with competencies, relevance/responsiveness, professional collaboration, and teaching-learning resources."},
{id:103,d:"easy",t:"PPST — Domain 7",q:"Which of the following is a strand of Domain 7 — Personal Growth and Professional Development?",c:["A. School policies and procedures","B. Professional ethics","C. Dignity of teaching as a profession","D. Feedback to improve learning"],a:"C",e:"DOMAIN 7 strands include: philosophy of teaching, DIGNITY OF TEACHING as a profession, professional links, professional reflection, and professional development goals."},
{id:104,d:"easy",t:"Classroom Management",q:"CLASSROOM MANAGEMENT also refers to the wide variety of skills and techniques that teachers use to keep students organized, orderly, focused, attentive on tasks, and academically ___.",c:["A. Obedient","B. Quiet","C. Productive in class","D. Compliant"],a:"C",e:"Classroom management refers to skills and techniques that keep students organized, orderly, focused, attentive, and ACADEMICALLY PRODUCTIVE IN CLASS."},
{id:105,d:"easy",t:"Classroom Management Principles",q:"'Make good use of every instructional moment. Minimize discipline time to maximize ___.' This is one principle of classroom management.",c:["A. Student participation","B. Teacher authority","C. Instructional time","D. Group work"],a:"C",e:"Principle of Classroom Management: MINIMIZE DISCIPLINE TIME TO MAXIMIZE INSTRUCTIONAL TIME."},
{id:106,d:"easy",t:"5 Types of Teacher Power",q:"Which type of teacher power involves the teacher demonstrating expertise and knowledge about the subject?",c:["A. Referent Power","B. Expert Power","C. Reward Power","D. Coercive Power"],a:"B",e:"EXPERT POWER — when a teacher makes students feel that HE KNOWS WHAT HE IS TALKING ABOUT. Knowledge and expertise are the source of this power."},
{id:107,d:"easy",t:"5 Types of Teacher Power",q:"Giving grades as an incentive is an example of which type of teacher power?",c:["A. Expert Power","B. Legitimate Power","C. Coercive Power","D. Reward Power"],a:"D",e:"REWARD POWER — giving rewards, ex. giving of grades. It motivates students through positive reinforcement."},
{id:108,d:"easy",t:"Types of Classroom Manager",q:"A teacher who is 'warm but not demanding' is classified as which type of classroom manager?",c:["A. Authoritative/Democratic","B. Authoritarian","C. Permissive/Laissez Faire","D. Uninvolved"],a:"C",e:"PERMISSIVE/LAISSEZ FAIRE = WARM BUT NOT DEMANDING. Places few demands on students, accepts students' impulses, more concerned with emotional well-being than classroom control."},
{id:109,d:"easy",t:"Types of Classroom Manager",q:"A teacher who is 'neither demanding nor warm' is classified as which type of classroom manager?",c:["A. Authoritative","B. Authoritarian","C. Permissive","D. Uninvolved"],a:"D",e:"UNINVOLVED = NEITHER DEMANDING NOR WARM — teachers who are indifferent and undemanding of student involvement."},
{id:110,d:"easy",t:"Approaches to Classroom Management",q:"The Assertive Approach expects teachers to specify ___ of behavior and consequences for disobeying them.",c:["A. Rewards","B. Rules","C. Goals","D. Standards"],a:"B",e:"ASSERTIVE APPROACH: expects teachers to specify RULES of behavior and consequences for disobeying them, and to communicate these rules clearly."},
{id:111,d:"easy",t:"Multiple Intelligences",q:"A student who is 'body smart' and manipulates what is to be learned through constructing models, sports, and dance demonstrates which intelligence?",c:["A. Visual-Spatial Skills","B. Musical Abilities","C. Bodily-Kinesthetic Skills","D. Naturalistic Abilities"],a:"C",e:"BODILY-KINESTHETIC SKILLS = 'body smart' — manipulates what is to be learned. Activities: construct a model, dance, sports, drama."},
{id:112,d:"easy",t:"Multiple Intelligences",q:"A student who is 'music smart' with an ear for good music and writes jingles demonstrates which intelligence?",c:["A. Verbal-Linguistic","B. Musical Abilities","C. Naturalistic","D. Existential Intelligence"],a:"B",e:"MUSICAL ABILITIES = 'music smart' — ear for good music. Activities: write a jingle, use an instrument, create a rhyme, rapping."},
{id:113,d:"easy",t:"Multiple Intelligences",q:"A student who is 'people smart' and excels at group work, team work, talking to people, and cooperating demonstrates which intelligence?",c:["A. Intrapersonal Abilities","B. Existential Intelligence","C. Interpersonal Abilities","D. Verbal-Linguistic Skills"],a:"C",e:"INTERPERSONAL ABILITIES = 'people smart' — group work and teamwork, talking to people, cooperating, interviewing people."},
{id:114,d:"easy",t:"Multiple Intelligences",q:"A student who is 'picture smart' and thinks in pictures, creates visual diagrams, and draws maps demonstrates which intelligence?",c:["A. Logical-Mathematical Skills","B. Verbal-Linguistic Skills","C. Visual-Spatial Skills","D. Naturalistic Abilities"],a:"C",e:"VISUAL-SPATIAL SKILLS = 'picture smart' — thinks in pictures. Activities: create visual diagram, draw a map, create a poster, graph results of a survey."},
{id:115,d:"easy",t:"Learning Styles",q:"Auditory learners learn best through verbal lectures, discussions, and talking things through. They also benefit from reading text ___.",c:["A. In silence","B. While taking notes","C. Aloud and using a tape recorder","D. With visual aids"],a:"C",e:"AUDITORY LEARNERS: learn through verbal lectures, discussions. Often benefit from READING TEXT ALOUD and using a tape recorder."},
{id:116,d:"easy",t:"Learning Styles",q:"Tactile learners learn through ___.",c:["A. Seeing visual aids","B. Listening to lectures","C. Touch","D. Reading textbooks"],a:"C",e:"TACTILE LEARNERS = learns through TOUCH — hands-on activities, kinesthetic experiences."},
{id:117,d:"easy",t:"Laws of Learning",q:"The Law of Effect states that learning is strengthened when accompanied by a ___ feeling.",c:["A. Challenging","B. Pleasant or satisfying","C. Difficult","D. Competitive"],a:"B",e:"LAW OF EFFECT: learning is strengthened when accompanied by a PLEASANT OR SATISFYING FEELING."},
{id:118,d:"easy",t:"Laws of Learning",q:"The Law of Freedom states that things freely learned are ___.",c:["A. Most often repeated","B. Best remembered","C. Best learned","D. Most easily forgotten"],a:"C",e:"LAW OF FREEDOM: things FREELY LEARNED are BEST LEARNED."},
{id:119,d:"easy",t:"Laws of Learning",q:"The Law of Intensity states that the more ___ the material taught, the more it is likely learned.",c:["A. Repeated","B. Intense","C. Recent","D. Free"],a:"B",e:"LAW OF INTENSITY: the more INTENSE the material taught, the more it is likely learned."},
{id:120,d:"easy",t:"Principles of Learning",q:"'Learning is an experience which occurs inside the learner and is activated by the learner.' This is Principle ___ of the Principles of Learning.",c:["A. 1","B. 3","C. 5","D. 7"],a:"A",e:"PRINCIPLE 1 of the Principles of Learning: 'Learning is an EXPERIENCE which occurs INSIDE the learner and is ACTIVATED BY THE LEARNER.' Learning by doing — make your class relatable."},
{id:121,d:"easy",t:"Principles of Learning",q:"'Learning is cooperative and collaborative.' This Principle of Learning is best supported by which classroom activity?",c:["A. Individual seat work","B. Lecture method","C. Group work","D. Silent reading"],a:"C",e:"PRINCIPLE 4: 'Learning is COOPERATIVE AND COLLABORATIVE.' This is best supported by GROUP WORK — students learn from and with each other."},
{id:122,d:"easy",t:"Bloom's Taxonomy",q:"In Bloom's Revised Taxonomy, 'Understanding' is defined as determining the meaning of instructional messages. Its sub-processes include ___.",c:["A. Recall, recognize, define","B. Use, employ, apply","C. Interpret, explain, paraphrase","D. Check, critique, rate, judge"],a:"C",e:"UNDERSTANDING: determining the meaning of instructional messages. Sub-processes: INTERPRET, EXPLAIN, PARAPHRASE."},
{id:123,d:"easy",t:"Bloom's Taxonomy",q:"In Bloom's Revised Taxonomy, 'Applying' involves carrying out or using a procedure in a given situation. Its sub-processes include ___.",c:["A. Recall, recognize, define","B. Use, employ, apply","C. Interpret, explain, paraphrase","D. Break down, categorize, group"],a:"B",e:"APPLYING: carrying out or using a procedure. Sub-processes: USE, EMPLOY, APPLY."},
{id:124,d:"easy",t:"Bloom's Taxonomy — Knowledge Dimension",q:"'Factual Knowledge' refers to ___.",c:["A. Words or ideas known by common name","B. How things work — step-by-step actions","C. Ideas, specific data or information","D. Knowledge of cognition in general"],a:"C",e:"FACTUAL KNOWLEDGE = IDEAS, SPECIFIC DATA OR INFORMATION — knowledge of terminology, specific details, and elements."},
{id:125,d:"easy",t:"Bloom's Taxonomy — Knowledge Dimension",q:"'Procedural Knowledge' refers to ___.",c:["A. Ideas and specific data","B. How things work, step-by-step actions, methods of inquiry","C. Words or ideas known by common name","D. Thinking about thinking"],a:"B",e:"PROCEDURAL KNOWLEDGE = HOW THINGS WORK, step-by-step actions, methods of inquiry. Knowledge of skills, techniques, methods, and procedures."},
{id:126,d:"easy",t:"Affective Domain",q:"In David Krathwohl's Affective Domain, the student who 'acts consistently according to the value and is firmly committed to the experience' is at which level?",c:["A. Valuing","B. Organization","C. Responding","D. Characterization"],a:"D",e:"CHARACTERIZATION (Level 5, highest): the student ACTS CONSISTENTLY ACCORDING TO THE VALUE and is FIRMLY COMMITTED to the experience."},
{id:127,d:"easy",t:"Affective Domain",q:"In Krathwohl's Affective Domain, 'Valuing' means the student displays definite involvement or commitment toward some experience. Example: a student voluntarily attending seminars on climate change demonstrates ___.",c:["A. Receiving","B. Responding","C. Valuing","D. Organization"],a:"C",e:"VALUING: student displays DEFINITE INVOLVEMENT or COMMITMENT toward some experience — attending seminars voluntarily = personal commitment = Valuing."},
{id:128,d:"easy",t:"Psychomotor Domain — Harrow",q:"In Anita Harrow's Psychomotor Domain, 'Perceptual Abilities' means students can translate stimulus received through the senses into appropriate desired movements. Example: ___.",c:["A. Walking and running","B. Flexion and extension reflex","C. Jumping rope or catching","D. Dancing and choreography"],a:"C",e:"PERCEPTUAL ABILITIES: students translate SENSORY STIMULI into appropriate DESIRED MOVEMENTS. Examples: JUMPING ROPE or CATCHING — coordinated movements requiring sensory input."},
{id:129,d:"easy",t:"Psychomotor Domain — Harrow",q:"In Harrow's Psychomotor Domain, 'Non-discursive communication' means students have the ability to communicate through ___.",c:["A. Written language","B. Verbal instructions","C. Body movements","D. Mathematical symbols"],a:"C",e:"NON-DISCURSIVE COMMUNICATION: students communicate through BODY MOVEMENTS — body postures, gestures, and facial expressions efficiently executed in skilled dance movement and choreography."},
{id:130,d:"easy",t:"Content Selection",q:"'FEASIBILITY' as a quality of content selection means ___.",c:["A. The content responds to learner needs","B. The content includes facts, skills, and values","C. The content can be covered in the amount of time available for instruction","D. Teaching content aligned to national standards"],a:"C",e:"FEASIBILITY: the content can be COVERED IN THE AMOUNT OF TIME AVAILABLE FOR INSTRUCTION."},
{id:131,d:"moderate",t:"PPST — Domain 5",q:"Domain 5, Assessment and Reporting, strand 3 is ___.",c:["A. Design, selection, organization of assessment strategies","B. Monitoring and evaluation of learner progress","C. Feedback to improve learning","D. Communication of learner needs to stakeholders"],a:"C",e:"Domain 5, Strand 3 = FEEDBACK TO IMPROVE LEARNING — using assessment information to give feedback that helps learners improve."},
{id:132,d:"moderate",t:"PPST — Domain 6",q:"Domain 6, Community Linkages and Professional Engagement, strand 3 is ___.",c:["A. School policies and procedures","B. Professional ethics","C. Engagement of parents","D. Establishment of learning environments"],a:"B",e:"Domain 6, Strand 3 = PROFESSIONAL ETHICS — ethical standards and professional conduct in the teaching profession."},
{id:133,d:"moderate",t:"Career Stages Applied",q:"A teacher who consistently displays HIGH LEVEL OF PERFORMANCE in their teaching practice, manifests sophisticated understanding of teaching, and mentors colleagues is at which Career Stage?",c:["A. Career Stage 1","B. Career Stage 2","C. Career Stage 3","D. Career Stage 4"],a:"C",e:"CAREER STAGE 3 (HIGHLY PROFICIENT): consistently display high performance, manifest in-depth and sophisticated understanding, mentor colleagues, continually develop professional knowledge."},
{id:134,d:"moderate",t:"Career Stages Applied",q:"A teacher who creates lifelong impact in the lives of colleagues, students, and others, and is recognized as a LEADER IN EDUCATION who initiates collaborations and partnerships is at which Career Stage?",c:["A. Career Stage 1","B. Career Stage 2","C. Career Stage 3","D. Career Stage 4"],a:"D",e:"CAREER STAGE 4 (DISTINGUISHED): recognized as LEADERS IN EDUCATION, contributors to the profession, initiators of collaborations and partnerships, create lifelong impact."},
{id:135,d:"moderate",t:"Classroom Management Principles",q:"'As classroom manager, be aware of all actions and activities in the classroom' is called the ___.",c:["A. Ripple Effect","B. Withitness Principle","C. Group Focus technique","D. Pygmalion Effect"],a:"B",e:"WITHITNESS PRINCIPLE (Kounin): Be aware of ALL ACTIONS AND ACTIVITIES in the classroom — 'eyes in the back of your head.' This is also related to the 'With-it-ness' concept."},
{id:136,d:"moderate",t:"Approaches to Classroom Management",q:"The Business Academic Approach developed by Evertson and Emmer emphasizes ___.",c:["A. Specifying rules and consequences for disobeying","B. Using rewards for appropriate behavior","C. Organization and management of students as they engage in academic work","D. Responding immediately to group misbehavior"],a:"C",e:"BUSINESS ACADEMIC APPROACH (Evertson & Emmer): emphasizes ORGANIZATION AND MANAGEMENT OF STUDENTS AS THEY ENGAGE IN ACADEMIC WORK — clear communication, monitoring student work, and feedback."},
{id:137,d:"moderate",t:"Effects in Classroom",q:"The Placebo Effect in a classroom context means ___.",c:["A. Students perform better because of high teacher expectations","B. Students improve behavior simply because they believe an intervention will work","C. Individuals improve behavior because they know they are being observed","D. A control group competes with an experimental group"],a:"B",e:"PLACEBO EFFECT: a remarkable phenomenon where an INACTIVE TREATMENT or FALSE BELIEF improves behavior/condition simply because the PERSON BELIEVES it will be helpful."},
{id:138,d:"moderate",t:"Effects in Classroom",q:"The Halo Effect is a cognitive bias where the observer's OVERALL IMPRESSION of a person influences thoughts about their ___.",c:["A. Academic grades","B. Character or properties","C. Teaching methods","D. Learning style"],a:"B",e:"HALO EFFECT: a COGNITIVE BIAS where overall impression of a person, company, brand, or product INFLUENCES the observer's feelings and thoughts about that entity's CHARACTER OR PROPERTIES."},
{id:139,d:"moderate",t:"Group Focus Techniques",q:"'Direct Appeal' refers to ___.",c:["A. Ignoring an action done for attention","B. Asking a student to leave the room","C. Responding when appropriate, pointing out the connection between conduct and its consequences","D. Using a child's name in an example"],a:"C",e:"DIRECT APPEAL: RESPONDING WHEN APPROPRIATE, pointing out the CONNECTION BETWEEN THE CONDUCT OR MISCONDUCT AND ITS CONSEQUENCES."},
{id:140,d:"moderate",t:"Group Focus Techniques",q:"'Interest Boosting' is a response directed to a student that ___.",c:["A. Asks the student to leave the room","B. Seems to be losing interest in a lesson","C. Uses humor to release tension","D. Names the student as an example"],a:"B",e:"INTEREST BOOSTING: a response directed to a student that SEEMS TO BE LOSING INTEREST IN A LESSON — pay some additional attention to other students and their work."},
{id:141,d:"moderate",t:"Group Focus Techniques",q:"'Program Restructuring' means ___.",c:["A. Using humor to release tension in a tensed situation","B. Ignoring an action done for attention","C. Recognizing a poor lesson or activity and trying to replace it for something better","D. Giving clues to help the student give the correct answer"],a:"C",e:"PROGRAM RESTRUCTURING: RECOGNIZING A POOR LESSON or activity and trying to REPLACE IT FOR SOMETHING ELSE in order to restore a desired behavior."},
{id:142,d:"moderate",t:"12 Characteristics of an Effective Teacher",q:"An effective teacher who 'handles students and grading fairly' and 'gives students equal opportunities and privileges' demonstrates which characteristic?",c:["A. Prepared","B. Positive","C. Fair","D. Creative"],a:"C",e:"FAIR effective teachers: HANDLE STUDENTS AND GRADING FAIRLY — give students EQUAL OPPORTUNITIES AND PRIVILEGES, provide clear requirements."},
{id:143,d:"moderate",t:"12 Characteristics of an Effective Teacher",q:"An effective teacher who 'has a way of making students feel welcome and comfortable in their classrooms' demonstrates which characteristic?",c:["A. Compassionate","B. Respectful","C. Forgiving","D. Cultivate a Sense of Belonging"],a:"D",e:"CULTIVATE A SENSE OF BELONGING: have a way of making students FEEL WELCOME AND COMFORTABLE in their classrooms."},
{id:144,d:"moderate",t:"12 Characteristics of an Effective Teacher",q:"An effective teacher who 'do not hold grudges' and 'habitually starts each day with a clean slate' demonstrates which characteristic?",c:["A. Forgiving","B. Respectful","C. Compassionate","D. Admitting Mistakes"],a:"A",e:"FORGIVING: DO NOT HOLD GRUDGES — forgive students for inappropriate behavior, habitually START EACH DAY WITH A CLEAN SLATE."},
{id:145,d:"moderate",t:"Roger Sperry's Model",q:"A Golden Brain learner in Roger Sperry's Model is ___.",c:["A. Purely left-brained","B. Purely right-brained","C. Balanced — both left and right brained","D. Neither left nor right brained"],a:"C",e:"GOLDEN BRAIN = BALANCED — uses BOTH left brain (analytic) and right brain (global) hemispheres effectively."},
{id:146,d:"moderate",t:"Cognitive Structures — Lettieri",q:"'The ability to break down information into component parts for the purpose of identification and categorization' defines which Lettieri cognitive structure?",c:["A. Focusing","B. Analysis (field dependence-independence)","C. Narrowing","D. Tolerance"],a:"B",e:"ANALYSIS (FIELD DEPENDENCE-INDEPENDENCE): the ability to BREAK DOWN INFORMATION INTO COMPONENT PARTS for the purpose of IDENTIFICATION AND CATEGORIZATION."},
{id:147,d:"moderate",t:"Cognitive Structures — Lettieri",q:"'The ability to select a correct item from among several alternatives and to compare information and make proper choices' defines which Lettieri cognitive structure?",c:["A. Sharpening","B. Narrowing","C. Comparative Analysis (reflective-impulsivity)","D. Tolerance"],a:"C",e:"COMPARATIVE ANALYSIS (REFLECTIVE-IMPULSIVITY): the ability to SELECT A CORRECT ITEM from among several alternatives and to COMPARE INFORMATION AND MAKE PROPER CHOICES."},
{id:148,d:"moderate",t:"Cognitive Structures — Lettieri",q:"'The ability to maintain distinctions between cognitive structures (including old and new information) and to avoid confusion or overlap' defines which Lettieri cognitive structure?",c:["A. Complex Cognitive","B. Analysis","C. Narrowing","D. Sharpening (sharpening-leveling)"],a:"D",e:"SHARPENING (SHARPENING-LEVELING): the ability to MAINTAIN DISTINCTIONS between cognitive structures and to AVOID CONFUSION OR OVERLAP."},
{id:149,d:"moderate",t:"Kendall & Marzano Domains",q:"In Kendall and Marzano's 3 Domains of Knowledge, 'Information (Declarative Knowledge)' includes ___.",c:["A. Conducting proofs and figuring lengths","B. Playing basketball and building furniture","C. Facts, concepts, generalizations, principles, and laws","D. Manipulative skills and thinking skills"],a:"C",e:"INFORMATION (DECLARATIVE KNOWLEDGE): FACTS, CONCEPTS, GENERALIZATIONS, PRINCIPLES, AND LAWS. Examples: vocabulary — isosceles, equilateral, right triangle."},
{id:150,d:"moderate",t:"Kendall & Marzano Domains",q:"In Kendall and Marzano's 6 Levels of Knowledge, which level comes AFTER Comprehension in the Cognitive System?",c:["A. Retrieval","B. Self-System","C. Metacognitive System","D. Analysis"],a:"D",e:"Kendall & Marzano's 6 Levels: (1) Retrieval, (2) Comprehension, (3) ANALYSIS, (4) Knowledge Utilization — all in the Cognitive System. Then (5) Metacognitive System and (6) Self-System."},
{id:151,d:"moderate",t:"Guiding Principles — Learning Objectives",q:"Which of the following is NOT a guiding principle in formulating learning objectives?",c:["A. Begin with an end in mind","B. Share lesson objective with students","C. Lesson objective must be SMART","D. Focus only on cognitive domain"],a:"D",e:"The guiding principles include: begin with an end in mind, share with students, cover TWO OR THREE DOMAINS (cognitive, psychomotor, affective), align with Philippine Constitution and laws, aim for critical/creative thinking, and be SMART. 'Focus only on cognitive domain' is NOT a guiding principle."},
{id:152,d:"moderate",t:"Mager's Objective Components",q:"In Mager's Three Main Components, 'Condition' refers to ___.",c:["A. What the student should be able to do","B. The criteria by which performance will be judged","C. The conditions under which the performance will occur","D. The learning objectives of the lesson"],a:"C",e:"CONDITION (Mager's Component 2): THE CONDITIONS UNDER WHICH THE PERFORMANCE WILL OCCUR — specifies the given resources, time limits, or tools available."},
{id:153,d:"moderate",t:"Content Selection Qualities",q:"'INTEREST' as a quality of content selection means ___.",c:["A. The content can be covered in time available","B. Teaching the content we ought to teach according to national standards","C. Content covers facts, skills, and values","D. The teacher considers the learners' interest, developmental stages, and cultural/ethnic background"],a:"D",e:"INTEREST: the teacher considers the INTEREST OF THE LEARNERS, their developmental stages, and cultural and ethnic background."},
{id:154,d:"moderate",t:"Content Selection Qualities",q:"'UTILITY' as a quality of content selection refers to ___.",c:["A. Cost effectiveness of materials","B. The usefulness/application of the content to the life of the learner after it has been learned","C. Content aligned to national standards","D. Coverage of content within time available"],a:"B",e:"UTILITY: refers to the USEFULNESS/APPLICATION of the content to THE LIFE OF THE LEARNER after it has been learned."},
{id:155,d:"moderate",t:"Structure of Subject Matter",q:"'Laws' in the cognitive content structure are defined as ___.",c:["A. Relationship between facts and concepts","B. Educated guesses about relationships","C. Categorization of events, places, people, ideas","D. Accepted scientific principles — true to all"],a:"D",e:"LAWS: ACCEPTED SCIENTIFIC PRINCIPLES — TRUE TO ALL. Unlike hypotheses (educated guesses) or principles (relationships between facts and concepts), laws are universally accepted."},
{id:156,d:"moderate",t:"Different Approaches and Methods",q:"'Strategy' is defined as ___.",c:["A. Set of principles, beliefs or ideas about the nature of learning","B. Long-term plan of action designed to achieve a particular goal","C. Systematic way of doing something with logical arrangement of steps","D. Teacher's particular style and well-defined procedure"],a:"B",e:"STRATEGY: LONG-TERM PLAN OF ACTION designed to ACHIEVE A PARTICULAR GOAL."},
{id:157,d:"moderate",t:"Different Approaches and Methods",q:"'Technique' is defined as ___.",c:["A. Set of principles, beliefs or ideas about the nature of learning","B. Long-term plan of action designed to achieve a particular goal","C. Systematic way of doing something with logical arrangement of steps","D. Teacher's particular style and well-defined procedure used to accomplish a specific activity or task"],a:"D",e:"TECHNIQUE: teacher's PARTICULAR STYLE and WELL-DEFINED PROCEDURE used to accomplish a SPECIFIC ACTIVITY OR TASK."},
{id:158,d:"moderate",t:"Teaching Approaches",q:"The Banking Approach is associated with which philosopher?",c:["A. Howard Gardner","B. John Dewey","C. John Locke","D. Ralph Tyler"],a:"C",e:"BANKING APPROACH: associated with JOHN LOCKE — students are perceived as empty receptacles waiting to be filled ('tabula rasa' — blank slate). Teacher deposits knowledge into empty minds."},
{id:159,d:"moderate",t:"Teaching Approaches",q:"The Reflective Teaching approach involves students/teachers learning through ___.",c:["A. Group activities and cooperative learning","B. Analysis and evaluation of past experiences","C. Direct instruction and demonstration","D. Memorization and repetition"],a:"B",e:"REFLECTIVE TEACHING: students/teachers learn through ANALYSIS AND EVALUATION OF PAST EXPERIENCES. Without analysis, no new learning and ideas can be constructed."},
{id:160,d:"moderate",t:"Teaching Approaches",q:"Activities for Reflective Teaching include self-analysis, writing journals, and ___.",c:["A. Cooperative learning","B. Keeping a portfolio","C. Group discussion","D. Direct instruction"],a:"B",e:"Activities for REFLECTIVE TEACHING: self-analysis, writing journals, and KEEPING A PORTFOLIO."},
{id:161,d:"moderate",t:"Teaching Approaches",q:"The Integrated Approach — Intradisciplinary — occurs when ___.",c:["A. Two different subjects such as Aral Pan and Science are integrated","B. Teachers organize curriculum around students' questions and real-life context","C. Teachers integrate the subdisciplines WITHIN a subject area","D. Subjects are related to each other but maintain their identity"],a:"C",e:"INTRADISCIPLINARY: when teachers INTEGRATE THE SUBDISCIPLINES WITHIN A SUBJECT AREA. Example: integrating listening, speaking, reading, and writing in language arts."},
{id:162,d:"moderate",t:"Teaching Approaches",q:"The Integrated Approach — Interdisciplinary — is done when ___.",c:["A. Teachers integrate subdisciplines within one subject","B. Two different subjects such as Aral Pan and Science are integrated","C. Curriculum is organized around students' questions","D. Subjects maintain their identity while being related"],a:"B",e:"INTERDISCIPLINARY: is done when TWO DIFFERENT SUBJECTS such as Aral Pan and Science are INTEGRATED."},
{id:163,d:"moderate",t:"Direct Instruction Components",q:"In Direct Instruction, 'Modeling (Introduction)' is when ___.",c:["A. Students work together on a skill or task","B. Students complete assignments independently","C. The teacher identifies the skill required and shows how it is used — shares a 'cognitive secret'","D. The teacher reviews the skill periodically"],a:"C",e:"MODELING (INTRODUCTION): the teacher IDENTIFIES THE SKILL REQUIRED and SHOWS HOW IT IS USED. The teacher 'shares a cognitive secret' of how to execute a strategy."},
{id:164,d:"moderate",t:"Direct Instruction Components",q:"In Direct Instruction, 'Guided Practice' means ___.",c:["A. Students complete assignments independently at home","B. Teachers and students work TOGETHER on a skill or task and figure out how to apply strategy","C. The teacher reviews the when, why, and how of the skill","D. The teacher asks students to apply the skill in a new problem"],a:"B",e:"GUIDED PRACTICE: TEACHERS AND STUDENTS WORK TOGETHER on a skill or task and FIGURE OUT HOW TO APPLY STRATEGY."},
{id:165,d:"moderate",t:"Inquiry Method",q:"The Inquiry Method is sometimes termed as 'discovery', 'heuristic', and 'problem solving.' It is defined as a teaching method modeled after the ___.",c:["A. Cooperative learning model","B. Investigative processes of scientists","C. Banking approach","D. Lecture method"],a:"B",e:"INQUIRY METHOD: defined as a teaching method MODELLED AFTER THE INVESTIGATIVE PROCESSES OF SCIENTISTS."},
{id:166,d:"moderate",t:"Cooperative Learning",q:"In Cooperative Learning, which element ensures each student is held responsible for their own contribution to the group?",c:["A. Positive Interdependence","B. Face-to-Face Interaction","C. Individual and Group Accountability","D. Group Processing"],a:"C",e:"INDIVIDUAL AND GROUP ACCOUNTABILITY: ensures each STUDENT IS HELD RESPONSIBLE for their OWN CONTRIBUTION to the group's learning."},
{id:167,d:"moderate",t:"Cooperative Learning",q:"'Group Processing' as an element of the Cooperative Learning Model refers to ___.",c:["A. Students working in mixed ability groups","B. Face-to-face discussion of tasks","C. Students discussing how well they are achieving their goals and maintaining effective working relationships","D. Individual accountability of each student"],a:"C",e:"GROUP PROCESSING: students DISCUSS HOW WELL THEY ARE ACHIEVING THEIR GOALS and maintaining EFFECTIVE WORKING RELATIONSHIPS in the group."},
{id:168,d:"moderate",t:"Peer Tutoring",q:"'The best way to learn something is to ___.' This is the philosophy behind Peer Tutoring/Peer Teaching.",c:["A. Study it alone","B. Teach it","C. Read about it","D. Memorize it"],a:"B",e:"PEER TUTORING: 'The best way to learn something is to TEACH IT.' Peer tutoring is commonly employed when the teacher requests the older, brighter, and more cooperative member to tutor classmates."},
{id:169,d:"moderate",t:"Tutoring Arrangements",q:"Which tutoring arrangement uses a definite, highly structured procedure administered by trained tutors?",c:["A. Instructional tutoring","B. Same-age tutoring","C. Monitorial tutoring","D. Structured tutoring"],a:"D",e:"STRUCTURED TUTORING: a DEFINITE PROCEDURE is followed — HIGHLY STRUCTURED tutoring is administered by TRAINED TUTORS."},
{id:170,d:"moderate",t:"Student Problem Types",q:"A student who has short attention spans, rarely completes a task, has difficulty adjusting to changes, and is easily distracted by sights, sounds, or speech is a ___.",c:["A. Underachiever","B. Distractible student","C. Low Achiever","D. Hyperactive student"],a:"B",e:"DISTRACTIBLE student: SHORT ATTENTION SPANS, unable to sustain attention and concentration, HIGHLY DISTRACTIBLE. Signs: difficulty adjusting to changes, rarely completes a task, easily distracted by sights, sounds, or speech."},
{id:171,d:"moderate",t:"Student Problem Types",q:"An Underachiever student does the 'minimum to get by' and does not value school work. Signs include being ___.",c:["A. Easily frustrated and expecting to fail","B. Difficulty following directions and poor retention","C. Indifferent to schoolwork, minimum work output, not challenged by school","D. Withdrawn and avoiding personal interaction"],a:"C",e:"UNDERACHIEVER: does MINIMUM TO GET BY, does not value school work. Signs: INDIFFERENT to schoolwork, MINIMUM WORK OUTPUT, NOT CHALLENGED BY SCHOOL WORK, poorly motivated."},
{id:172,d:"moderate",t:"Student Problem Types",q:"A student who avoids personal interaction and is rejected, ignored, or excluded by peers — with signs of being quiet and sober, not initiating or volunteering — is which type?",c:["A. Defiant","B. Passive Aggressive","C. Withdrawn","D. Hostile Aggressive"],a:"C",e:"WITHDRAWN: avoids personal interaction and is REJECTED, IGNORED, OR EXCLUDED. Signs: quiet and sober, does not initiate or volunteer, does not call attention to self."},
{id:173,d:"moderate",t:"Student Problem Types",q:"A student who shows excessive and almost constant movement even when sitting, blurts out answers and comments, bothers children with noises, and is energetic but poorly directed is ___.",c:["A. Defiant","B. Failure Syndrome","C. Passive Aggressive","D. Hyperactive"],a:"D",e:"HYPERACTIVE: shows EXCESSIVE AND ALMOST CONSTANT MOVEMENT even when sitting. Signs: blurts out answers, often out of seat, bothers children with noises, energetic but poorly directed, excessively touches people or objects."},
{id:174,d:"moderate",t:"Student Problem Types",q:"A student who is unduly anxious about making mistakes, has unrealistically high self-imposed standards, and often fearfully holds back from class participation unless sure of self is a ___.",c:["A. Distractible student","B. Perfectionist","C. Failure Syndrome student","D. Hyperactive student"],a:"B",e:"PERFECTIONIST: UNDULY ANXIOUS about making mistakes, self-imposed standards are UNREALISTICALLY HIGH so that they are NEVER SATISFIED with their work. Signs: often anxious, fearful, frustrated, holds back from participation unless sure of self."},
{id:175,d:"moderate",t:"4 Mistaken Goals",q:"A child whose goal is to Seek Power has the belief: '___.'",c:["A. I count only when I'm being noticed or getting special service","B. I don't think I belong, so I'll hurt others as I feel hurt","C. I belong only when I'm boss or in control, or proving no one can boss me","D. I don't believe I can so I'll convince others not to expect anything of me"],a:"C",e:"SEEK POWER child's belief: 'I BELONG ONLY WHEN I'M BOSS OR IN CONTROL, or PROVING NO ONE CAN BOSS ME.' They say 'You can't make me.'"},
{id:176,d:"moderate",t:"4 Mistaken Goals",q:"For a child whose goal is to Seek Attention, what does the child need?",c:["A. Let Me Help–Give Me Choices","B. Notice Me–Involve Me","C. Have Faith in Me–Don't Give Up On Me","D. Help Me–I'm Hurting"],a:"B",e:"SEEK ATTENTION child needs: NOTICE ME–INVOLVE ME. Adults: redirect by involving child in a useful task, use touch without words, set up nonverbal signals, ignore misbehavior while encouraging appropriate behavior."},
{id:177,d:"moderate",t:"Key Elements — Classroom Management",q:"'Classroom Design' as a key element for effective classroom management refers to ___.",c:["A. Classroom rules set to foster love, care, and respect","B. Seating arrangement, bulletin boards, display, storage area, equipment, and supplies","C. Time allotment given for each period and activity","D. Consequences of every action in class"],a:"B",e:"CLASSROOM DESIGN: refers to SEATING ARRANGEMENT, bulletin boards, display, storage area, equipment, supplies, etc."},
{id:178,d:"moderate",t:"Key Elements — Classroom Management",q:"'Discipline' as a key element for effective classroom management means ___.",c:["A. Expectations set to foster love, care, and respect","B. Ways by which learning content is implemented","C. Classroom rules that define the consequences of every action/misdemeanor to ensure fairness and consistency","D. Consistent open lines of communication"],a:"C",e:"DISCIPLINE: CLASSROOM RULES that define the CONSEQUENCES OF EVERY ACTION/MISDEMEANOR in class to ensure FAIRNESS AND CONSISTENCY."},
{id:179,d:"moderate",t:"Group Elements — Discipline",q:"Which of the following is NOT one of the 5 Group Elements to Consider to Maintain Good Discipline?",c:["A. Dissatisfaction with classroom work","B. Poor interpersonal relations","C. High teacher expertise","D. Disturbances in group climate"],a:"C",e:"The 5 Group Elements: (1) Dissatisfaction with classroom work, (2) Poor interpersonal relations, (3) Disturbances in group climate, (4) Poor group organization, (5) Sudden change and group emotions. 'High teacher expertise' is NOT one of them."},
{id:180,d:"moderate",t:"Group Elements — Discipline",q:"'Sudden change and group emotions' as a group element causing discipline problems occurs when ___.",c:["A. The work is too easy or difficult","B. Problems are caused by friendships or tensions among individuals","C. The group is experiencing high level of anxiety — just before exam period","D. The group is too highly organized with too many rules"],a:"C",e:"SUDDEN CHANGE AND GROUP EMOTIONS: the group is experiencing HIGH LEVEL OF ANXIETY (just before exam period). Contemporary events lead to unusual depression, fear, or excitement."},
{id:181,d:"difficult",t:"PPST Domain Integration",q:"A teacher who designs learning environments responsive to community contexts, engages parents in the educative process, observes professional ethics, and follows school policies is PRIMARILY demonstrating which PPST Domain?",c:["A. Domain 4 — Curriculum and Planning","B. Domain 5 — Assessment and Reporting","C. Domain 6 — Community Linkages and Professional Engagement","D. Domain 7 — Personal Growth"],a:"C",e:"DOMAIN 6 (COMMUNITY LINKAGES AND PROFESSIONAL ENGAGEMENT): (1) Learning environments responsive to community, (2) Engagement of parents and wider school community, (3) Professional ethics, (4) School policies and procedures."},
{id:182,d:"difficult",t:"PQF Level 6 Deep Application",q:"A newly graduated teacher from a teacher education institution is expected to demonstrate PQF Level 6 outcomes including Application of professional work (teaching) in a broad range of discipline AND degree of independence. What does 'Degree of Independence' at PQF Level 6 mean for a teacher?",c:["A. The teacher works completely without supervision","B. Independent AS A TEACHER and/or in terms of related field","C. The teacher sets their own curriculum independently","D. The teacher operates outside of school policies"],a:"B",e:"PQF Level 6 — Degree of Independence descriptor: INDEPENDENT (AS A TEACHER) AND/OR IN TERMS OF RELATED FIELD. This means the graduate can function independently as a professional teacher."},
{id:183,d:"difficult",t:"Career Stage + PPST Domain Analysis",q:"A BEGINNING TEACHER (Career Stage 1) who is seeking advice from experienced colleagues to consolidate teaching practice is PRIMARILY developing which PPST Domain?",c:["A. Domain 1 — Content Knowledge","B. Domain 4 — Curriculum and Planning","C. Domain 7 — Personal Growth and Professional Development","D. Domain 2 — Learning Environment"],a:"C",e:"DOMAIN 7 — PERSONAL GROWTH AND PROFESSIONAL DEVELOPMENT: Strand 3 = PROFESSIONAL LINKS WITH COLLEAGUES. Beginning teachers SEEK ADVICE FROM EXPERIENCED COLLEAGUES to consolidate their teaching practice — a hallmark of Domain 7, Strand 3."},
{id:184,d:"difficult",t:"Bloom's Taxonomy — Two Dimensions Applied",q:"A teacher asks students to 'Create a video documentary about how to make palitaw using a step-by-step procedure.' Which cell of the Revised Bloom's Taxonomy (Krathwohl, 2002) BEST represents this task?",c:["A. Remembering — Factual Knowledge","B. Understanding — Conceptual Knowledge","C. Applying — Metacognitive Knowledge","D. Creating — Procedural Knowledge"],a:"D",e:"CREATING (cognitive dimension, highest level) + PROCEDURAL KNOWLEDGE (knowledge dimension — how things work, step-by-step actions). Making a video documentary on HOW TO MAKE palitaw = CREATING (producing something new) + PROCEDURAL (step-by-step procedure)."},
{id:185,d:"difficult",t:"Teaching Approaches Deep Analysis",q:"A teacher says: 'I deposit knowledge into my students — they are blank slates.' Another teacher says: 'My students are partners who construct their own meaning.' A third teacher says: 'I help students think about their own thinking.' The THREE teaching approaches are, in order ___.",c:["A. Constructivist, Banking, Metacognitive","B. Banking, Metacognitive, Constructivist","C. Banking, Constructivist, Metacognitive","D. Metacognitive, Banking, Constructivist"],a:"C",e:"(1) 'Deposit knowledge — blank slates' = BANKING APPROACH (John Locke, tabula rasa). (2) 'Partners who construct own meaning' = CONSTRUCTIVIST APPROACH (self-constructed meanings, prior knowledge). (3) 'Think about their own thinking' = METACOGNITIVE APPROACH (meta = beyond cognition, thinking about thinking)."},
{id:186,d:"difficult",t:"Student Problem Type + Intervention",q:"A student named Joy is convinced she cannot do her work, gives up easily after one attempt, says 'I can't do it' frequently, and is easily frustrated. What is Joy's problem type AND what is the BEST teacher response?",c:["A. Underachiever — challenge her with more difficult work","B. Perfectionist — lower her standards","C. Failure Syndrome — take small steps, make the task easier until she experiences success, and don't give up on her","D. Low Achiever — refer to special education"],a:"C",e:"FAILURE SYNDROME: convinced cannot do work, expects to fail even after succeeding. BEST RESPONSE: TAKE SMALL STEPS, MAKE THE TASK EASIER UNTIL THE CHILD EXPERIENCES SUCCESS, show faith, don't give up. This connects to the Mistaken Goal of 'Isolate Oneself' — child needs HAVE FAITH IN ME–DON'T GIVE UP ON ME."},
{id:187,d:"difficult",t:"MI + Learning Style + Roger Sperry Integration",q:"A student who excels at group work (interpersonal), prefers background music while studying (right-brained/global), and responds to emotion rather than word meaning MOST BENEFITS from which combined teaching strategy?",c:["A. Sequential lecture with logical-mathematical problems in bright lighting","B. Individual written reflections with abstract mathematical tasks","C. Group collaborative activity with music in the background addressing emotional themes","D. Independent self-paced projects with minimal social interaction"],a:"C",e:"INTERPERSONAL (people smart) + RIGHT BRAIN (responds to emotion, prefers sound/music, processes in varied order, global) = BEST: GROUP COLLABORATIVE ACTIVITY with MUSIC IN BACKGROUND addressing EMOTIONAL THEMES. This matches all three profiles: interpersonal MI (group), right-brain (music + emotion), global learner (holistic approach)."},
{id:188,d:"difficult",t:"Comprehensive — Laws + Principles of Learning",q:"A teacher who makes lessons relatable, allows students to discover personal meaning, uses group work, and repeats key concepts throughout the lesson is SIMULTANEOUSLY applying which Laws and Principles of Learning?",c:["A. Law of Primacy and Law of Recency only","B. Only the Principle of Cooperative Learning","C. Law of Exercise (repetition), Principle 1 (learning activated by learner), Principle 2 (discovery of personal meaning), Principle 4 (cooperative/collaborative)","D. Law of Freedom and Law of Readiness only"],a:"C",e:"MULTIPLE LAWS AND PRINCIPLES SIMULTANEOUSLY: LAW OF EXERCISE (repeating key concepts), PRINCIPLE 1 (learning activated by learner — making it relatable), PRINCIPLE 2 (discovery of personal meaning and relevance), PRINCIPLE 4 (cooperative and collaborative — group work)."},
{id:189,d:"difficult",t:"Affective Domain + Psychomotor Integration",q:"A student who voluntarily joins environmental clean-up drives (Valuing), integrates environmental value into their lifestyle (Organization), AND physically performs community clean-up activities skillfully (Skilled Movements/Physical Activities) has reached which combination of domain levels?",c:["A. Receiving (Affective) + Reflex Movements (Psychomotor)","B. Valuing and Organization (Affective) + Physical Activities or Skilled Movements (Psychomotor)","C. Responding (Affective) + Imitation (Moore's Psychomotor)","D. Characterization (Affective) + Non-discursive Communication (Psychomotor)"],a:"B",e:"AFFECTIVE: VALUING (voluntary commitment) + ORGANIZATION (integrating value into lifestyle). PSYCHOMOTOR: PHYSICAL ACTIVITIES (strenuous effort, physical activity) or SKILLED MOVEMENTS (complex movements requiring efficiency). Both domains are simultaneously demonstrated in the student's engaged, skilled environmental action."},
{id:190,d:"difficult",t:"Teaching Methods Deep Application",q:"A Math teacher follows these steps: (1) states a general rule about quadratic equations, (2) gives examples of how the rule applies, (3) asks students to practice similar problems, then (4) reviews. SIMULTANEOUSLY, a Science teacher: (1) gives students a set of observations about plant growth, (2) asks them to identify patterns, (3) leads them to formulate a hypothesis. The Math teacher uses ___ and the Science teacher uses ___.",c:["A. Inductive Method; Deductive Method","B. Deductive Method; Inductive Method","C. Inquiry Method; Direct Instruction","D. Demonstration Method; Project Method"],a:"B",e:"MATH TEACHER: starts with GENERAL RULE then gives EXAMPLES = DEDUCTIVE METHOD (general to specific). SCIENCE TEACHER: starts with SPECIFIC OBSERVATIONS then leads to HYPOTHESIS/GENERALIZATION = INDUCTIVE METHOD (specific to general). Classic contrast between deductive and inductive approaches."},
{id:191,d:"difficult",t:"PPST + PQF + Career Stage Integration",q:"A teacher education graduate with PQF Level 6 qualifications, demonstrating Beginning Teacher (Career Stage 1) standards, is expected to master the PPST. Which COMBINATION correctly describes this teacher?",c:["A. Independent in application of skills; displays highest global standards; creates lifelong impact","B. Has gained qualifications for entry, has strong understanding of subjects, possesses requisite knowledge/skills/values, manages learning programs, and seeks advice from experienced colleagues","C. Provides focused teaching programs meeting curriculum requirements; is a reflective practitioner","D. Consistently displays high level of performance; mentors colleagues; has sophisticated understanding"],a:"B",e:"CAREER STAGE 1 (BEGINNING TEACHER): (1) GAINED QUALIFICATIONS for entry, (2) STRONG UNDERSTANDING OF SUBJECTS (content knowledge and pedagogy), (3) POSSESSES REQUISITE KNOWLEDGE, SKILLS AND VALUES supporting teaching-learning, (4) MANAGES LEARNING PROGRAMS based on learning needs, (5) SEEKS ADVICE FROM EXPERIENCED COLLEAGUES. This matches PQF Level 6 expectations for beginning teacher education graduates."},
{id:192,d:"difficult",t:"Cognitive Structures + Bloom's Integration",q:"A student who can BREAK DOWN a complex essay (Analysis/Lettieri) and SELECT the most relevant argument (Focusing/Lettieri), then EVALUATE which argument best supports the thesis (Evaluating/Bloom's), demonstrates WHAT COMBINATION?",c:["A. Bloom's Remembering + Lettieri's Tolerance","B. Bloom's Applying + Lettieri's Narrowing","C. Lettieri's Analysis + Lettieri's Focusing + Bloom's Evaluating","D. Lettieri's Comparative Analysis + Bloom's Creating"],a:"C",e:"LETTIERI'S ANALYSIS (breaking down information into component parts) + LETTIERI'S FOCUSING (selecting relevant information without being distracted) + BLOOM'S EVALUATING (making judgments based on criteria) = a sophisticated combination of cognitive structures and higher-order thinking."},
{id:193,d:"difficult",t:"Teaching Approaches Synthesis",q:"A teacher asks students to: (1) discuss their OWN thought processes while solving a problem (Metacognitive), (2) connect new knowledge about photosynthesis to their prior knowledge of sunlight (Constructivist), AND (3) investigate 'Why do plants grow better near windows?' like scientists (Inquiry). How many teaching approaches are being SIMULTANEOUSLY used?",c:["A. 1 approach","B. 2 approaches","C. 3 approaches","D. All of the above are the same approach"],a:"C",e:"THREE approaches simultaneously: (1) METACOGNITIVE APPROACH — students discuss/monitor their own thought processes; (2) CONSTRUCTIVIST APPROACH — connecting prior knowledge (sunlight) to new concept (photosynthesis); (3) INQUIRY METHOD — investigative process modeled after scientists ('Why do plants grow better near windows?')."},
{id:194,d:"difficult",t:"Group Focus Techniques + Student Problem Types",q:"A teacher notices a student who is not paying attention and is becoming bored. The teacher: (1) walks near the student (Proximity), (2) calls the student's name in an example (Name Dropping), and (3) pays extra attention to the student (Interest Boosting). If the student's behavior escalates to uncontrollable giggling affecting the class, the teacher uses (4) ___.",c:["A. Humor Effect","B. Planned Ignoring","C. Prompting","D. Antiseptic Bouncing"],a:"D",e:"ANTISEPTIC BOUNCING: asking a student to LEAVE THE ROOM if he or she is UNCONTROLLABLY GIGGLING OR MISBEHAVING THAT AFFECTS THE MAJORITY OF THE CLASS. Steps 1-3 addressed minor inattention; Antiseptic Bouncing is used when behavior becomes uncontrollable and widespread."},
{id:195,d:"difficult",t:"Multiple Intelligences + Direct Instruction Design",q:"A teacher designs a lesson on fractions for students with different MI profiles: Group A is Logical-Mathematical (number games), Group B is Visual-Spatial (fraction diagrams), Group C is Bodily-Kinesthetic (manipulatives). Which Direct Instruction component BEST supports ALL groups simultaneously?",c:["A. Review — periodically reviewing the why and how","B. Application — applying skill in new problem","C. Independent Practice — completing assignments independently at home","D. Modeling (Introduction) — teacher shows how it is used; students then apply through their MI-appropriate activity"],a:"D",e:"MODELING (INTRODUCTION): teacher identifies the skill and SHOWS HOW IT IS USED — this works for ALL groups as the teacher demonstrates first. Each group then applies through their MI-appropriate activity (numbers for Logical-Mathematical, diagrams for Visual-Spatial, manipulatives for Bodily-Kinesthetic). Modeling sets the cognitive foundation before MI-differentiated practice."},
{id:196,d:"difficult",t:"Comprehensive — All 4 Career Stages",q:"Four teachers at a school are described: Teacher A seeks advice from experienced mentors. Teacher B is professionally independent and provides focused teaching programs. Teacher C consistently displays high performance and provides mentoring to junior teachers. Teacher D is recognized as a leader in education who creates lifelong impact and initiates partnerships. Match them to Career Stages 1-4 in order.",c:["A. A=Stage 2, B=Stage 1, C=Stage 4, D=Stage 3","B. A=Stage 1, B=Stage 2, C=Stage 3, D=Stage 4","C. A=Stage 3, B=Stage 4, C=Stage 1, D=Stage 2","D. A=Stage 4, B=Stage 3, C=Stage 2, D=Stage 1"],a:"B",e:"A (seeks advice) = CAREER STAGE 1 (BEGINNING). B (professionally independent, focused programs) = CAREER STAGE 2 (PROFICIENT). C (high performance, mentoring) = CAREER STAGE 3 (HIGHLY PROFICIENT). D (leader, lifelong impact, partnerships) = CAREER STAGE 4 (DISTINGUISHED)."},
{id:197,d:"difficult",t:"Mistaken Goals + Classroom Management",q:"In one class: Student 1 disrupts and asks for favors; Student 2 argues and resists authority; Student 3 retreats when confronted and shows no improvement; Student 4 acts in cruel and violent ways feeling justified when punished. Match their mistaken goals correctly.",c:["A. 1=Power, 2=Attention, 3=Revenge, 4=Isolation","B. 1=Attention, 2=Power, 3=Isolation, 4=Revenge","C. 1=Revenge, 2=Isolation, 3=Attention, 4=Power","D. 1=Isolation, 2=Revenge, 3=Power, 4=Attention"],a:"B",e:"Student 1 (disrupts, asks favors) = SEEK ATTENTION. Student 2 (argues, resists authority) = SEEK POWER. Student 3 (retreats, no improvement, assumed inadequacy) = ISOLATE ONESELF. Student 4 (cruel, violent, feels justified when punished) = SEEK REVENGE."},
{id:198,d:"difficult",t:"Content Structure + Bloom's Deep Analysis",q:"A teacher teaches about 'All right triangles have one angle of 90 degrees' (Law), asks students to apply the Pythagorean theorem (Procedural Knowledge + Applying), and then asks students to EVALUATE whether a given triangle is a right triangle (Evaluating + Conceptual Knowledge). How many of Kendall & Marzano's 3 domains AND Bloom's cognitive levels are simultaneously involved?",c:["A. 1 domain and 1 level","B. 2 domains and 2 levels","C. All 3 domains and 3 cognitive levels","D. 2 domains and 3 levels"],a:"D",e:"DOMAINS: Information/Declarative (the Law about right triangles) + Mental Procedures/Procedural (applying Pythagorean theorem) = 2 Kendall & Marzano domains. BLOOM'S LEVELS: APPLYING (using the Pythagorean theorem) + EVALUATING (judging whether the triangle qualifies) + UNDERSTANDING (grasping the concept of right triangle properties) = 3 cognitive levels. Total: 2 domains + 3 Bloom's levels."},
{id:199,d:"difficult",t:"Comprehensive Classroom Management Scenario",q:"A teacher observes the following in class: Students are bored because work is too easy (Group Element 1); some students are forming cliques causing tension (Group Element 2); the teacher notices all of this while teaching without stopping (Principle); and immediately addresses the bored students with an interest-boosting comment while walking near the clique students (Technique). What COMBINATION of concepts is demonstrated?",c:["A. Law of Effect + Ripple Effect + With-it-ness + Planned Ignoring","B. Group Elements 1&2 (Dissatisfaction + Poor Interpersonal Relations) + With-it-ness + Interest Boosting + Proximity and Touch Control","C. Pygmalion Effect + John Henry Effect + Antiseptic Bouncing","D. Hawthorne Effect + Placebo Effect + Name Dropping"],a:"B",e:"GROUP ELEMENT 1: DISSATISFACTION WITH CLASSROOM WORK (work too easy). GROUP ELEMENT 2: POOR INTERPERSONAL RELATIONS (cliques causing tension). WITH-IT-NESS: noticing all this while teaching = eyes in the back of the head. INTEREST BOOSTING: addressing bored students. PROXIMITY AND TOUCH CONTROL: walking near the clique students. Five concepts demonstrated simultaneously."},
{id:200,d:"difficult",t:"Master Synthesis — Methods & Strategies",q:"A distinguished teacher (Career Stage 4) with PQF Level 6 mastery designs a Transdisciplinary unit where students investigate environmental problems (Inquiry Method) using cooperative learning (mixed abilities), differentiates instruction based on MI profiles and learning styles, applies Bloom's highest level (Creating), addresses all three of Harrow's higher psychomotor levels, and reflects professionally to improve practice. How many of the 7 PPST Domains are DIRECTLY addressed?",c:["A. 3 Domains","B. 5 Domains","C. 6 Domains","D. All 7 Domains"],a:"D",e:"ALL 7 DOMAINS: Domain 1 (inquiry method, HOTS, Bloom's Creating, content knowledge), Domain 2 (learning environment for cooperative and inquiry learning), Domain 3 (differentiating for diverse learners via MI and learning styles), Domain 4 (transdisciplinary curriculum design, ICT, professional collaboration), Domain 5 (assessment embedded in differentiated instruction and outcomes), Domain 6 (transdisciplinary connects to community/real-world issues), Domain 7 (professional reflection). A Distinguished Career Stage 4 teacher embodies all 7 domains simultaneously."},
];
const METHODS_100 = [

// ═══════════════════ EASY (1–30) ═══════════════════
{id:1,d:"easy",t:"PQF",q:"The Philippine Qualifications Framework (PQF) is provided by law under which Republic Act?",c:["A. RA 10533","B. RA 10968","C. RA 10533","D. RA 9155"],a:"B",e:"The PQF is provided by law under RA 10968, s. 2018. It was adopted as part of ASEAN convergence to provide national standards and levels for outcomes in education."},
{id:2,d:"easy",t:"PQF",q:"PQF Level 6 describes the career path for which type of degree programs?",c:["A. Doctoral degree programs","B. Post-baccalaureate degree programs","C. Baccalaureate degree programs including teacher education","D. Technical and vocational programs"],a:"C",e:"PQF Level 6 describes the career path for BACCALAUREATE DEGREE PROGRAMS, including teacher education degrees. All baccalaureate graduates are expected to exhibit outcomes described in PQF Level 6."},
{id:3,d:"easy",t:"PPST",q:"PPST stands for ___.",c:["A. Philippine Professional Standards for Teachers","B. Philippine Program Standards for Teaching","C. Philippine Professional Strategies for Teachers","D. Philippine Program for School Teachers"],a:"A",e:"PPST stands for PHILIPPINE PROFESSIONAL STANDARDS FOR TEACHERS, implemented through Department Order 42, s. 2017."},
{id:4,d:"easy",t:"PPST",q:"How many domains does the PPST have?",c:["A. 5","B. 6","C. 7","D. 8"],a:"C",e:"The PPST has SEVEN (7) DOMAINS. The 7 domains collectively comprise 37 strands that refer to more specific dimensions of teaching."},
{id:5,d:"easy",t:"PPST",q:"How many strands do the 7 Domains of PPST collectively comprise?",c:["A. 27","B. 35","C. 37","D. 42"],a:"C",e:"The 7 Domains of PPST collectively comprise 37 STRANDS that refer to more specific dimensions of teaching."},
{id:6,d:"easy",t:"PPST — Domain 1",q:"Domain 1 of PPST is Content Knowledge and Pedagogy. How many strands does it contain?",c:["A. 5","B. 6","C. 7","D. 8"],a:"C",e:"Domain 1 (Content Knowledge and Pedagogy) is composed of SEVEN STRANDS including content knowledge, research-based knowledge, positive use of ICT, literacy and numeracy strategies, HOTS, mother tongue, and classroom communication."},
{id:7,d:"easy",t:"PPST — Domain 2",q:"Domain 2, Learning Environment, consists of how many strands?",c:["A. 4","B. 5","C. 6","D. 7"],a:"C",e:"Domain 2 (Learning Environment) consists of SIX strands: learner safety, fair learning environment, management of classroom structure, support for learner participation, purposive learning, and management of learner behavior."},
{id:8,d:"easy",t:"PPST — Domains",q:"Which PPST Domain focuses on Personal Growth and Professional Development?",c:["A. Domain 5","B. Domain 6","C. Domain 7","D. Domain 4"],a:"C",e:"DOMAIN 7 is Personal Growth and Professional Development, containing five strands: philosophy of teaching, dignity of teaching, professional links, professional reflection, and professional development goals."},
{id:9,d:"easy",t:"Career Stages",q:"How many Career Stages of a Teacher are described in the document?",c:["A. 3","B. 4","C. 5","D. 6"],a:"B",e:"There are FOUR Career Stages: (1) Beginning Teachers, (2) Proficient Teachers, (3) Highly Proficient Teachers, and (4) Distinguished Teachers."},
{id:10,d:"easy",t:"Career Stages",q:"Career Stage 1 teachers are also called ___.",c:["A. Proficient Teachers","B. Highly Proficient Teachers","C. Distinguished Teachers","D. Beginning Teachers"],a:"D",e:"Career Stage 1 are BEGINNING TEACHERS — they have gained qualifications for entry into the teaching profession, have strong understanding of their subjects, and seek advice from experienced colleagues."},
{id:11,d:"easy",t:"Classroom Management",q:"Classroom management refers to the process of organizing and conducting the business of the classroom relatively free of ___.",c:["A. Student participation","B. Behavior problems","C. Teaching strategies","D. Assessment activities"],a:"B",e:"Classroom management is the process of organizing and conducting the business of the classroom relatively FREE OF BEHAVIOR PROBLEMS. It relates to preservation of order and maintenance of control."},
{id:12,d:"easy",t:"5 Types of Teacher Power",q:"Which type of teacher power is exercised when a teacher gives students a sense of belonging and acceptance?",c:["A. Expert Power","B. Legitimate Power","C. Referent Power","D. Coercive Power"],a:"C",e:"REFERENT POWER — giving students a sense of BELONGING AND ACCEPTANCE. Expert Power comes from knowledge; Legitimate Power comes from authority ('loco parentis'); Reward Power gives rewards; Coercive Power gives punishments."},
{id:13,d:"easy",t:"5 Types of Teacher Power",q:"'Loco parentis' is associated with which type of teacher power?",c:["A. Expert Power","B. Reward Power","C. Referent Power","D. Legitimate Power"],a:"D",e:"LEGITIMATE POWER — persons in authority. 'Loco parentis' means 'in place of a parent' — teachers assume parental-like authority in the classroom."},
{id:14,d:"easy",t:"Types of Classroom Manager",q:"A teacher who is 'demanding yet warm' is classified as which type of classroom manager?",c:["A. Authoritarian","B. Permissive","C. Uninvolved","D. Authoritative/Democratic"],a:"D",e:"AUTHORITATIVE/DEMOCRATIC classroom manager = DEMANDING YET WARM. They clearly and fairly communicate standards for discipline and performance, and are kind, caring, warm, but also firm."},
{id:15,d:"easy",t:"Multiple Intelligences",q:"Multiple Intelligences theory was created by ___.",c:["A. Jean Piaget","B. Howard Gardner","C. Benjamin Bloom","D. Lev Vygotsky"],a:"B",e:"The theory of Multiple Intelligences was created by HOWARD GARDNER, suggesting abilities cluster in nine different areas."},
{id:16,d:"easy",t:"Multiple Intelligences",q:"A student who is 'word smart,' enjoys reading, writing, and discussing is demonstrating which intelligence?",c:["A. Logical-Mathematical Skills","B. Verbal-Linguistic Skills","C. Interpersonal Abilities","D. Intrapersonal Abilities"],a:"B",e:"VERBAL-LINGUISTIC SKILLS = 'word smart' — enjoys reading, writing, discussing. Activities include: write a story, write a poem, create ads, keep a journal."},
{id:17,d:"easy",t:"Multiple Intelligences",q:"Which intelligence is described as 'number smart/logic smart' involving concept of time, quantity, cause and effect?",c:["A. Visual-Spatial","B. Bodily-Kinesthetic","C. Logical-Mathematical","D. Musical"],a:"C",e:"LOGICAL-MATHEMATICAL SKILLS = 'number smart/logic smart' — involves concept of time, quantity, cause and effect. Activities: problem-solving, mental calculations, science experiments, number games."},
{id:18,d:"easy",t:"Multiple Intelligences",q:"'Nature smart' with a love for nature is associated with which of Gardner's intelligences?",c:["A. Existential Intelligence","B. Musical Abilities","C. Naturalistic Abilities","D. Intrapersonal Abilities"],a:"C",e:"NATURALISTIC ABILITIES = 'nature smart' — love for nature, nature study, care for animals."},
{id:19,d:"easy",t:"Learning Styles",q:"Learning Style refers to the preferred way an individual ___.",c:["A. Scores on examinations","B. Processes information","C. Interacts with teachers","D. Completes assignments"],a:"B",e:"Learning Style refers to the PREFERRED WAY an individual PROCESSES INFORMATION — describes a person's typical mode of thinking, remembering, or problem solving."},
{id:20,d:"easy",t:"Laws of Learning",q:"The Law of Exercise states that things most often repeated are ___.",c:["A. Most easily forgotten","B. Best remembered","C. Most likely to be questioned","D. Least effective for learning"],a:"B",e:"LAW OF EXERCISE: things most often REPEATED are BEST REMEMBERED — this is why drills are used in teaching."},
{id:21,d:"easy",t:"Laws of Learning",q:"The Law of Primacy states that ___.",c:["A. Things most recently learned are best remembered","B. Things freely learned are best learned","C. Things learned first create a strong impression — what is taught must be right the first time","D. Learning is strengthened with a pleasant feeling"],a:"C",e:"LAW OF PRIMACY: things LEARNED FIRST create a STRONG IMPRESSION. What is taught must be RIGHT THE FIRST TIME — first impressions are lasting."},
{id:22,d:"easy",t:"Bloom's Taxonomy",q:"In the Revised Bloom's Taxonomy (Krathwohl, 2002), which level replaces 'Synthesis' in the old taxonomy?",c:["A. Evaluating","B. Applying","C. Analyzing","D. Creating"],a:"D",e:"In the REVISED TAXONOMY: old 'Synthesis' becomes 'CREATING' (putting things together — construct, combine, compose, formulate). Old 'Evaluation' becomes 'Evaluating.'"},
{id:23,d:"easy",t:"Bloom's Taxonomy",q:"In Bloom's Revised Taxonomy, 'Remembering' involves retrieving knowledge from ___.",c:["A. Short-term memory","B. Working memory","C. Long-term memory","D. Procedural memory"],a:"C",e:"REMEMBERING: retrieving relevant knowledge from LONG-TERM MEMORY. Sub-processes: recall, recognize, define, identify."},
{id:24,d:"easy",t:"Teaching Approaches",q:"In Teacher-Centered Approach, the learner is considered a ___.",c:["A. Active constructor of knowledge","B. Passive recipient of instruction","C. Collaborative partner in learning","D. Self-directed learner"],a:"B",e:"In TEACHER-CENTERED APPROACH, the learner is a PASSIVE RECIPIENT OF INSTRUCTION. The teacher is the only reliable source of information; teaching consists of telling and prescribing."},
{id:25,d:"easy",t:"Teaching Approaches",q:"The Deductive Method moves from ___.",c:["A. Specific to general","B. Simple to complex","C. General to specific","D. Easy to difficult"],a:"C",e:"DEDUCTIVE METHOD moves from GENERAL TO SPECIFIC. The teacher starts discussing a rule then ends with giving examples. It is associated with LOTS (lower-order thinking skills) and less interaction."},
{id:26,d:"easy",t:"Teaching Approaches",q:"The Inductive Method is also referred to as ___.",c:["A. Direct instruction","B. Deductive method","C. Indirect instruction","D. Lecture method"],a:"C",e:"The INDUCTIVE METHOD is also referred to as INDIRECT INSTRUCTION — it begins from specific to general, starting with questions, problems, and details and ending up with answers, generalizations, and conclusions."},
{id:27,d:"easy",t:"Cooperative Learning",q:"In Cooperative Learning, teams are made up of students with ___.",c:["A. Same ability levels","B. High ability only","C. Mixed abilities — high, average, and low achievers","D. Low ability only"],a:"C",e:"COOPERATIVE LEARNING teams are made up of MIXED ABILITIES — high, average, and low achievers. Reward systems are group-oriented rather than individually-oriented."},
{id:28,d:"easy",t:"Effective Teacher Characteristics",q:"A teacher who does not waste instructional time and starts on time demonstrates which characteristic of an effective teacher?",c:["A. Positive","B. Prepared","C. Creative","D. Fair"],a:"B",e:"PREPARED effective teachers: come to class each day ready to teach, always ready in class, don't waste instructional time and start on time. 'Time flies in their classes because students are engaged in learning.'"},
{id:29,d:"easy",t:"Mager's Objective Components",q:"Mager's Three Main Components of an Effective Objective include Performance, Condition, and ___.",c:["A. Content","B. Assessment","C. Acceptable Performance/Criterion of Success","D. Learning Outcome"],a:"C",e:"MAGER'S THREE COMPONENTS: (1) PERFORMANCE — what the student should be able to do; (2) CONDITION — conditions under which the performance will occur; (3) ACCEPTABLE PERFORMANCE/CRITERION OF SUCCESS — the criteria by which performance will be judged."},
{id:30,d:"easy",t:"Classroom Management Principles",q:"'Routines are the backbone of daily classroom life.' This is one of the key ___.",c:["A. Laws of Learning","B. Principles of Classroom Management","C. Characteristics of an Effective Teacher","D. Types of Classroom Manager"],a:"B",e:"This is one of the PRINCIPLES OF CLASSROOM MANAGEMENT — establishing routines for all daily tasks and needs saves valuable classroom time and makes it easier for students to learn and achieve more."},

// ═══════════════════ MODERATE (31–80) ═══════════════════
{id:31,d:"moderate",t:"PQF",q:"Which of the following is NOT listed as a purpose of the PQF?",c:["A. Assists individuals to move easily between different education and training sectors and the labor market","B. Aligns international qualifications for full recognition of Philippine qualifications","C. Provides direct employment to graduates of teacher education","D. Used as basis for accrediting certificates and licenses"],a:"C",e:"PQF purposes: (1) legal document adopting national standards; (2) assists movement between education sectors and labor market; (3) aligns international qualifications; (4) basis for accrediting certificates and licenses. Providing direct employment is NOT listed."},
{id:32,d:"moderate",t:"PPST",q:"The old NCBTS was institutionalized through which DepEd order?",c:["A. CHED Memorandum Order No. 42, s. 2017","B. Department Order 42, s. 2017","C. CHED Memorandum Order No. 52, s. 2007 and DepEd Order No. 32, s. 2009","D. Republic Act 10533"],a:"C",e:"NCBTS (National Competency-Based Teacher Standards) was institutionalized through CHED Memorandum Order No. 52, s. 2007 and DepEd Order No. 32, s. 2009. The new PPST is implemented through DO 42, s. 2017."},
{id:33,d:"moderate",t:"PPST — Domain 5",q:"Domain 5, Assessment and Reporting, is composed of five strands. Which of the following is NOT one of those strands?",c:["A. Design, selection, organization and utilization of assessment strategies","B. Monitoring and evaluation of learner progress and achievement","C. Management of classroom structure and activities","D. Use of assessment data to enhance teaching and learning practices"],a:"C",e:"'Management of classroom structure and activities' is a strand of DOMAIN 2 (Learning Environment), NOT Domain 5. Domain 5 strands include: design of assessment strategies, monitoring learner progress, feedback to improve learning, communication to stakeholders, and use of assessment data."},
{id:34,d:"moderate",t:"PPST — Domain 6",q:"Domain 6, Community Linkages and Professional Engagement, consists of how many strands?",c:["A. 3","B. 4","C. 5","D. 6"],a:"B",e:"Domain 6 consists of FOUR strands: (1) Establishment of learning environments responsive to community contexts; (2) Engagement of parents and wider school community; (3) Professional ethics; (4) School policies and procedures."},
{id:35,d:"moderate",t:"Career Stages",q:"Career Stage 2 (Proficient Teachers) are described as INDIVIDUALLY ___.",c:["A. Seeking advice from experienced colleagues","B. Professionally independent in the application of skills vital to teaching","C. Displaying the highest standard for teaching grounded in global best practices","D. Manifesting sophisticated understanding of teaching and learning"],a:"B",e:"Career Stage 2 (Proficient Teachers): are PROFESSIONALLY INDEPENDENT in the application of skills vital to teaching. They provide focused teaching programs, display skills in planning, implementing, and managing learning programs."},
{id:36,d:"moderate",t:"Career Stages",q:"Career Stage 3 (Highly Proficient Teachers) are characterized as ___.",c:["A. Beginning stage — seeking advice from senior teachers","B. Leaders in education who embody the highest global standards","C. Consistently displaying high level of performance in teaching practice and are mentors","D. Professionally independent and reflective practitioners"],a:"C",e:"Career Stage 3 (HIGHLY PROFICIENT TEACHERS) = MENTORS — consistently display HIGH LEVEL OF PERFORMANCE in teaching; have high education-focused situation cognition; provide support and mentoring to colleagues."},
{id:37,d:"moderate",t:"Career Stages",q:"Career Stage 4 teachers are described as LEADERS IN EDUCATION. Which characteristic is UNIQUE to Career Stage 4?",c:["A. They seek advice from experienced colleagues","B. They provide focused teaching programs meeting curriculum requirements","C. They embody the highest standard for teaching grounded in global best practices","D. They display high-level performance in teaching"],a:"C",e:"CAREER STAGE 4 (DISTINGUISHED TEACHERS): embody the HIGHEST STANDARD for teaching GROUNDED IN GLOBAL BEST PRACTICES; exhibit exceptional capacity to improve their own and others' practice; recognized as leaders in education."},
{id:38,d:"moderate",t:"Classroom Management",q:"The principle 'Resolve minor inattention and disruption before they become major disruption' is an example of which concept?",c:["A. Ripple Effect","B. With-it-ness","C. Proactive discipline","D. Pygmalion Effect"],a:"C",e:"This is one of the PRINCIPLES OF CLASSROOM MANAGEMENT — specifically related to PROACTIVE DISCIPLINE. Proactive means anticipating and preventing behavior problems (rules set at day 1 of class, anticipatory, inventive)."},
{id:39,d:"moderate",t:"Types of Classroom Manager",q:"An Authoritarian classroom manager is characterized by which phrase?",c:["A. Warm but not demanding","B. Neither demanding nor warm","C. Demanding but not warm","D. Demanding yet warm"],a:"C",e:"AUTHORITARIAN = DEMANDING BUT NOT WARM. Characterized by power, domination, pressure, and criticism. The authoritarian teacher uses pressure, a sharp voice, and fear in forcing class decisions."},
{id:40,d:"moderate",t:"Approaches to Classroom Management",q:"The Business Academic Approach was developed by ___.",c:["A. Jacob Kounin","B. Duke and Mechei","C. Evertson and Emmer","D. Robert Mager"],a:"C",e:"BUSINESS ACADEMIC APPROACH was developed by EVERTSON AND EMMER. It emphasizes the organization and management of students as they engage in academic work — clear communication of assignments and work requirements, monitoring student work, and feedback."},
{id:41,d:"moderate",t:"Approaches to Classroom Management",q:"The Group Managerial Approach is based on whose research?",c:["A. Evertson and Emmer","B. Jacob Kounin","C. Duke and Mechei","D. Howard Gardner"],a:"B",e:"GROUP MANAGERIAL APPROACH is based on JACOB KOUNIN's research. It emphasizes the importance of responding immediately to group student behavior that might be inappropriate in order to prevent problems."},
{id:42,d:"moderate",t:"Effects in Classroom",q:"'The greater the expectation placed upon people, the better they perform.' This defines which effect?",c:["A. Hawthorne Effect","B. John Henry Effect","C. Placebo Effect","D. Pygmalion/Rosenthal Effect"],a:"D",e:"PYGMALION/ROSENTHAL EFFECT — the phenomenon whereby the GREATER THE EXPECTATION placed upon people, the BETTER THEY PERFORM. Higher teacher expectations lead to higher student achievement."},
{id:43,d:"moderate",t:"Effects in Classroom",q:"The Hawthorne Effect (also called Observer Effect) is described as ___.",c:["A. A control group gets no intervention but competes with the experimental group","B. Individuals modify or improve an aspect of their behavior in response to their awareness of being observed","C. Greater expectation leads to better performance","D. A fake treatment improves a patient's condition based on belief"],a:"B",e:"HAWTHORNE EFFECT (OBSERVER EFFECT): individuals MODIFY or IMPROVE an aspect of their BEHAVIOR in RESPONSE TO THEIR AWARENESS OF BEING OBSERVED."},
{id:44,d:"moderate",t:"Effects in Classroom",q:"The John Henry Effect is the opposite of which effect?",c:["A. Pygmalion Effect","B. Placebo Effect","C. Hawthorne Effect","D. Halo Effect"],a:"C",e:"JOHN HENRY EFFECT is the OPPOSITE OF THE HAWTHORNE EFFECT — it is when a CONTROL GROUP that gets no intervention compares themselves to the experimental group and through EXTRA EFFORT gets the same effects or results."},
{id:45,d:"moderate",t:"Effects in Classroom",q:"The Halo Effect is described as ___.",c:["A. A cognitive bias where overall impression of a person influences thoughts about their character","B. A control group competing with an experimental group","C. Behavior change due to being observed","D. Students performing better due to teacher expectations"],a:"A",e:"HALO EFFECT: a COGNITIVE BIAS in which an observer's OVERALL IMPRESSION OF A PERSON (company, brand, or product) INFLUENCES the observer's FEELINGS AND THOUGHTS about that entity's character or properties."},
{id:46,d:"moderate",t:"Group Focus Techniques",q:"'With-it-ness' is described as the skill to ___.",c:["A. Respond when appropriate by pointing out misconduct","B. Know what is going on in all parts of the classroom at all times — nothing is missed","C. Place the teacher's presence close to a misbehaving student","D. Use a child's name in an example"],a:"B",e:"WITH-IT-NESS: the skill to KNOW WHAT IS GOING ON IN ALL PARTS OF THE CLASSROOM AT ALL TIMES; nothing is missed. The teacher has 'eyes in the back of their head.'"},
{id:47,d:"moderate",t:"Group Focus Techniques",q:"'Flip-flop' in Kounin's analysis refers to ___.",c:["A. A teacher moving at a brisk pace through lessons","B. A teacher involving the whole class using alerting techniques","C. A teacher who terminates one activity, goes to another, then returns to the previously terminated activity — lacks clear direction","D. A teacher responding immediately to group misbehavior"],a:"C",e:"FLIP-FLOP: the teacher TERMINATES ONE ACTIVITY, goes to ANOTHER, then RETURNS to the previously terminated activity. The teacher LACKS CLEAR DIRECTION and sequence of activities."},
{id:48,d:"moderate",t:"Group Focus Techniques",q:"'Antiseptic Bouncing' refers to ___.",c:["A. Ignoring a student's action done for attention","B. Asking a student to leave the room if uncontrollably misbehaving","C. Using humor to release tension in a tensed situation","D. Placing the teacher's presence close to a misbehaving student"],a:"B",e:"ANTISEPTIC BOUNCING: ASKING A STUDENT TO LEAVE THE ROOM if he or she is uncontrollably giggling or misbehaving that affects the majority of the class."},
{id:49,d:"moderate",t:"Multiple Intelligences",q:"A student who works best independently, keeps journals and diaries, and works on self-paced projects demonstrates which intelligence?",c:["A. Interpersonal Abilities","B. Musical Abilities","C. Intrapersonal Abilities","D. Naturalistic Abilities"],a:"C",e:"INTRAPERSONAL ABILITIES = 'self-smart' — works independently, keeps journals and diaries, works alone, does self-paced projects, reflecting and having space."},
{id:50,d:"moderate",t:"Multiple Intelligences",q:"Existential Intelligence is associated with ___.",c:["A. Body smart — manipulating what is learned","B. Spirit smart — asking big questions, thinking philosophy, 'Who am I?'","C. People smart — group work and team work","D. Music smart — ear for good music"],a:"B",e:"EXISTENTIAL INTELLIGENCE = 'spirit smart' — 'Who am I?' — asks deep questions, thinks philosophy, looks at the big picture, seeks meaningful learning."},
{id:51,d:"moderate",t:"Learning Styles",q:"A Visual-Iconic learner is MOST described by which characteristic?",c:["A. Comfortable with abstract symbolism such as mathematical formulae","B. Prefers to read a book than a map","C. More interested in visual imagery such as film, graphic displays, or pictures — has 'picture memory'","D. Learns best through verbal lectures"],a:"C",e:"VISUAL-ICONIC learners: more interested in VISUAL IMAGERY such as film, graphic displays, or pictures to solidify learning. Have 'picture memory' (iconic memory) and prefer maps to books."},
{id:52,d:"moderate",t:"Learning Styles",q:"Visual-Symbolic learners are characterized by ___.",c:["A. Interest in film, graphic displays, and pictures","B. Preferring to read a map rather than a book","C. Comfort with abstract symbolism such as mathematical formulae or the written word — good abstract thinkers","D. Learning best by listening to lectures"],a:"C",e:"VISUAL-SYMBOLIC learners: feel COMFORTABLE WITH ABSTRACT SYMBOLISM such as mathematical formulae or the WRITTEN WORD. Prefer to read a book than a map. Tend to be good ABSTRACT THINKERS."},
{id:53,d:"moderate",t:"Roger Sperry's Model",q:"In Roger Sperry's Model, the Left Brain (Analytic) is characterized by which of the following?",c:["A. Visual processing, responds to tone of voice, random, processes in varied order","B. Verbal, responds to word meaning, sequential, processes information linearly, responds to logic","C. Impulsive, responds to emotion, gestures when speaking","D. Prefers sound/music background while studying"],a:"B",e:"LEFT BRAIN (ANALYTIC): VERBAL, responds to WORD MEANING, SEQUENTIAL, PROCESSES INFORMATION LINEARLY, RESPONDS TO LOGIC, plans ahead, recalls names, speaks with few gestures, PUNCTUAL, prefers formal study design and bright lights."},
{id:54,d:"moderate",t:"Roger Sperry's Model",q:"The Right Brain (Global) learner prefers ___.",c:["A. Sequential processing and formal study design","B. Responding to word meaning and logic","C. Sound/music background while studying and processes information in varied order","D. Verbal communication and bright lights while studying"],a:"C",e:"RIGHT BRAIN (GLOBAL): visual, responds to TONE OF VOICE, RANDOM, processes information in VARIED ORDER, responds to emotion, IMPULSIVE, recalls faces, GESTURES WHEN SPEAKING, LESS PUNCTUAL, PREFERS SOUND/MUSIC background while studying."},
{id:55,d:"moderate",t:"Differentiated Instruction",q:"Differentiated Instruction (DI) is a teaching theory based on the premise that ___.",c:["A. All students should receive identical instruction","B. Instructional approaches should vary and be adapted in relation to individual and diverse students","C. The teacher is the primary source of all learning","D. Content should be standardized across all classrooms"],a:"B",e:"DIFFERENTIATED INSTRUCTION (DI): teaching theory based on the premise that INSTRUCTIONAL APPROACHES SHOULD VARY AND BE ADAPTED in RELATION TO INDIVIDUAL AND DIVERSE STUDENTS in the classroom."},
{id:56,d:"moderate",t:"Principles of Learning",q:"'Learning is the discovery of the personal meaning and relevance of ideas.' Which Principle of Learning does this represent?",c:["A. Learning is a cooperative and collaborative process","B. The process of learning is emotional as well as intellectual","C. Learning is the discovery of the personal meaning and relevance of ideas","D. Learning is sometimes a painful process"],a:"C",e:"This is PRINCIPLE 2 of the Principles of Learning: 'Learning is the DISCOVERY OF THE PERSONAL MEANING AND RELEVANCE OF IDEAS.' Making your class RELATABLE helps learners discover why what they learn matters."},
{id:57,d:"moderate",t:"Laws of Learning",q:"The Law of Readiness states that individuals learn best when they are ___.",c:["A. Most recently exposed to the information","B. Physically, mentally, and emotionally ready to learn","C. Experiencing pleasant feelings during learning","D. Frequently repeating the material"],a:"B",e:"LAW OF READINESS: individuals learn best when they are PHYSICALLY, MENTALLY, AND EMOTIONALLY READY to learn. They do learn well if they see NO REASON FOR LEARNING (motivated)."},
{id:58,d:"moderate",t:"Laws of Learning",q:"The Law of Recency states that ___.",c:["A. The more intense the material taught, the more it is likely learned","B. Things freely learned are best learned","C. Things most recently learned are best remembered","D. Things most often repeated are best remembered"],a:"C",e:"LAW OF RECENCY: things MOST RECENTLY LEARNED are BEST REMEMBERED. This supports the use of reviews and summaries at the end of lessons."},
{id:59,d:"moderate",t:"Cognitive Structures — Charles Lettieri",q:"'The ability to select relevant or important information without being distracted or confused by irrelevant secondary information' — this defines which of Lettieri's 7 Cognitive Structures?",c:["A. Analysis (field dependence-independence)","B. Comparative Analysis (reflective-impulsivity)","C. Narrowing (breadth of categorization)","D. Focusing (scanning/concentration)"],a:"D",e:"FOCUSING (SCANNING/CONCENTRATION): the ability to SELECT RELEVANT OR IMPORTANT INFORMATION WITHOUT BEING DISTRACTED or confused by irrelevant secondary information."},
{id:60,d:"moderate",t:"Cognitive Structures — Charles Lettieri",q:"Which cognitive structure involves 'the ability to integrate complex information into existing cognitive structures (long-term memory)'?",c:["A. Sharpening (sharpening-leveling)","B. Analysis (field dependence-independence)","C. Complex Cognitive (complexity-simplicity)","D. Tolerance (tolerant-intolerant)"],a:"C",e:"COMPLEX COGNITIVE (COMPLEXITY-SIMPLICITY): the ability to INTEGRATE COMPLEX INFORMATION INTO EXISTING COGNITIVE STRUCTURES — connecting past to present (long-term memory)."},
{id:61,d:"moderate",t:"Bloom's Taxonomy — Knowledge Dimension",q:"Which Knowledge Dimension category involves 'knowledge of cognition in general and awareness of one's own cognition — thinking about thinking'?",c:["A. Factual Knowledge","B. Conceptual Knowledge","C. Procedural Knowledge","D. Metacognitive Knowledge"],a:"D",e:"METACOGNITIVE KNOWLEDGE: knowledge of COGNITION IN GENERAL, AWARENESS of one's own cognition — THINKING ABOUT THINKING. Includes knowledge of strategies, cognitive tasks, and self-knowledge."},
{id:62,d:"moderate",t:"Bloom's Taxonomy",q:"In the Revised Bloom's Taxonomy, 'Evaluating' involves making judgments based on criteria and standards. The sub-processes include ___.",c:["A. Recall, recognize, define, identify","B. Use, employ, apply","C. Break down, categorize, group","D. Check, critique, rate, judge"],a:"D",e:"EVALUATING: making judgments based on criteria and standards. Sub-processes: CHECK, CRITIQUE, RATE, JUDGE. Example: judging whether a solution meets required criteria."},
{id:63,d:"moderate",t:"Affective Domain",q:"In David Krathwohl's Affective Domain, a student who shows 'willingness to attend to particular classroom stimuli or phenomenon in the environment' is at which level?",c:["A. Responding","B. Valuing","C. Receiving","D. Organization"],a:"C",e:"RECEIVING: the student shows WILLINGNESS TO ATTEND to particular classroom stimuli or phenomenon. Example: watching a video about climate change. This is the first level of the Affective Domain."},
{id:64,d:"moderate",t:"Affective Domain",q:"A student who arranges a union in school to help the environment and provide awareness on climate change is demonstrating which affective level?",c:["A. Receiving","B. Valuing","C. Responding","D. Organization"],a:"D",e:"ORGANIZATION: the student has INTEGRATED A NEW VALUE into his general set of values and can give it its proper place in a priority system. Example: arranging a union in school — showing commitment beyond individual valuing."},
{id:65,d:"moderate",t:"Psychomotor Domain",q:"In Anita Harrow's Psychomotor Domain, movements that students have innately formed from a combination of reflex movements (like walking, running, pushing) are classified as ___.",c:["A. Reflex movements","B. Basic fundamental movement","C. Perceptual abilities","D. Physical activities"],a:"B",e:"BASIC FUNDAMENTAL MOVEMENT: students have INNATE MOVEMENT PATTERNS formed from a COMBINATION OF REFLEX MOVEMENTS. Examples: walking, running, pushing, twisting, gripping, grasping, manipulating."},
{id:66,d:"moderate",t:"Psychomotor Domain — Moore",q:"In Moore's 3 Levels of Learning Psychomotor Domain, the HIGHEST level is ___.",c:["A. Imitation","B. Manipulation","C. Precision","D. Automaticity"],a:"C",e:"PRECISION is the HIGHEST LEVEL in Moore's 3 Levels — students can perform the skill accurately, efficiently, and effortlessly. AUTOMATICITY (ability to perform with unconscious effort) is associated with precision."},
{id:67,d:"moderate",t:"Content Selection Qualities",q:"'Validity' in content selection means ___.",c:["A. The content responds to the needs and interests of learners","B. Content covers facts, skills, and values","C. Teaching the content we ought to teach according to the national standards in the Basic Education Curriculum","D. The content can be covered in time available"],a:"C",e:"VALIDITY: means TEACHING THE CONTENT THAT WE OUGHT TO TEACH ACCORDING TO THE NATIONAL STANDARDS in the Basic Education Curriculum. It aligns content to official standards."},
{id:68,d:"moderate",t:"Content Selection Qualities",q:"'Self-sufficiency' in content selection refers to ___.",c:["A. Content that responds to learner needs","B. Content should cover the essentials of the lesson — 'a mile wide and an inch deep'","C. Content includes facts, skills, and values","D. Content can be covered in the time available for instruction"],a:"B",e:"SELF-SUFFICIENCY: content should cover the ESSENTIALS OF THE LESSON and NOT 'a mile wide and an inch deep' — quality over quantity in content coverage."},
{id:69,d:"moderate",t:"Cognitive Content — Day 5",q:"'A categorization of events, places, people, ideas' defines which component of cognitive content?",c:["A. Fact","B. Hypothesis","C. Principle","D. Concept"],a:"D",e:"CONCEPT: CATEGORIZATION OF EVENTS, PLACES, PEOPLE, IDEAS. It is a category or mental grouping. Compare: Fact = verifiable idea/action; Principle = relationship between facts and concepts; Hypothesis = educated guess."},
{id:70,d:"moderate",t:"Thinking Skills — Day 5",q:"'Fluent thinking, flexible thinking, original thinking, and elaborative thinking' are all components of ___.",c:["A. Convergent thinking","B. Critical thinking","C. Metaphoric thinking","D. Divergent thinking"],a:"D",e:"DIVERGENT THINKING contains: FLUENT THINKING (generation of lots of ideas), FLEXIBLE THINKING (variety of types of ideas), ORIGINAL THINKING (away from the obvious), ELABORATIVE THINKING (uses prior knowledge to expand)."},
{id:71,d:"moderate",t:"Teaching Approaches",q:"The Banking Approach views students as ___.",c:["A. Active constructors of knowledge","B. Empty receptacles waiting to be filled (tabula rasa)","C. Partners in collaborative learning","D. Self-directed learners"],a:"B",e:"BANKING APPROACH: teacher deposits knowledge into 'empty minds' of students. Students are EMPTY RECEPTACLES WAITING TO BE FILLED — 'tabula rasa.' Associated with John Locke. Similar to Freire's critique of traditional education."},
{id:72,d:"moderate",t:"Teaching Approaches",q:"The Constructivist Approach views learning as ___.",c:["A. A passive reception of teacher-transmitted knowledge","B. An active process that results from self-constructed meanings with a meaningful connection between prior and present knowledge","C. A process of depositing facts into student memory","D. A process of following prescribed procedures"],a:"B",e:"CONSTRUCTIVIST APPROACH: LEARNING IS AN ACTIVE PROCESS that results from SELF-CONSTRUCTED MEANINGS. A meaningful connection is established between PRIOR KNOWLEDGE and the PRESENT LEARNING ACTIVITY. Teacher's role is to FACILITATE the learning environment."},
{id:73,d:"moderate",t:"Integrated Approach",q:"When teachers organize the curriculum around students' questions and concerns, teaching using real-life context, this is called ___.",c:["A. Intradisciplinary","B. Interdisciplinary","C. Transdisciplinary","D. Multidisciplinary"],a:"C",e:"TRANSDISCIPLINARY: teachers organize the curriculum around STUDENTS' QUESTIONS AND CONCERNS, teaching using REAL-LIFE CONTEXT. Compare: Intradisciplinary = within one subject; Interdisciplinary = between two different subjects."},
{id:74,d:"moderate",t:"Direct Instruction Components",q:"In Direct Instruction, 'Consolidation (Extension)' is the component where ___.",c:["A. Teachers and students work together on a skill or task","B. Students complete assignments by themselves first in class, then at home","C. The teacher helps students consider a skill in relation to several examples to determine when the skill should or should not be used","D. The teacher asks students to apply the skill in a new problem"],a:"C",e:"CONSOLIDATION (EXTENSION): the teacher HELPS STUDENTS CONSIDER A SKILL in relation to SEVERAL EXAMPLES and to DETERMINE WHETHER THE SKILLS SHOULD OR SHOULD NOT BE USED — deepening understanding of when to apply a skill."},
{id:75,d:"moderate",t:"Cooperative Learning Elements",q:"Which of the following is NOT one of the five elements of the Cooperative Learning Model?",c:["A. Positive Interdependence","B. Face-to-Face Interaction","C. Individual and Group Accountability","D. Teacher-Centered Instruction"],a:"D",e:"The 5 elements of Cooperative Learning: (1) POSITIVE INTERDEPENDENCE, (2) FACE-TO-FACE INTERACTION, (3) INDIVIDUAL AND GROUP ACCOUNTABILITY, (4) INTERPERSONAL AND SMALL GROUP SKILLS, (5) GROUP PROCESSING. Teacher-centered instruction is not an element."},
{id:76,d:"moderate",t:"Student Problem Types",q:"A student who says 'you can't make me,' resists verbally, and contradicts the teacher is MOST likely which type of problem student?",c:["A. Withdrawn","B. Passive Aggressive","C. Hyperactive","D. Defiant"],a:"D",e:"DEFIANT students: RESIST AUTHORITY, carry on a POWER STRUGGLE with the teacher. Signs: resists verbally with 'you can't make me,' derogatory statements, resists non-verbally with frowns, deliberately does what teacher says not to do."},
{id:77,d:"moderate",t:"Student Problem Types",q:"A student who has low potential or lack of readiness rather than poor motivation — has difficulty following directions, poor retention, progresses slowly — is a ___.",c:["A. Distractible student","B. Underachiever","C. Low Achiever","D. Failure Syndrome student"],a:"C",e:"LOW ACHIEVER: have difficulty even though they may be WILLING TO WORK. Their problem is LOW POTENTIAL OR LACK OF READINESS RATHER THAN POOR MOTIVATION. Signs: difficulty following directions, completing work, poor retention, progresses slowly."},
{id:78,d:"moderate",t:"4 Mistaken Goals",q:"A student who disrupts the classroom, asks for favors, tattles on others, and refuses to work — seeking to 'keep others busy or get special service' — has which mistaken goal?",c:["A. Goal to Seek Power","B. Goal to Seek Revenge","C. Goal to Seek Attention","D. Goal to Isolate Oneself"],a:"C",e:"GOAL TO SEEK ATTENTION: 'to keep others busy or to get special service.' Child's belief: 'I count (belong) only when I'm being noticed or getting special service.' Teacher response: Notice Me–Involve Me."},
{id:79,d:"moderate",t:"4 Mistaken Goals",q:"For a child whose goal is to Seek Revenge, what does the child need?",c:["A. Notice Me–Involve Me","B. Let Me Help–Give Me Choices","C. Have Faith in Me–Don't Give Up On Me","D. Help Me–I'm Hurting"],a:"D",e:"GOAL TO SEEK REVENGE: child's belief — 'I can't be liked or loved, so I'll hurt others as I feel hurt.' Child needs: HELP ME–I'M HURTING. Adults: apologize, avoid punishment and retaliation, show you care."},
{id:80,d:"moderate",t:"Tutoring Arrangements",q:"'Monitorial tutoring' refers to ___.",c:["A. Older students helping younger ones on a one-to-one basis","B. The class divided into groups with monitors assigned to lead each group","C. Children acting as interactive pairs for same-age tutoring","D. A combination of unstructured and structured tutoring"],a:"B",e:"MONITORIAL TUTORING: the CLASS MAY BE DIVIDED INTO GROUPS and MONITORS ARE ASSIGNED TO LEAD EACH GROUP. Compare: Instructional tutoring = older helps younger; Same-age tutoring = interactive pairs; Semi-structured = combination of unstructured and structured."},

// ═══════════════════ DIFFICULT (81–100) ═══════════════════
{id:81,d:"difficult",t:"Integrated Application — PQF & PPST",q:"A teacher education institution graduates a student with PQF 6 qualifications. According to the document, this student should ALSO master ___.",c:["A. The NCBTS framework","B. The PPST — Beginning Teacher Standards","C. Department Order 32, s. 2009","D. The PPSSH"],a:"B",e:"Teacher education institutions have the responsibility of graduating students with PQF 6 qualifications AND to MASTER THE PPST — specifically the BEGINNING TEACHER STANDARDS, which are the expectation of the teaching industry in basic education."},
{id:82,d:"difficult",t:"Career Stages — Analysis",q:"A teacher is 'professionally independent,' provides focused teaching programs, is a reflective practitioner consolidating Career Stage 1 knowledge, and actively engages in collaborative learning with the professional community. This teacher is MOST accurately at which career stage?",c:["A. Career Stage 1 — Beginning Teachers","B. Career Stage 2 — Proficient Teachers","C. Career Stage 3 — Highly Proficient Teachers","D. Career Stage 4 — Distinguished Teachers"],a:"B",e:"CAREER STAGE 2 (PROFICIENT): professionally INDEPENDENT, provides FOCUSED TEACHING PROGRAMS, reflective practitioners who consolidate Career Stage 1 knowledge, actively engage in COLLABORATIVE LEARNING with stakeholders for mutual growth."},
{id:83,d:"difficult",t:"Classroom Management Effects — Analysis",q:"A teacher tells students that Santa Claus is coming with gifts ONLY for well-behaved students. Students begin behaving well. Which effect BEST explains this behavior change?",c:["A. Hawthorne Effect","B. Pygmalion Effect","C. Halo Effect","D. Placebo Effect"],a:"D",e:"PLACEBO EFFECT: an inactive substance or FALSE BELIEF/EXPECTATION improves behavior because the PERSON BELIEVES it will work. The teacher conditioned children to BELIEVE Santa is coming — they behave based on that belief/expectation, not actual intervention."},
{id:84,d:"difficult",t:"Domain Analysis — PPST",q:"A teacher designs lessons aligned with learning competencies, uses ICT to enrich practice, and ensures professional collaboration with colleagues. These actions PRIMARILY reflect which PPST Domain?",c:["A. Domain 2 — Learning Environment","B. Domain 1 — Content Knowledge and Pedagogy","C. Domain 4 — Curriculum and Planning","D. Domain 7 — Personal Growth and Professional Development"],a:"C",e:"DOMAIN 4 (CURRICULUM AND PLANNING) strands: (1) Planning and management of teaching and learning process; (2) Learning outcomes aligned with learning competencies; (3) Relevance and responsiveness of learning programs; (4) PROFESSIONAL COLLABORATION to enrich teaching practice; (5) Teaching and learning resources including ICT."},
{id:85,d:"difficult",t:"Bloom's Taxonomy — Application",q:"A student is asked to 'Design a solution to reduce plastic waste in your community using the engineering design process.' Which cell in the Revised Bloom's Taxonomy BEST represents this task?",c:["A. Remembering — Factual Knowledge","B. Understanding — Conceptual Knowledge","C. Creating — Procedural Knowledge","D. Analyzing — Metacognitive Knowledge"],a:"C",e:"CREATING (highest cognitive level) + PROCEDURAL KNOWLEDGE (how things work, step-by-step actions, methods). Designing a solution is CREATING; using the engineering design process is PROCEDURAL. This is the highest-order, most complex cell."},
{id:86,d:"difficult",t:"Teaching Approaches — Deep Analysis",q:"A teacher using the Metacognitive Approach allows students to think aloud about their own thought processes while solving a problem. A teacher using the Constructivist Approach facilitates a learning environment where students connect prior knowledge to new concepts. What is the KEY DIFFERENCE between these two approaches?",c:["A. Both approaches have the same underlying philosophy","B. Metacognitive focuses on MONITORING THOUGHT PROCESSES while thinking; Constructivist focuses on BUILDING MEANING through the connection of prior and present knowledge","C. Constructivist is teacher-centered; Metacognitive is student-centered","D. Metacognitive uses banking approach; Constructivist uses inquiry"],a:"B",e:"KEY DIFFERENCE: METACOGNITIVE = thinking about thinking, MONITORING THOUGHT PROCESSES, going beyond cognition, allowing students to THINK ALOUD. CONSTRUCTIVIST = learning as ACTIVE PROCESS, SELF-CONSTRUCTED MEANINGS, connection of PRIOR KNOWLEDGE to present learning activity. Both are student-centered but address different aspects of learning."},
{id:87,d:"difficult",t:"Inductive vs. Deductive — Analysis",q:"A teacher introduces a grammar lesson by giving students several example sentences containing the passive voice, then asks students to figure out the rule. Which approach is being used, and what are its TWO MAIN ADVANTAGES according to the document?",c:["A. Deductive Method — uses generalization first, develops LOTS","B. Inductive Method — learners are more engaged, learning becomes more interesting because it begins with experiences, and develops HOTS","C. Direct Instruction — teacher directed, used for facts and principles","D. Demonstration Method — shows how a process is done while students observe"],a:"B",e:"INDUCTIVE METHOD (specific→general): begins with EXAMPLES then leads to the RULE. Advantages: (1) LEARNERS ARE MORE ENGAGED; (2) LEARNING BECOMES MORE INTERESTING because it begins with experiences of the learners; (3) DEVELOPS HOTS (Higher-Order Thinking Skills)."},
{id:88,d:"difficult",t:"Student Problem Types — Case Analysis",q:"A student who repeatedly says 'I can't do it,' gives up easily, is easily frustrated, and expects to fail even after succeeding MOST LIKELY demonstrates which student problem type?",c:["A. Low Achiever — has low potential or lack of readiness","B. Underachiever — does the minimum to get by","C. Failure Syndrome — convinced they cannot do their work and expect to fail even after succeeding","D. Perfectionist — unrealistically high self-imposed standards"],a:"C",e:"FAILURE SYNDROME: children are CONVINCED THAT THEY CANNOT DO THEIR WORK. They EXPECT TO FAIL EVEN AFTER SUCCEEDING. Signs: easily frustrated, easily gives up, says 'I can't do it.' Unlike Low Achiever (lacks ability), Failure Syndrome students may have the ability but are psychologically blocked."},
{id:89,d:"difficult",t:"4 Mistaken Goals — Deep Analysis",q:"A child who retreats further when confronted, shows no improvement or response, and needs to convince the teacher of their disability in order to be left alone — has which mistaken goal? What does this child need?",c:["A. Seek Attention — needs Notice Me–Involve Me","B. Seek Power — needs Let Me Help–Give Me Choices","C. Isolate Oneself (assumed inadequacy) — needs Have Faith in Me–Don't Give Up On Me","D. Seek Revenge — needs Help Me–I'm Hurting"],a:"C",e:"GOAL TO ISOLATE ONESELF (ASSUMED INADEQUACY): 'to give up and be left alone.' Child needs to CONVINCE TEACHER OF DISABILITY to be left alone. NO IMPROVEMENT, NO RESPONSE, RETREATS FURTHER. Child needs: HAVE FAITH IN ME–DON'T GIVE UP ON ME. Teacher: take small steps, make task easier until child experiences success."},
{id:90,d:"difficult",t:"Cognitive Structures — Application",q:"A student who can deal with ambiguous or unclear information without getting frustrated, and can monitor and modify their thinking, demonstrates which of Lettieri's cognitive structures?",c:["A. Sharpening (sharpening-leveling)","B. Complex Cognitive (complexity-simplicity)","C. Tolerance (tolerant-intolerant)","D. Focusing (scanning/concentration)"],a:"C",e:"TOLERANCE (TOLERANT-INTOLERANT): the ability to MONITOR AND MODIFY THINKING, the ability to DEAL WITH AMBIGUOUS OR UNCLEAR INFORMATION WITHOUT GETTING FRUSTRATED. This is key for adaptable, resilient learners."},
{id:91,d:"difficult",t:"Comprehensive Integration — Multiple Intelligences & Learning Styles",q:"A student who prefers group work, talking to people, and cooperating — while also being right-brained (responds to emotion, processes information in varied order, prefers sound while studying) — would MOST BENEFIT from which teaching activity?",c:["A. Individual written reflections with quiet formal study setting","B. Sequential, step-by-step lecture with bright lights","C. Abstract symbolic problem-solving with mathematical formulae","D. Collaborative musical project with group singing and creating jingles"],a:"D",e:"This student has: INTERPERSONAL ABILITIES (people smart, group work, cooperating) + RIGHT BRAIN (responds to emotion, random, prefers sound/music). BEST ACTIVITY: collaborative musical project — uses interpersonal intelligence through group collaboration AND musical intelligence through jingles AND appeals to right-brain's preference for music and emotional/varied processing."},
{id:92,d:"difficult",t:"Laws of Learning — Critical Application",q:"A student who studied Chapter 5 of a textbook last night scores highest on those questions in today's quiz. However, they had studied Chapter 1 first, and it was the most exciting. Which TWO laws BEST explain this student's performance pattern?",c:["A. Law of Exercise and Law of Primacy","B. Law of Recency and Law of Effect","C. Law of Recency (best on Chapter 5 studied last) and Law of Intensity (Chapter 1 — most exciting/intense = more likely learned)","D. Law of Freedom and Law of Readiness"],a:"C",e:"LAW OF RECENCY: THINGS MOST RECENTLY LEARNED are best remembered — explains scoring highest on Chapter 5 (studied last night/most recently). LAW OF INTENSITY: THE MORE INTENSE THE MATERIAL TAUGHT, THE MORE IT IS LIKELY LEARNED — explains remembering Chapter 1 (most exciting). Both laws operate simultaneously."},
{id:93,d:"difficult",t:"Deep Analysis — Classroom Management Approaches",q:"A teacher increases rewards for good behavior and applies consistent consequences for inappropriate behavior. Which classroom management approach is this?",c:["A. Assertive Approach — specifies rules and consequences","B. Behavior Modification Approach — increases appropriate behavior through rewards and reduces inappropriate behavior through punishments","C. Business Academic Approach — emphasizes academic work and clear communication","D. Group Managerial Approach — based on Kounin's research"],a:"B",e:"BEHAVIOR MODIFICATION APPROACH: STRIVES TO INCREASE THE OCCURRENCE OF APPROPRIATE BEHAVIOR through a system of REWARDS and REDUCE LIKELIHOOD OF INAPPROPRIATE BEHAVIOR through PUNISHMENTS. Based on behavioral psychology — good/bad stimulus responses."},
{id:94,d:"difficult",t:"Synthesis — Teaching Methods",q:"A science teacher asks students to investigate 'What makes bread mold faster?' Students design their own experiment, collect data, and present findings. This BEST reflects which method and what is its defining characteristic?",c:["A. Demonstration Method — teacher shows while students observe","B. Project Method — self-directed study presenting results in concrete form","C. Inquiry Method — modeled after investigative processes of scientists, sometimes called discovery, heuristic, or problem solving","D. Deductive Method — teacher presents the rule first"],a:"C",e:"INQUIRY METHOD: sometimes termed 'DISCOVERY,' 'HEURISTIC,' and 'PROBLEM SOLVING.' DEFINED AS a teaching method MODELLED AFTER THE INVESTIGATIVE PROCESSES OF SCIENTISTS. Students investigate a question, collect data, and construct knowledge — exactly what scientists do."},
{id:95,d:"difficult",t:"Assessment — Affective & Psychomotor Integration",q:"A student who can perform a complex dance routine accurately, efficiently, and effortlessly — and simultaneously expresses the emotion of the dance through body movements and facial expressions — has reached which levels in Harrow's Psychomotor and Krathwohl's Affective domains?",c:["A. Psychomotor: Imitation; Affective: Receiving","B. Psychomotor: Basic Fundamental Movement; Affective: Responding","C. Psychomotor: Precision (with Automaticity); Affective: Characterization","D. Psychomotor: Physical Activities; Affective: Valuing"],a:"C",e:"PSYCHOMOTOR: PRECISION (highest Moore level) — performing accurately, efficiently, effortlessly — with AUTOMATICITY (unconscious effort, frees student to focus on expression). AFFECTIVE: CHARACTERIZATION (highest Krathwohl level) — student ACTS CONSISTENTLY ACCORDING TO THE VALUE and is FIRMLY COMMITTED — their artistry IS who they are."},
{id:96,d:"difficult",t:"PPST Domain 7 — Critical Analysis",q:"A school head requires all teachers to write personal teaching philosophies, join professional networks, participate in reflective teaching workshops, and set professional development goals. Which Domain and strands are DIRECTLY addressed?",c:["A. Domain 4 — Professional Collaboration and Teaching Resources","B. Domain 6 — Professional Ethics and School Policies","C. Domain 7 — Philosophy of Teaching, Professional Links, Professional Reflection, Professional Development Goals","D. Domain 5 — Feedback to Improve Learning"],a:"C",e:"DOMAIN 7 (PERSONAL GROWTH AND PROFESSIONAL DEVELOPMENT): (1) PHILOSOPHY OF TEACHING — writing personal teaching philosophies; (2) PROFESSIONAL LINKS with colleagues — joining professional networks; (3) PROFESSIONAL REFLECTION and learning to improve practice — reflective workshops; (5) PROFESSIONAL DEVELOPMENT GOALS — setting goals. Four of five Domain 7 strands are directly addressed."},
{id:97,d:"difficult",t:"Comprehensive — Content Structure",q:"A student can accurately recite the boiling point of water (100°C). This is an example of which type of cognitive content, and at which Knowledge Dimension in Bloom's Revised Taxonomy?",c:["A. Principle — Procedural Knowledge","B. Theory — Conceptual Knowledge","C. Fact — Factual Knowledge","D. Concept — Metacognitive Knowledge"],a:"C",e:"FACT (cognitive content structure): an IDEA OR ACTION THAT CAN BE VERIFIED; BASIC UNIT OF COGNITIVE SUBJECT MATTER CONTENT. FACTUAL KNOWLEDGE (Knowledge Dimension): IDEAS, SPECIFIC DATA OR INFORMATION — terminology, specific details, and elements. Boiling point is a specific, verifiable datum = Fact + Factual Knowledge."},
{id:98,d:"difficult",t:"Scenario — Student Problem Type + Mistaken Goal",q:"Marcus constantly challenges the teacher, argues about everything, has temper tantrums, and intensifies behavior when the teacher gets upset. He seems to 'win' when the teacher reacts with anger. What is his PROBLEM TYPE and MISTAKEN GOAL?",c:["A. Problem type: Withdrawn; Goal: Seek Attention","B. Problem type: Defiant; Goal: Seek Power (to be boss)","C. Problem type: Passive Aggressive; Goal: Seek Revenge","D. Problem type: Failure Syndrome; Goal: Isolate Oneself"],a:"B",e:"DEFIANT (problem type): resists authority, carries on power struggle with teacher, wants own way. MISTAKEN GOAL: SEEK POWER (TO BE BOSS) — characteristics: argues, contradicts, has temper tantrums, attempts to upset teacher. FEELS HE'S WON WHEN PARENTS/TEACHERS ARE UPSET. Child's belief: 'I belong only when I'm boss or proving no one can boss me.'"},
{id:99,d:"difficult",t:"Key Elements for Effective Classroom Management",q:"'It refers to the systematic arrangement of files and records and keeping them organized always and ready for use.' Which Key Element for Effective Classroom Management does this describe?",c:["A. Scheduling","B. Classroom Design","C. Rules","D. Organization"],a:"D",e:"ORGANIZATION: refers to the SYSTEMATIC ARRANGEMENT OF FILES AND RECORDS and KEEPING THEM ORGANIZED ALWAYS AND READY FOR USE. The 7 Key Elements: (1) Classroom Design, (2) Rules, (3) Discipline, (4) Scheduling, (5) Organization, (6) Instructional Techniques, (7) Communication."},
{id:100,d:"difficult",t:"Master Synthesis — All Topics",q:"A teacher is a Career Stage 3 professional who applies Inductive Method (HOTS) in a Constructivist learning environment, differentiates instruction for diverse learners, uses Cooperative Learning, and reflects on practice to grow professionally. Which combination of PPST Domains is MOST DIRECTLY reflected in this teacher's practice?",c:["A. Domains 1, 2, 3, 4, 7","B. Domains 2, 5, 6, 7 only","C. Domains 1 and 4 only","D. Domains 3, 5, 6 only"],a:"A",e:"This teacher reflects: DOMAIN 1 (Content Knowledge — Inductive Method develops HOTS, strand 5); DOMAIN 2 (Learning Environment — Constructivist approach creates conducive learning, strand 3); DOMAIN 3 (Diversity of Learners — differentiates instruction for diverse learners); DOMAIN 4 (Curriculum and Planning — cooperative learning, learning programs); DOMAIN 7 (Personal Growth — professional reflection, Career Stage 3). Five domains are directly reflected."},];

// ═══════════════════════════════════════════════════════════════════
// QUIZ REGISTRY — 6 quizzes (2 per subject)
// ═══════════════════════════════════════════════════════════════════
const QUIZ_REGISTRY = [
  { id:"ethics-200",    subjId:"ethics",    title:"Ethics — 200Q Master Review",
    desc:"Full 200-item coverage: Moral frameworks, conscience, determinants of morality, applied ethics, moral dilemmas.",
    questions:ETHICS_200,    easy:60, moderate:100, difficult:40, color:"#6366f1", icon:"⚖️" },
  { id:"ethics-100",    subjId:"ethics",    title:"Ethics — 100Q Focused Review",
    desc:"100 fresh questions targeting key ethics concepts, case analysis, and board exam patterns.",
    questions:ETHICS_100,    easy:30, moderate:50,  difficult:20, color:"#818cf8", icon:"⚖️" },
  { id:"curriculum-200",subjId:"curriculum",title:"Curriculum — 200Q Master Review",
    desc:"Full 200-item coverage: Curriculum definitions, development models, Oliva's axioms, design models, evaluation.",
    questions:CURRICULUM_200,easy:60, moderate:100, difficult:40, color:"#10b981", icon:"📚" },
  { id:"curriculum-100",subjId:"curriculum",title:"Curriculum — 100Q Focused Review",
    desc:"100 fresh questions on curriculum theory, historical foundations, and practical application.",
    questions:CURRICULUM_100,easy:30, moderate:50,  difficult:20, color:"#34d399", icon:"📚" },
  { id:"methods-200",   subjId:"methods",   title:"Methods & Strategies — 200Q Master Review",
    desc:"Full 200-item coverage: PQF, PPST, career stages, classroom management, MI, teaching approaches.",
    questions:METHODS_200,   easy:60, moderate:100, difficult:40, color:"#f59e0b", icon:"🎓" },
  { id:"methods-100",   subjId:"methods",   title:"Methods & Strategies — 100Q Focused Review",
    desc:"100 focused questions on PPST domains, career stages, classroom strategies, and student behavior.",
    questions:METHODS_100,   easy:30, moderate:50,  difficult:20, color:"#fbbf24", icon:"🎓" },
];

const SUBJECTS = [
  { id:"ethics",     name:"Professional Ethics",               color:"#6366f1", icon:"⚖️", desc:"Ethical theories, moral frameworks, conscience, and professional ethics." },
  { id:"curriculum", name:"The Teacher & The School Curriculum",color:"#10b981", icon:"📚", desc:"Curriculum foundations, development, design models, and evaluation." },
  { id:"methods",    name:"Methods, Strategies & Field Study", color:"#f59e0b", icon:"🎓", desc:"Teaching approaches, classroom management, PPST, learning theories." },
];

// ── MASTER 350Q — sampled proportionally from all 600Q ────────────
function buildMaster350() {
  function sample(arr, n) {
    const s = [...arr]; const out = [];
    for (let i = 0; i < n && s.length; i++) {
      const j = Math.floor(Math.random() * s.length);
      out.push({ ...s[j], _src: "master" });
      s.splice(j, 1);
    }
    return out;
  }
  return [
    ...sample(ETHICS_200,    117),
    ...sample(CURRICULUM_200,117),
    ...sample(METHODS_200,   116),
  ];
}

// ═══════════════════════════════════════════════════════════════════
// AUTH CONSTANTS
// ═══════════════════════════════════════════════════════════════════
const ADMIN_USER = "crael";
const ADMIN_PASS = "ftrc2024";

// ═══════════════════════════════════════════════════════════════════
// STORAGE — per-user isolation
// ═══════════════════════════════════════════════════════════════════
function useStorage(username) {
  const prefix = username ? `mra_${username}_` : "mra_guest_";

  // Local fallback
  const lGet = (key) => { try { return JSON.parse(localStorage.getItem(prefix + key)) || null; } catch { return null; } };
  const lSet = (key, val) => { try { localStorage.setItem(prefix + key, JSON.stringify(val)); } catch {} };

  // Save to Supabase (fire-and-forget, non-blocking)
  async function sbSave(key, val) {
    if (!username) return;
    if (key.startsWith("quiz_")) {
      const quizId = key.replace("quiz_", "");
      await sbFetch("quiz_progress", {
        method: "POST",
        headers: { "Prefer": "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({
          username,
          quiz_id: quizId,
          score: val.score,
          total: val.total,
          percentage: val.score,
          completed_at: new Date().toISOString()
        })
      });
    }
  }

  // Load from Supabase (async, with local cache fallback)
  async function sbLoad(key) {
    if (!username) return null;
    if (key.startsWith("quiz_")) {
      const quizId = key.replace("quiz_", "");
      const rows = await sbFetch(`quiz_progress?username=eq.${username}&quiz_id=eq.${quizId}&select=score,total,completed_at`);
      if (rows && rows.length > 0) {
        return { score: rows[0].score, total: rows[0].total, date: rows[0].completed_at };
      }
    }
    return null;
  }

  const get = (key) => lGet(key);

  const set = (key, val) => {
    lSet(key, val);        // always save locally first (instant)
    sbSave(key, val);      // then sync to cloud (async, non-blocking)
  };

  const getGlobal = (key) => { try { return JSON.parse(localStorage.getItem("mra_" + key)) || null; } catch { return null; } };
  const setGlobal = (key, val) => { try { localStorage.setItem("mra_" + key, JSON.stringify(val)); } catch {} };

  return { get, set, getGlobal, setGlobal, sbLoad };
}

// ═══════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildOrder(questions) {
  const e = shuffle(questions.filter(q => (q.d||q.diff) === "easy"));
  const m = shuffle(questions.filter(q => (q.d||q.diff) === "moderate"));
  const h = shuffle(questions.filter(q => (q.d||q.diff) === "difficult"));
  const out = []; let ei=0, mi=0, hi=0;
  const blocks = Math.ceil(questions.length / 10);
  for (let b = 0; b < blocks; b++) {
    for (let j = 0; j < 3 && ei < e.length; j++) out.push(e[ei++]);
    for (let j = 0; j < 5 && mi < m.length; j++) out.push(m[mi++]);
    for (let j = 0; j < 2 && hi < h.length; j++) out.push(h[hi++]);
  }
  return out;
}

function getQ(q)  { return q.q || q.q; }
function getC(q)  { return q.c || q.choices || []; }
function getA(q)  { return q.a || q.ans; }
function getD(q)  { return q.d || q.diff; }
function getT(q)  { return q.t || q.topic; }
function getE(q)  { return q.e || q.exp || q.explanation || ""; }

function getRating(p) {
  if (p >= 95) return { l:"Outstanding",      c:"#10b981", bg:"#022c22", bdr:"#10b981" };
  if (p >= 90) return { l:"Excellent",         c:"#818cf8", bg:"#1e1b4b", bdr:"#6366f1" };
  if (p >= 80) return { l:"Very Good",         c:"#38bdf8", bg:"#0c2740", bdr:"#0ea5e9" };
  if (p >= 70) return { l:"Good",              c:"#fbbf24", bg:"#2c1a00", bdr:"#f59e0b" };
  return              { l:"Needs Improvement", c:"#f87171", bg:"#2a0a0a", bdr:"#ef4444" };
}

// ═══════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════
const sf     = "'SF Pro Display',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const BG     = "#09090b";
const SURF   = "#111116";
const SURF2  = "#1a1a22";
const BORDER = "#27272f";
const TXT    = "#fafafa";
const TXT2   = "#71717a";
const DIFF   = {
  easy:     { bg:"#052e16", ring:"#22c55e", text:"#4ade80", label:"Easy"      },
  moderate: { bg:"#1c1400", ring:"#eab308", text:"#facc15", label:"Moderate"  },
  difficult:{ bg:"#2d0a1f", ring:"#a855f7", text:"#c084fc", label:"Difficult" },
};

// ═══════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════════════════
function Ring({ pct, size=72, color="#6366f1", label }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = Math.min(pct||0, 100) / 100 * circ;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)", flexShrink:0 }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={BORDER} strokeWidth={6}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition:"stroke-dasharray 1s ease" }}/>
        <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle"
          fill={TXT} fontSize={size<56?11:14} fontWeight="700" fontFamily={sf}
          style={{ transform:`rotate(90deg)`, transformOrigin:`${size/2}px ${size/2}px` }}>
          {pct||0}%
        </text>
      </svg>
      {label && <span style={{ fontSize:10, color:TXT2, fontFamily:sf, letterSpacing:"0.5px", textTransform:"uppercase" }}>{label}</span>}
    </div>
  );
}

function Bar({ pct, color="#6366f1", h=3 }) {
  return (
    <div style={{ background:BORDER, borderRadius:99, height:h, overflow:"hidden" }}>
      <div style={{ background:color, width:`${Math.min(pct||0,100)}%`, height:"100%", borderRadius:99, transition:"width .8s ease" }}/>
    </div>
  );
}

function DiffTag({ diff }) {
  const d = DIFF[diff] || DIFF.easy;
  return (
    <span style={{ fontSize:10, fontWeight:700, color:d.text, background:d.bg,
      border:`1px solid ${d.ring}33`, padding:"2px 9px", borderRadius:99,
      fontFamily:sf, letterSpacing:"0.6px", textTransform:"uppercase" }}>
      {d.label}
    </span>
  );
}

function NavBar({ title, left, right }) {
  return (
    <nav style={{ background:`${SURF}cc`, backdropFilter:"blur(16px)", borderBottom:`1px solid ${BORDER}`,
      padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between",
      height:54, position:"sticky", top:0, zIndex:200 }}>
      <div style={{ minWidth:80 }}>{left}</div>
      <span style={{ fontSize:13, fontWeight:700, color:TXT, fontFamily:sf, letterSpacing:"-0.2px" }}>{title}</span>
      <div style={{ minWidth:80, display:"flex", justifyContent:"flex-end" }}>{right}</div>
    </nav>
  );
}

function GhostBtn({ onClick, children, style={} }) {
  return (
    <button onClick={onClick} style={{ background:"none", border:"none", color:TXT2,
      fontSize:12, cursor:"pointer", padding:"7px 12px", borderRadius:8, fontFamily:sf,
      fontWeight:500, ...style }}>
      {children}
    </button>
  );
}

function SolidBtn({ onClick, children, color="#6366f1", style={} }) {
  return (
    <button onClick={onClick} style={{ background:color, color:"#fff", border:"none",
      borderRadius:10, padding:"11px 20px", fontSize:13, fontWeight:700, cursor:"pointer",
      fontFamily:sf, transition:"opacity .15s", ...style }}>
      {children}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════
// LOGIN / REGISTER
// ═══════════════════════════════════════════════════════════════════
function AuthScreen({ onLogin }) {
  const [mode, setMode]   = useState("login"); // login | register
  const [user, setUser]   = useState("");
  const [pass, setPass]   = useState("");
  const [pass2, setPass2] = useState("");
  const [err, setErr]     = useState("");
  const [ok, setOk]       = useState("");

  function getUsers() { try { return JSON.parse(localStorage.getItem("mra_users")) || {}; } catch { return {}; } }
function saveUsers(u) { localStorage.setItem("mra_users", JSON.stringify(u)); }

async function syncUserToSupabase(username, password) {
  await sbFetch("users", {
    method: "POST",
    headers: { "Prefer": "resolution=ignore-duplicates,return=representation" },
    body: JSON.stringify({ username, password, created_at: new Date().toISOString() })
  });
}

  function handleLogin() {
    setErr(""); setOk("");
    if (!user.trim() || !pass.trim()) { setErr("Please enter username and password."); return; }
    if (user.trim() === ADMIN_USER && pass === ADMIN_PASS) { onLogin(user.trim(), true); return; }
    const users = getUsers();
    if (!users[user.trim()]) { setErr("Username not found."); return; }
    if (users[user.trim()].pass !== pass) { setErr("Incorrect password."); return; }
    onLogin(user.trim(), false);
  }

  function handleRegister() {
    setErr(""); setOk("");
    if (!user.trim() || !pass.trim()) { setErr("All fields are required."); return; }
    if (user.trim() === ADMIN_USER) { setErr("That username is reserved."); return; }
    if (pass !== pass2) { setErr("Passwords do not match."); return; }
    if (pass.length < 6) { setErr("Password must be at least 6 characters."); return; }
    const users = getUsers();
    if (users[user.trim()]) { setErr("Username already taken."); return; }
    users[user.trim()] = { pass, createdAt: new Date().toISOString() };
    saveUsers(users);syncUserToSupabase(user.trim(), pass);
    setOk("Account created! You can now log in.");
    setMode("login"); setPass(""); setPass2("");
  }

  const inp = { width:"100%", background:SURF2, border:`1px solid ${BORDER}`, borderRadius:10,
    padding:"12px 16px", fontSize:14, color:TXT, fontFamily:sf, outline:"none", boxSizing:"border-box" };

  return (
    <div style={{ background:BG, minHeight:"100vh", fontFamily:sf, color:TXT,
      display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:400 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#6366f1,#a855f7)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:24,
            margin:"0 auto 14px" }}>🏛</div>
          <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.5px" }}>Master Review Academy</div>
          <div style={{ fontSize:13, color:TXT2, marginTop:4 }}>LET Board Examination Review</div>
        </div>

        <div style={{ background:SURF, borderRadius:20, padding:28, border:`1px solid ${BORDER}` }}>
          {/* Tab */}
          <div style={{ display:"flex", background:SURF2, borderRadius:10, padding:4, marginBottom:24, gap:4 }}>
            {["login","register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setErr(""); setOk(""); }}
                style={{ flex:1, background:mode===m?"#6366f1":"none", color:mode===m?"#fff":TXT2,
                  border:"none", borderRadius:8, padding:"9px", fontSize:13, fontWeight:600,
                  cursor:"pointer", fontFamily:sf, textTransform:"capitalize", transition:"all .2s" }}>
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div>
              <label style={{ fontSize:11, color:TXT2, letterSpacing:"0.5px", textTransform:"uppercase", display:"block", marginBottom:6 }}>Username</label>
              <input value={user} onChange={e=>setUser(e.target.value)} placeholder="Enter username"
                style={inp} onKeyDown={e=>e.key==="Enter"&&(mode==="login"?handleLogin():null)} />
            </div>
            <div>
              <label style={{ fontSize:11, color:TXT2, letterSpacing:"0.5px", textTransform:"uppercase", display:"block", marginBottom:6 }}>Password</label>
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Enter password"
                style={inp} onKeyDown={e=>e.key==="Enter"&&(mode==="login"?handleLogin():null)} />
            </div>
            {mode === "register" && (
              <div>
                <label style={{ fontSize:11, color:TXT2, letterSpacing:"0.5px", textTransform:"uppercase", display:"block", marginBottom:6 }}>Confirm Password</label>
                <input type="password" value={pass2} onChange={e=>setPass2(e.target.value)} placeholder="Confirm password"
                  style={inp} onKeyDown={e=>e.key==="Enter"&&handleRegister()} />
              </div>
            )}

            {err && <div style={{ background:"#2a0a0a", border:"1px solid #ef4444", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#f87171" }}>{err}</div>}
            {ok  && <div style={{ background:"#022c22", border:"1px solid #22c55e", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#4ade80" }}>{ok}</div>}

            <SolidBtn onClick={mode==="login"?handleLogin:handleRegister} style={{ width:"100%", marginTop:4, padding:"13px" }}>
              {mode === "login" ? "Sign In →" : "Create Account"}
            </SolidBtn>
          </div>
        </div>
        <div style={{ textAlign:"center", marginTop:16, fontSize:12, color:TXT2 }}>
          Your progress is saved locally on this device.
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ADMIN — RATING SHEET
// ═══════════════════════════════════════════════════════════════════
function AdminPanel({ onBack }) {
  const [tab, setTab] = useState("ratings"); // ratings | users
  const [search, setSearch] = useState("");

  function getUsers() { try { return JSON.parse(localStorage.getItem("mra_users")) || {}; } catch { return {}; } }

  function getUserScore(username, quizId) {
    try {
      const val = localStorage.getItem(`mra_${username}_quiz_${quizId}`);
      return val ? JSON.parse(val) : null;
    } catch { return null; }
  }

  const users = getUsers();
  const userList = Object.keys(users).filter(u =>
    !search || u.toLowerCase().includes(search.toLowerCase())
  );

  const allQuizzes = [...QUIZ_REGISTRY, { id:"master", title:"Master Exam (350Q)", icon:"🏆" }];

  function getLetterGrade(score) {
    if (score === null || score === undefined) return "—";
    if (score >= 95) return "OS";
    if (score >= 90) return "EX";
    if (score >= 80) return "VG";
    if (score >= 70) return "GD";
    return "NI";
  }

  function getGradeColor(score) {
    if (score === null || score === undefined) return TXT2;
    if (score >= 90) return "#4ade80";
    if (score >= 80) return "#60a5fa";
    if (score >= 70) return "#facc15";
    return "#f87171";
  }

  return (
    <div style={{ background:BG, minHeight:"100vh", fontFamily:sf, color:TXT }}>
      <NavBar title="Admin Panel"
        left={<GhostBtn onClick={onBack}>← Dashboard</GhostBtn>}
        right={<span style={{ fontSize:11, color:"#6366f1", fontWeight:700, letterSpacing:"1px" }}>OWNER</span>}
      />

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"28px 20px" }}>
        {/* Tabs */}
        <div style={{ display:"flex", gap:8, marginBottom:28 }}>
          {[["ratings","Rating Sheet"],["users","User List"]].map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ background:tab===t?"#6366f1":SURF, color:tab===t?"#fff":TXT2,
                border:`1px solid ${tab===t?"#6366f1":BORDER}`, borderRadius:8,
                padding:"8px 18px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:sf }}>
              {l}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginBottom:20 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users..."
            style={{ background:SURF, border:`1px solid ${BORDER}`, borderRadius:10, padding:"10px 16px",
              fontSize:13, color:TXT, fontFamily:sf, outline:"none", width:280, boxSizing:"border-box" }} />
        </div>

        {/* Summary cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:28 }}>
          {[
            { l:"Total Users", v:Object.keys(users).length, c:"#6366f1" },
            { l:"Active (attempted)", v:Object.keys(users).filter(u=>QUIZ_REGISTRY.some(q=>getUserScore(u,q.id))).length, c:"#10b981" },
            { l:"Total Quizzes", v:QUIZ_REGISTRY.length, c:"#f59e0b" },
            { l:"Avg Mastery", v:(() => {
                const scores = Object.keys(users).flatMap(u => QUIZ_REGISTRY.map(q => getUserScore(u,q.id)?.score).filter(Boolean));
                return scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) + "%" : "—";
              })(), c:"#a855f7" },
          ].map(s => (
            <div key={s.l} style={{ background:SURF, borderRadius:12, padding:"16px", border:`1px solid ${BORDER}`, textAlign:"center" }}>
              <div style={{ fontSize:26, fontWeight:900, color:s.c, letterSpacing:"-1px" }}>{s.v}</div>
              <div style={{ fontSize:10, color:TXT2, marginTop:4, textTransform:"uppercase", letterSpacing:"0.5px" }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* RATING SHEET */}
        {tab === "ratings" && (
          <div>
            <div style={{ fontSize:11, color:TXT2, letterSpacing:"2px", textTransform:"uppercase", fontWeight:600, marginBottom:14 }}>
              Rating Sheet — All Users × All Quizzes
            </div>
            <div style={{ fontSize:11, color:TXT2, marginBottom:12 }}>
              OS=Outstanding(95%+) · EX=Excellent(90%+) · VG=Very Good(80%+) · GD=Good(70%+) · NI=Needs Improvement · —=Not attempted
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, fontFamily:sf }}>
                <thead>
                  <tr style={{ background:SURF2 }}>
                    <th style={{ padding:"12px 16px", textAlign:"left", color:TXT2, fontWeight:600,
                      borderBottom:`1px solid ${BORDER}`, whiteSpace:"nowrap", position:"sticky", left:0, background:SURF2 }}>
                      USERNAME
                    </th>
                    {QUIZ_REGISTRY.map(q => (
                      <th key={q.id} style={{ padding:"12px 10px", textAlign:"center", color:TXT2, fontWeight:600,
                        borderBottom:`1px solid ${BORDER}`, whiteSpace:"nowrap", minWidth:90 }}>
                        <div>{q.icon} {q.title.split("—")[0].trim()}</div>
                        <div style={{ fontSize:10, fontWeight:400, marginTop:2 }}>
                          {q.title.includes("200Q") ? "200Q" : "100Q"}
                        </div>
                      </th>
                    ))}
                    <th style={{ padding:"12px 10px", textAlign:"center", color:"#818cf8", fontWeight:700,
                      borderBottom:`1px solid ${BORDER}`, minWidth:90 }}>
                      MASTER<br/><span style={{ fontSize:10, fontWeight:400 }}>350Q</span>
                    </th>
                    <th style={{ padding:"12px 10px", textAlign:"center", color:"#10b981", fontWeight:700,
                      borderBottom:`1px solid ${BORDER}`, minWidth:80 }}>
                      AVG
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userList.length === 0 && (
                    <tr><td colSpan={QUIZ_REGISTRY.length + 3} style={{ padding:"24px", textAlign:"center", color:TXT2 }}>
                      No users found.
                    </td></tr>
                  )}
                  {userList.map((u, i) => {
                    const scores = QUIZ_REGISTRY.map(q => getUserScore(u, q.id)?.score ?? null);
                    const masterScore = getUserScore(u, "master")?.score ?? null;
                    const allScores = [...scores, masterScore].filter(s => s !== null);
                    const avg = allScores.length ? Math.round(allScores.reduce((a,b)=>a+b,0)/allScores.length) : null;
                    return (
                      <tr key={u} style={{ background:i%2===0?BG:SURF, borderBottom:`1px solid ${BORDER}` }}>
                        <td style={{ padding:"12px 16px", fontWeight:600, color:TXT,
                          position:"sticky", left:0, background:i%2===0?BG:SURF, whiteSpace:"nowrap" }}>
                          👤 {u}
                          <div style={{ fontSize:10, color:TXT2, fontWeight:400 }}>
                            {users[u]?.createdAt ? new Date(users[u].createdAt).toLocaleDateString() : ""}
                          </div>
                        </td>
                        {scores.map((s, j) => (
                          <td key={j} style={{ padding:"12px 10px", textAlign:"center" }}>
                            {s !== null ? (
                              <div>
                                <div style={{ fontWeight:700, color:getGradeColor(s), fontSize:14 }}>{s}%</div>
                                <div style={{ fontSize:10, color:getGradeColor(s), marginTop:1 }}>{getLetterGrade(s)}</div>
                              </div>
                            ) : <span style={{ color:TXT2 }}>—</span>}
                          </td>
                        ))}
                        <td style={{ padding:"12px 10px", textAlign:"center" }}>
                          {masterScore !== null ? (
                            <div>
                              <div style={{ fontWeight:700, color:getGradeColor(masterScore), fontSize:14 }}>{masterScore}%</div>
                              <div style={{ fontSize:10, color:getGradeColor(masterScore), marginTop:1 }}>{getLetterGrade(masterScore)}</div>
                            </div>
                          ) : <span style={{ color:TXT2 }}>—</span>}
                        </td>
                        <td style={{ padding:"12px 10px", textAlign:"center" }}>
                          {avg !== null ? (
                            <div style={{ fontWeight:800, color:getGradeColor(avg), fontSize:15 }}>{avg}%</div>
                          ) : <span style={{ color:TXT2 }}>—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USER LIST */}
        {tab === "users" && (
          <div>
            <div style={{ fontSize:11, color:TXT2, letterSpacing:"2px", textTransform:"uppercase", fontWeight:600, marginBottom:14 }}>
              Registered Users — {userList.length}
            </div>
            <div style={{ background:SURF, borderRadius:16, border:`1px solid ${BORDER}`, overflow:"hidden" }}>
              {userList.length === 0 && (
                <div style={{ padding:32, textAlign:"center", color:TXT2 }}>No users registered yet.</div>
              )}
              {userList.map((u, i) => {
                const attempts = QUIZ_REGISTRY.filter(q => getUserScore(u, q.id)).length;
                const scores = QUIZ_REGISTRY.map(q=>getUserScore(u,q.id)?.score).filter(Boolean);
                const avg = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : null;
                return (
                  <div key={u} style={{ padding:"16px 20px", borderBottom:i<userList.length-1?`1px solid ${BORDER}`:"none",
                    display:"flex", alignItems:"center", gap:16 }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#6366f1,#a855f7)",
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0, fontWeight:700 }}>
                      {u[0].toUpperCase()}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:TXT }}>{u}</div>
                      <div style={{ fontSize:11, color:TXT2, marginTop:3 }}>
                        Joined: {users[u]?.createdAt ? new Date(users[u].createdAt).toLocaleDateString() : "N/A"} · {attempts} quiz{attempts!==1?"zes":""} attempted
                      </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      {avg !== null ? (
                        <>
                          <div style={{ fontSize:18, fontWeight:900, color:getGradeColor(avg) }}>{avg}%</div>
                          <div style={{ fontSize:10, color:TXT2 }}>avg score</div>
                        </>
                      ) : <div style={{ fontSize:12, color:TXT2 }}>No attempts</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// QUIZ ENGINE
// ═══════════════════════════════════════════════════════════════════
function QuizEngine({ rawQuestions, title, quizId, accentColor, onExit, username }) {
  const storage = useStorage(username);
  const [questions]  = useState(() => buildOrder(rawQuestions));
  const [idx,   setIdx]   = useState(0);
  const [sel,   setSel]   = useState(null);
  const [shown, setShown] = useState(false);
  const [correct,setCorrect] = useState(0);
  const [wrong,  setWrong]   = useState(0);
  const [missed, setMissed]  = useState([]);
  const [phase,  setPhase]   = useState("quiz");
  const [ckpt,   setCkpt]    = useState(null);
  const ref = useRef(null);

  const total    = questions.length;
  const q        = questions[idx];
  const answered = correct + wrong;
  const acc      = answered > 0 ? Math.round(correct / answered * 100) : 0;
  const prog     = Math.round(idx / total * 100);
  const every    = total >= 150 ? 50 : total >= 100 ? 25 : 20;

  function submit() {
    if (!sel || shown) return;
    const ok = sel === getA(q);
    if (ok) setCorrect(c => c + 1);
    else { setWrong(c => c + 1); setMissed(m => [...m, { ...q, ya: sel }]); }
    setShown(true);
  }

  function next() {
    const ni = idx + 1;
    if (ni >= total) {
      const fc = correct + (sel === getA(q) ? 1 : 0);
      const score = Math.round(fc / total * 100);
      storage.set(`quiz_${quizId}`, { score, correct: fc, total, date: new Date().toISOString() });
      setPhase("results");
      return;
    }
    if (ni % every === 0) {
      setCkpt({ ni, correct: correct + (sel===getA(q)?1:0), wrong: wrong+(sel!==getA(q)?1:0), acc });
      setPhase("checkpoint");
    } else advance(ni);
  }

  function advance(ni) {
    setIdx(ni); setSel(null); setShown(false);
    if (ref.current) ref.current.scrollTop = 0;
  }

  const ok = shown && sel === getA(q);
  const g  = getRating(Math.round(correct / total * 100));
  const weakTopics = [...new Set(missed.map(w => getT(w)))];

  // Checkpoint
  if (phase === "checkpoint" && ckpt) return (
    <div style={{ background:BG, minHeight:"100vh", fontFamily:sf, color:TXT }}>
      <NavBar title="Checkpoint" right={<GhostBtn onClick={()=>{setPhase("quiz");advance(ckpt.ni);}}>Continue →</GhostBtn>} />
      <div style={{ maxWidth:680, margin:"0 auto", padding:"32px 20px" }}>
        <div style={{ fontSize:11, color:accentColor, letterSpacing:"2px", textTransform:"uppercase", fontWeight:700, marginBottom:16 }}>
          Progress Report · Q{ckpt.ni} of {total}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:24 }}>
          {[{l:"Correct",v:ckpt.correct,c:"#22c55e"},{l:"Wrong",v:ckpt.wrong,c:"#ef4444"},{l:"Accuracy",v:ckpt.acc+"%",c:accentColor},{l:"Left",v:total-ckpt.ni,c:TXT2}].map(s=>(
            <div key={s.l} style={{ background:SURF, borderRadius:12, padding:"14px 10px", textAlign:"center", border:`1px solid ${BORDER}` }}>
              <div style={{ fontSize:22, fontWeight:800, color:s.c, letterSpacing:"-1px" }}>{s.v}</div>
              <div style={{ fontSize:10, color:TXT2, marginTop:3, textTransform:"uppercase", letterSpacing:"0.5px" }}>{s.l}</div>
            </div>
          ))}
        </div>
        <SolidBtn onClick={()=>{setPhase("quiz");advance(ckpt.ni);}} color={accentColor} style={{ width:"100%", padding:"13px" }}>
          Continue — Question {ckpt.ni + 1}
        </SolidBtn>
      </div>
    </div>
  );

  // Results
  if (phase === "results") {
    const finalScore = Math.round(correct / total * 100);
    const gr = getRating(finalScore);
    return (
      <div style={{ background:BG, minHeight:"100vh", fontFamily:sf, color:TXT }}>
        <NavBar title="Results" right={<GhostBtn onClick={onExit}>← Library</GhostBtn>} />
        <div style={{ maxWidth:740, margin:"0 auto", padding:"28px 20px" }}>
          <div style={{ background:gr.bg, borderRadius:20, padding:"28px", textAlign:"center", border:`1px solid ${gr.bdr}`, marginBottom:20 }}>
            <div style={{ fontSize:11, color:gr.c, letterSpacing:"2px", textTransform:"uppercase", fontWeight:700, marginBottom:8 }}>Final Score</div>
            <div style={{ fontSize:60, fontWeight:900, color:gr.c, letterSpacing:"-3px", lineHeight:1 }}>{finalScore}%</div>
            <div style={{ fontSize:18, fontWeight:700, color:gr.c, marginTop:6 }}>{gr.l}</div>
            <div style={{ fontSize:12, color:TXT2, marginTop:6 }}>{correct} correct · {wrong} incorrect · {total} total questions</div>
          </div>

          {/* Diff breakdown */}
          <div style={{ background:SURF, borderRadius:14, padding:18, border:`1px solid ${BORDER}`, marginBottom:16 }}>
            <div style={{ fontSize:10, color:TXT2, letterSpacing:"1.5px", textTransform:"uppercase", fontWeight:600, marginBottom:12 }}>By Difficulty</div>
            {["easy","moderate","difficult"].map(d => {
              const dq = rawQuestions.filter(q=>(q.d||q.diff)===d);
              const dm = missed.filter(q=>(q.d||q.diff)===d);
              const dp = dq.length ? Math.round((dq.length-dm.length)/dq.length*100) : 0;
              return (
                <div key={d} style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:11, color:DIFF[d].text, fontWeight:600, textTransform:"capitalize" }}>{d}</span>
                    <span style={{ fontSize:11, color:TXT2 }}>{dq.length-dm.length}/{dq.length} · {dp}%</span>
                  </div>
                  <Bar pct={dp} color={DIFF[d].ring} h={4}/>
                </div>
              );
            })}
          </div>

          {weakTopics.length > 0 && (
            <div style={{ background:SURF, borderRadius:14, padding:18, border:`1px solid ${BORDER}`, marginBottom:16 }}>
              <div style={{ fontSize:10, color:TXT2, letterSpacing:"1.5px", textTransform:"uppercase", fontWeight:600, marginBottom:10 }}>Topics to Review</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {weakTopics.map(t=><span key={t} style={{ background:SURF2, border:`1px solid ${BORDER}`, color:TXT, padding:"3px 10px", borderRadius:99, fontSize:11 }}>{t}</span>)}
              </div>
            </div>
          )}

          {missed.length > 0 && (
            <div style={{ background:SURF, borderRadius:14, padding:18, border:`1px solid ${BORDER}`, marginBottom:20 }}>
              <div style={{ fontSize:10, color:TXT2, letterSpacing:"1.5px", textTransform:"uppercase", fontWeight:600, marginBottom:14 }}>
                Review Guide · {missed.length} missed
              </div>
              {missed.map((w,i)=>(
                <div key={i} style={{ background:SURF2, borderRadius:10, padding:12, marginBottom:8, borderLeft:`3px solid ${DIFF[getD(w)]?.ring||"#6366f1"}` }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6, flexWrap:"wrap" }}>
                    <DiffTag diff={getD(w)}/>
                    <span style={{ fontSize:11, color:TXT2 }}>{getT(w)}</span>
                  </div>
                  <div style={{ fontSize:13, fontWeight:500, color:TXT, marginBottom:6, lineHeight:1.5 }}>{getQ(w)}</div>
                  <div style={{ fontSize:12, color:"#f87171", marginBottom:3 }}>✗ {w.ya} · {getC(w).find(x=>x.startsWith(w.ya))?.slice(3)}</div>
                  <div style={{ fontSize:12, color:"#4ade80", marginBottom:4 }}>✓ {getA(w)} · {getC(w).find(x=>x.startsWith(getA(w)))?.slice(3)}</div>
                  <div style={{ fontSize:12, color:TXT2, lineHeight:1.6 }}>{getE(w)}</div>
                </div>
              ))}
            </div>
          )}

          <SolidBtn onClick={onExit} color={accentColor} style={{ width:"100%", padding:"13px" }}>Back to Library</SolidBtn>
        </div>
      </div>
    );
  }

  // Quiz
  return (
    <div style={{ background:BG, minHeight:"100vh", fontFamily:sf, color:TXT }}>
      <NavBar title={title.length > 30 ? title.slice(0,30)+"…" : title}
        left={<GhostBtn onClick={onExit}>← Exit</GhostBtn>}
        right={
          <div style={{ display:"flex", gap:14 }}>
            {[{v:correct,c:"#4ade80",l:"✓"},{v:wrong,c:"#f87171",l:"✗"},{v:acc+"%",c:TXT,l:"Acc"}].map(s=>(
              <div key={s.l} style={{ textAlign:"right" }}>
                <div style={{ fontSize:14, fontWeight:800, color:s.c }}>{s.v}</div>
                <div style={{ fontSize:9, color:TXT2, textTransform:"uppercase", letterSpacing:"0.5px" }}>{s.l}</div>
              </div>
            ))}
          </div>
        }
      />
      <div style={{ maxWidth:700, margin:"0 auto", padding:"24px 20px" }} ref={ref}>
        <div style={{ marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontSize:12, color:TXT2 }}>Question {idx+1} of {total}</span>
            <span style={{ fontSize:12, color:TXT2 }}>{prog}%</span>
          </div>
          <Bar pct={prog} color={accentColor} h={3}/>
        </div>
        <div style={{ background:SURF, borderRadius:18, border:`1px solid ${BORDER}`, overflow:"hidden" }}>
          <div style={{ height:3, background:accentColor }}/>
          <div style={{ padding:"22px 22px 0" }}>
            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:12 }}>
              <DiffTag diff={getD(q)}/>
              <span style={{ fontSize:11, color:TXT2 }}>{getT(q)}</span>
            </div>
            <div style={{ fontSize:16, fontWeight:500, color:TXT, lineHeight:1.65, marginBottom:20, letterSpacing:"-0.1px" }}>
              {getQ(q)}
            </div>
          </div>
          <div style={{ padding:"0 22px 22px" }}>
            {getC(q).map(ch => {
              const l = ch[0];
              let bg=SURF2,bdr=BORDER,col=TXT,fw=400;
              if (shown) {
                if (l===getA(q)) { bg="#022c22"; bdr="#22c55e"; col="#4ade80"; fw=600; }
                else if (l===sel&&l!==getA(q)) { bg="#2a0a0a"; bdr="#ef4444"; col="#f87171"; }
              } else if (l===sel) { bg="#1e1b4b"; bdr=accentColor; col="#a5b4fc"; fw=500; }
              return (
                <button key={l} onClick={()=>!shown&&setSel(l)}
                  style={{ display:"block", width:"100%", padding:"12px 14px", marginBottom:7, borderRadius:11,
                    border:`1.5px solid ${bdr}`, background:bg, color:col, cursor:shown?"default":"pointer",
                    textAlign:"left", fontSize:13, fontFamily:sf, fontWeight:fw, lineHeight:1.5,
                    transition:"all .12s", boxSizing:"border-box" }}>
                  {ch}{shown&&l===getA(q)?" ✓":""}{shown&&l===sel&&l!==getA(q)?" ✗":""}
                </button>
              );
            })}
            {!shown ? (
              <button onClick={submit} disabled={!sel}
                style={{ width:"100%", background:sel?accentColor:"#27272f", color:sel?"#fff":TXT2, border:"none",
                  borderRadius:11, padding:"13px", fontSize:13, fontWeight:700, cursor:sel?"pointer":"not-allowed",
                  fontFamily:sf, transition:"all .2s", marginTop:4 }}>
                Submit Answer
              </button>
            ) : (
              <>
                <div style={{ padding:"12px 14px", borderRadius:11, marginTop:4, fontSize:13, lineHeight:1.65,
                  background:ok?"#022c22":"#2a0a0a", borderLeft:`3px solid ${ok?"#22c55e":"#ef4444"}`,
                  color:ok?"#86efac":"#fca5a5" }}>
                  <div style={{ fontWeight:700, marginBottom:4 }}>{ok?"Correct.":"Incorrect. Answer: "+getA(q)}</div>
                  {getE(q)}
                </div>
                <button onClick={next}
                  style={{ width:"100%", background:SURF2, color:TXT, border:`1px solid ${BORDER}`, borderRadius:11,
                    padding:"13px", fontSize:13, fontWeight:600, cursor:"pointer", marginTop:8, fontFamily:sf }}>
                  {idx+1>=total ? "View Results" : "Next →"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function MasterReviewAcademy() {
  // ── Persist login across refresh ──────────────────────────────
  const savedSession = (() => {
    try { return JSON.parse(localStorage.getItem("mra_session")) || {}; } catch { return {}; }
  })();

  const [user,     setUser]     = useState(savedSession.user     || null);
  const [isAdmin,  setIsAdmin]  = useState(savedSession.isAdmin  || false);
  const [view,     setView]     = useState(savedSession.view     || "home");
  const [activeQ,  setActiveQ]  = useState(null); // never restore mid-quiz on refresh
  const [filterS,  setFilterS]  = useState("all");
  const [search,   setSearch]   = useState("");
  const [master350,setMaster350]= useState(null);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("mra_session", JSON.stringify({ user, isAdmin, view }));
    } else {
      localStorage.removeItem("mra_session");
    }
  }, [user, isAdmin, view]);

  const storage = useStorage(user);

  function handleLogin(username, admin) {
    setUser(username); setIsAdmin(admin); setView(admin ? "dashboard" : "home");
  }
  function handleLogout() {
    setUser(null); setIsAdmin(false); setView("home"); setActiveQ(null);
    localStorage.removeItem("mra_session");
  }

  function getData(id) { return storage.get(`quiz_${id}`); }

  const totalMastery = () => {
    const scores = QUIZ_REGISTRY.map(q => getData(q.id)?.score || 0);
    return Math.round(scores.reduce((a,b)=>a+b,0) / QUIZ_REGISTRY.length);
  };

  if (!user) return <AuthScreen onLogin={handleLogin}/>;

  if (isAdmin && view === "admin") return <AdminPanel onBack={() => setView("dashboard")}/>;

  if (activeQ) {
    if (activeQ === "master") {
      if (!master350) setMaster350(buildMaster350());
      const qs = master350 || buildMaster350();
      return <QuizEngine rawQuestions={qs} title="Master Board Exam — 350Q" quizId="master"
        accentColor="#6366f1" onExit={()=>setActiveQ(null)} username={user}/>;
    }
    const quiz = QUIZ_REGISTRY.find(q=>q.id===activeQ);
    return <QuizEngine rawQuestions={quiz.questions} title={quiz.title} quizId={quiz.id}
      accentColor={quiz.color} onExit={()=>setActiveQ(null)} username={user}/>;
  }

  const filtered = QUIZ_REGISTRY.filter(q => {
    const ms = search.toLowerCase();
    return (filterS==="all"||q.subjId===filterS) && (!ms||q.title.toLowerCase().includes(ms));
  });

  const completedCount = QUIZ_REGISTRY.filter(q=>getData(q.id)).length;

  // ── HOME ──────────────────────────────────────────────────────
  if (view === "home") return (
    <div style={{ background:BG, minHeight:"100vh", fontFamily:sf, color:TXT }}>
      <NavBar title="Master Review Academy"
        left={<span style={{ fontSize:13, color:"#6366f1", fontWeight:700 }}>👤 {user}</span>}
        right={
          <div style={{ display:"flex", gap:4 }}>
            {["Library","Dashboard"].map(v=>(
              <GhostBtn key={v} onClick={()=>setView(v.toLowerCase())}>{v}</GhostBtn>
            ))}
            <GhostBtn onClick={handleLogout} style={{ color:"#ef4444" }}>Sign Out</GhostBtn>
          </div>
        }
      />

      {/* Hero */}
      <div style={{ padding:"56px 20px 40px", maxWidth:860, margin:"0 auto" }}>
        <div style={{ fontSize:11, color:"#6366f1", letterSpacing:"3px", textTransform:"uppercase", fontWeight:700, marginBottom:12 }}>
          LET Board Examination Review
        </div>
        <h1 style={{ fontSize:"clamp(28px,5vw,52px)", fontWeight:900, letterSpacing:"-2px", lineHeight:1.08,
          margin:"0 0 14px", background:"linear-gradient(135deg,#fafafa 40%,#52525b)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          Everything you need<br/>to pass the LET.
        </h1>
        <p style={{ fontSize:15, color:TXT2, lineHeight:1.75, maxWidth:480, margin:"0 0 28px" }}>
          600 questions across Professional Ethics, Curriculum Studies, and Methods & Strategies. Organized, trackable, examination-ready.
        </p>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <SolidBtn onClick={()=>setView("library")}>Start Reviewing</SolidBtn>
          <SolidBtn onClick={()=>{setMaster350(buildMaster350());setActiveQ("master");}}
            color={SURF2} style={{ border:`1px solid ${BORDER}`, color:TXT }}>
            Master Exam — 350Q
          </SolidBtn>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background:SURF, borderTop:`1px solid ${BORDER}`, borderBottom:`1px solid ${BORDER}`, padding:"20px" }}>
        <div style={{ maxWidth:860, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
          {[
            {l:"Total Questions",v:600,          c:"#6366f1"},
            {l:"Subject Areas",  v:SUBJECTS.length,c:"#10b981"},
            {l:"Available Quizzes",v:QUIZ_REGISTRY.length,c:"#f59e0b"},
            {l:"Your Mastery",   v:totalMastery()+"%",c:"#a855f7"},
          ].map(s=>(
            <div key={s.l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:26, fontWeight:900, color:s.c, letterSpacing:"-1px" }}>{s.v}</div>
              <div style={{ fontSize:10, color:TXT2, marginTop:3, textTransform:"uppercase", letterSpacing:"0.5px" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Cards */}
      <div style={{ padding:"40px 20px", maxWidth:860, margin:"0 auto" }}>
        <div style={{ fontSize:10, color:TXT2, letterSpacing:"2px", textTransform:"uppercase", fontWeight:600, marginBottom:16 }}>Subject Areas</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:12 }}>
          {SUBJECTS.map(s => {
            const sq = QUIZ_REGISTRY.filter(q=>q.subjId===s.id);
            const avg = Math.round(sq.reduce((a,q)=>a+(getData(q.id)?.score||0),0)/sq.length);
            return (
              <div key={s.id} onClick={()=>{setFilterS(s.id);setView("library");}}
                style={{ background:SURF, borderRadius:14, padding:20, border:`1px solid ${BORDER}`, cursor:"pointer", transition:"border-color .2s" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=s.color}
                onMouseLeave={e=>e.currentTarget.style.borderColor=BORDER}>
                <div style={{ fontSize:24, marginBottom:10 }}>{s.icon}</div>
                <div style={{ fontSize:13, fontWeight:700, color:TXT, marginBottom:5, letterSpacing:"-0.2px" }}>{s.name}</div>
                <div style={{ fontSize:11, color:TXT2, lineHeight:1.6, marginBottom:12 }}>{s.desc}</div>
                <Bar pct={avg} color={s.color}/>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:7 }}>
                  <span style={{ fontSize:10, color:TXT2 }}>{sq.length} quizzes · {sq.reduce((a,q)=>a+q.questions.length,0)}Q</span>
                  <span style={{ fontSize:10, color:s.color, fontWeight:600 }}>{avg}% mastery</span>
                </div>
              </div>
            );
          })}
          <div onClick={()=>{setMaster350(buildMaster350());setActiveQ("master");}}
            style={{ background:"linear-gradient(135deg,#1e1b4b,#111116)", borderRadius:14, padding:20, border:"1px solid #6366f1", cursor:"pointer" }}>
            <div style={{ fontSize:24, marginBottom:10 }}>🏆</div>
            <div style={{ fontSize:13, fontWeight:700, color:TXT, marginBottom:5 }}>Master Board Exam</div>
            <div style={{ fontSize:11, color:TXT2, lineHeight:1.6, marginBottom:12 }}>350 questions sampled from all 600. Professional Education subjects only.</div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:10, color:TXT2 }}>350Q · All subjects</span>
              <span style={{ fontSize:10, color:"#818cf8", fontWeight:600 }}>Start →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── LIBRARY ───────────────────────────────────────────────────
  if (view === "library") return (
    <div style={{ background:BG, minHeight:"100vh", fontFamily:sf, color:TXT }}>
      <NavBar title="Quiz Library"
        left={<GhostBtn onClick={()=>{setView("home");setFilterS("all");}}>← Home</GhostBtn>}
        right={<GhostBtn onClick={()=>setView("dashboard")}>Dashboard</GhostBtn>}
      />
      <div style={{ maxWidth:860, margin:"0 auto", padding:"28px 20px" }}>
        {/* Search & Filter */}
        <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search quizzes..."
            style={{ flex:1, minWidth:160, background:SURF, border:`1px solid ${BORDER}`, borderRadius:9,
              padding:"9px 14px", fontSize:13, color:TXT, fontFamily:sf, outline:"none" }}/>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {[{id:"all",label:"All"},...SUBJECTS.map(s=>({id:s.id,label:`${s.icon} ${s.name.split(" ")[1]||s.name}`}))].map(f=>(
              <button key={f.id} onClick={()=>setFilterS(f.id)}
                style={{ background:filterS===f.id?"#6366f1":SURF, color:filterS===f.id?"#fff":TXT2,
                  border:`1px solid ${filterS===f.id?"#6366f1":BORDER}`, borderRadius:8,
                  padding:"7px 12px", fontSize:12, cursor:"pointer", fontFamily:sf, fontWeight:500 }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Master Banner */}
        <div onClick={()=>{setMaster350(buildMaster350());setActiveQ("master");}}
          style={{ background:"linear-gradient(135deg,#1e1b4b,#111116)", borderRadius:14, padding:"16px 20px",
            border:"1px solid #6366f1", cursor:"pointer", marginBottom:24,
            display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
          <div>
            <div style={{ fontSize:10, color:"#818cf8", letterSpacing:"2px", textTransform:"uppercase", fontWeight:700, marginBottom:4 }}>Comprehensive Exam</div>
            <div style={{ fontSize:15, fontWeight:800, color:TXT, letterSpacing:"-0.3px" }}>Master Board Exam Review</div>
            <div style={{ fontSize:11, color:TXT2, marginTop:3 }}>
              350 questions · All 3 subjects · Sampled fresh each attempt · Professional Education only
              {getData("master") && <span style={{ color:"#818cf8", marginLeft:8 }}>Last: {getData("master").score}%</span>}
            </div>
          </div>
          <SolidBtn onClick={e=>{e.stopPropagation();setMaster350(buildMaster350());setActiveQ("master");}}>Start 350Q →</SolidBtn>
        </div>

        {/* Quiz Grid */}
        <div style={{ fontSize:10, color:TXT2, letterSpacing:"2px", textTransform:"uppercase", fontWeight:600, marginBottom:14 }}>
          {filtered.length} Quiz{filtered.length!==1?"zes":""}
        </div>

        {/* Group by subject */}
        {SUBJECTS.filter(s=>filterS==="all"||s.id===filterS).map(s => {
          const sq = filtered.filter(q=>q.subjId===s.id);
          if (!sq.length) return null;
          return (
            <div key={s.id} style={{ marginBottom:28 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <div style={{ width:3, height:16, background:s.color, borderRadius:99 }}/>
                <span style={{ fontSize:12, fontWeight:700, color:s.color }}>{s.icon} {s.name}</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:12 }}>
                {sq.map(quiz => {
                  const data = getData(quiz.id);
                  return (
                    <div key={quiz.id} style={{ background:SURF, borderRadius:14, border:`1px solid ${BORDER}`, overflow:"hidden", transition:"border-color .2s" }}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=quiz.color}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=BORDER}>
                      <div style={{ height:2, background:quiz.color }}/>
                      <div style={{ padding:18 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                          <span style={{ fontSize:11, fontWeight:700, color:quiz.color, letterSpacing:"-0.1px" }}>
                            {quiz.title.includes("200Q") ? "200Q" : "100Q"} · {quiz.easy+quiz.moderate+quiz.difficult} Questions
                          </span>
                          {data && <span style={{ fontSize:13, fontWeight:800, color:quiz.color }}>{data.score}%</span>}
                        </div>
                        <div style={{ fontSize:13, fontWeight:700, color:TXT, marginBottom:5, lineHeight:1.3, letterSpacing:"-0.2px" }}>
                          {quiz.title.split("—")[1]?.trim()||quiz.title}
                        </div>
                        <div style={{ fontSize:11, color:TXT2, lineHeight:1.55, marginBottom:12 }}>{quiz.desc}</div>
                        <div style={{ display:"flex", gap:4, marginBottom:12 }}>
                          {[["easy",quiz.easy],["moderate",quiz.moderate],["difficult",quiz.difficult]].map(([d,n])=>(
                            <span key={d} style={{ fontSize:9, color:DIFF[d].text, background:DIFF[d].bg, padding:"2px 7px", borderRadius:5 }}>{n} {d}</span>
                          ))}
                        </div>
                        {data && <div style={{ marginBottom:10 }}><Bar pct={data.score} color={quiz.color}/></div>}
                        <button onClick={()=>setActiveQ(quiz.id)}
                          style={{ width:"100%", background:quiz.color, color:"#fff", border:"none", borderRadius:9,
                            padding:"10px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:sf }}>
                          {data ? "Retake" : "Start Quiz"}
                        </button>
                        {data && <div style={{ fontSize:10, color:TXT2, textAlign:"center", marginTop:6 }}>
                          {data.correct}/{data.total} · {new Date(data.date).toLocaleDateString()}
                        </div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── DASHBOARD ─────────────────────────────────────────────────
  if (view === "dashboard") return (
    <div style={{ background:BG, minHeight:"100vh", fontFamily:sf, color:TXT }}>
      <NavBar title="Dashboard"
        left={<GhostBtn onClick={()=>setView("home")}>← Home</GhostBtn>}
        right={
          <div style={{ display:"flex", gap:4 }}>
            <GhostBtn onClick={()=>setView("library")}>Library</GhostBtn>
            {isAdmin && <GhostBtn onClick={()=>setView("admin")} style={{ color:"#6366f1", fontWeight:700 }}>Admin Panel</GhostBtn>}
            <GhostBtn onClick={handleLogout} style={{ color:"#ef4444" }}>Sign Out</GhostBtn>
          </div>
        }
      />
      <div style={{ maxWidth:860, margin:"0 auto", padding:"28px 20px" }}>
        {/* Welcome */}
        <div style={{ background:"linear-gradient(135deg,#1e1b4b,#111116)", borderRadius:16, padding:24, border:"1px solid #6366f1", marginBottom:20,
          display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>
          <Ring pct={totalMastery()} size={88} color="#6366f1" label="Overall"/>
          <div style={{ flex:1, minWidth:160 }}>
            <div style={{ fontSize:11, color:"#818cf8", letterSpacing:"1.5px", textTransform:"uppercase", fontWeight:700, marginBottom:6 }}>
              Welcome back, {user}
            </div>
            <div style={{ fontSize:28, fontWeight:900, color:TXT, letterSpacing:"-1px", lineHeight:1 }}>{totalMastery()}% Mastery</div>
            <div style={{ fontSize:12, color:TXT2, marginTop:6 }}>
              {completedCount}/{QUIZ_REGISTRY.length} quizzes completed · 600 total questions
            </div>
          </div>
          <div style={{ display:"flex", gap:24 }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:24, fontWeight:900, color:"#22c55e" }}>{completedCount}</div>
              <div style={{ fontSize:9, color:TXT2, marginTop:2, textTransform:"uppercase", letterSpacing:"0.5px" }}>Done</div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:24, fontWeight:900, color:"#f59e0b" }}>{QUIZ_REGISTRY.length-completedCount}</div>
              <div style={{ fontSize:9, color:TXT2, marginTop:2, textTransform:"uppercase", letterSpacing:"0.5px" }}>Left</div>
            </div>
          </div>
        </div>

        {/* Subject Performance */}
        <div style={{ fontSize:10, color:TXT2, letterSpacing:"2px", textTransform:"uppercase", fontWeight:600, marginBottom:12 }}>Subject Performance</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12, marginBottom:20 }}>
          {SUBJECTS.map(s => {
            const sq = QUIZ_REGISTRY.filter(q=>q.subjId===s.id);
            const scores = sq.map(q=>getData(q.id)?.score).filter(Boolean);
            const avg = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
            return (
              <div key={s.id} style={{ background:SURF, borderRadius:14, padding:18, border:`1px solid ${BORDER}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                  <div>
                    <div style={{ fontSize:20, marginBottom:3 }}>{s.icon}</div>
                    <div style={{ fontSize:11, fontWeight:700, color:TXT, letterSpacing:"-0.2px" }}>{s.name.split(" ").slice(0,3).join(" ")}</div>
                  </div>
                  <Ring pct={avg} size={52} color={s.color}/>
                </div>
                <Bar pct={avg} color={s.color}/>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:7 }}>
                  <span style={{ fontSize:10, color:TXT2 }}>{scores.length}/{sq.length} done</span>
                  <span style={{ fontSize:10, color:s.color, fontWeight:600 }}>{avg>0?avg+"%":"Not started"}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* All Quizzes */}
        <div style={{ fontSize:10, color:TXT2, letterSpacing:"2px", textTransform:"uppercase", fontWeight:600, marginBottom:12 }}>All Quizzes</div>
        <div style={{ background:SURF, borderRadius:14, border:`1px solid ${BORDER}`, overflow:"hidden", marginBottom:20 }}>
          {[...QUIZ_REGISTRY, {id:"master",title:"Master Board Exam",icon:"🏆",color:"#6366f1"}].map((quiz,i,arr)=>{
            const data = getData(quiz.id);
            return (
              <div key={quiz.id} style={{ padding:"14px 18px", borderBottom:i<arr.length-1?`1px solid ${BORDER}`:"none",
                display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:34,height:34,borderRadius:9,background:`${quiz.color}22`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0 }}>
                  {quiz.icon}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12,fontWeight:600,color:TXT,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                    {quiz.title}
                  </div>
                  <Bar pct={data?.score||0} color={quiz.color} h={2}/>
                </div>
                <div style={{ textAlign:"right",flexShrink:0,minWidth:50 }}>
                  {data?<><div style={{fontSize:14,fontWeight:800,color:quiz.color}}>{data.score}%</div>
                  <div style={{fontSize:9,color:TXT2}}>{data.correct}/{data.total}</div></>
                  :<div style={{fontSize:10,color:TXT2}}>—</div>}
                </div>
                <button onClick={()=>{if(quiz.id==="master"){setMaster350(buildMaster350());setActiveQ("master");}else setActiveQ(quiz.id);}}
                  style={{background:SURF2,border:`1px solid ${BORDER}`,color:TXT,borderRadius:7,
                    padding:"5px 12px",fontSize:11,cursor:"pointer",fontFamily:sf,fontWeight:600,flexShrink:0}}>
                  {data?"Retry":"Start"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        <div style={{ fontSize:10, color:TXT2, letterSpacing:"2px", textTransform:"uppercase", fontWeight:600, marginBottom:12 }}>Study Recommendations</div>
        <div style={{ background:SURF, borderRadius:14, border:`1px solid ${BORDER}`, padding:18 }}>
          {QUIZ_REGISTRY.filter(q=>!getData(q.id)||(getData(q.id)?.score||0)<80).length > 0 ? (
            QUIZ_REGISTRY.filter(q=>!getData(q.id)||(getData(q.id)?.score||0)<80).map(quiz=>(
              <div key={quiz.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:`1px solid ${BORDER}` }}>
                <div style={{fontSize:18}}>{quiz.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:TXT}}>{quiz.title}</div>
                  <div style={{fontSize:10,color:TXT2,marginTop:2}}>
                    {getData(quiz.id)?`Score: ${getData(quiz.id).score}% → Target: 80%+`:"Not yet attempted"}
                  </div>
                </div>
                <button onClick={()=>setActiveQ(quiz.id)}
                  style={{background:quiz.color,color:"#fff",border:"none",borderRadius:7,
                    padding:"6px 14px",fontSize:11,cursor:"pointer",fontFamily:sf,fontWeight:700}}>
                  Practice
                </button>
              </div>
            ))
          ) : (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ fontSize:24, marginBottom:6 }}>🏆</div>
              <div style={{ fontSize:14, fontWeight:700, color:"#4ade80" }}>All quizzes above 80%!</div>
              <div style={{ fontSize:11, color:TXT2, marginTop:4 }}>Ready for the Master Exam.</div>
              <SolidBtn onClick={()=>{setMaster350(buildMaster350());setActiveQ("master");}}
                style={{ marginTop:14, padding:"10px 24px" }}>Take Master Exam →</SolidBtn>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return null;
}
