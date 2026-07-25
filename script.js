/**
 * WEDDING INVITATION - SCRIPT.JS
 * Logika interaktif, musik latar, hitung mundur, dan RSVP statis
 */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. MEMBACAS PARAMETER URL (?to=)
  // ==========================================
  const getGuestName = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get("to");
    
    if (guestParam) {
      // Decode dan bersihkan spasi berlebih
      return decodeURIComponent(guestParam).trim();
    }
    return "Tamu Undangan";
  };

  const guestName = getGuestName();
  
  // Tampilkan nama tamu di Cover/Welcome Screen
  const coverGuestEl = document.getElementById("cover-guest-name");
  if (coverGuestEl) {
    coverGuestEl.textContent = guestName;
  }

  // Tampilkan nama tamu di Hero Section
  const heroGuestEl = document.getElementById("hero-guest-name");
  if (heroGuestEl) {
    heroGuestEl.textContent = guestName;
  }


  // ==========================================
  // 2. MUSIK LATAR & LOCK/UNLOCK SCROLL COVER
  // ==========================================
  const audio = document.getElementById("bg-music");
  const coverScreen = document.getElementById("cover-screen");
  const openBtn = document.getElementById("btn-open-invitation");
  const musicBtn = document.getElementById("music-btn");
  const musicIcon = musicBtn ? musicBtn.querySelector("span") : null;

  // Mulanya kunci scroll body
  document.body.classList.add("no-scroll");

  // Ketika tombol "Buka Undangan" diklik
  if (openBtn && coverScreen) {
    openBtn.addEventListener("click", () => {
      // Hilangkan cover screen dengan transisi CSS (slide up/fade out)
      coverScreen.classList.add("is-hidden");
      
      // Buka kunci scroll
      document.body.classList.remove("no-scroll");
      
      // Putar musik otomatis (jika elemen audio ada)
      if (audio) {
        audio.play()
          .then(() => {
            console.log("Autoplay background music successfully started.");
            if (musicBtn) {
              musicBtn.classList.add("is-visible", "is-playing");
            }
          })
          .catch((err) => {
            console.warn("Autoplay was prevented by browser security. Audio will start on user action.", err);
            // Tetap tampilkan tombol musik agar user bisa klik manual
            if (musicBtn) {
              musicBtn.classList.add("is-visible");
            }
          });
      }

      // Picu animasi scroll reveal awal
      triggerRevealOnScroll();
    });
  }

  // Kontrol Floating Button Musik Mute/Unmute
  if (musicBtn && audio) {
    musicBtn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play()
          .then(() => {
            musicBtn.classList.add("is-playing");
            if (musicIcon) musicIcon.textContent = "🎵";
          })
          .catch((err) => console.error("Error playing audio: ", err));
      } else {
        audio.pause();
        musicBtn.classList.remove("is-playing");
        if (musicIcon) musicIcon.textContent = "🔇";
      }
    });
  }


  // ==========================================
  // 3. COUNTDOWN TIMER
  // ==========================================
  // Tentukan Tanggal Pernikahan di sini (Format: YYYY-MM-DDTHH:mm:ss)
  const WEDDING_DATE = new Date("2026-08-01T08:00:00").getTime();

  const runCountdown = () => {
    const now = new Date().getTime();
    const distance = WEDDING_DATE - now;

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    // Jika waktu hitung mundur selesai
    if (distance < 0) {
      if (daysEl) daysEl.textContent = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minutesEl) minutesEl.textContent = "00";
      if (secondsEl) secondsEl.textContent = "00";
      return;
    }

    // Perhitungan waktu
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Format pad left dengan angka 0 jika < 10
    if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
  };

  // Jalankan countdown segera dan ulangi setiap detik
  runCountdown();
  setInterval(runCountdown, 1000);


  // ==========================================
  // 4. GALERI LIGHTBOX
  // ==========================================
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox ? lightbox.querySelector(".lightbox-img") : null;
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;

  if (galleryItems.length > 0 && lightbox && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener("click", () => {
        const img = item.querySelector("img");
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt || "Wedding Gallery Photo";
          lightbox.classList.add("is-open");
          document.body.classList.add("no-scroll"); // kunci scroll saat memperbesar gambar
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      // Buka kunci scroll jika cover screen sudah tertutup
      if (coverScreen && coverScreen.classList.contains("is-hidden")) {
        document.body.classList.remove("no-scroll");
      }
    };

    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    // Klik di luar gambar untuk menutup lightbox
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }


  // ==========================================
  // 5. RSVP & DIGITAL WISHES (UCAPAN)
  // ==========================================
  const rsvpForm = document.getElementById("rsvp-form");
  const rsvpSuccess = document.getElementById("rsvp-success");
  const ucapanList = document.getElementById("ucapan-list");

  // Contoh ucapan bawaan/sebelumnya untuk mengisi konten agar estetis
  const defaultWishes = [
    {
      nama: "Budi & Sarah",
      kehadiran: "hadir",
      pesan: "Selamat menempuh hidup baru Zaki dan Yulia! Semoga cinta kalian selalu bertumbuh dan menjadi keluarga yang sakinah, mawaddah, warahmah. Amin!"
    },
    {
      nama: "Diana Lestari",
      kehadiran: "hadir",
      pesan: "Happy Wedding! Ikut bahagia melihat perjalanan kalian berdua. Semoga dilancarkan semua acaranya dan berkah selalu. Doa terbaik selalu mengiringi langkah kalian."
    },
    {
      nama: "Ahmad Subarjo",
      kehadiran: "tidak",
      pesan: "Selamat berbahagia! Semoga dilancarkan semua acaranya dan berkah selalu pernikahan kalian berdua."
    }
  ];

  // Render ucapan bawaan
  const renderWish = (nama, kehadiran, pesan) => {
    const card = document.createElement("div");
    card.className = "ucapan-card reveal";
    
    const badgeText = kehadiran === "hadir" ? "Hadir" : "Absen";
    const badgeClass = kehadiran === "hadir" ? "hadir" : "tidak";

    card.innerHTML = `
      <div class="ucapan-header">
        <span class="ucapan-name">${escapeHTML(nama)}</span>
        <span class="ucapan-badge ${badgeClass}">${badgeText}</span>
      </div>
      <p class="ucapan-message">"${escapeHTML(pesan)}"</p>
    `;
    
    if (ucapanList) {
      ucapanList.insertBefore(card, ucapanList.firstChild);
    }
  };

  // Helper untuk mencegah XSS
  const escapeHTML = (text) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  };

  // Inisialisasi ucapan bawaan ke layout
  defaultWishes.forEach(wish => {
    renderWish(wish.nama, wish.kehadiran, wish.pesan);
  });

  // Logika submit form RSVP
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("rsvp-name");
      const statusSelect = document.getElementById("rsvp-status");
      const messageInput = document.getElementById("rsvp-message");

      const nama = nameInput ? nameInput.value.trim() : "";
      const kehadiran = statusSelect ? statusSelect.value : "hadir";
      const pesan = messageInput ? messageInput.value.trim() : "";

      if (!nama || !pesan) {
        alert("Mohon isi Nama dan Ucapan Anda.");
        return;
      }

      // Log ke console sebagai mock penyimpanan data statis
      console.log("=== PENGIRIMAN RSVP & UCAPAN ===");
      console.log("Nama Tamu   :", nama);
      console.log("Kehadiran   :", kehadiran);
      console.log("Pesan/Doa   :", pesan);
      console.log("=================================");

      // Tambahkan ucapan baru ke daftar ucapan secara dinamis
      renderWish(nama, kehadiran, pesan);

      // Sembunyikan form dan tampilkan pesan sukses
      rsvpForm.style.display = "none";
      if (rsvpSuccess) {
        rsvpSuccess.classList.add("is-visible");
      }

      // Trigger reveal ulang agar card ucapan baru bisa terdeteksi jika butuh transisi
      triggerRevealOnScroll();
    });
  }


  // ==========================================
  // 6. SALIN REKENING (COPY TO CLIPBOARD)
  // ==========================================
  const copyButtons = document.querySelectorAll(".btn-copy");
  copyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const textToCopy = btn.getAttribute("data-copy");
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const textSpan = btn.querySelector(".btn-copy-text");
        const originalText = textSpan ? textSpan.textContent : "Salin No. Rekening";
        
        btn.classList.add("copied");
        if (textSpan) textSpan.textContent = "Tersalin!";

        setTimeout(() => {
          btn.classList.remove("copied");
          if (textSpan) textSpan.textContent = originalText;
        }, 2000);
      }).catch(err => {
        console.error("Gagal menyalin teks: ", err);
      });
    });
  });


  // ==========================================
  // 7. SCROLL REVEAL ANIMATION (VANILLA JS)
  // ==========================================
  function triggerRevealOnScroll() {
    const reveals = document.querySelectorAll(".reveal");
    const windowHeight = window.innerHeight;

    reveals.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const elementVisible = 100; // elemen muncul ketika ter-scroll sejauh 100px

      if (elementTop < windowHeight - elementVisible) {
        el.classList.add("is-visible");
      }
    });
  }

  // Daftarkan listener scroll
  window.addEventListener("scroll", triggerRevealOnScroll);
  // Panggil sekali untuk mengecek elemen yang sudah terlihat saat load
  triggerRevealOnScroll();
});
