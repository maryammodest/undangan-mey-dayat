import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 1. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAe8-hMuCWka5grBASZ_5uLXndt5BLRd0w",
  authDomain: "undangan-mey-dayat.firebaseapp.com",
  projectId: "undangan-mey-dayat",
  storageBucket: "undangan-mey-dayat.firebasestorage.app",
  messagingSenderId: "1012778814451",
  appId: "1:1012778814451:web:83a7b7ae86a5db4b30e086"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. DOM Loaded Event
document.addEventListener("DOMContentLoaded", () => {
  
  // Tangkap nama tamu dari URL (?to=Nama)
  const urlParams = new URLSearchParams(window.location.search);
  const guest = urlParams.get("to");
  if (guest) {
    const guestElem = document.getElementById("guestName");
    if (guestElem) guestElem.innerText = decodeURIComponent(guest);
  }

  // LOGIKA BUKA UNDANGAN
  const openBtn = document.getElementById("openInvitation");
  const openingScreen = document.getElementById("opening");
  const mainContent = document.getElementById("main");
  const music = document.getElementById("music");

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      if (openingScreen) openingScreen.classList.add("open-active");

      setTimeout(() => {
        if (openingScreen) openingScreen.style.display = "none";
        if (mainContent) mainContent.classList.remove("hidden");
        
        if (music) {
          music.play().catch(err => console.log("Autoplay ditahan browser:", err));
        }
      }, 900);
    });
  }

  // RSVP FIREBASE
  const rsvpForm = document.getElementById("form");
  const wishesContainer = document.getElementById("wishes");

  if (rsvpForm && wishesContainer) {
    // Read Real-time Wishes
    const q = query(collection(db, "ucapan"), orderBy("timestamp", "desc"));
    onSnapshot(q, (snapshot) => {
      wishesContainer.innerHTML = "";
      snapshot.forEach((doc) => {
        const data = doc.data();
        const wishCard = document.createElement("div");
        wishCard.classList.add("wish-card");

        wishCard.innerHTML = `
          <div class="wish-name">${data.nama || 'Tamu'}</div>
          <div class="wish-status">${data.kehadiran || 'Hadir'}</div>
          <div class="wish-message">${data.ucapan || ''}</div>
        `;
        wishesContainer.appendChild(wishCard);
      });
    });

    // Send Wish
    rsvpForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name")?.value.trim() || 'Tamu Undangan';
      const status = document.getElementById("status")?.value || 'Hadir';
      const message = document.getElementById("message")?.value.trim() || '';

      if (!message) return;

      try {
        await addDoc(collection(db, "ucapan"), {
          nama: name,
          kehadiran: status,
          ucapan: message,
          timestamp: serverTimestamp()
        });
        rsvpForm.reset();
      } catch (error) {
        console.error("Gagal mengirim ucapan: ", error);
      }
    });
  }

  // FADE-IN ANIMATION ON SCROLL
  const observerOptions = { root: null, threshold: 0.15 };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-element').forEach(el => observer.observe(el));
});

// FUNGSIONALITAS SALIN REKENING (Global Function)
window.copyRekening = function() {
  const rekening = document.getElementById("rekening")?.innerText;
  const message = document.getElementById("copy-message");

  if (rekening) {
    navigator.clipboard.writeText(rekening).then(() => {
      if (message) {
        message.textContent = "✓ Nomor rekening berhasil disalin 🤎";
        setTimeout(() => { message.textContent = ""; }, 2500);
      }
    });
  }
};
// FUNGSI PAKSA BUKA UNDANGAN
window.bukaUndanganTamu = function() {
  const openingScreen = document.getElementById("opening");
  const mainContent = document.getElementById("main");
  const music = document.getElementById("music");

  if (openingScreen) {
    openingScreen.classList.add("open-active");
    openingScreen.style.opacity = "0";
    openingScreen.style.transform = "translateY(-100%)";
  }

  setTimeout(() => {
    if (openingScreen) openingScreen.style.display = "none";
    if (mainContent) mainContent.classList.remove("hidden");
    
    if (music) {
      music.play().catch(err => console.log("Autoplay ditahan browser:", err));
    }
  }, 700);
};