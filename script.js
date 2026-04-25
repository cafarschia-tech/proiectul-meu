let cartCount = 0;

function updateCart() {
  document.querySelector('.nav__cart').textContent = `coș(${cartCount})`;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.hero__cta').addEventListener('click', () => {
    // adaugă redirect sau scroll la colecție
  });

  document.querySelector('.nav__cart').addEventListener('click', (e) => {
    e.preventDefault();
    // adaugă logica pentru coș
  });
});
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

// REGISTER
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

    afiseazaMesaj('Cont creat cu succes! Te redirecționăm...', 'succes');
    setTimeout(() => { window.location.href = 'login.html'; }, 2000);
  });
}

// LOGIN
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
      setTimeout(() => { window.location.href = 'user.html'; }, 2000);
    } else {
      afiseazaMesaj('Email sau parolă greșită!', 'eroare');
    }
  });
}

// COS
function getCart() {
  return JSON.parse(localStorage.getItem('divix_cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('divix_cart', JSON.stringify(cart));
}

function adaugaInCos(id) {
  const cart = getCart();
  const existent = cart.find(item => item.id === id);
  if (existent) {
    existent.cantitate += 1;
  } else {
    cart.push({ id, cantitate: 1 });
  }
  saveCart(cart);
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.cantitate, 0);
  const cartEl = document.querySelector('.nav__cart');
  if (cartEl) cartEl.textContent = 'coș(' + total + ')';
}

updateCartCount();

// Afiseaza utilizatorul logat
const userLogat = JSON.parse(localStorage.getItem('divix_logat'));
const userDiv = document.getElementById('user-logat');
if (userDiv) {
  if (userLogat) {
    userDiv.textContent = 'Logat ca: ' + userLogat.prenume + ' ' + userLogat.nume;
    userDiv.style.display = 'block';
  }
}