//Array globale per memorizzare i libri nel carrello
let cart = 0;
let url = 'https://striveschool-api.herokuapp.com/books';

document.addEventListener('DOMContentLoaded', function () {
  ottienifetch(); // Ottieni i dati dall'API  
  initializeEvents(); // Inizializza gli eventi
})


function initializeEvents() {
  document.querySelector('.btn-outline-dark').addEventListener('click', () => {
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    cartModal.show();
  });
}

const ottienifetch = () => {
  fetch(url)
    .then(response => {
      if (!response.ok) { // Controlla se la risposta HTTP non è OK (status 200-299)
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Converte la risposta in JSON solo se è valida
    })
    .then(data => {
      let res = data; // Supponendo che `data` sia un array di oggetti libro
      console.log(res);

      let cont = document.querySelector('#productContainer');
      cont.innerHTML = res
        .map((book) => {
          return ` <div class='col col-3'><div class='card mb-4 shadow-sm' id='book_${book.asin}'>
          <img src='${book.img}'alt='${book.title}'>
          <div class='card-body'>
          <h5 class='card-title text-truncate'>${book.title}</h5>
          <p class='card-text'>
          <strong class='text-danger ms-2'>€${book.price.toFixed(2)}</strong>
          <span class='badge bg-danger text-uppercase ms-2'>${book.category}</span>
          <span class='ms-2'>ASIN: ${book.asin}</span>
          </p>
          <div class='d-flex align-items-center justify-content-between'>
          <button class="btn btn-dark" style="border-radius: 20px; width: 100px; height: 40px;"  onClick="addTocart('${book.title}', ${book.price}, '${book.asin}')"> Aggiungi </button>
        <button class="btn btn-success btn-salta" style="border-radius: 20px; width: 100px; height: 40px;" onclick="salta()"> Salta </button>
        <a class="btn btn-warning" btn-dettagli" style="border-radius: 20px; width: 100px; height: 40px;" href="dettagli.html?id=${book.asin}">Dettagli</a>
          </div>
          </div>
          </div>
          </div>`
        })
        .join(''); // Usa `.join('')` per evitare virgole tra gli elementi

    })
    .catch(error => {
      console.error('Errore:', error); // Gestisce gli errori
    });
}

const addTocart = (title, price, asin) => {
  const book = document.querySelector("#book_" + asin);
  book.style.border = '2px solid red';
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  cartItems.innerHTML += `
  <div class="d-flex justify-content-between align-items-center mb-3" id="cartItem_${asin}">
    <div>
      <h6>${title}</h6>
      <small>€${price.toFixed(2)}</small>
    </div>
    <button class="btn btn-sm btn-danger" onclick="removeFromCart('${asin}', ${price})">Rimuovi</button>
  </div>
`;

  cartTotal.textContent = (parseFloat(cartTotal.textContent) + parseFloat(price)).toFixed(2);
  showCartNotification(title);//Mostra la notifica del carrello
  updateCartBadge();//Aggiorna il badge del carrello
}

function showCartNotification(title) {
  //Crea e mostra un toast Boostrap temporaneo
  //Usa setTimeout per nascondere il toast dopo 3 secondi
  //Docs: https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout

  const toast = document.querySelector('.toast');
  if (toast) {//Rimuovi toast precedenti
    toast.remove();
  }

  const newToast = `
<div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
<div class="toast-header">
<strong class="me-auto">Carrello</strong>
<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
</div>
<div class="toast-body">
  ${title} aggiunto al carrello
</div>

</div>
`;

  //Inserisci il toast nel DOM
  document.body.insertAdjacentHTML('beforeend', newToast);

  //Rimuovi il toast dopo 3 secondi
  setTimeout(() => {
    const toast = document.querySelector('.toast');
    if (toast) toast.remove();
  }, 3000);

}

function updateCartBadge() {
  const badge = document.querySelector('.badge');
  badge.textContent = (Number(badge.textContent) + 1);
}
const searchBooks = (ev) => {
  let query = ev.target.value.toLowerCase();
  let allTitles = document.querySelectorAll('.card-title');
  console.log(
    query,
    allTitles[0].textContent.toLowerCase().includes(query)
  )
  allTitles.forEach(title => {
    const currCard = title.parentElement.parentElement.parentElement;
    if (title.textContent.toLowerCase().includes(query)) {
      currCard.style.display = 'none';
    } else {
      currCard.style.display = 'block';
    }

  })
}

function removeFromCart(asin) {
  // Seleziona l'elemento da rimuovere
  const itemToRemove = document.querySelector(`#cartItem_${asin}`);
  if (!itemToRemove) {
    console.error(`Elemento con ASIN ${asin} non trovato.`);
    return;
  }

  // Ottieni il prezzo
  const price = itemToRemove.querySelector('small').innerText.replace('€', '');
  if (!price) {
    console.error('Prezzo non trovato per l\'elemento da rimuovere.');
    return;
  }

  // Aggiorna il totale del carrello
  const cartTotal = document.getElementById('cartTotal');
  if (cartTotal) {
    cartTotal.innerText = (parseFloat(cartTotal.innerText) - parseFloat(price)).toFixed(2);
  }

  // Rimuovi l'elemento dal DOM
  itemToRemove.remove();

  // Rimuovi il bordo rosso dal libro corrispondente
  const book = document.querySelector(`#book_${asin}`);
  if (book) {
    book.style.border = 'none';
  }

  // Aggiorna il badge del carrello
  const badge = document.querySelector('.badge');
  if (badge) {
    badge.textContent = (Number(badge.textContent) - 1);
  }

  console.log(`Rimosso dal carrello: ASIN ${asin}, Prezzo €${price}`);
}

function salta() {
  const container = document.querySelector('#productContainer'); // Contenitore delle schede
  container.addEventListener('click', (event) => {
    // Controlla se il clic è su un pulsante "Salta"
    if (event.target && event.target.classList.contains('btn-salta')) {
      const card = event.target.closest('.card.mb-4.shadow-sm'); // Trova la scheda corrispondente
      if (card) {
        card.style.display = 'none'; // Nasconde la scheda
      }
    }
  });
}



document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const asin = params.get('id');
  fetch(`https://striveschool-api.herokuapp.com/books/${asin}`)
    .then(response => {
      return response.json();
    })
    .then(book => {
      const container = document.getElementById('bookDetails');
      container.innerHTML = `
        <h1 style="text-align: center;">${book.title}</h1>
        <p style="text-align: center;">Prezzo: €${book.price.toFixed(2)}</p>
        <p style="text-align: center;">ASIN: ${book.asin}</p>
        <img src="${book.img}" alt="${book.title}" style="width: 200px; height: 200px; position: relative; left: 44%;">
        <p style="text-align: center;">Categoria: ${book.category}</p>
      `;
    })
    .catch(error => {
      console.error('Errore:', error);
    });
});
