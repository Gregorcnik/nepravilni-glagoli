const urlParams = new URLSearchParams(window.location.search);
const lang = urlParams.get("lang") || "ang";

document.getElementById("naslov").innerHTML = Slovar[lang].naslov;
document.getElementById("opis").innerHTML = Slovar[lang].opis;

let a = premesaj(Slovar[lang].glagoli);

let pravilno = 0;
let vseTocke = 0;
let trenutInd = 0;

let stStolpca; //-1 means random, 0 means first column itd.
let ponavljajNapacno;
nastaviPonavljajNapacno();
nastaviStStolpca();

let zadnjaPravilna = true;

document.getElementById("seznamBesed").innerHTML = narediSeznamBesed(
  [a[0]],
  function() {
    return nakljucno(4) - 1;
  },
);

function narediSeznamBesed(seznam, funkcijaZaStolpec) {
  let vrnitev = `<tbody><tr style='position: sticky; top: -1.5px; background-color: white;'>${Slovar[lang].casi}</tr></tbody>`;
  for (let vrstica = 0; vrstica < seznam.length; vrstica++) {
    vrnitev += "<tr>";
    let poln = funkcijaZaStolpec();

    for (let stolpec = 0; stolpec < seznam[vrstica].length; stolpec++) {
      if (poln == -1 || poln == stolpec) {
        vrnitev += "<td>" + seznam[vrstica][stolpec] + "</td>";
      } else {
        vrnitev += '<td><div contenteditable="true" id="prostorcek" spellcheck="false"></div></td>';
      }
    }
    vrnitev += "</tr>";
  }

  return vrnitev;
}

function preveri(seznamResitev) {
  let narobe = 0;
  let prav = 0;
  let seznam = document.getElementById("seznamBesed").children[1];
  let stolpci = seznam.children[0].children;
  
  for (let stolpec = 0; stolpec < stolpci.length; stolpec++) {
    let prostorcek = stolpci[stolpec].children[0];
    if (prostorcek != undefined) {
      if (enako(prostorcek.innerText, seznamResitev[stolpec])) {
        prostorcek.style.backgroundColor = "lightgreen";
        prav += 1;
      } else {
        prostorcek.style.backgroundColor = stolpec == 3 ? "orange" : "rgb(255, 102, 102)";
        if (stolpec != 3) narobe += 1;
        prostorcek.innerHTML = `<s>${prostorcek.innerText.trim()}</s> ${seznamResitev[stolpec]}`;
      }
      prostorcek.setAttribute("contenteditable", "false");
    }
  }

  return [prav, narobe];
}

function onPreveri() {
  t = preveri(a[trenutInd]);
  pravilno += t[0]; 
  vseTocke += (t[1]+t[0]);
  zadnjaPravilna = t[1] == 0;
  nastaviStevecTock(pravilno, vseTocke);
  skrij('preveri');
  prikazi('naprej');
}

function onNaprej() {
  if (!ponavljajNapacno || zadnjaPravilna) trenutInd = (trenutInd+1) % a.length;
  document.getElementById('seznamBesed').innerHTML = narediSeznamBesed([a[trenutInd]], function(ind) {
    if (stStolpca == -1) return nakljucno(4) - 1;
    else return stStolpca;
  });
  skrij('naprej');
  prikazi('preveri');
}

document.getElementById("preveri").addEventListener("click", onPreveri);
document.getElementById("naprej").addEventListener("click", onNaprej);
document.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    if (document.getElementById("preveri").style.visibility != "hidden") onPreveri();
    else onNaprej();
  }
});
document.getElementById("izpisiVse").addEventListener("click", function() {
  document.getElementById('seznamBesed').innerHTML = narediSeznamBesed(a, function() {return -1;});
  skrij('preveri');
  prikazi('naprej')
});

function nakljucno(a) {
  /*vrne nakljucno celo stevilo med 1 in a vkljucno*/
  let x = Math.random();
  return Math.floor(x * a + 1);
}

function enako(a, b) {
  if (!a || !b) return false;
  let clean = function(str) {
    return str
      .trim()
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/č/g, 'c')
      .replace(/ž/g, 'z')
      .replace(/š/g, 's')
  };
  return clean(a) == clean(b);
}

function premesaj(seznam) {
  let vrnitev = [...seznam];
  let l = seznam.length;
  for (let i = 0; i < l; i++) {
    let r = nakljucno(seznam.length) - 1;
    [vrnitev[i], vrnitev[r]] = [vrnitev[r], vrnitev[i]];
  }
  return vrnitev;
}

function nastaviStevecTock(p, v) {
  document.getElementById("steviloNalog").innerText = v;
  document.getElementById("pravilno").innerText = p;
}

function prikazi(id) { document.getElementById(id).style.visibility = "visible"; }
function skrij(id) { document.getElementById(id).style.visibility = "hidden"; }

function nastaviStStolpca() {
  let moznosti = ["naključno", "nedoločnik", "preteklik", "pretekli deležnik", "prevod"];
  stStolpca = moznosti.indexOf(document.getElementById("set1").value) -1;
}
function nastaviPonavljajNapacno() {
  ponavljajNapacno = document.getElementById("repeatFailed").checked;
}

function toggleTheme(element) {
  if (element.checked) {
    document.getElementById("body").classList = "dark";
  } else {
    document.getElementById("body").classList = "";
  }
}
