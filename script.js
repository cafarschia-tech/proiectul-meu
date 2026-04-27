// =====================
// HELPER FUNCTIONS
// =====================

function getUtilizatori() {
  return JSON.parse(localStorage.getItem('divix_utilizatori')) || [];
}

function salveazaUtilizatori(lista) {
  localStorage.setItem('divix_utilizatori', JSON.stringify(lista));
}

function afiseazaMesaj(text, tip) {
  const div = document.getElementById('mesaj');
  if (!div) return;
  div.textContent = text;
  div.className = 'auth__mesaj ' + (tip === 'eroare' ? 'auth__mesaj--eroare' : 'auth__mesaj--succes');
}

// =====================
// REGISTER
// =====================

const formRegister = document.getElementById('formRegister');
if (formRegister) {
  formRegister.addEventListener('submit', function(e) {
    e.preventDefault();

    const nume       = document.getElementById('nume').value.trim();
    const prenume    = document.getElementById('prenume').value.trim();
    const email      = document.getElementById('email').value.trim();
    const telefon    = document.getElementById('telefon').value.trim();
    const parola     = document.getElementById('parola').value;
    const confirmare = document.getElementById('confirmare').value;

    if (!nume || !prenume || !email || !telefon || !parola || !confirmare) {
      afiseazaMesaj('Toate câmpurile sunt obligatorii!', 'eroare');
      return;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      afiseazaMesaj('Emailul nu este valid!', 'eroare');
      return;
    }

    const regexTelefon = /^[0-9]+$/;
    if (!regexTelefon.test(telefon)) {
      afiseazaMesaj('Telefonul trebuie să conțină doar cifre!', 'eroare');
      return;
    }

    if (parola.length < 8) {
      afiseazaMesaj('Parola trebuie să aibă minim 8 caractere!', 'eroare');
      return;
    }

    if (parola !== confirmare) {
      afiseazaMesaj('Parolele nu coincid!', 'eroare');
      return;
    }

    const utilizatori = getUtilizatori();
    if (utilizatori.find(u => u.email === email)) {
      afiseazaMesaj('Acest email este deja înregistrat!', 'eroare');
      return;
    }

    utilizatori.push({ nume, prenume, email, telefon, parola });
    salveazaUtilizatori(utilizatori);

    // Descarca fisier JSON
    const dataStr = JSON.stringify(utilizatori, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'utilizatori.json';
    a.click();
    URL.revokeObjectURL(url);

    afiseazaMesaj('Cont creat cu succes! Te redirecționăm...', 'succes');
    setTimeout(() => { window.location.href = 'login.html'; }, 2000);
  });
}

// =====================
// LOGIN
// =====================

const formLogin = document.getElementById('formLogin');
if (formLogin) {
  formLogin.addEventListener('submit', function(e) {
    e.preventDefault();

    const email  = document.getElementById('email').value.trim();
    const parola = document.getElementById('parola').value;

    if (!email || !parola) {
      afiseazaMesaj('Completează toate câmpurile!', 'eroare');
      return;
    }

    const utilizatori = getUtilizatori();
    const utilizator  = utilizatori.find(u => u.email === email && u.parola === parola);

    if (utilizator) {
      afiseazaMesaj('Bun venit, ' + utilizator.prenume + '! Redirecționare...', 'succes');
      localStorage.setItem('divix_logat', JSON.stringify(utilizator));

      // Descarca fisier JSON cu datele utilizatorului logat
      const logData = {
        nume: utilizator.nume,
        prenume: utilizator.prenume,
        email: utilizator.email,
        telefon: utilizator.telefon,
        status: 'S-a logat cu succes))',
        data: new Date().toLocaleString('ro-RO')
      };
      const dataStr = JSON.stringify(logData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'logare.json';
      a.click();
      URL.revokeObjectURL(url);

      setTimeout(() => { window.location.href = 'index.html'; }, 2000);
    } else {
      afiseazaMesaj('Email sau parolă greșită!', 'eroare');
    }
  });
}

// =====================
// COS
// =====================

function getCart() {
  return JSON.parse(localStorage.getItem('divix_cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('divix_cart', JSON.stringify(cart));
}

function adaugaInCos(id, nume, pret, imagine) {
  const cart = getCart();
  const existent = cart.find(item => item.id === id);
  if (existent) {
    existent.cantitate += 1;
  } else {
    cart.push({ id, nume, pret, imagine, cantitate: 1 });
  }
  saveCart(cart);
  updateCartCount();
  updateButoane();

  const mesajCos = document.getElementById('mesaj-cos');
  if (mesajCos) {
    mesajCos.style.display = 'block';
    setTimeout(() => { mesajCos.style.display = 'none'; }, 2000);
  }
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.cantitate, 0);
  document.querySelectorAll('.nav__cart').forEach(el => {
    el.textContent = 'coș(' + total + ')';
  });
}

// Afiseaza produsele in cos.html
function afiseazaCos() {
  const continut = document.getElementById('cos-continut');
  const totalEl = document.getElementById('cos-total');
  if (!continut) return;

  const cart = getCart();

  if (cart.length === 0) {
    continut.innerHTML = '<p class="cos__gol">Coșul tău este gol.</p>';
    totalEl.innerHTML = '';
    return;
  }

  let html = '';
  let total = 0;

  cart.forEach(item => {
    total += item.pret * item.cantitate;
    html += `
      <div class="cos__item">
        <img src="${item.imagine}" alt="${item.nume}" class="cos__item-img" />
        <div class="cos__item-info">
          <p class="cos__item-nume">${item.nume}</p>
          <p class="cos__item-pret">${item.pret}$ × ${item.cantitate}</p>
        </div>
        <button class="cos__item-sterge" onclick="stergedinCos(${item.id})">Șterge</button>
      </div>
    `;
  });

  continut.innerHTML = html;
  totalEl.innerHTML = 'Total: <strong>' + total + '$</strong>';
}

function stergedinCos(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  updateCartCount();
  afiseazaCos();
}

updateCartCount();
afiseazaCos();

// CONTACT
const formContact = document.getElementById('formContact');
if (formContact) {
  formContact.addEventListener('submit', function(e) {
    e.preventDefault();
    const mesaj = document.getElementById('mesaj-contact-trimis');
    if (mesaj) {
      mesaj.style.display = 'block';
      setTimeout(() => { mesaj.style.display = 'none'; }, 3000);
    }
    formContact.reset();
  });
}

// NEWSLETTER
const btnAbonare = document.getElementById('btnAbonare');
if (btnAbonare) {
  btnAbonare.addEventListener('click', function() {
    const mesaj = document.getElementById('mesaj-abonare');
    mesaj.style.display = 'block';
    btnAbonare.textContent = '✓ Abonat!';
    btnAbonare.style.backgroundColor = '#4CAF50';
    setTimeout(() => {
      mesaj.style.display = 'none';
      btnAbonare.textContent = 'Abonează-te';
      btnAbonare.style.backgroundColor = '';
    }, 3000);
  });
}

function updateButoane() {
  const cart = getCart();
  document.querySelectorAll('.produs-card__btn').forEach(btn => {
    const onclick = btn.getAttribute('onclick');
    if (!onclick) return;
    const id = parseInt(onclick.match(/\d+/)[0]);
    const item = cart.find(i => i.id === id);
    btn.textContent = item ? 'coș(' + item.cantitate + ')' : 'coș(0)';
  });
}

updateButoane();