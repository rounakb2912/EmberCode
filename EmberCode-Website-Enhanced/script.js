const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.querySelector('#year').textContent = new Date().getFullYear();

const form = document.querySelector('#contact-form');
const feedback = document.querySelector('#form-feedback');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  feedback.classList.remove('error');

  if (!form.checkValidity()) {
    form.reportValidity();
    feedback.textContent = 'Please complete the required fields with valid information.';
    feedback.classList.add('error');
    return;
  }

  const data = new FormData(form);
  const firstName = String(data.get('firstName') || '').trim();
  const lastName = String(data.get('lastName') || '').trim();
  const email = String(data.get('email') || '').trim();
  const service = String(data.get('service') || '').trim();
  const message = String(data.get('message') || '').trim();

  // Front-end demo: opens the visitor's email app. Replace this with a backend
  // endpoint or form service before publishing for real lead collection.
  const subject = encodeURIComponent(`New EmberCode enquiry — ${service}`);
  const body = encodeURIComponent(
    `Name: ${firstName} ${lastName}\nEmail: ${email}\nService: ${service}\n\nMessage:\n${message}`
  );

  feedback.textContent = 'Opening your email app to send this enquiry…';
  window.location.href = `mailto:hello@embercode.example?subject=${subject}&body=${body}`;
});


// Cinematic showreel: gracefully falls back to the animated artwork if no MP4 is installed.
const video = document.querySelector('#showreel-video');
const videoFrame = document.querySelector('.video-frame');
const videoButton = document.querySelector('#video-play');
const progress = document.querySelector('#video-progress');

if (video && videoFrame && videoButton) {
  video.addEventListener('loadeddata', () => videoFrame.classList.add('has-video'));
  video.addEventListener('timeupdate', () => {
    if (video.duration && progress) {
      progress.style.width = `${(video.currentTime / video.duration) * 100}%`;
    }
  });
  video.addEventListener('ended', () => {
    videoFrame.classList.remove('is-playing');
    videoButton.setAttribute('aria-pressed', 'false');
  });
  videoButton.addEventListener('click', async () => {
    if (video.paused) {
      try {
        await video.play();
        videoFrame.classList.add('is-playing', 'has-video');
        videoButton.setAttribute('aria-pressed', 'true');
        videoButton.setAttribute('aria-label', 'Pause showreel');
      } catch {
        const feedback = document.createElement('span');
        feedback.className = 'video-hint';
        feedback.textContent = 'Add assets/embercode-showreel.mp4 to play your brand film.';
        videoFrame.appendChild(feedback);
        window.setTimeout(() => feedback.remove(), 3500);
      }
    } else {
      video.pause();
      videoFrame.classList.remove('is-playing');
      videoButton.setAttribute('aria-pressed', 'false');
      videoButton.setAttribute('aria-label', 'Play showreel');
    }
  });
}
