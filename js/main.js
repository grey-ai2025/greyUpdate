// LOGIN SCRIPT 
// Login function
function login(event) {
    event.preventDefault(); // Prevent form submission

    // Get input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Clear previous error message
    errorMessage.textContent = '';
    errorMessage.classList.remove('hidden');

    // Simple validation (in a real app, this would be done on a server)
    if ((username === 'admin' && password === 'IMB082025') ||
        (username === 'user' && password === 'IMB082025')) {
        // Store login state in local storage (persists after refresh)
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);

        // Show welcome page and hide login form
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('welcomePage').classList.remove('hidden');
        document.getElementById('greeting').textContent = `Hello, ${username}!`;

        errorMessage.classList.add('hidden');
    } else {
        errorMessage.textContent = 'Invalid username or password';
    }
}

// Logout function
function logout() {
    // Clear login state
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');

    // Show login form and hide welcome page
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('welcomePage').classList.add('hidden');

    // Clear the form
    document.getElementById('login').reset();
}

// Check login state on page load
document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');

    // Check if user is logged in
    if (isLoggedIn === 'true' && username) {
        // User is logged in, show welcome page
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('welcomePage').classList.remove('hidden');
    } else {
        // Ensure login form is visible
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('welcomePage').classList.add('hidden');
    }
});


let currentPage = 1;
const totalPages = 10;
let currentMode = 'section'; // 'section' for scrolling sections, 'page' for division pages

// Set current date
const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

document.querySelectorAll('[id^="current-date"]').forEach(el => {
    el.textContent = currentDate;
});

// Function to get score color class based on value
function getScoreClass(score) {
    const numScore = parseInt(score);
    if (numScore <= 30) return 'critical';
    if (numScore <= 45) return 'low';
    if (numScore <= 55) return 'medium-low';
    if (numScore <= 65) return 'medium';
    if (numScore <= 75) return 'medium-high';
    return 'high';
}

// Function to dynamically update sidebar position based on header height
function updateSidebarPosition() {
    const header = document.getElementById('headerWrapper');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarWrapper = document.getElementById('sidebarWrapper');
    const mainContent = document.getElementById('mainContent');

    if (header && sidebarToggle && sidebarWrapper && mainContent) {
        if (window.innerWidth <= 768) {
            const headerHeight = header.offsetHeight;
            const topPosition = headerHeight + 10; // 10px margin

            sidebarToggle.style.top = `${topPosition}px`;
            sidebarWrapper.style.top = `${topPosition}px`;
            sidebarWrapper.style.height = `calc(100vh - ${topPosition}px)`;
            mainContent.style.paddingTop = `${headerHeight}px`;
        } else {
            // Reset styles for larger screens to default
            sidebarToggle.style.top = ''; // Use CSS default
            sidebarWrapper.style.top = ''; // Use CSS default
            sidebarWrapper.style.height = ''; // Use CSS default
            mainContent.style.paddingTop = ''; // Use CSS default
        }
    }
}

// Apply dynamic colors to all score elements
document.addEventListener('DOMContentLoaded', function () {
    // Update score cards
    document.querySelectorAll('.score-card').forEach(card => {
        const scoreText = card.querySelector('h3').textContent;
        const score = parseInt(scoreText);
        if (!isNaN(score)) {
            const scoreClass = getScoreClass(score);
            card.className = 'score-card ' + scoreClass;
        }
    });

    // Sidebar functionality
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarWrapper = document.getElementById('sidebarWrapper');
    const mainContent = document.getElementById('mainContent');
    const toggleIcon = sidebarToggle?.querySelector('i');

    // Toggle sidebar functionality
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            sidebarWrapper.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            sidebarToggle.classList.toggle('collapsed');

            // Change icon
            if (sidebarWrapper.classList.contains('collapsed')) {
                toggleIcon.classList.remove('bi-list');
                toggleIcon.classList.add('bi-arrow-right');
            } else {
                toggleIcon.classList.remove('bi-arrow-right');
                toggleIcon.classList.add('bi-list');
            }
        });
    }

    // Section navigation
    const sectionLinks = document.querySelectorAll('a[data-section]');
    const sections = document.querySelectorAll('.section[id]');
    const headerHeight = 80;

    // Smooth scroll to section when navigation link is clicked
    sectionLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('data-section');
            currentMode = 'section';

            // Hide all division pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });

            scrollToSection(targetId);
        });
    });

    // Update active navigation item based on scroll position
    function updateActiveNavLink(activeId = null) {
        document.querySelectorAll('a[data-section]').forEach(link => {
            link.classList.remove('active');

            const linkId = link.getAttribute('data-section');
            if (activeId === linkId || (!activeId && isElementInViewport(linkId))) {
                link.classList.add('active');
            }
        });
    }

    // Check if element is in viewport
    function isElementInViewport(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        return rect.top <= windowHeight / 3 && rect.bottom >= 0;
    }

    // Update active state on scroll
    let scrollTimeout;
    window.addEventListener('scroll', function () {
        if (currentMode === 'section') {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                let activeSection = null;
                sections.forEach(section => {
                    if (isElementInViewport(section.id)) {
                        activeSection = section.id;
                    }
                });

                if (activeSection) {
                    updateActiveNavLink(activeSection);
                }
            }, 100);
        }
    });

    // Set initial active state
    updateActiveNavLink('about-report');

    // Auto-collapse sidebar on mobile
    if (window.innerWidth < 768) {
        sidebarWrapper.classList.add('collapsed');
        mainContent.classList.add('expanded');
        if (sidebarToggle) {
            sidebarToggle.classList.add('collapsed');
            toggleIcon.classList.remove('bi-list');
            toggleIcon.classList.add('bi-arrow-right');
        }
    }


});

// Update sidebar on window resize
window.addEventListener('load', updateSidebarPosition);
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateSidebarPosition, 100);
});

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = 80;
        const offsetTop = section.offsetTop - headerHeight - 20;

        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });

        updateActiveNavLink(sectionId);
    }
}

function updateActiveNavLink(activeId) {
    document.querySelectorAll('a[data-section]').forEach(link => {
        link.classList.remove('active');

        const linkId = link.getAttribute('data-section');
        if (activeId === linkId) {
            link.classList.add('active');
        }
    });
}



// jsPDF library for PDF generation
async function generatePDF() {
    const { jsPDF } = window.jspdf;

    // Show loading overlay
    const overlay = document.getElementById('pdfOverlay');
    overlay.classList.add('active');

    try {
        // Create new PDF document
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'legal'
        });

        // PDF settings
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pageWidth - (margin * 2);
        let currentPage = 1;

        // Add header function
        const addHeader = (pageNum) => {
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text('GREY Score™ Report - IMB Partners', margin, 10);
            pdf.text(`Page ${pageNum}`, pageWidth - margin - 15, 10);

            // Add a subtle line under header
            pdf.setDrawColor(173, 251, 246);
            pdf.setLineWidth(0.5);
            pdf.line(margin, 15, pageWidth - margin, 15);
        };

        // Hide elements that shouldn't be in PDF
        const elementsToHide = [
            document.getElementById('sidebarWrapper'),
            document.getElementById('sidebarToggle'),
            document.querySelector('.nav-buttons'),
            document.querySelector('.pdf-button'),
            document.querySelector('.logout-btn'),
            document.querySelector('.header-custom')
        ];

        elementsToHide.forEach(el => {
            if (el) el.style.display = 'none';
        });

        // Expand main content
        const mainContent = document.getElementById('mainContent');
        mainContent.style.marginLeft = '0';
        mainContent.style.width = '100%';

        // Add cover page
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');

        // === ADD LOGO USING EMBEDDED BASE64 IMAGE ===
        const imgData = 'data:image/png;base64,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';

        // Image dimensions (adjust as needed)
        const logoWidth = 60;  // mm
        const logoHeight = 60;  // mm (adjust proportionally if needed)

        // Position: centered horizontally
        const x = (pageWidth - logoWidth) / 2;
        const y = 10;  // Adjust to align visually with previous text (was 80)

        // Add the logo image
        pdf.addImage(imgData, 'PNG', x, y, logoWidth, logoHeight);



        // === CONTINUE WITH REST OF TEXT BELOW THE LOGO ===
        pdf.setFontSize(28);
        pdf.setTextColor(0, 0, 0);
        // Skip "GREY Score™" text — already shown as image
        pdf.text('GREY Score™ Report', pageWidth / 2, 95, { align: 'center' });

        pdf.setFontSize(18);
        pdf.setTextColor(67, 67, 67);
        pdf.text('IMB Partners', pageWidth / 2, 115, { align: 'center' });

        pdf.setFontSize(14);
        pdf.text('August 2025', pageWidth / 2, 130, { align: 'center' });

        // Overall Score Box with Rounded Corners
        const boxX = pageWidth / 2 - 40;  // x position
        const boxY = 150;                  // y position
        const boxWidth = 80;               // width
        const boxHeight = 50;              // height
        const cornerRadius = 10;           // radius for rounded corners

        pdf.setFillColor(173, 251, 246);   // light cyan background
        pdf.roundedRect(boxX, boxY, boxWidth, boxHeight, cornerRadius, cornerRadius, 'F');

        // Text inside the box
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text('OVERALL GREY SCORE', pageWidth / 2, 162, { align: 'center' });

        pdf.setFontSize(32);
        pdf.setFont(undefined, 'bold');
        pdf.text('56', pageWidth / 2, 180, { align: 'center' });

        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(14);
        pdf.text('DEVELOPING', pageWidth / 2, 190, { align: 'center' });

        // Add date at bottom
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        const date = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        pdf.text(`Generated on ${date}`, pageWidth / 2, pageHeight - 20, { align: 'center' });

        // Table of Contents Page
        pdf.addPage();
        currentPage++;
        addHeader(currentPage);

        pdf.setFontSize(24);
        pdf.setTextColor(67, 67, 67);
        pdf.setFont(undefined, 'bold');
        pdf.text('Table of Contents', margin, 35);
        pdf.setFont(undefined, 'normal');

        // Define sections with their expected page numbers
        const sections = [
            { title: 'About Your Report', id: 'about-report', page: 3 },
            { title: 'Assessment Methodology', id: 'methodology', page: 4 },
            { title: 'Executive Summary', id: 'executive-summary', page: 5 },
            { title: 'Division Overview', id: 'Division', page: 7 },
            { title: 'Finance & Accounting', id: 'Finance', page: 8 },
            { title: 'Investments', id: 'Investments', page: 10 },
            { title: 'Business Development', id: 'BusinessDevelopment', page: 12 },
            { title: 'CEO & Operations', id: 'CEOOperations', page: 14 },
            { title: 'Evidence & Documentation', id: 'evidence', page: 16 }
        ];

        pdf.setFontSize(14);
        let tocY = 55;
        sections.forEach(section => {
            // Section title
            pdf.setTextColor(0, 0, 0);
            pdf.text(section.title, margin, tocY);

            // Page number
            pdf.setTextColor(150, 150, 150);
            const pageText = section.page.toString();
            const pageTextWidth = pdf.getTextWidth(pageText);
            pdf.text(pageText, pageWidth - margin - pageTextWidth, tocY);

            // Dotted line
            pdf.setDrawColor(200, 200, 200);
            pdf.setLineDash([1, 1], 0);
            const titleWidth = pdf.getTextWidth(section.title);
            pdf.line(margin + titleWidth + 5, tocY - 2, pageWidth - margin - pageTextWidth - 5, tocY - 2);
            pdf.setLineDash([]);

            tocY += 15;
        });

        // Process each section
        for (const section of sections) {
            const element = document.getElementById(section.id);
            if (element) {
                // Always start a new page for each section
                pdf.addPage();
                currentPage++;
                addHeader(currentPage);

                // Temporarily show the section
                const originalDisplay = element.style.display;
                element.style.display = 'block';

                // Capture the section
                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    windowWidth: 1200,
                    backgroundColor: '#ffffff'
                });

                // Calculate dimensions
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = contentWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                // Add content to PDF with pagination
                let yPosition = 25; // Start below header
                let remainingHeight = imgHeight;
                let sourceY = 0;

                while (remainingHeight > 0) {
                    const availableHeight = pageHeight - yPosition - margin;
                    const pageContentHeight = Math.min(remainingHeight, availableHeight);
                    const sourceHeight = (pageContentHeight * canvas.height) / imgHeight;

                    // Create a temporary canvas for this page portion
                    const pageCanvas = document.createElement('canvas');
                    pageCanvas.width = canvas.width;
                    pageCanvas.height = sourceHeight;

                    const ctx = pageCanvas.getContext('2d');
                    ctx.drawImage(
                        canvas,
                        0, sourceY,
                        canvas.width, sourceHeight,
                        0, 0,
                        canvas.width, sourceHeight
                    );

                    // Add the portion to PDF
                    pdf.addImage(
                        pageCanvas.toDataURL('image/png'),
                        'PNG',
                        margin,
                        yPosition,
                        imgWidth,
                        pageContentHeight,
                        undefined,
                        'FAST'
                    );

                    remainingHeight -= pageContentHeight;
                    sourceY += sourceHeight;

                    if (remainingHeight > 0) {
                        pdf.addPage();
                        currentPage++;
                        addHeader(currentPage);
                        yPosition = 25;
                    }
                }

                // Restore original display
                element.style.display = originalDisplay;
            }
        }

        // Add final page with generation info
        pdf.addPage();
        currentPage++;
        addHeader(currentPage);

        pdf.setFontSize(16);
        pdf.setTextColor(67, 67, 67);
        pdf.text('Document Information', margin, 35);

        pdf.setFontSize(12);
        pdf.setTextColor(100, 100, 100);
        let infoY = 50;

        const info = [
            `Generated: ${date}`,
            'Document Type: GREY Score™ Report',
            'Organization: IMB Partners',
            'Assessment Period: August 2025',
            'Total Pages: ' + currentPage,
            '',
            'This document contains confidential and proprietary information.',
            'Distribution is limited to authorized personnel only.'
        ];

        info.forEach(line => {
            pdf.text(line, margin, infoY);
            infoY += 8;
        });

        // Save the PDF
        const filename = `GREY_Score™_Report_IMB_Partners_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(filename);

        // Show success message
        setTimeout(() => {
            alert('PDF generated successfully!');
        }, 500);

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('There was an error generating the PDF. Please try again.');
    } finally {
        // Restore original layout
        const sidebarWrapper = document.getElementById('sidebarWrapper');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const mainContent = document.getElementById('mainContent');
        const pdfOverlay = document.getElementById('pdfOverlay');
        const pdfButton = document.querySelector('.pdf-button');
        const logoutButton = document.querySelector('.logout-btn');
        const headerWrapper = document.querySelector('.header-custom'); // ✅ corrected

        if (sidebarWrapper) sidebarWrapper.style.display = '';
        if (sidebarToggle) sidebarToggle.style.display = '';
        if (mainContent) {
            mainContent.style.marginLeft = '';
            mainContent.style.width = '';
        }
        if (headerWrapper) headerWrapper.style.display = '';
        if (pdfButton) {
            pdfButton.style.display = '';
            pdfButton.disabled = false;
        }
        if (logoutButton) logoutButton.style.display = '';

        if (pdfOverlay) pdfOverlay.classList.remove('active');
    }
}
