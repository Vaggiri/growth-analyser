document.addEventListener('DOMContentLoaded', function() {
    // --- STATE MANAGEMENT ---
    let state = {
        projects: [],
        team: [],
        currency: 'INR', // 'INR' or 'USD'
        usdToInrRate: 83,
        charts: {}
    };

    // --- DOM ELEMENTS ---
    const DOMElements = {
        // Pages
        dashboardPage: document.getElementById('dashboard-page'),
        projectsPage: document.getElementById('projects-page'),
        teamPage: document.getElementById('team-page'),
        settingsPage: document.getElementById('settings-page'),
        
        // Navigation Links
        navLinks: document.querySelectorAll('.nav-link'),
        
        // Buttons
        addProjectBtn: document.getElementById('add-project-btn'),
        saveProjectBtn: document.getElementById('save-project'),
        cancelProjectBtn: document.getElementById('cancel-project'),
        deleteProjectBtn: document.getElementById('delete-project'),
        
        // Mobile Menu
        mobileMenuButton: document.getElementById('mobile-menu-button'),
        mobileCloseButton: document.getElementById('mobile-close-button'),
        mobileSidebar: document.getElementById('mobile-sidebar'),
        mobileSidebarOverlay: document.getElementById('mobile-sidebar-overlay'),

        // Modal
        projectModal: document.getElementById('project-modal'),
        projectForm: document.getElementById('project-form'),
        modalTitle: document.getElementById('modal-title'),
        
        // Tables & Containers
        projectsTableBody: document.getElementById('projects-table-body'),
        recentProjects: document.getElementById('recent-projects'),
        teamMembersContainer: document.getElementById('team-members-container'),

        // Filters & Settings
        timeFilter: document.getElementById('time-filter'),
        darkModeToggle: document.getElementById('dark-mode-toggle'),
        currencySelector: document.getElementById('currency-selector'),
        
        // Stat Displays
        totalEarnings: document.getElementById('total-earnings'),
        monthlyGrowth: document.getElementById('monthly-growth'),
        avgProjectValue: document.getElementById('avg-project-value'),
        bestMonth: document.getElementById('best-month'),
        bestMonthAmount: document.getElementById('best-month-amount'),
        earningsChange: document.getElementById('earnings-change'),
        growthChange: document.getElementById('growth-change'),
        avgChange: document.getElementById('avg-change'),
    };

    // --- INITIALIZATION ---
    function init() {
        // Load data
        loadSampleData();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize UI components
        initDarkMode();
        initCharts();
        
        // Initial render
        navigateTo('dashboard');
        updateAll();
        
        // Initialize icons
        lucide.createIcons();
    }

    // --- DATA HANDLING ---
    function loadSampleData() {
        const clients = ['Acme Corp', 'Globex', 'Soylent', 'Initech', 'Umbrella', 'Hooli', 'Wayne Ent'];
        const teamMembers = [
            { id: 'team-1', name: 'Rohan Patel', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a', role: 'Project Manager' },
            { id: 'team-2', name: 'Anjali Singh', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b', role: 'Lead Developer' },
            { id: 'team-3', name: 'Vikram Choudhury', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704c', role: 'UI/UX Designer' },
            { id: 'team-4', name: 'Sneha Reddy', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', role: 'Backend Developer' },
        ];
        state.team = teamMembers;

        const currentDate = new Date();
        for (let i = 0; i < 30; i++) {
            const monthOffset = Math.floor(Math.random() * 12);
            const day = Math.floor(Math.random() * 28) + 1;
            const month = (currentDate.getMonth() - monthOffset + 12) % 12;
            const year = month > currentDate.getMonth() ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
            
            state.projects.push({
                id: 'proj-' + i,
                name: 'Project Alpha ' + (i + 1),
                client: clients[Math.floor(Math.random() * clients.length)],
                date: new Date(year, month, day),
                amountUSD: Math.floor(Math.random() * 9000) + 1000,
                notes: 'Project notes and details go here.',
                status: ['Completed', 'In Progress', 'Pending'][Math.floor(Math.random() * 3)],
                assignedTo: teamMembers[Math.floor(Math.random() * teamMembers.length)].id
            });
        }
        state.projects.sort((a, b) => b.date - a.date);
    }

    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        // Navigation
        DOMElements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.id.replace('nav-', '').replace('mobile-', '');
                navigateTo(page);
                if (DOMElements.mobileSidebar.classList.contains('hidden') === false) {
                    toggleMobileMenu();
                }
            });
        });

        // Project actions
        DOMElements.addProjectBtn.addEventListener('click', () => showProjectForm());
        DOMElements.saveProjectBtn.addEventListener('click', saveProject);
        DOMElements.cancelProjectBtn.addEventListener('click', hideProjectForm);
        DOMElements.deleteProjectBtn.addEventListener('click', deleteProject);

        // Mobile menu
        DOMElements.mobileMenuButton.addEventListener('click', toggleMobileMenu);
        DOMElements.mobileCloseButton.addEventListener('click', toggleMobileMenu);
        DOMElements.mobileSidebarOverlay.addEventListener('click', toggleMobileMenu);

        // Filters & Settings
        DOMElements.timeFilter.addEventListener('change', updateAll);
        DOMElements.darkModeToggle.addEventListener('change', toggleDarkMode);
        DOMElements.currencySelector.addEventListener('change', (e) => {
            state.currency = e.target.value;
            updateAll();
        });
    }

    // --- NAVIGATION & UI ---
    function navigateTo(page) {
        // Hide all pages
        document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
        // Show the target page
        document.getElementById(`${page}-page`).classList.remove('hidden');

        // Update active nav link
        DOMElements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.id.includes(page)) {
                link.classList.add('active');
            }
        });
    }
    
    function toggleMobileMenu() {
        DOMElements.mobileSidebar.classList.toggle('hidden');
    }

    function initDarkMode() {
        if (localStorage.getItem('darkMode') === 'true' || 
           (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('darkMode'))) {
            document.documentElement.classList.add('dark');
            DOMElements.darkModeToggle.checked = true;
        }
    }

    function toggleDarkMode() {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('darkMode', DOMElements.darkModeToggle.checked);
        updateAllCharts(); // Redraw charts for new theme
    }

    // --- PROJECT MODAL ---
    function showProjectForm(project = null) {
        DOMElements.projectForm.reset();
        if (project) {
            DOMElements.modalTitle.textContent = 'Edit Project';
            document.getElementById('project-id').value = project.id;
            document.getElementById('project-name').value = project.name;
            document.getElementById('client-name').value = project.client || '';
            document.getElementById('project-date').value = formatDateForInput(project.date);
            document.getElementById('project-amount').value = convertFromUSD(project.amountUSD).toFixed(0);
            document.getElementById('project-notes').value = project.notes || '';
            DOMElements.deleteProjectBtn.classList.remove('hidden');
        } else {
            DOMElements.modalTitle.textContent = 'Add New Project';
            document.getElementById('project-id').value = '';
            document.getElementById('project-date').value = formatDateForInput(new Date());
            DOMElements.deleteProjectBtn.classList.add('hidden');
        }
        DOMElements.projectModal.classList.remove('hidden');
    }

    function hideProjectForm() {
        DOMElements.projectModal.classList.add('hidden');
    }

    // --- DATA MANIPULATION ---
    function saveProject() {
        if (!DOMElements.projectForm.checkValidity()) {
            DOMElements.projectForm.reportValidity();
            return;
        }
        
        const projectId = document.getElementById('project-id').value;
        const amount = parseFloat(document.getElementById('project-amount').value);

        const projectData = {
            name: document.getElementById('project-name').value,
            client: document.getElementById('client-name').value,
            date: new Date(document.getElementById('project-date').value),
            amountUSD: convertToUSD(amount),
            notes: document.getElementById('project-notes').value,
            status: 'Pending', // Default status for new/edited projects
            assignedTo: state.team[0].id // Default assignment
        };
        
        if (projectId) {
            const index = state.projects.findIndex(p => p.id === projectId);
            if (index !== -1) {
                state.projects[index] = { ...state.projects[index], ...projectData };
            }
        } else {
            projectData.id = 'proj-' + Date.now();
            state.projects.unshift(projectData);
        }
        
        state.projects.sort((a, b) => b.date - a.date);
        updateAll();
        hideProjectForm();
    }

    function deleteProject() {
        const projectId = document.getElementById('project-id').value;
        if (!projectId) return;
        
        state.projects = state.projects.filter(p => p.id !== projectId);
        updateAll();
        hideProjectForm();
    }

    // --- RENDER FUNCTIONS ---
    function updateAll() {
        const filteredProjects = getFilteredProjects();
        updateDashboardMetrics(filteredProjects);
        updateProjectsTable();
        updateRecentProjects();
        updateTeamPage();
        updateAllCharts(filteredProjects);
    }
    
    function updateDashboardMetrics(filteredProjects) {
        const totalEarnings = filteredProjects.reduce((sum, p) => sum + p.amountUSD, 0);
        const avgProjectValue = filteredProjects.length > 0 ? totalEarnings / filteredProjects.length : 0;
        
        // Monthly growth calculation
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        
        const currentMonthRevenue = state.projects.filter(p => p.date.getMonth() === currentMonth && p.date.getFullYear() === currentYear).reduce((sum, p) => sum + p.amountUSD, 0);
        const prevMonthRevenue = state.projects.filter(p => p.date.getMonth() === prevMonth && p.date.getFullYear() === prevYear).reduce((sum, p) => sum + p.amountUSD, 0);
        
        let monthlyGrowth = 0;
        if (prevMonthRevenue > 0) {
            monthlyGrowth = ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;
        } else if (currentMonthRevenue > 0) {
            monthlyGrowth = 100;
        }

        // Best month calculation
        let bestMonth = '-';
        let bestMonthAmount = 0;
        if (state.projects.length > 0) {
            const monthlyRevenue = {};
            state.projects.forEach(p => {
                const monthYear = `${p.date.getFullYear()}-${p.date.getMonth()}`;
                monthlyRevenue[monthYear] = (monthlyRevenue[monthYear] || 0) + p.amountUSD;
            });
            
            let bestMonthKey = '';
            for (const [key, value] of Object.entries(monthlyRevenue)) {
                if (value > bestMonthAmount) {
                    bestMonthAmount = value;
                    bestMonthKey = key;
                }
            }
            
            if (bestMonthKey) {
                const [year, month] = bestMonthKey.split('-');
                bestMonth = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
            }
        }
        
        // Update DOM
        DOMElements.totalEarnings.textContent = formatCurrency(totalEarnings);
        DOMElements.monthlyGrowth.textContent = monthlyGrowth.toFixed(1);
        DOMElements.avgProjectValue.textContent = formatCurrency(avgProjectValue);
        DOMElements.bestMonth.textContent = bestMonth;
        DOMElements.bestMonthAmount.textContent = formatCurrency(bestMonthAmount);
        
        // Dummy change percentages
        DOMElements.earningsChange.textContent = '+12.5%';
        DOMElements.growthChange.textContent = `${monthlyGrowth >= 0 ? '+' : ''}${monthlyGrowth.toFixed(1)}%`;
        DOMElements.avgChange.textContent = '-2.1%';
    }

    function updateProjectsTable() {
        renderTable(DOMElements.projectsTableBody, state.projects, true);
    }
    
    function updateRecentProjects() {
        renderTable(DOMElements.recentProjects, state.projects.slice(0, 5), false);
    }

    function renderTable(tbody, projects, showStatus) {
        tbody.innerHTML = '';
        if (projects.length === 0) {
            const colSpan = showStatus ? 6 : 5;
            tbody.innerHTML = `<tr><td colspan="${colSpan}" class="text-center py-10 text-gray-500">No projects found.</td></tr>`;
            return;
        }

        projects.forEach(project => {
            const statusColors = {
                Completed: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
                'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
                Pending: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300'
            };
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${project.name}</td>
                <td>${project.client || '-'}</td>
                <td>${formatDate(project.date)}</td>
                <td>${formatCurrency(project.amountUSD)}</td>
                ${showStatus ? `<td><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[project.status]}">${project.status}</span></td>` : ''}
                <td>
                    <button class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-3 edit-btn" data-id="${project.id}">Edit</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        tbody.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const project = state.projects.find(p => p.id === this.dataset.id);
                if (project) showProjectForm(project);
            });
        });
    }
    
    function updateTeamPage() {
        DOMElements.teamMembersContainer.innerHTML = '';
        state.team.forEach(member => {
            const projectsAssigned = state.projects.filter(p => p.assignedTo === member.id);
            const totalValue = projectsAssigned.reduce((sum, p) => sum + p.amountUSD, 0);
            
            const memberCard = document.createElement('div');
            memberCard.className = 'flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg';
            memberCard.innerHTML = `
                <img class="w-12 h-12 rounded-full" src="${member.avatar}" alt="${member.name}">
                <div class="ml-4 flex-grow">
                    <p class="font-semibold text-gray-800 dark:text-gray-100">${member.name}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">${member.role}</p>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-gray-800 dark:text-gray-100">${projectsAssigned.length} Projects</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">${formatCurrency(totalValue)}</p>
                </div>
            `;
            DOMElements.teamMembersContainer.appendChild(memberCard);
        });
    }

    // --- CHARTS ---
    function initCharts() {
        const commonOptions = (isDarkMode) => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: isDarkMode ? '#374151' : '#111827',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    titleFont: { weight: 'bold' },
                    callbacks: {
                        label: (context) => ` ${formatCurrency(context.raw, 0)}`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: isDarkMode ? '#9CA3AF' : '#6B7280' }
                },
                y: {
                    grid: { color: isDarkMode ? '#374151' : '#E5E7EB' },
                    ticks: {
                        color: isDarkMode ? '#9CA3AF' : '#6B7280',
                        callback: (value) => formatCurrency(value, 0, true) // isShort = true
                    }
                }
            }
        });

        const chartConfigs = {
            growthChart: { type: 'line', el: 'growthChart' },
            projectDistributionChart: { type: 'bar', el: 'projectDistributionChart' },
            clientDistributionChart: { type: 'doughnut', el: 'clientDistributionChart' },
            teamPerformanceChart: { type: 'bar', el: 'teamPerformanceChart' }
        };

        Object.keys(chartConfigs).forEach(key => {
            const config = chartConfigs[key];
            const ctx = document.getElementById(config.el).getContext('2d');
            state.charts[key] = new Chart(ctx, {
                type: config.type,
                data: { labels: [], datasets: [] },
                options: commonOptions(document.documentElement.classList.contains('dark'))
            });
        });
    }

    function updateAllCharts(filteredProjects) {
        if (!filteredProjects) filteredProjects = getFilteredProjects();
        const isDarkMode = document.documentElement.classList.contains('dark');

        // Update chart options for dark/light mode
        Object.values(state.charts).forEach(chart => {
            chart.options.plugins.tooltip.backgroundColor = isDarkMode ? '#374151' : '#111827';
            chart.options.scales.x.ticks.color = isDarkMode ? '#9CA3AF' : '#6B7280';
            chart.options.scales.y.ticks.color = isDarkMode ? '#9CA3AF' : '#6B7280';
            chart.options.scales.y.grid.color = isDarkMode ? '#374151' : '#E5E7EB';
        });

        updateGrowthChart(filteredProjects);
        updateProjectDistributionChart(filteredProjects);
        updateClientDistributionChart(filteredProjects);
        updateTeamPerformanceChart();
    }

    function updateGrowthChart(projects) {
        const monthlyData = {};
        const sortedProjects = [...projects].sort((a, b) => a.date - b.date);
        let cumulativeRevenue = 0;
        sortedProjects.forEach(project => {
            const monthYear = project.date.toISOString().slice(0, 7);
            cumulativeRevenue += project.amountUSD;
            monthlyData[monthYear] = cumulativeRevenue;
        });
        
        const labels = Object.keys(monthlyData).map(my => new Date(my + '-02').toLocaleString('default', { month: 'short', year: '2-digit' }));
        const data = Object.values(monthlyData);
        
        state.charts.growthChart.data = {
            labels,
            datasets: [{
                label: 'Cumulative Revenue', data,
                backgroundColor: 'rgba(79, 70, 229, 0.1)', borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 2, tension: 0.4, fill: true, pointBackgroundColor: 'rgba(79, 70, 229, 1)',
            }]
        };
        state.charts.growthChart.update();
    }

    function updateProjectDistributionChart(projects) {
        const monthlyData = {};
        projects.forEach(project => {
            const monthYear = project.date.toISOString().slice(0, 7);
            monthlyData[monthYear] = (monthlyData[monthYear] || 0) + project.amountUSD;
        });

        const sortedMonths = Object.keys(monthlyData).sort().slice(-6);
        const labels = sortedMonths.map(my => new Date(my + '-02').toLocaleString('default', { month: 'short' }));
        const data = sortedMonths.map(my => monthlyData[my]);
        
        state.charts.projectDistributionChart.data = {
            labels,
            datasets: [{
                label: 'Revenue', data,
                backgroundColor: 'rgba(79, 70, 229, 0.7)',
                borderRadius: 4,
            }]
        };
        state.charts.projectDistributionChart.update();
    }
    
    function updateClientDistributionChart(projects) {
        const clientData = {};
        projects.forEach(p => {
            const client = p.client || 'Unknown';
            clientData[client] = (clientData[client] || 0) + p.amountUSD;
        });
        
        const sortedClients = Object.entries(clientData).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const labels = sortedClients.map(([client]) => client);
        const data = sortedClients.map(([, amount]) => amount);
        
        const backgroundColors = ['#4F46E5', '#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE'];
        
        state.charts.clientDistributionChart.data = {
            labels,
            datasets: [{ data, backgroundColor: backgroundColors, borderWidth: 0 }]
        };
        state.charts.clientDistributionChart.update();
        
        // Update legend
        const legendContainer = document.getElementById('client-legend');
        legendContainer.innerHTML = '';
        labels.forEach((label, index) => {
            legendContainer.innerHTML += `
                <div class="flex items-center">
                    <span class="w-3 h-3 rounded-full mr-2" style="background-color: ${backgroundColors[index]}"></span>
                    <span class="text-xs text-gray-600 dark:text-gray-400">${label}</span>
                </div>`;
        });
    }
    
    function updateTeamPerformanceChart() {
        const teamPerformance = state.team.map(member => {
            const memberProjects = state.projects.filter(p => p.assignedTo === member.id);
            return {
                name: member.name.split(' ')[0], // First name
                revenue: memberProjects.reduce((sum, p) => sum + p.amountUSD, 0)
            };
        }).sort((a, b) => b.revenue - a.revenue);

        state.charts.teamPerformanceChart.data = {
            labels: teamPerformance.map(m => m.name),
            datasets: [{
                label: 'Total Revenue',
                data: teamPerformance.map(m => m.revenue),
                backgroundColor: 'rgba(236, 72, 153, 0.7)',
                borderRadius: 4,
            }]
        };
        state.charts.teamPerformanceChart.update();
    }

    // --- UTILITY FUNCTIONS ---
    function getFilteredProjects() {
        const filter = DOMElements.timeFilter.value;
        const now = new Date();
        if (filter === 'all') return state.projects;
        if (filter === 'year') return state.projects.filter(p => p.date.getFullYear() === now.getFullYear());
        if (filter === 'month') return state.projects.filter(p => p.date.getFullYear() === now.getFullYear() && p.date.getMonth() === now.getMonth());
        if (filter === 'week') {
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            startOfWeek.setHours(0, 0, 0, 0);
            return state.projects.filter(p => p.date >= startOfWeek);
        }
        return state.projects;
    }

    function formatDateForInput(date) {
        return new Date(date).toISOString().split('T')[0];
    }

    function formatDate(date) {
        return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    
    function convertToUSD(amount) {
        return state.currency === 'INR' ? amount / state.usdToInrRate : amount;
    }

    function convertFromUSD(amountUSD) {
        return state.currency === 'INR' ? amountUSD * state.usdToInrRate : amountUSD;
    }

    function formatCurrency(amountUSD, fractionDigits = 0, isShort = false) {
        const amount = convertFromUSD(amountUSD);
        const symbol = state.currency === 'INR' ? '₹' : '$';
        
        if (isShort) {
            if (amount >= 10000000) return `${symbol}${(amount / 10000000).toFixed(1)}Cr`;
            if (amount >= 100000) return `${symbol}${(amount / 100000).toFixed(1)}L`;
            if (amount >= 1000) return `${symbol}${(amount / 1000).toFixed(1)}k`;
            return `${symbol}${amount.toFixed(0)}`;
        }
        
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: state.currency,
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits
        }).format(amount).replace('₹', '₹').replace('$', '$');
    }

    // --- START THE APP ---
    init();
});
