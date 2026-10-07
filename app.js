/**
 * NO TIME TO DOUBT - NOTAS DEL PARCHE (PATCH NOTES)
 * Lógica interactiva en JavaScript Vanilla
 * Sin dependencias externas - Listo para despliegue estático en Vercel
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Barra de progreso de lectura superior
  const progressBar = document.getElementById('progress-bar');
  
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  });

  // 2. Filtros de notas del parche
  const filterBtns = document.querySelectorAll('.filter-btn');
  const patchCards = document.querySelectorAll('.patch-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      patchCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory || cardCategory.includes(filterCategory)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 3. Copiar fragmentos de código al portapapeles
  const copyButtons = document.querySelectorAll('.btn-copy-code');
  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const codeBlock = button.closest('.code-block-wrapper').querySelector('pre.code-content');
      if (!codeBlock) return;

      const codeText = codeBlock.innerText;
      const copyToClipboard = async (text) => {
        if (navigator.clipboard && window.isSecureContext) {
          try {
            await navigator.clipboard.writeText(text);
            return true;
          } catch (e) {
            // Fallback below
          }
        }
        // Fallback for non-secure contexts or permission errors
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        let success = false;
        try {
          success = document.execCommand('copy');
        } catch (err) {
          console.error('Fallback copy failed', err);
        }
        document.body.removeChild(textArea);
        return success;
      };

      const copied = await copyToClipboard(codeText);
      if (copied) {
        const originalText = button.innerText;
        button.innerText = '✓ Copiado';
        button.style.backgroundColor = '#059669';
        button.style.color = '#ffffff';

        setTimeout(() => {
          button.innerText = originalText;
          button.style.backgroundColor = '';
          button.style.color = '';
        }, 2000);
      }
    });
  });

  // 4. Modal Lightbox para visualización de capturas y diagramas
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  const evidenceCards = document.querySelectorAll('.evidence-card');
  evidenceCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const captionText = card.querySelector('.evidence-caption span')?.innerText || '';

      if (img && lightboxModal && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.innerText = captionText;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // 5. Controles del reproductor de video de Gameplay
  const gameplayVideo = document.getElementById('gameplay-video');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const btnTogglePlay = document.getElementById('btn-toggle-play');
  const speedButtons = document.querySelectorAll('.btn-speed');

  if (gameplayVideo) {
    // Alternar reproducir/pausar
    if (btnTogglePlay) {
      btnTogglePlay.addEventListener('click', () => {
        if (gameplayVideo.paused) {
          gameplayVideo.play();
          btnTogglePlay.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
            Pausar
          `;
        } else {
          gameplayVideo.pause();
          btnTogglePlay.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Reproducir
          `;
        }
      });

      gameplayVideo.addEventListener('play', () => {
        btnTogglePlay.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
          Pausar
        `;
      });

      gameplayVideo.addEventListener('pause', () => {
        btnTogglePlay.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Reproducir
        `;
      });
    }

    // Pantalla completa para el video
    const enterFullscreen = () => {
      if (gameplayVideo.requestFullscreen) {
        gameplayVideo.requestFullscreen();
      } else if (gameplayVideo.webkitRequestFullscreen) {
        gameplayVideo.webkitRequestFullscreen();
      } else if (gameplayVideo.msRequestFullscreen) {
        gameplayVideo.msRequestFullscreen();
      }
    };

    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', enterFullscreen);
    }

    // Controles de velocidad
    speedButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const speed = parseFloat(btn.getAttribute('data-speed'));
        gameplayVideo.playbackRate = speed;
        speedButtons.forEach(b => {
          b.style.backgroundColor = '';
          b.style.color = '';
        });
        btn.style.backgroundColor = '#2563eb';
        btn.style.color = '#ffffff';
      });
    });
  }

  // 6. Atajos de teclado para la presentación
  document.addEventListener('keydown', (e) => {
    // ESC cierra el lightbox
    if (e.key === 'Escape') {
      closeLightbox();
    }

    // Tecla 'F' activa pantalla completa en el video si está en pantalla
    if (e.key === 'f' || e.key === 'F') {
      if (!lightboxModal.classList.contains('active') && gameplayVideo) {
        const rect = gameplayVideo.getBoundingClientRect();
        if (rect.top >= -200 && rect.bottom <= window.innerHeight + 300) {
          if (!document.fullscreenElement) {
            gameplayVideo.requestFullscreen?.();
          } else {
            document.exitFullscreen?.();
          }
        }
      }
    }
  });

  // 7. Resaltado de enlace activo en la barra de navegación según el scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.style.backgroundColor = '#f1f5f9';
        link.style.color = '#2563eb';
      } else {
        link.style.backgroundColor = '';
        link.style.color = '';
      }
    });
  });
});
