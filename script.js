function initDarkMode() {
    const toggleButton = document.getElementById('toggle-dark-mode');
    const body = document.body;

    // Check for saved dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        body.classList.add('dark-mode');
    }

    // Toggle dark mode on button click
    toggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    });
}

async function fetchProjects() {
    try {
        const allRepos = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const response = await fetch(`https://api.github.com/users/iam269/repos?sort=updated&per_page=100&page=${page}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'GitHub-Projects-Viewer/1.0'
                }
            });
            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error(`GitHub API rate limit exceeded. Please try again later or use a personal access token.`);
                }
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }
            const repos = await response.json();

            if (!Array.isArray(repos) || repos.length === 0) {
                hasMore = false;
            } else {
                allRepos.push(...repos);
                page++;
            }
        }

        const webProjectsDiv = document.getElementById('web-projects');
        const gameProjectsDiv = document.getElementById('game-projects');
        const mobileProjectsDiv = document.getElementById('mobile-projects');
        const otherProjectsDiv = document.getElementById('other-projects');

        let webCount = 0, gameCount = 0, mobileCount = 0, otherCount = 0;

        allRepos.forEach((repo) => {
            const projectDiv = document.createElement('div');
            projectDiv.className = 'project';

            const stars = repo.stargazers_count || 0;
            const forks = repo.forks_count || 0;
            const language = repo.language || 'Not specified';

            const homepageLink = repo.homepage ? `<p><a href="${repo.homepage}" target="_blank">View Live Site</a></p>` : '';

            const nameLower = repo.name.toLowerCase();
            const descLower = (repo.description || '').toLowerCase();

            let targetDiv, count, githubPagesLink = '';
            if (nameLower.includes('web') || descLower.includes('web') || ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Vue', 'React', 'Angular', 'PHP', 'Ruby', 'Go', 'Rust', 'Svelte', 'Next.js', 'Nuxt.js', 'Express', 'Django', 'Flask', 'Laravel', 'Symfony'].includes(language)) {
                targetDiv = webProjectsDiv;
                count = ++webCount;
                githubPagesLink = `<p><a href="https://iam269.github.io/${repo.name}" target="_blank">View GitHub Pages</a></p>`;
            } else if (nameLower.includes('game') || descLower.includes('game') || ['C#', 'Unity', 'Python', 'Lua', 'Haxe', 'GDScript', 'C', 'Assembly'].includes(language)) {
                targetDiv = gameProjectsDiv;
                count = ++gameCount;
            } else if (nameLower.includes('mobile') || descLower.includes('mobile') || ['Java', 'Kotlin', 'Swift', 'Dart', 'Objective-C', 'React Native', 'Flutter', 'Ionic', 'Xamarin', 'C++'].includes(language)) {
                targetDiv = mobileProjectsDiv;
                count = ++mobileCount;
            } else {
                targetDiv = otherProjectsDiv;
                count = ++otherCount;
            }

            projectDiv.innerHTML = `
                <h2>${count}. <a href="${repo.html_url}" target="_blank">${repo.name}</a></h2>
                ${repo.description ? `<p>${repo.description}</p>` : ''}
                ${homepageLink}
                ${githubPagesLink}
                <div class="stats">
                    <span>Language: ${language}</span> |
                    <span>Stars: ${stars}</span> |
                    <span>Forks: ${forks}</span> |
                    <span>Updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
            `;

            targetDiv.appendChild(projectDiv);
        });

        const totalProjects = allRepos.length;
        const totalDiv = document.getElementById('total-projects');
        totalDiv.innerHTML = `<p>Total Projects: ${totalProjects}</p>`;
    } catch (error) {
        console.error('Error fetching projects:', error);
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `<p>Error loading projects: ${error.message}. Please check the console for details.</p>`;
        document.body.appendChild(errorDiv);
    }
}

initDarkMode();
fetchProjects();