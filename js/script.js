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
    const servicesView = document.getElementById('view-services');
    const projectsView = document.getElementById('view-projects');
    const careersView = document.getElementById('view-careers');
    const aboutView = document.getElementById('view-about');
    const linkHome = document.getElementById('link-home');
    const linkCareers = document.getElementById('link-careers');
    const linkAbout = document.getElementById('link-about');
    const linkServices = document.getElementById('link-services');
    const linkProjects = document.getElementById('link-projects');
    const linkContact = document.getElementById('link-contact');
    const allNavLinks = [linkHome, linkAbout, linkServices, linkProjects, linkCareers, linkContact];

    const menuToggle = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');
    const navBackdrop = document.getElementById('nav-backdrop');
    const header = document.getElementById('main-header');
    const scrollProgress = document.getElementById('nav-scroll-progress');

    function setActiveNavLink(targetLink) {
        allNavLinks.forEach(link => {
            if (link) link.classList.remove('active-link');
        });
        if (targetLink) targetLink.classList.add('active-link');
    }

    function setMobileMenuState(isOpen) {
        if (!navList || !menuToggle) return;
        navList.classList.toggle('active', isOpen);
        menuToggle.classList.toggle('is-active', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        if (navBackdrop) navBackdrop.classList.toggle('active', isOpen);
        document.body.classList.toggle('nav-open', isOpen);
    }

    function closeMobileMenu() {
        setMobileMenuState(false);
    }

    function switchView(viewName, sectionId = null, updateHash = true) {
        // Hide all views
        [homeView, servicesView, projectsView, careersView, aboutView].forEach(view => {
            if (view) view.classList.add('hidden');
        });

        // Show selected view & highlight active nav link
        if (viewName === 'home' && homeView) {
            homeView.classList.remove('hidden');
            if (sectionId === 'services') {
                setActiveNavLink(linkServices);
            } else if (sectionId === 'projects') {
                setActiveNavLink(linkProjects);
            } else if (sectionId === 'contact') {
                setActiveNavLink(linkContact);
            } else {
                setActiveNavLink(linkHome);
            }
        } else if (viewName === 'services' && servicesView) {
            servicesView.classList.remove('hidden');
            setActiveNavLink(linkServices);
        } else if (viewName === 'projects' && projectsView) {
            projectsView.classList.remove('hidden');
            setActiveNavLink(linkProjects);
        } else if (viewName === 'careers' && careersView) {
            careersView.classList.remove('hidden');
            setActiveNavLink(linkCareers);
        } else if (viewName === 'about' && aboutView) {
            aboutView.classList.remove('hidden');
            setActiveNavLink(linkAbout);
        }

        // Close mobile drawer if open
        closeMobileMenu();

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
        } else if (hash === 'services') {
            switchView('services', null, false);
        } else if (hash === 'projects') {
            switchView('projects', null, false);
        } else if (hash === 'careers') {
            switchView('careers', null, false);
        } else if (['stats', 'contact'].includes(hash)) {
            switchView('home', hash, false);
        } else {
            switchView('home', null, false);
        }
    }

    // Initialize route on page load
    handleHashRouting();

    // Mobile drawer toggle, backdrop, Escape key, and desktop resize reset
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            const isOpen = !navList.classList.contains('active');
            setMobileMenuState(isOpen);
        });
    }

    if (navBackdrop) {
        navBackdrop.addEventListener('click', closeMobileMenu);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navList && navList.classList.contains('active')) {
            closeMobileMenu();
            if (menuToggle) menuToggle.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900 && navList && navList.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // 3. Header Sticky, Scroll Progress & Scroll-Spy
    const homeSections = [
        { id: 'home', link: linkHome },
        { id: 'services', link: linkServices },
        { id: 'projects', link: linkProjects },
        { id: 'contact', link: linkContact }
    ];

    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Scroll progress bar
        if (scrollProgress) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100)) : 0;
            scrollProgress.style.width = `${pct}%`;
        }

        // Scroll-spy for home view sections
        if (homeView && !homeView.classList.contains('hidden')) {
            const headerHeight = header ? header.offsetHeight + 40 : 120;
            const scrollPos = window.scrollY + headerHeight;
            let activeSectionLink = linkHome;

            for (const sec of homeSections) {
                const el = document.getElementById(sec.id);
                if (el && el.offsetTop <= scrollPos) {
                    activeSectionLink = sec.link;
                }
            }
            setActiveNavLink(activeSectionLink);
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

    window.toggleExperienceRecord = function () {
        const wrap = document.getElementById('experience-record-wrap');
        const btn = document.getElementById('toggle-exp-btn');
        if (!wrap) return;
        const isHidden = wrap.classList.toggle('hidden');
        if (btn) {
            btn.innerHTML = isHidden
                ? '<i class="fas fa-clipboard-list" style="margin-right: 8px;"></i> View Complete Experience Record (23 Projects)'
                : '<i class="fas fa-chevron-up" style="margin-right: 8px;"></i> Hide Experience Record (23 Projects)';
        }
        if (!isHidden) {
            wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    // 5c. Experience Record Search & Work-Type Filter
    const expSearchInput = document.getElementById('exp-search-input');
    const expTypeFilter = document.getElementById('exp-type-filter');
    function filterExperienceTable() {
        const rows = document.querySelectorAll('#experience-record-wrap tbody tr');
        const query = (expSearchInput ? expSearchInput.value : '').trim().toLowerCase();
        const workType = expTypeFilter ? expTypeFilter.value : 'all';

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const badge = row.querySelector('.work-badge');
            const rowType = badge ? badge.textContent.trim() : '';
            const matchesQuery = !query || text.includes(query);
            const matchesType = workType === 'all' || rowType === workType;
            row.style.display = (matchesQuery && matchesType) ? '' : 'none';
        });
    }
    if (expSearchInput) expSearchInput.addEventListener('input', filterExperienceTable);
    if (expTypeFilter) expTypeFilter.addEventListener('change', filterExperienceTable);

    // 5d. Dedicated Projects Page Filter & Search
    const projPageFilterBtns = document.querySelectorAll('#projects-page-filters .filter-btn');
    const projPageSearch = document.getElementById('projects-page-search');
    let activeProjPageCat = 'all';

    function filterProjectsPageCards() {
        const cards = document.querySelectorAll('#projects-all-grid .project-record-card');
        const q = (projPageSearch ? projPageSearch.value : '').trim().toLowerCase();
        cards.forEach(card => {
            const cat = card.getAttribute('data-proj-cat') || '';
            const text = card.textContent.toLowerCase();
            const matchCat = activeProjPageCat === 'all' || cat === activeProjPageCat;
            const matchQuery = !q || text.includes(q);
            card.style.display = (matchCat && matchQuery) ? '' : 'none';
        });
    }

    projPageFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            projPageFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeProjPageCat = btn.getAttribute('data-proj-filter') || 'all';
            filterProjectsPageCards();
        });
    });

    if (projPageSearch) {
        projPageSearch.addEventListener('input', filterProjectsPageCards);
    }

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
                showToast('Network Error', 'Could not reach server. Please email us directly at info@bhagatgroupconstruction.com.np', true);
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

    // 11b. Office Map Switcher (Head Office vs Branch Office)
    window.switchOfficeMap = function (office, btn) {
        const iframe = document.getElementById('office-map-iframe');
        if (!iframe) return;
        const mapUrls = {
            kathmandu: 'https://maps.google.com/maps?q=New%20Baneshwor-10,%20Kathmandu,%20Nepal&t=&z=15&ie=UTF8&iwloc=&output=embed',
            bardibas: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3487.89279581781!2d85.8923315758535!3d26.98714031666666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ec730070849ad5%3A0xb88187576762c4f9!2sBhagat%20Group%20of%20Construction!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus'
        };
        if (mapUrls[office]) {
            iframe.src = mapUrls[office];
        }
        document.querySelectorAll('.map-tab').forEach(tab => tab.classList.remove('active'));
        if (btn) btn.classList.add('active');
    };

    // 11c. Careers Role Pre-select & Scroll to Application Form
    window.applyForRole = function (roleName) {
        const selectEl = document.getElementById('career-expertise');
        if (selectEl) {
            selectEl.value = roleName;
        }
        const formSection = document.getElementById('apply-form');
        if (formSection) {
            const headerHeight = header ? header.offsetHeight : 80;
            const y = formSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    // 12. Hero Architectural Construction Motion Graphics
    function initHeroConstructionGraphics() {
        const canvas = document.getElementById('hero-construction-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let width = 0;
        let height = 0;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let animId = null;
        let isVisible = true;
        const cycleDuration = 18000; // 18s continuous construction loop
        let startTime = performance.now();

        const sparks = Array.from({ length: 28 }, (_, i) => ({
            seed: i * 1.37,
            xOffset: (Math.sin(i * 7.3) * 0.5),
            speed: 0.4 + (i % 5) * 0.18,
            size: 1.2 + (i % 3) * 0.8
        }));

        function resize() {
            const rect = canvas.getBoundingClientRect();
            width = rect.width || window.innerWidth;
            height = rect.height || window.innerHeight;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function drawBlueprintGrid(groundY) {
            ctx.save();
            ctx.strokeStyle = 'rgba(130, 195, 255, 0.12)';
            ctx.lineWidth = 1;
            const step = 48;
            for (let x = 0; x < width; x += step) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, groundY);
                ctx.stroke();
            }
            for (let y = groundY; y > 0; y -= step) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Ground horizon line
            const grad = ctx.createLinearGradient(0, groundY, width, groundY);
            grad.addColorStop(0, 'rgba(197, 160, 89, 0.25)');
            grad.addColorStop(0.5, 'rgba(230, 197, 132, 0.85)');
            grad.addColorStop(1, 'rgba(197, 160, 89, 0.25)');
            ctx.strokeStyle = grad;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, groundY);
            ctx.lineTo(width, groundY);
            ctx.stroke();
            ctx.restore();
        }

        function drawBuilding(x, groundY, bWidth, floors, floorH, progress, accentGold) {
            const exactFloors = progress * floors;
            const completedFloors = Math.floor(exactFloors);
            const activeFrac = exactFloors - completedFloors;
            const cols = 4;
            const colGap = bWidth / cols;

            ctx.save();

            // Foundation plinth
            ctx.fillStyle = 'rgba(18, 56, 98, 0.95)';
            ctx.strokeStyle = 'rgba(230, 197, 132, 0.85)';
            ctx.lineWidth = 2;
            ctx.fillRect(x - 10, groundY - 14, bWidth + 20, 14);
            ctx.strokeRect(x - 10, groundY - 14, bWidth + 20, 14);

            const baseTop = groundY - 14;

            // Draw completed and active floors
            const visibleFloors = Math.min(floors, completedFloors + 1);
            for (let f = 0; f < visibleFloors; f++) {
                const isCurrent = f === completedFloors && completedFloors < floors;
                const hScale = isCurrent ? Math.min(1, activeFrac * 1.25) : 1;
                const fy = baseTop - (f + 1) * floorH;
                const drawH = floorH * hScale;
                const drawTop = baseTop - f * floorH - drawH;

                // Structural core & glass fill
                ctx.fillStyle = isCurrent
                    ? `rgba(230, 197, 132, ${0.18 + 0.16 * hScale})`
                    : 'rgba(16, 56, 98, 0.82)';
                ctx.fillRect(x, drawTop, bWidth, drawH);

                // Steel/RCC frame outline
                ctx.strokeStyle = isCurrent
                    ? 'rgba(255, 224, 150, 0.98)'
                    : 'rgba(160, 212, 255, 0.52)';
                ctx.lineWidth = isCurrent ? 2 : 1.25;
                ctx.strokeRect(x, drawTop, bWidth, drawH);

                // Vertical structural columns
                for (let c = 1; c < cols; c++) {
                    const cx = x + c * colGap;
                    ctx.beginPath();
                    ctx.moveTo(cx, baseTop - f * floorH);
                    ctx.lineTo(cx, drawTop);
                    ctx.stroke();
                }

                // Cross bracing on active or top-2 floors
                if (isCurrent || f >= completedFloors - 1) {
                    ctx.strokeStyle = 'rgba(230, 197, 132, 0.55)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(x, baseTop - f * floorH);
                    ctx.lineTo(x + colGap, drawTop);
                    ctx.moveTo(x + bWidth, baseTop - f * floorH);
                    ctx.lineTo(x + bWidth - colGap, drawTop);
                    ctx.stroke();
                }

                // Glowing architectural windows on completed floors
                if (!isCurrent) {
                    for (let c = 0; c < cols; c++) {
                        const wx = x + c * colGap + 5;
                        const ww = colGap - 10;
                        const wy = fy + 5;
                        const wh = floorH - 10;
                        if (ww > 4 && wh > 4) {
                            const lit = ((f * 3 + c * 5) % 3 === 0);
                            ctx.fillStyle = lit
                                ? (accentGold ? 'rgba(230, 197, 132, 0.58)' : 'rgba(140, 215, 255, 0.42)')
                                : 'rgba(140, 205, 255, 0.18)';
                            ctx.fillRect(wx, wy, ww, wh);
                        }
                    }
                }
            }

            // Active top floor height for crane/sparks reference
            const currentTopY = baseTop - Math.min(floors, exactFloors) * floorH;
            ctx.restore();
            return currentTopY;
        }

        function drawTowerCrane(craneX, groundY, mastHeight, jibLen, targetX, targetY, timeSec) {
            ctx.save();
            const topY = groundY - mastHeight;
            const mastW = 16;

            // Mast lattice
            ctx.strokeStyle = 'rgba(230, 197, 132, 0.85)';
            ctx.lineWidth = 1.8;
            ctx.strokeRect(craneX - mastW / 2, topY, mastW, mastHeight);
            for (let y = groundY; y > topY; y -= 18) {
                ctx.beginPath();
                ctx.moveTo(craneX - mastW / 2, y);
                ctx.lineTo(craneX + mastW / 2, y - 18);
                ctx.moveTo(craneX + mastW / 2, y);
                ctx.lineTo(craneX - mastW / 2, y - 18);
                ctx.stroke();
            }

            // Operator cab & peak
            ctx.fillStyle = '#e6c584';
            ctx.fillRect(craneX - 11, topY - 13, 22, 13);

            // Peak triangle
            ctx.beginPath();
            ctx.moveTo(craneX - 9, topY - 13);
            ctx.lineTo(craneX, topY - 38);
            ctx.lineTo(craneX + 9, topY - 13);
            ctx.stroke();

            // Jib & Counter-jib
            const dir = targetX < craneX ? -1 : 1;
            const jibTipX = craneX + dir * jibLen;
            const counterTipX = craneX - dir * (jibLen * 0.34);

            ctx.strokeStyle = '#f5d996';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(counterTipX, topY - 11);
            ctx.lineTo(jibTipX, topY - 11);
            ctx.stroke();

            // Support cables from peak
            ctx.strokeStyle = 'rgba(245, 217, 150, 0.65)';
            ctx.lineWidth = 1.25;
            ctx.beginPath();
            ctx.moveTo(craneX, topY - 38);
            ctx.lineTo(jibTipX * 0.85 + craneX * 0.15, topY - 11);
            ctx.moveTo(craneX, topY - 38);
            ctx.lineTo(counterTipX, topY - 11);
            ctx.stroke();

            // Counterweight
            ctx.fillStyle = '#c5a059';
            ctx.fillRect(counterTipX - 11, topY - 9, 22, 15);

            // Moving trolley & hoist cable
            const sweep = 0.5 + 0.45 * Math.sin(timeSec * 0.9);
            const trolleyX = craneX + dir * (jibLen * (0.25 + sweep * 0.62));
            const hookY = Math.min(targetY - 16, topY + 28 + (Math.cos(timeSec * 1.2) + 1) * 26);

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(trolleyX - 7, topY - 11, 14, 8);

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(trolleyX, topY - 3);
            ctx.lineTo(trolleyX, hookY);
            ctx.stroke();

            // Suspended glowing steel beam
            ctx.strokeStyle = '#ffdf8e';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(trolleyX - 24, hookY);
            ctx.lineTo(trolleyX + 24, hookY);
            ctx.stroke();

            ctx.restore();
        }

        function drawSparks(cx, cy, timeSec) {
            ctx.save();
            for (const s of sparks) {
                const life = ((timeSec * s.speed + s.seed) % 1);
                const sx = cx + s.xOffset * 110 + Math.sin(timeSec * 2 + s.seed) * 14;
                const sy = cy - 6 + life * 48;
                const alpha = (1 - life) * 0.75;
                ctx.fillStyle = `rgba(230, 197, 132, ${alpha})`;
                ctx.beginPath();
                ctx.arc(sx, sy, s.size * (1 - life * 0.4), 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        function render(now) {
            if (!isVisible) {
                animId = null;
                return;
            }
            const elapsed = prefersReducedMotion ? cycleDuration * 0.72 : ((now - startTime) % cycleDuration);
            const tNorm = elapsed / cycleDuration;
            const timeSec = elapsed / 1000;

            // Build up smoothly from 0.12 to 1.0, hold briefly, then fade out at end of cycle
            let buildProgress = Math.min(1, 0.12 + tNorm * 1.05);
            let sceneAlpha = 1;
            if (!prefersReducedMotion && tNorm > 0.9) {
                sceneAlpha = Math.max(0, 1 - (tNorm - 0.9) / 0.1);
            } else if (!prefersReducedMotion && tNorm < 0.05) {
                sceneAlpha = tNorm / 0.05;
            }

            ctx.clearRect(0, 0, width, height);
            const groundY = height * 0.88;

            drawBlueprintGrid(groundY);

            ctx.save();
            ctx.globalAlpha = sceneAlpha;

            const isNarrow = width < 768;
            const rightBWidth = isNarrow ? width * 0.34 : Math.min(230, width * 0.19);
            const rightX = width - rightBWidth - (isNarrow ? 18 : width * 0.06);
            const floorH = isNarrow ? 26 : 32;
            const rightTopY = drawBuilding(rightX, groundY, rightBWidth, 11, floorH, buildProgress, true);

            // Left secondary building
            const leftBWidth = isNarrow ? width * 0.28 : Math.min(185, width * 0.15);
            const leftX = isNarrow ? 14 : width * 0.055;
            const leftProgress = Math.min(1, buildProgress * 1.15);
            drawBuilding(leftX, groundY, leftBWidth, 8, floorH - 2, leftProgress, false);

            // Tower crane beside the right building
            const craneX = rightX - (isNarrow ? 18 : 34);
            const mastH = Math.min(height * 0.74, 420);
            const jibLen = rightBWidth + (isNarrow ? 30 : 75);
            drawTowerCrane(craneX, groundY, mastH, jibLen, rightX + rightBWidth * 0.5, rightTopY, timeSec);

            if (!prefersReducedMotion) {
                drawSparks(rightX + rightBWidth * 0.5, rightTopY, timeSec);
            }

            ctx.restore();

            if (!prefersReducedMotion) {
                animId = requestAnimationFrame(render);
            }
        }

        resize();
        window.addEventListener('resize', () => {
            resize();
            if (prefersReducedMotion) render(performance.now());
        });

        const heroEl = document.getElementById('home');
        if (heroEl && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                isVisible = entries[0].isIntersecting;
                if (isVisible && !animId && !prefersReducedMotion) {
                    animId = requestAnimationFrame(render);
                }
            }, { threshold: 0.05 });
            observer.observe(heroEl);
        }

        animId = requestAnimationFrame(render);
    }

    initHeroConstructionGraphics();
});
