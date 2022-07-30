const facile = 0, normal = 2, moyen = 4, difficile = 6, impossible = 12;
let niveau = 1;

const joueur = { nom: "Le héro", pdv: 20, atq: 15, def: 9, agi: 13, cnc: 12 };
const adversaire = { nom: "La créature", pdv: 0, atq: 0, def: 0, agi: 0, cnc: 0 };
const creatures  = [ "rat géant", "goblin", "fantôme", "squelette", "orc", "vampire", "troll", "démon" ];

const msgEchecs =
[
    "Cependant, l'attaque échoue.",
    "Le jeu d'adresse supérieur de la défense déjoue l'attaquant.",
    "La défense évite l'attaque de justesse.",
    "Les parades du défenseur révèlent un fin escrimeur... et font échouer l'attaque.",
    "L'attaquant s'enfarge sur une garnotte et manque son coup.",
    "Les armes s'échangent des compliments et les jambes dansent au rythme des arts martiaux, mais l'attaque échoue."
];

const rouleDes = (qte, type, min = 1) => {

    let res = 0;
    for (let i = 0; i < qte; ++i)
        res += Math.floor(Math.random() * (type - min + 1) ) + min

    return res;
};

const rouleD20 = (qte = 1) => rouleDes(qte, 20);
const rouleD12 = (qte = 1) => rouleDes(qte, 12);
const rouleD6  = (qte = 1) => rouleDes(qte,  6);

const trouverCreature = () => {

    if (niveau <  6) return creatures[rouleDes(1, 3, 0)]; // rat, gob, fan
    if (niveau < 11) return creatures[rouleDes(1, 3   )]; // gob, fan, squ
    if (niveau < 16) return creatures[rouleDes(1, 4, 2)]; // fan, squ, orc
    if (niveau < 21) return creatures[rouleDes(1, 5, 3)]; // squ, orc, vam
    if (niveau < 26) return creatures[rouleDes(1, 6, 4)]; // orc, vam, tro
    if (niveau < 31) return creatures[rouleDes(1, 7, 5)]; // vam, tro, dém
    if (niveau < 36) return creatures[rouleDes(1, 7, 6)]; // tro, dém
                     return creatures[7];                 // dém
};

const genererAdversaire = () => { 

    return {

        nom: `Le ${trouverCreature()}`;
        pdv: rouleD20() + adversaire.pdv,
        atq: rouleD6()  + adversaire.atq,
        def: rouleD6()  + adversaire.def,
        cnc: adversaire.cnc
    };
};

const testerChance = (obj) => {

    if (obj.cnc < 2) return false;
    const res = rouleD12() < obj.cnc;

    --obj.cnc;
    return res;
};

const trouverQuantiteDes = (stat) => {

    let res = 0;

    for (; stat > 0; stat -= 6, ++res);

    return res;
};

// aléatoire
const testerStatComparativement = (statA, statB) => {

    let resA = rouleD6(trouverQuantiteDes(statA));
    let resB = rouleD6(trouverQuantiteDes(statB));

    return resA > resB ? 1 : resA === resB ? 0 : -1;
};

const obtenirResistance = (def) => Math.floor(def / 255 * 100);

const obtenirDegat = (atq) => Math.ceil(atq / 250 * 100);

const obtenirDegatCritique = (deg) => Math.floor(deg * 1.5);

const loguer = (msg) => document.querySelector("#log").innerHTML += `${msg}<br/>`;

const attaquer = (objAttaquant, objDefenseur) => {

    loguer(`${objAttaquant.nom} attaque ${objDefenseur.nom}.`);

    if (testerStatComparativement(objAttaquant.agi, objDefenseur.agi) === 1) {

        loguer("L'attaque touche la cible...");

        let resultatAttaque = testerStatComparativement(objAttaquant.atq, objDefenseur.def);
        let degat = obtenirDegat(objAttaquant.atq);

        if (resultatAttaque === 1) {

            loguer("...et inflige une blessure critique; les dégats sont doublés!");
            degat = obtenirDegatCritique(degat);
        }

        else if (resultatAttaque === -1) {

            loguer("...mais la défense joue dur et résiste bien; les dégats sont réduits!");
            degat = Math.max(1, degat - obterirResistance(objDefenseur.def));
        }

        loguer(`${objDefenseur.nom} subit une perte de ${degat} points de vie.`);
        objDefenseur.pdv -= degat;
    }

    else loguer(msgEchecs[rouleD6() - 1]);
};

