window.HOUSES = [
  {
    id: "gryffindor",
    name: "Gryffindor",
    founder: "Godric Gryffindor",
    mascot: "Lion",
    colors: ["Scarlet", "Gold"],
    traits: ["Bravery", "Daring", "Chivalry"],
    relic: "Sword of Gryffindor",
    ghost: "Nearly Headless Nick",
    summary:
      "Gryffindor champions nerve, daring, and a willingness to charge toward danger when others hesitate. Its students forge tight bonds forged in shared risks, earning reputations as steadfast friends whose courage often lights the way through the darkest corridors.",
    img: "assets/img/house-gryffindor.webp",
    established: 990,
    timelineHighlight:
      "Gryffindor pupils rally to defend their classmates whenever Hogwarts is threatened, proving that bravery is strongest when shared."
  },
  {
    id: "hufflepuff",
    name: "Hufflepuff",
    founder: "Helga Hufflepuff",
    mascot: "Badger",
    colors: ["Canary Yellow", "Black"],
    traits: ["Loyalty", "Patience", "Fairness"],
    relic: "Hufflepuff Cup",
    ghost: "Fat Friar",
    summary:
      "Hufflepuff values kindness, humility, and the patience to do what is right long after applause fades. Its members nurture Hogwarts with quiet diligence, creating safe harbors where every student has a seat at the table and a voice worth hearing.",
    img: "assets/img/house-hufflepuff.webp",
    established: 990,
    timelineHighlight:
      "Hufflepuff's welcoming kitchens and common room keep morale warm even when the castle doors must brace against war."
  },
  {
    id: "ravenclaw",
    name: "Ravenclaw",
    founder: "Rowena Ravenclaw",
    mascot: "Eagle",
    colors: ["Blue", "Bronze"],
    traits: ["Wit", "Wisdom", "Creativity"],
    relic: "Diadem of Rowena Ravenclaw",
    ghost: "The Grey Lady",
    summary:
      "Ravenclaw prizes curiosity, inventive thinking, and the courage to ask the questions others overlook. Students climb spiraling stairs toward lofty ideas, weaving scholarship and artistry together into solutions that shimmer with imagination and insight.",
    img: "assets/img/house-ravenclaw.webp",
    established: 990,
    timelineHighlight:
      "Ravenclaw problem-solvers unveil clever strategies that shift the balance of conflicts far beyond the classroom."
  },
  {
    id: "slytherin",
    name: "Slytherin",
    founder: "Salazar Slytherin",
    mascot: "Serpent",
    colors: ["Emerald", "Silver"],
    traits: ["Ambition", "Resourcefulness", "Determination"],
    relic: "Locket of Salazar Slytherin",
    ghost: "The Bloody Baron",
    summary:
      "Slytherin cultivates ambition, cunning, and the resilience to navigate gray areas that others avoid. Its members pursue greatness with relentless focus, mastering every advantage while slowly learning when power must bend toward protecting the wider wizarding world.",
    img: "assets/img/house-slytherin.webp",
    established: 990,
    timelineHighlight:
      "Slytherin alumni wrestle with legacy and loyalty, showing how ambition can be reclaimed for Hogwarts' defense."
  }
];

window.WIZARDS = [
  {
    id: "harry-potter",
    name: "Harry Potter",
    house: "Gryffindor",
    years: [1991, 1992, 1993, 1994, 1995, 1996, 1997],
    aliases: ["The Boy Who Lived"],
    summary:
      "Harry grows from an unnoticed orphan into a reluctant leader who continually chooses compassion over revenge. His journey charts the costs of prophecy, the power of friendship, and the resolve required to stand against oppression even when victory feels impossible.",
    notableEvents: ["Defeated Voldemort", "Founded Dumbledore's Army"],
    img: "assets/img/harry-potter.webp",
    spoilerLevel: "high"
  },
  {
    id: "hermione-granger",
    name: "Hermione Granger",
    house: "Gryffindor",
    years: [1991, 1992, 1993, 1994, 1995, 1996, 1997],
    aliases: ["Brightest Witch of Her Age"],
    summary:
      "Hermione combines encyclopedic knowledge with fierce moral clarity. She advocates for the overlooked, hacks bureaucracy with daring plans, and grounds every mission in preparation, proving that empathy paired with intellect can rewrite the rules of a rigged system.",
    notableEvents: ["Co-founded Dumbledore's Army", "Time-Turner rescue mission"],
    img: "assets/img/hermione-granger.webp",
    spoilerLevel: "low"
  },
  {
    id: "ron-weasley",
    name: "Ron Weasley",
    house: "Gryffindor",
    years: [1991, 1992, 1993, 1994, 1995, 1996, 1997],
    aliases: ["Keeper Ron"],
    summary:
      "Ron brings humor, loyalty, and tactical chess skills that steady his friends when fear presses in. He wrestles with insecurity yet repeatedly chooses courage, reminding the trio and the reader that ordinary people can deliver extraordinary heroism when unity is on the line.",
    notableEvents: ["Life-sized wizard chess sacrifice", "Hunted Horcruxes"],
    img: "assets/img/ron-weasley.webp",
    spoilerLevel: "low"
  },
  {
    id: "albus-dumbledore",
    name: "Albus Dumbledore",
    house: "Gryffindor",
    years: [1991, 1992, 1993, 1994, 1995, 1996, 1997],
    aliases: ["Headmaster Dumbledore"],
    summary:
      "Dumbledore guides Hogwarts with warmth, mischief, and long-buried secrets. His layered plans test the limits of trust, revealing how even legendary wizards must confront their past before steering the next generation toward a future free from oppression.",
    notableEvents: ["Led the Order of the Phoenix", "Planned Voldemort's downfall"],
    img: "assets/img/albus-dumbledore.webp",
    spoilerLevel: "high"
  },
  {
    id: "severus-snape",
    name: "Severus Snape",
    house: "Slytherin",
    years: [1991, 1992, 1993, 1994, 1995, 1996, 1997],
    aliases: ["Half-Blood Prince"],
    summary:
      "Snape hides true motives behind a caustic exterior, straddling the line between villain and guardian. His arc explores remorse, unrequited loyalty, and the murky choices demanded by war, culminating in revelations that challenge every assumption about courage.",
    notableEvents: ["Mastered Occlumency", "Fulfilled Dumbledore's secret request"],
    img: "assets/img/severus-snape.webp",
    spoilerLevel: "high"
  },
  {
    id: "minerva-mcgonagall",
    name: "Minerva McGonagall",
    house: "Gryffindor",
    years: [1991, 1992, 1993, 1994, 1995, 1996, 1997],
    aliases: ["Deputy Headmistress"],
    summary:
      "Professor McGonagall balances sharp wit with profound devotion to her students. Whether animating statues to defend the school or guiding young wizards through turbulent times, she exemplifies disciplined courage and an unshakeable belief in fair play.",
    notableEvents: ["Commanded Hogwarts defenses", "Led Transfiguration mastery"],
    img: "assets/img/minerva-mcgonagall.webp",
    spoilerLevel: "low"
  },
  {
    id: "rubeus-hagrid",
    name: "Rubeus Hagrid",
    house: "Gryffindor",
    years: [1991, 1992, 1993, 1994, 1995, 1996, 1997],
    aliases: ["Keeper of Keys"],
    summary:
      "Hagrid's giant heart introduces students to magical creatures and the value of kindness to outsiders. Despite prejudice and peril, he champions acceptance with stubborn optimism, safeguarding Hogwarts with loyalty as steady as the rock cakes he proudly bakes.",
    notableEvents: ["Introduced Care of Magical Creatures", "Sheltered vulnerable allies"],
    img: "assets/img/rubeus-hagrid.webp",
    spoilerLevel: "low"
  },
  {
    id: "draco-malfoy",
    name: "Draco Malfoy",
    house: "Slytherin",
    years: [1991, 1992, 1993, 1994, 1995, 1996, 1997],
    aliases: [],
    summary:
      "Draco begins as a privileged rival yet finds himself pressured by dark expectations he never fully controls. His storyline follows the fear, hesitation, and unlikely empathy that arise when loyalty to family collides with the cost of violence.",
    notableEvents: ["Led Inquisitorial Squad", "Struggled with mandated mission"],
    img: "assets/img/draco-malfoy.webp",
    spoilerLevel: "high"
  },
  {
    id: "luna-lovegood",
    name: "Luna Lovegood",
    house: "Ravenclaw",
    years: [1995, 1996, 1997],
    aliases: ["Loony Lovegood"],
    summary:
      "Luna embraces wonder and radical empathy, turning supposed oddities into strengths. Her unflinching honesty and imaginative worldview steady friends during crises, proving that believing the unbelievable can deliver the calm needed to outwit darkness.",
    notableEvents: ["Helped locate Ravenclaw's relic", "Co-led D.A. broadcasts"],
    img: "assets/img/luna-lovegood.webp",
    spoilerLevel: "low"
  },
  {
    id: "neville-longbottom",
    name: "Neville Longbottom",
    house: "Gryffindor",
    years: [1991, 1992, 1993, 1994, 1995, 1996, 1997],
    aliases: [],
    summary:
      "Neville evolves from shy, accident-prone student to fearless defender of Hogwarts. His quiet persistence, love for Herbology, and willingness to confront tyranny inspire peers, culminating in a decisive act that symbolizes the bravery found in steady hearts.",
    notableEvents: ["Led the Resistance at Hogwarts", "Destroyed a Horcrux"],
    img: "assets/img/neville-longbottom.webp",
    spoilerLevel: "high"
  }
];
