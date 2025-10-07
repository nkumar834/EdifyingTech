// Create floating particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 30;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
                
                // Randomly assign orange or blue color
                if (Math.random() > 0.5) {
                    particle.style.setProperty('--particle-color', '#00B2FF');
                    const before = particle.style.getPropertyValue('--particle-color');
                    particle.style.background = '#00B2FF';
                }
                
                particlesContainer.appendChild(particle);
            }
        }

        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');

        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Active navigation highlighting
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.nav-link');

        function updateActiveNav() {
            const scrollPosition = window.pageYOffset + 100;

            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navItems.forEach(item => item.classList.remove('active'));
                    const currentNav = document.querySelector(`.nav-link[href="#${section.id}"]`);
                    if (currentNav) currentNav.classList.add('active');
                }
            });
        }

        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            updateActiveNav();
        });

        // Initial active nav update
        updateActiveNav();

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Feature tabs functionality
        const tabs = document.querySelectorAll('.tab-item');
        const panels = document.querySelectorAll('.content-panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                
                // Remove active class from all tabs and panels
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding panel
                tab.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });

        // Initialize particles
        createParticles();

        // Text rotation with character animation
        const textSets = document.querySelectorAll('.text-set');
        let currentIndex = 0;
        let isAnimating = false;

        function wrapTextInSpans(element) {
            const text = element.textContent;
            element.innerHTML = text.split('').map((char, i) => 
                `<span class="char" style="animation-delay: ${i * 0.05}s">${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('');
        }

        function animateTextIn(textSet) {
            const glitchText = textSet.querySelector('.glitch-text');
            const subtitle = textSet.querySelector('.subtitle');
            
            // Wrap text in spans for animation
            wrapTextInSpans(glitchText);
            
            // Update data attribute for glitch effect
            glitchText.setAttribute('data-text', glitchText.textContent);
            
            // Show subtitle after main text
            setTimeout(() => {
                subtitle.classList.add('visible');
            }, 800);
        }

        function animateTextOut(textSet) {
            const chars = textSet.querySelectorAll('.char');
            const subtitle = textSet.querySelector('.subtitle');
            
            // Animate characters out
            chars.forEach((char, i) => {
                char.style.animationDelay = `${i * 0.02}s`;
                char.classList.add('out');
            });
            
            // Hide subtitle
            subtitle.classList.remove('visible');
        }

        function rotateText() {
            if (isAnimating) return;
            isAnimating = true;

            const currentSet = textSets[currentIndex];
            const nextIndex = (currentIndex + 1) % textSets.length;
            const nextSet = textSets[nextIndex];

            // Animate out current text
            animateTextOut(currentSet);

            // After out animation, switch sets
            setTimeout(() => {
                currentSet.classList.remove('active');
                nextSet.classList.add('active');
                animateTextIn(nextSet);
                
                currentIndex = nextIndex;
                isAnimating = false;
            }, 600);
        }

        // Initialize first text set
        textSets[0].classList.add('active');
        animateTextIn(textSets[0]);

        // Start rotation after initial display
        setTimeout(() => {
            setInterval(rotateText, 5000); // Change every 5 seconds
        }, 4000);

        // Add random glitch effect
        setInterval(() => {
            const glitchTexts = document.querySelectorAll('.glitch-text');
            glitchTexts.forEach(text => {
                if (Math.random() > 0.95) {
                    text.style.animation = 'none';
                    setTimeout(() => {
                        text.style.animation = '';
                    }, 200);
                }
            });
        }, 3000);

        document.addEventListener('DOMContentLoaded', function() {
            const images = document.querySelectorAll('.carousel-img');
            const leftBtn = document.getElementById('carouselLeft');
            const rightBtn = document.getElementById('carouselRight');
            let current = 2; // Start with the middle image

            function updateCarousel() {
                images.forEach((img, i) => {
                    img.classList.remove('active', 'left', 'right', 'far-left', 'far-right');
                    if (i === current) img.classList.add('active');
                    else if (i === (current - 1 + images.length) % images.length) img.classList.add('left');
                    else if (i === (current + 1) % images.length) img.classList.add('right');
                    else if (i === (current - 2 + images.length) % images.length) img.classList.add('far-left');
                    else if (i === (current + 2) % images.length) img.classList.add('far-right');
                });
            }

            leftBtn.addEventListener('click', () => {
                current = (current - 1 + images.length) % images.length;
                updateCarousel();
            });

            rightBtn.addEventListener('click', () => {
                current = (current + 1) % images.length;
                updateCarousel();
            });

            // Gesture support
            let startX = null;
            let isDragging = false;

            const track = document.querySelector('.carousel-track');

            // Touch events
            track.addEventListener('touchstart', function(e) {
                startX = e.touches[0].clientX;
                isDragging = true;
            });

            track.addEventListener('touchmove', function(e) {
                if (!isDragging) return;
                let diff = e.touches[0].clientX - startX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        current = (current - 1 + images.length) % images.length;
                    } else {
                        current = (current + 1) % images.length;
                    }
                    updateCarousel();
                    isDragging = false;
                }
            });

            track.addEventListener('touchend', function() {
                isDragging = false;
                startX = null;
            });

            // Mouse drag events (desktop)
            track.addEventListener('mousedown', function(e) {
                startX = e.clientX;
                isDragging = true;
            });

            track.addEventListener('mousemove', function(e) {
                if (!isDragging) return;
                let diff = e.clientX - startX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        current = (current - 1 + images.length) % images.length;
                    } else {
                        current = (current + 1) % images.length;
                    }
                    updateCarousel();
                    isDragging = false;
                }
            });

            track.addEventListener('mouseup', function() {
                isDragging = false;
                startX = null;
            });

            track.addEventListener('mouseleave', function() {
                isDragging = false;
                startX = null;
            });

            updateCarousel();
        });

        // Contact Form Functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Check if EmailJS is loaded
            if (typeof emailjs === 'undefined') {
                console.error('EmailJS is not loaded! Make sure the script is included in HTML.');
                return;
            } else {
                console.log('EmailJS is loaded successfully');
            }

            const contactForm = document.getElementById('contactForm');
            if (!contactForm) {
                console.error('Contact form not found!');
                return;
            }

            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;

            // Simple notification function
            function showNotification(message, type = 'success') {
                // Remove existing notifications
                const existingNotification = document.querySelector('.form-notification');
                if (existingNotification) {
                    existingNotification.remove();
                }

                const notification = document.createElement('div');
                notification.className = `form-notification ${type}`;
                notification.innerHTML = `
                    <div class="notification-content">
                        <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
                        <span class="notification-message">${message}</span>
                        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
                    </div>
                `;
                
                // Insert notification before the form
                contactForm.parentNode.insertBefore(notification, contactForm);
                
                // Auto-remove after 5 seconds
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 5000);
            }

            // Loading state function
            function setLoadingState(loading) {
                if (loading) {
                    submitBtn.innerHTML = `
                        <span class="loading-spinner"></span>
                        Sending...
                    `;
                    submitBtn.disabled = true;
                } else {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }
            }

            // Main form submission handler
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                console.log('Form submission started...');
                
                // Get form values directly from inputs
                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const subject = document.getElementById('subject').value.trim();
                const message = document.getElementById('message').value.trim();
                
                console.log('Form values:', { name, email, subject, message });
                
                // Simple validation
                if (!name || name.length < 2) {
                    showNotification('Please enter a valid name (at least 2 characters)', 'error');
                    return;
                }
                
                if (!email || !email.includes('@') || !email.includes('.')) {
                    showNotification('Please enter a valid email address', 'error');
                    return;
                }
                
                if (!subject || subject.length < 3) {
                    showNotification('Please enter a subject (at least 3 characters)', 'error');
                    return;
                }
                
                if (!message || message.length < 5) {
                    showNotification('Please enter a message (at least 5 characters)', 'error');
                    return;
                }

                console.log('Validation passed, sending email...');
                setLoadingState(true);

                try {
                    // Initialize EmailJS
                    console.log('Initializing EmailJS with key: XDjsAsSSH82Fc4z4C');
                    emailjs.init("XDjsAsSSH82Fc4z4C");
                    
                    const emailData = {
                        from_name: name,
                        from_email: email,
                        subject: subject,
                        message: message,
                        to_email: 'skniraj7494@gmail.com',
                        reply_to: email
                    };
                    
                    console.log('Sending email with data:', emailData);
                    console.log('Using service: service_jewg9sp');
                    console.log('Using NEW template: template_c55f9gc');
                    
                    const result = await emailjs.send(
                        'service_jewg9sp',
                        'template_c55f9gc',
                        emailData
                    );
                    
                    console.log('Email sent successfully:', result);
                    console.log('Result status:', result.status);
                    console.log('Result text:', result.text);
                    
                    showNotification('Thank you for your message! We will get back to you soon.', 'success');
                    contactForm.reset();
                    
                    console.log('Email sent successfully:', result);
                    console.log('Result status:', result.status);
                    console.log('Result text:', result.text);
                    
                    showNotification('Thank you for your message! We will get back to you soon.', 'success');
                    contactForm.reset();
                    
                } catch (error) {
                    console.error('Full error object:', error);
                    console.error('Error message:', error.message);
                    console.error('Error status:', error.status);
                    console.error('Error text:', error.text);
                    
                    let errorMsg = 'Sorry, there was an error sending your message. ';
                    
                    if (error.status === 400) {
                        errorMsg += 'Please check your EmailJS configuration.';
                    } else if (error.status === 401) {
                        errorMsg += 'EmailJS authentication failed.';
                    } else if (error.status === 402) {
                        errorMsg += 'EmailJS quota exceeded.';
                    } else if (error.status === 403) {
                        errorMsg += 'EmailJS access forbidden.';
                    } else if (error.status === 404) {
                        errorMsg += 'EmailJS service or template not found.';
                    } else {
                        errorMsg += 'Please try again or contact us directly.';
                    }
                    
                    showNotification(errorMsg, 'error');
                } finally {
                    setLoadingState(false);
                }
            });
        });