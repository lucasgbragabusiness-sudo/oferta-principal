/**
 * ====================================================================
 * SCRIPTS INTERATIVOS — ESTANTE DE ANÁLISES CLÍNICAS
 * ====================================================================
 * Funcionalidades:
 * 1. Injeção dinâmica de links de checkout via config.js
 * 2. Sanfonamento (Accordion) interativo de FAQ
 * 3. Abertura e fechamento do Modal de Upsell / Oferta Especial
 * 4. Rolagem suave para âncoras (#pacotes)
 * 5. Inicialização opcional de pixels próprios (sem rastreadores antigos)
 */

document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------------------------------------------
  // 1. INJEÇÃO DE LINKS DO CONFIG.JS (PRESERVANDO PARÂMETROS UTM)
  // ------------------------------------------------------------------
  const cfg = window.PAGE_CONFIG || {};
  const checkouts = cfg.checkout || {};

  const updateCheckoutUrl = (el, newBase) => {
    if (!el || !newBase) return;
    // Se o elemento já tiver query params de UTM / rastreamento adicionados, preserva-os
    if (el.search && el.search.length > 1) {
      try {
        const url = new URL(newBase, window.location.origin);
        const currentParams = new URLSearchParams(el.search);
        currentParams.forEach((val, key) => {
          url.searchParams.set(key, val);
        });
        el.href = url.toString();
        return;
      } catch (e) {}
    }
    el.href = newBase;
  };

  const btnCompleto = document.getElementById("btn-checkout-completo");
  if (btnCompleto && checkouts.completo) {
    updateCheckoutUrl(btnCompleto, checkouts.completo);
  }

  const btnUpsell = document.getElementById("btn-checkout-upsell");
  if (btnUpsell && checkouts.upsell) {
    updateCheckoutUrl(btnUpsell, checkouts.upsell);
  }

  const btnBasico = document.getElementById("btn-checkout-basico");
  if (btnBasico && checkouts.basico) {
    updateCheckoutUrl(btnBasico, checkouts.basico);
  }

  // ------------------------------------------------------------------
  // 2. SISTEMA DO POP-UP (APENAS AO CLICAR NO BÁSICO OU AO SAIR DA PÁGINA)
  // ------------------------------------------------------------------
  const btnOpenUpsell = document.getElementById("btn-open-upsell");
  const modal = document.getElementById("upsell-modal");

  if (modal) {
    let exitTriggered = false;

    const openModal = () => {
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    };

    // 1. Disparo ao clicar no botão do plano Básico
    if (btnOpenUpsell) {
      btnOpenUpsell.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    }

    // Fechar ao clicar no X ou no fundo escuro (backdrop)
    modal.querySelectorAll(".modal-close-btn, .modal-backdrop").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal();
      });
    });

    // Fechar ao pressionar a tecla ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
      }
    });

    // 2. Disparo ao tentar sair da página (Exit Intent)
    // ATENÇÃO: Dispara APENAS se o visitante estiver visualizando a seção dos dois planos (#pacotes)
    const triggerExit = () => {
      if (exitTriggered || !modal.classList.contains("hidden")) return;

      const pacotes = document.getElementById("pacotes");
      if (!pacotes) return;

      const rect = pacotes.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      // Só dispara se a seção #pacotes estiver visível na janela do usuário
      const isInPacotes = rect.top <= windowHeight && rect.bottom >= 0;
      if (!isInPacotes) return;

      exitTriggered = true;
      openModal();
    };

    // Desktop: cursor sai da janela pelo topo (indo fechar a aba ou digitar URL)
    document.documentElement.addEventListener("mouseleave", (e) => {
      if (e.clientY <= 25) {
        triggerExit();
      }
    });

    // Mobile: usuário pressiona o botão 'Voltar' do navegador
    if (window.history && window.history.pushState) {
      window.history.pushState({ page: "sales" }, "", window.location.href);
      window.addEventListener("popstate", () => {
        if (!modal.classList.contains("hidden")) {
          closeModal();
        } else if (!exitTriggered) {
          triggerExit();
          window.history.pushState(null, "", window.location.href);
        }
      });
    }
  }

  // ------------------------------------------------------------------
  // 3. FAQ INTERATIVO (ACCORDION)
  // ------------------------------------------------------------------
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    const content = item.querySelector(".faq-content");
    const chevron = item.querySelector(".faq-chevron");

    if (trigger && content) {
      trigger.addEventListener("click", () => {
        const isOpen = !content.classList.contains("hidden");

        // Opcional: fechar outros abertos
        faqItems.forEach((other) => {
          if (other !== item) {
            const otherContent = other.querySelector(".faq-content");
            const otherChevron = other.querySelector(".faq-chevron");
            if (otherContent) otherContent.classList.add("hidden");
            if (otherChevron) otherChevron.classList.remove("rotate-180");
          }
        });

        // Alterna o atual
        if (isOpen) {
          content.classList.add("hidden");
          if (chevron) chevron.classList.remove("rotate-180");
        } else {
          content.classList.remove("hidden");
          if (chevron) chevron.classList.add("rotate-180");
        }
      });
    }
  });

  // ------------------------------------------------------------------
  // 4. ROLAGEM SUAVE PARA ÂNCORAS
  // ------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId && targetId !== "#") {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    });
  });

  // ------------------------------------------------------------------
  // 5. INICIALIZAÇÃO DE PIXEL PRÓPRIO (SE CONFIGURADO)
  // ------------------------------------------------------------------
  const tracking = cfg.tracking || {};
  if (tracking.metaPixelId && tracking.metaPixelId.trim() !== "") {
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    fbq("init", tracking.metaPixelId.trim());
    fbq("track", "PageView");
  }

  // ------------------------------------------------------------------
  // 6. CARROSSEL AUTOMÁTICO DE DEPOIMENTOS WHATSAPP
  // ------------------------------------------------------------------
  const track = document.getElementById("whatsapp-carousel-track");
  const container = document.getElementById("whatsapp-carousel-container");
  const prevBtn = document.getElementById("whatsapp-prev-btn");
  const nextBtn = document.getElementById("whatsapp-next-btn");
  const dotsContainer = document.getElementById("whatsapp-dots-container");

  if (track && container) {
    const cards = track.querySelectorAll(".whatsapp-card");
    const totalCards = cards.length;
    let currentIndex = 0;
    let autoplayTimer = null;

    const getVisibleCount = () => {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 768) return 2;
      return 3;
    };

    const getMaxIndex = () => Math.max(0, totalCards - getVisibleCount());

    const updateCarousel = (index) => {
      const maxIndex = getMaxIndex();
      currentIndex = Math.max(0, Math.min(index, maxIndex));

      const firstCard = cards[0];
      if (!firstCard) return;
      const cardWidth = firstCard.offsetWidth;
      const gap = 24; // gap-6 = 24px
      const offset = currentIndex * (cardWidth + gap);

      track.style.transform = `translateX(-${offset}px)`;

      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll(".whatsapp-dot");
        dots.forEach((dot, i) => {
          if (i === currentIndex) {
            dot.className = "whatsapp-dot h-2.5 w-8 rounded-full bg-primary transition-all duration-300";
          } else {
            dot.className = "whatsapp-dot h-2.5 w-2.5 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50 transition-all duration-300";
          }
        });
      }
    };

    const buildDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = "";
      const maxIndex = getMaxIndex();
      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", `Ir para depoimento ${i + 1}`);
        dot.className = i === 0
          ? "whatsapp-dot h-2.5 w-8 rounded-full bg-primary transition-all duration-300"
          : "whatsapp-dot h-2.5 w-2.5 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50 transition-all duration-300";
        dot.addEventListener("click", () => {
          updateCarousel(i);
          resetAutoplay();
        });
        dotsContainer.appendChild(dot);
      }
    };

    const nextSlide = () => {
      const maxIndex = getMaxIndex();
      if (currentIndex >= maxIndex) {
        updateCarousel(0);
      } else {
        updateCarousel(currentIndex + 1);
      }
    };

    const prevSlide = () => {
      const maxIndex = getMaxIndex();
      if (currentIndex <= 0) {
        updateCarousel(maxIndex);
      } else {
        updateCarousel(currentIndex - 1);
      }
    };

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
        resetAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        resetAutoplay();
      });
    }

    const startAutoplay = () => {
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, 3500);
    };

    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const resetAutoplay = () => {
      startAutoplay();
    };

    
    

    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    container.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
      startAutoplay();
    }, { passive: true });

    buildDots();
    updateCarousel(0);
    startAutoplay();

    window.addEventListener("resize", () => {
      buildDots();
      updateCarousel(currentIndex);
    });
  }

  // ------------------------------------------------------------------
  // 7. BARRA FIXA MOBILE FLUIDA (SCROLL DOWN MOSTRA / SCROLL UP ESCONDE)
  // ------------------------------------------------------------------
  const stickyCta = document.getElementById("sticky-mobile-cta");
  const pacotesSection = document.getElementById("pacotes");

  if (stickyCta) {
    let lastScrollY = window.scrollY || window.pageYOffset;
    let ticking = false;

    const updateStickyState = () => {
      const currentScrollY = window.scrollY || window.pageYOffset;

      // Somente em dispositivos móveis (< 768px)
      if (window.innerWidth >= 768) {
        stickyCta.classList.remove("is-active");
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

      // No topo da página (Hero), mantém oculto para não sobrecarregar
      if (currentScrollY < 160) {
        stickyCta.classList.remove("is-active");
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

      // Oculta se a seção de compra #pacotes já estiver visível na tela
      let inPacotes = false;
      if (pacotesSection) {
        const rect = pacotesSection.getBoundingClientRect();
        inPacotes = rect.top < window.innerHeight && rect.bottom > 120;
      }

      const diff = currentScrollY - lastScrollY;

      // Limiar suave para ignorar pequenas oscilações de toque (flick)
      if (Math.abs(diff) > 4) {
        if (diff > 0 && !inPacotes) {
          // ROLANDO PARA BAIXO: Mostra a barra com animação fluida
          stickyCta.classList.add("is-active");
        } else {
          // ROLANDO PARA CIMA OU NA SEÇÃO PACOTES: Esconde suavemente
          stickyCta.classList.remove("is-active");
        }
        lastScrollY = currentScrollY;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateStickyState);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Clique suave para rolar até a tabela de pacotes
    const stickyLink = stickyCta.querySelector('a[href^="#"]');
    if (stickyLink) {
      stickyLink.addEventListener("click", (e) => {
        const target = document.querySelector("#pacotes");
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }

    // Permite pré-visualização direta via hash (#preview-sticky)
    if (window.location.hash === "#preview-sticky") {
      stickyCta.classList.add("is-active");
    }
  }

  // ------------------------------------------------------------------
  // 8. CRONÔMETRO REGRESSIVO NO TOPO (URGÊNCIA REALÍSTICA)
  // ------------------------------------------------------------------
  const minEl = document.getElementById("top-timer-min");
  const secEl = document.getElementById("top-timer-sec");

  if (minEl && secEl) {
    const STORAGE_KEY = "estante_top_timer_deadline";
    let targetTime = sessionStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    // 14 minutos e 47 segundos para parecer um cronômetro vivo em andamento
    const DURATION_MS = (14 * 60 + 47) * 1000;

    if (!targetTime || isNaN(targetTime) || Number(targetTime) <= now) {
      targetTime = now + DURATION_MS;
      sessionStorage.setItem(STORAGE_KEY, targetTime);
    } else {
      targetTime = Number(targetTime);
    }

    const updateTimer = () => {
      let remainingMs = targetTime - Date.now();
      if (remainingMs <= 0) {
        // Renova suavemente para nunca travar em 00:00
        targetTime = Date.now() + 10 * 60 * 1000;
        sessionStorage.setItem(STORAGE_KEY, targetTime);
        remainingMs = targetTime - Date.now();
      }

      const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      minEl.textContent = String(minutes).padStart(2, "0");
      secEl.textContent = String(seconds).padStart(2, "0");
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  }

    // ------------------------------------------------------------------
  // 4. VSL SMART AUTOPLAY & UNMUTE (ESTILO VTURB / PANDA) - OTIMIZADO & FLUIDO
  // ------------------------------------------------------------------
  const vslContainer = document.getElementById("vslContainer");
  const vslVideo = document.getElementById("vslVideo");
  const vslOverlay = document.getElementById("vslUnmuteOverlay");
  const vslProgressBar = document.getElementById("vslProgressBar");
  const fsBtn = document.getElementById("vslFullscreenBtn");
  const endScreen = document.getElementById("vslEndScreen");
  const endScreenBtn = document.getElementById("vslEndScreenBtn");
  const replayBtn = document.getElementById("vslReplayBtn");

  if (vslVideo && vslContainer) {
    let unmuted = false;

    // Autoplay suave e sem travar a thread inicial da página
    vslVideo.muted = true;
    requestAnimationFrame(() => {
      const playPromise = vslVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Se o navegador bloquear autoplay, o overlay de clique assume
        });
      }
    });

    const unmuteAndPlay = (e) => {
      if (e) e.stopPropagation();
      if (vslVideo.ended) return;
      if (!unmuted) {
        unmuted = true;
        vslVideo.muted = false;
        vslVideo.currentTime = 0; // Começa do início com áudio limpo
        vslVideo.volume = 1;
        vslVideo.play();
        if (vslOverlay) vslOverlay.classList.add("hidden");
      } else {
        // Se já está com som, clique no container pausa/despausa
        if (vslVideo.paused) vslVideo.play();
        else vslVideo.pause();
      }
    };

    if (vslOverlay) {
      vslOverlay.addEventListener("click", unmuteAndPlay);
    }
    vslContainer.addEventListener("click", unmuteAndPlay);

    // Barra de progresso contínua com throttling via requestAnimationFrame
    let progressTicking = false;
    vslVideo.addEventListener("timeupdate", () => {
      if (!progressTicking && vslProgressBar && vslVideo.duration) {
        progressTicking = true;
        requestAnimationFrame(() => {
          const pct = (vslVideo.currentTime / vslVideo.duration) * 100;
          vslProgressBar.style.width = pct + "%";
          progressTicking = false;
        });
      }
    });

// Fullscreen desativado para evitar avanco do video

    // Fim da VSL: ativa apenas a tela final (SEM ROLAR AUTOMATICAMENTE)
    vslVideo.addEventListener("ended", () => {
      if (endScreen) {
        endScreen.classList.remove("hidden");
        endScreen.classList.add("active");
      }
    });

    // Rola para as ofertas APENAS quando o usuario clicar no botao
    if (endScreenBtn) {
      endScreenBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pacotes = document.getElementById("pacotes");
        if (pacotes) {
          pacotes.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }

    if (replayBtn) {
      replayBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (endScreen) {
          endScreen.classList.remove("active");
          endScreen.classList.add("hidden");
        }
        vslVideo.currentTime = 0;
        vslVideo.muted = false;
        vslVideo.play();
      });
    }
  }
});
