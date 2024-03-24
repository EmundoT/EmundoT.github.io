/* ===================================================================
 * Augustine 1.0.0 - Main JS
 *
 *
 * ------------------------------------------------------------------- */

(function (html) {
  "use strict";

  var loadAlternator = 0;

  /* animations
   * -------------------------------------------------- */
  const tl = anime
    .timeline({
      easing: "easeInOutCubic",
      duration: 800,
      autoplay: false,
    })
    .add({
      targets: "#loader",
      opacity: 0,
      duration: 1000,
      begin: function (anim) {
        window.scrollTo(0, 0);
      },
    })
    .add({
      targets: "#preloader",
      opacity: 0,
      complete: function (anim) {
        document.querySelector("#preloader").style.visibility = "hidden";
        document.querySelector("#preloader").style.display = "none";
      },
    })
    .add(
      {
        targets: ".s-header",
        translateY: [-100, 0],
        opacity: [0, 1],
      },
      "-=200"
    )
    .add({
      targets: ".s-intro__bg",
      opacity: [0, 1],
      duration: 1000,
    })
    .add({
      targets: [".animate-on-load"],
      translateY: [100, 0],
      opacity: [0, 1],
      delay: anime.stagger(400),
    });

  /* preloader
   * -------------------------------------------------- */
  const ssPreloader = function () {
    const preloader = document.querySelector("#preloader");
    if (!preloader) return;

    html.classList.add("ss-preload");

    window.addEventListener("load", function () {
      html.classList.remove("ss-preload");
      html.classList.add("ss-loaded");
      tl.play();
    });
  }; // end ssPreloader

  /* mobile menu
   * ---------------------------------------------------- */
  const ssMobileMenu = function () {
    const toggleButton = document.querySelector(".s-header__menu-toggle");
    const mainNavWrap = document.querySelector(".s-header__nav-wrap");
    const siteBody = document.querySelector("body");

    if (!(toggleButton && mainNavWrap)) return;

    toggleButton.addEventListener("click", function (e) {
      e.preventDefault();
      toggleButton.classList.toggle("is-clicked");
      siteBody.classList.toggle("menu-is-open");
    });

    mainNavWrap.querySelectorAll(".s-header__nav a").forEach(function (link) {
      link.addEventListener("click", function (e) {
        // at 900px and below
        if (window.matchMedia("(max-width: 900px)").matches) {
          toggleButton.classList.toggle("is-clicked");
          siteBody.classList.toggle("menu-is-open");
        }
      });
    });

    window.addEventListener("resize", function () {
      // above 900px
      if (window.matchMedia("(min-width: 901px)").matches) {
        if (siteBody.classList.contains("menu-is-open"))
          siteBody.classList.remove("menu-is-open");
        if (toggleButton.classList.contains("is-clicked"))
          toggleButton.classList.remove("is-clicked");
      }
    });
  }; // end ssMobileMenu

  /* sticky header
   * ------------------------------------------------------ */
  const ssStickyHeader = function () {
    const hdr = document.querySelector(".s-header");
    if (!hdr) return;

    // const triggerHeight = window.pageYOffset + hdr.getBoundingClientRect().top;
    const triggerHeight = 1;

    window.addEventListener("scroll", function () {
      let loc = window.scrollY;

      if (loc > triggerHeight) {
        hdr.classList.add("sticky");
      } else {
        hdr.classList.remove("sticky");
      }
    });
  }; // end ssStickyHeader

  /* color picker
   * ------------------------------------------------------ */
  function rgbToHex(r, g, b) {
    r = parseInt(r, 10).toString(16);
    g = parseInt(g, 10).toString(16);
    b = parseInt(b, 10).toString(16);

    if (r.length == 1) r = "0" + r;
    if (g.length == 1) g = "0" + g;
    if (b.length == 1) b = "0" + b;

    return "#" + r + g + b;
  }

  function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  function hexToRgbString(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
          result[3],
          16
        )}`
      : null;
  }

  function setColorGradient(hexColor) {
    let colorGradient = document.getElementById("colorGradient");
    let colorPicker = document.getElementById("colorPicker");
    let spans = colorGradient.getElementsByTagName("span");

    // Define the color picker listener
    let colorPickerListener = function () {
      setColorGradient(this.value);
    };

    // Add the color picker listener
    colorPicker.addEventListener("input", colorPickerListener);

    // Convert the hex color to RGB
    let [r, g, b] = hexColor
      .substr(1)
      .match(/.{2}/g)
      .map((hex) => parseInt(hex, 16));

    // Iterate over the spans
    for (let i = 0; i < spans.length; i++) {
      let factor;

      // Determine the factor based on the position of the span
      if (i < spans.length / 2) {
        factor = 100 - (i << 1) * (150 / spans.length);
      } else {
        factor = ((i - (spans.length >> 1)) << 1) * (150 / spans.length);
      }
      factor = factor < 0 ? 0 : factor > 100 ? 100 : factor;

      // Calculate the RGB values based on the factor
      let rAdjusted = (r * factor) >> 8;
      let gAdjusted = (g * factor) >> 8;
      let bAdjusted = (b * factor) >> 8;

      // Set the background color of the span
      let hexColorAdjusted = `#${(
        (1 << 24) +
        (rAdjusted << 16) +
        (gAdjusted << 8) +
        bAdjusted
      )
        .toString(16)
        .slice(1)}`;
      spans[i].style.backgroundColor = hexColorAdjusted;

      // Set the gradient swatch property
      document.documentElement.style.setProperty(
        `--gradient-swatch${i + 1}`,
        hexColorAdjusted
      );

      // Add a click listener to the span
      spans[i].addEventListener("click", function () {
        let clickedColor = this.style.backgroundColor;
        document.documentElement.style.setProperty("--color-2", clickedColor);
        colorPicker.value = clickedColor;
      });
    }
  }

  const ssColorPicker = function () {
    let colorGradient = document.getElementById("colorGradient");
    let colorPicker = document.getElementById("colorPicker");
    let spans = colorGradient.getElementsByTagName("span");
    let spanCount = Math.floor(window.innerWidth / 25);

    function createColorGradientSpans() {
      colorGradient.innerHTML = ""; // Clear any existing spans

      for (let i = 0; i < spanCount; i++) {
        let span = document.createElement("span");
        span.style.setProperty("--factor", i / (spanCount - 1));
        if (i / (spanCount - 1) <= 0.95) {
          colorGradient.appendChild(span);
        }

        if (i >= Math.floor(spanCount / 2)) {
          span.classList.add("after-picker");
        }

        // Add click event listener to each span
        span.addEventListener("click", function () {
          let opacity = parseFloat(this.style.getPropertyValue("--factor"));
          document.documentElement.style.setProperty("--opacity-2", opacity);
        });
      }

      spans = colorGradient.getElementsByTagName("span");
    }

    function updateColorGradient() {
      let pickedColor = hexToRgb(colorPicker.value);
      let [r, g, b] = [pickedColor.r, pickedColor.g, pickedColor.b];

      document.documentElement.style.setProperty(
        "--color-2-rgb",
        `${r}, ${g}, ${b}`
      );
    }

    function initialize() {
      createColorGradientSpans();

      let rgb = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-2-rgb")
        .trim()
        .split(", ");
      colorPicker.value = rgbToHex(rgb[0], rgb[1], rgb[2]);

      updateColorGradient();

      colorPicker.addEventListener("input", updateColorGradient);
      window.addEventListener("resize", function () {
        spanCount = Math.floor(window.innerWidth / 25);
        createColorGradientSpans();
        updateColorGradient();
      });
    }

    return {
      initialize: initialize,
      setColorGradient: setColorGradient,
    };
  };

  function setColorGradient(hexColor) {
    const colorPicker = ssColorPicker();
    colorPicker.setColorGradient(hexColor);
  }

  /* photoswipe
   * ----------------------------------------------------- */
  const ssPhotoswipe = function () {
    const items = [];
    const pswp = document.querySelectorAll(".pswp")[0];
    const folioItems = document.querySelectorAll(".folio-item");

    if (!(pswp && folioItems)) return;

    folioItems.forEach(function (folioItem) {
      let folio = folioItem;
      let thumbLink = folio.querySelector(".folio-item__thumb-link");
      let title = folio.querySelector(".folio-item__title");
      let caption = folio.querySelector(".folio-item__caption");
      let titleText = "<h4>" + title.innerHTML + "</h4>";
      let captionText = caption.innerHTML;
      let href = thumbLink.getAttribute("href");
      let size = thumbLink.dataset.size.split("x");
      let width = size[0];
      let height = size[1];

      let item = {
        src: href,
        w: width,
        h: height,
      };

      if (caption) {
        item.title = titleText.trim() + captionText.trim();
      }

      items.push(item);
    });

    // bind click event
    folioItems.forEach(function (folioItem, i) {
      let thumbLink = folioItem.querySelector(".folio-item__thumb-link");

      thumbLink.addEventListener("click", function (e) {
        e.preventDefault();

        let options = {
          index: i,
          showHideOpacity: true,
        };

        // initialize PhotoSwipe
        let lightBox = new PhotoSwipe(
          pswp,
          PhotoSwipeUI_Default,
          items,
          options
        );
        lightBox.init();
      });
    });
  }; // end ssPhotoSwipe

  /* animate elements if in viewport
   * ------------------------------------------------------ */
  const ssAnimateOnScroll = function () {
    const blocks = document.querySelectorAll("[data-animate-block]");

    window.addEventListener("scroll", animateOnScroll);

    function animateOnScroll() {
      let scrollY = window.pageYOffset;

      blocks.forEach(function (current) {
        const viewportHeight = window.innerHeight;
        const triggerTop =
          current.offsetTop + viewportHeight * 0.1 - viewportHeight;
        const blockHeight = current.offsetHeight;
        const blockSpace = triggerTop + blockHeight;
        const inView = scrollY > triggerTop && scrollY <= blockSpace;
        const isAnimated = current.classList.contains("ss-animated");

        loadAlternator = loadAlternator === 0 ? 1 : 0;

        if (inView && !isAnimated) {
          anime({
            targets: current.querySelectorAll("[data-animate-el]"),
            opacity: [0, 1],
            translateY: [100, 0],
            translateX: loadAlternator === 0 ? [100, 0] : [-100, 0],
            delay: anime.stagger(200, { start: 200 }),
            duration: 600,
            easing: "easeInOutCubic",
            begin: function (anim) {
              current.classList.add("ss-animated");
            },
          });
        }
      });
    }
  }; // end ssAnimateOnScroll

  /* swiper
   * ------------------------------------------------------ */
  const ssSwiper = function () {
    const mySwiper = new Swiper(".swiper", {
      slidesPerView: 1,
      effect: "slide",
      spaceBetween: 160,
      centeredSlides: true,
      speed: 1000,
      navigation: {
        nextEl: ".testimonial-slider__next",
        prevEl: ".testimonial-slider__prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }; // end ssSwiper

  /* alert boxes
   * ------------------------------------------------------ */
  const ssAlertBoxes = function () {
    const boxes = document.querySelectorAll(".alert-box");

    boxes.forEach(function (box) {
      box.addEventListener("click", function (e) {
        if (e.target.matches(".alert-box__close")) {
          e.stopPropagation();
          e.target.parentElement.classList.add("hideit");

          setTimeout(function () {
            box.style.display = "none";
          }, 500);
        }
      });
    });
  }; // end ssAlertBoxes

  /* back to top
   * ------------------------------------------------------ */
  const ssBackToTop = function () {
    const pxShow = 900;
    const goTopButton = document.querySelector(".ss-go-top");

    if (!goTopButton) return;

    // Show or hide the button
    if (window.scrollY >= pxShow) goTopButton.classList.add("link-is-visible");

    window.addEventListener("scroll", function () {
      if (window.scrollY >= pxShow) {
        if (!goTopButton.classList.contains("link-is-visible"))
          goTopButton.classList.add("link-is-visible");
      } else {
        goTopButton.classList.remove("link-is-visible");
      }
    });
  }; // end ssBackToTop

  /* smoothscroll
   * ------------------------------------------------------ */
  const ssMoveTo = function () {
    const easeFunctions = {
      easeInQuad: function (t, b, c, d) {
        t /= d;
        return c * t * t + b;
      },
      easeOutQuad: function (t, b, c, d) {
        t /= d;
        return -c * t * (t - 2) + b;
      },
      easeInOutQuad: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      },
      easeInOutCubic: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t * t + b;
        t -= 2;
        return (c / 2) * (t * t * t + 2) + b;
      },
    };

    const triggers = document.querySelectorAll(".smoothscroll");

    const moveTo = new MoveTo(
      {
        tolerance: 0,
        duration: 1200,
        easing: "easeInOutCubic",
        container: window,
      },
      easeFunctions
    );

    triggers.forEach(function (trigger) {
      moveTo.registerTrigger(trigger);
    });
  }; // end ssMoveTo

  /* initialize
   * ------------------------------------------------------ */
  (function ssInit() {
    ssPreloader();
    ssMobileMenu();
    ssStickyHeader();
    const colorPicker = ssColorPicker();
    colorPicker.initialize();

    ssPhotoswipe();
    ssAnimateOnScroll();
    ssSwiper();
    ssAlertBoxes();
    ssBackToTop();
    ssMoveTo();
  })();
})(document.documentElement);
