/**
 * BHAGAT GROUP OF CONSTRUCTION - APPLICATION SCRIPT
 * Enhanced Navigation, UI Interactivity & AJAX Form Handling
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader Logic
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 600);
        });
        // Fallback safety timeout if load event took too long
        setTimeout(() => {
            if (preloader.style.display !== 'none') {
                preloader.style.opacity = '0';
                setTimeout(() => { preloader.style.display = 'none'; }, 500);
            }
        }, 3000);
    }

    // 2. Navigation & Hash-based Routing
    const homeView = document.getElementById('view-home');
    const careersView = document.getElementById('view-careers');
    const aboutView = document.getElementById('view-about');
    const linkHome = document.getElementById('link-home');
    const linkCareers = document.getElementById('link-careers');
    const linkAbout = document.getElementById('link-about');
    const menuToggle = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');
    const header = document.getElementById('main-header');

    function switchView(viewName, sectionId = null, updateHash = true) {
        // Hide all views
        [homeView, careersView, aboutView].forEach(view => {
            if (view) view.classList.add('hidden');
        });

        // Remove active class from all top links
        [linkHome, linkCareers, linkAbout].forEach(link => {
            if (link) link.classList.remove('active-link');
        });

        // Show selected view
        if (viewName === 'home' && homeView) {
            homeView.classList.remove('hidden');
            if (linkHome) linkHome.classList.add('active-link');
        } else if (viewName === 'careers' && careersView) {
            careersView.classList.remove('hidden');
            if (linkCareers) linkCareers.classList.add('active-link');
        } else if (viewName === 'about' && aboutView) {
            aboutView.classList.remove('hidden');
            if (linkAbout) linkAbout.classList.add('active-link');
        }

        // Close mobile menu if open
        if (navList && navList.classList.contains('active')) {
            navList.classList.remove('active');
        }

        // Handle scrolling & Hash
        if (sectionId) {
            if (updateHash) {
                history.pushState(null, '', `#${sectionId}`);
            }
            setTimeout(() => {
                const el = document.getElementById(sectionId);
                if (el) {
                    const headerHeight = header ? header.offsetHeight : 80;
                    const elPos = el.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({ top: elPos, behavior: 'smooth' });
                }
            }, 120);
        } else {
            if (updateHash) {
                history.pushState(null, '', `#${viewName}`);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Make switchView accessible globally
    window.switchView = switchView;

    // Handle back/forward navigation using hashchange
    window.addEventListener('popstate', handleHashRouting);

    function handleHashRouting() {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        if (hash === 'about') {
            switchView('about', null, false);
        } else if (hash === 'careers') {
            switchView('careers', null, false);
        } else if (['services', 'projects', 'stats', 'contact'].includes(hash)) {
            switchView('home', hash, false);
        } else {
            switchView('home', null, false);
        }
    }

    // Initialize route on page load
    handleHashRouting();

    // Mobile menu toggle
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }

    // 3. Header Sticky & Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button visibility
        const backToTopBtn = document.getElementById('back-to-top');
        if (backToTopBtn) {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    });

    // Back to top click handler
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 4. Stats Counter Animation
    const statsSection = document.getElementById('stats');
    let statsAnimated = false;

    function animateCounter(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                document.querySelectorAll('.stat-number').forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const speed = 120;
                    const updateCount = () => {
                        const current = +counter.innerText;
                        const increment = Math.ceil(target / speed) || 1;
                        if (current < target) {
                            counter.innerText = Math.min(current + increment, target);
                            setTimeout(updateCount, 15);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                });
                statsAnimated = true;
                observer.unobserve(entry.target);
            }
        });
    }

    if (statsSection && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(animateCounter, { threshold: 0.3 });
        observer.observe(statsSection);
    } else {
        document.querySelectorAll('.stat-number').forEach(c => {
            c.innerText = c.getAttribute('data-target');
        });
    }

    // 5. Portfolio Filtering Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            projectItems.forEach(item => {
                const itemCat = item.getAttribute('data-category');
                if (filterValue === 'all' || itemCat === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => { item.style.display = 'none'; }, 300);
                }
            });
        });
    });

    window.showAllProjects = function () {
        const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (allBtn) allBtn.click();
        const projEl = document.getElementById('projects');
        if (projEl) projEl.scrollIntoView({ behavior: 'smooth' });
    };

    // 5b. Project Details Lightbox Modal
    const projectDetailsData = {
        'simbuwa': {
            title: 'Simbuwa Remit Hydro Project',
            badge: 'Hydropower Civil Works',
            image: 'images/pro1.jpg',
            desc: 'Turnkey civil engineering works for administrative quarters, camp structures, and auxiliary buildings supporting the Simbuwa Remit Hydroelectric installation in demanding mountain terrain.',
            client: 'Simbuwa Remit Hydro Pvt. Ltd.',
            location: 'Taplejung District, Koshi Province',
            scope: 'Site leveling, camp accommodations, staff office building, access civil structures, and utility retention walls.'
        },
        'sukhipur-hospital': {
            title: 'Sukhipur Municipal Hospital',
            badge: 'Healthcare & Public Infrastructure',
            image: 'images/pro2.jpg',
            desc: 'State-of-the-art 15-bed primary municipal hospital engineered with seismic-resistant RCC frames, sanitary plumbing, emergency wards, and modern outpatient blocks.',
            client: 'Sukhipur Municipality, Siraha',
            location: 'Sukhipur, Siraha, Madhesh Province',
            scope: 'Multi-story hospital block construction, specialized medical ward layout, electrification, and sanitation network.'
        },
        'rajbiraj-road': {
            title: 'Interconnected Urban Road Network',
            badge: 'Road Infrastructure',
            image: 'images/pro3.jpg',
            desc: 'Comprehensive rehabilitation, widening, base-course preparation, and asphalt blacktopping across central municipal transit corridors in Rajbiraj.',
            client: 'Rajbiraj Municipality / Department of Roads',
            location: 'Rajbiraj, Saptari, Madhesh Province',
            scope: 'Grading, sub-base preparation, road widening, concrete side drains, and asphalt overlaying.'
        },
        'ear-care': {
            title: 'Ear Care Centre Rajbiraj',
            badge: 'Institutional Healthcare',
            image: 'images/pro4.jpg',
            desc: 'Specialized healthcare and audiology diagnostic centre built in partnership with Impact Nepal, providing specialized clinics and community surgical care.',
            client: 'Impact Nepal',
            location: 'Rajbiraj, Saptari, Madhesh Province',
            scope: 'Specialized clinic rooms, acoustic-insulated testing chambers, consultation halls, and sterile ward zones.'
        },
        'sukhipur-health': {
            title: 'Sukhipur Primary Health Post',
            badge: 'Community Health',
            image: 'images/pro6.jpg',
            desc: 'A vital community health facility providing preventive care, maternity wards, and emergency primary healthcare to surrounding rural communities.',
            client: 'Ministry of Health & Population / Local Municipality',
            location: 'Sukhipur, Siraha, Madhesh Province',
            scope: 'Foundation excavation, RCC superstructure, interior finishing, medical storage rooms, and perimeter fencing.'
        },
        'bardibas-malsc': {
            title: 'Municipal Agricultural & Livestock Service Centre',
            badge: 'Public Institutional Development',
            image: 'images/pro5.jpg',
            desc: 'Under the ECO Bardibas Phase IV development, this institutional complex provides farmer training facilities, animal husbandry clinics, and storage infrastructure.',
            client: 'ECO Bardibas Phase IV / Local Government',
            location: 'Bardibas-01, Mahottari, Madhesh Province',
            scope: 'Multi-functional institutional building, lecture halls, veterinary treatment rooms, and sustainable drainage.'
        }
    };

    let activeModalProjectId = null;

    window.openProjectModal = function (projectId) {
        const data = projectDetailsData[projectId];
        if (!data) return;

        activeModalProjectId = projectId;

        const imgEl = document.getElementById('modal-project-img');
        if (imgEl) {
            imgEl.src = data.image;
            imgEl.alt = data.title;
        }
        const badgeEl = document.getElementById('modal-project-badge');
        if (badgeEl) badgeEl.textContent = data.badge;
        const titleEl = document.getElementById('modal-project-title');
        if (titleEl) titleEl.textContent = data.title;
        const descEl = document.getElementById('modal-project-desc');
        if (descEl) descEl.textContent = data.desc;
        const clientEl = document.getElementById('modal-project-client');
        if (clientEl) clientEl.textContent = data.client;
        const locEl = document.getElementById('modal-project-loc');
        if (locEl) locEl.textContent = data.location;
        const scopeEl = document.getElementById('modal-project-scope');
        if (scopeEl) scopeEl.textContent = data.scope;

        const modal = document.getElementById('project-modal');
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeProjectModal = function () {
        const modal = document.getElementById('project-modal');
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    };

    window.inquireAboutProject = function () {
        const data = activeModalProjectId ? projectDetailsData[activeModalProjectId] : null;
        closeProjectModal();
        switchView('home', 'contact');

        if (data) {
            setTimeout(() => {
                const messageInput = document.getElementById('contact-message');
                if (messageInput) {
                    messageInput.value = `Hello Bhagat Group, I would like to inquire about project execution similar to: "${data.title}" (${data.badge}). Please share details on consultation and bidding.`;
                    messageInput.focus();
                }
            }, 300);
        }
    };

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProjectModal();
            closeToast();
        }
    });

    // 6. Testimonials Slider
    let currentSlide = 0;
    const slides = document.querySelectorAll('.testimonial-item');
    const sliderTrack = document.querySelector('.testimonial-slider');
    const nextBtn = document.getElementById('next-testimonial');
    const prevBtn = document.getElementById('prev-testimonial');

    function updateTestimonialSlider() {
        if (sliderTrack && slides.length > 0) {
            sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateTestimonialSlider();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateTestimonialSlider();
        });
    }

    // Auto rotate every 6 seconds
    if (slides.length > 1) {
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateTestimonialSlider();
        }, 6000);
    }

    // 7. FAQ Accordion Toggle Logic
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentNode;
            const isActive = item.classList.contains('active');

            // Close all other FAQs
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 8. Career CV Upload File Display and Validation
    const cvInput = document.getElementById('cv-file');
    const fileNameDisplay = document.getElementById('file-name-display');

    if (cvInput && fileNameDisplay) {
        cvInput.addEventListener('change', function () {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                const maxSize = 5 * 1024 * 1024; // 5 MB

                if (file.size > maxSize) {
                    showToast('File Too Large', 'Please select a CV smaller than 5MB.', true);
                    this.value = '';
                    fileNameDisplay.textContent = '';
                    return;
                }

                fileNameDisplay.innerHTML = `<i class="fas fa-file-pdf" style="color:var(--accent-gold); margin-right:6px;"></i> Attached: <strong>${file.name}</strong> (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
            }
        });
    }

    // 9. Toast Notification Handler
    function showToast(title, message, isError = false) {
        const toast = document.getElementById('toast-notification');
        const toastTitle = document.getElementById('toast-title');
        const toastMsg = document.getElementById('toast-message');

        if (!toast) return;

        toastTitle.textContent = title;
        toastMsg.textContent = message;

        if (isError) {
            toast.style.borderLeftColor = '#ef4444';
            toast.querySelector('.toast-icon i').className = 'fas fa-exclamation-circle';
            toast.querySelector('.toast-icon').style.color = '#ef4444';
        } else {
            toast.style.borderLeftColor = 'var(--success)';
            toast.querySelector('.toast-icon i').className = 'fas fa-check-circle';
            toast.querySelector('.toast-icon').style.color = 'var(--success)';
        }

        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }

    window.closeToast = function () {
        const toast = document.getElementById('toast-notification');
        if (toast) toast.classList.remove('show');
    };

    // 10. AJAX Form Submission for Contact & Career Forms
    function setupAjaxForm(formId, successTitle, successMsg) {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Check basic HTML validation
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn ? submitBtn.innerHTML : 'Submit';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            }

            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showToast(successTitle, successMsg);
                    form.reset();
                    if (fileNameDisplay) fileNameDisplay.textContent = '';
                } else {
                    const data = await response.json();
                    showToast('Submission Issue', (data && data.message) ? data.message : 'Please check your connection and try again.', true);
                }
            } catch (err) {
                showToast('Network Error', 'Could not reach server. Please email us directly at bhagatgrouppvt@gmail.com', true);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                }
            }
        });
    }

    setupAjaxForm('contact-form', 'Inquiry Sent!', 'Thank you for reaching out. An engineer will review your request and get in touch.');
    setupAjaxForm('career-form', 'Application Received!', 'Thank you for your application. Our recruitment desk will review your profile.');

    // 11. Dynamic Current Year in Footer
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
});
