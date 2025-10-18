async function fetchProjects() {
    try {
        const allRepos = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const response = await fetch(`https://api.github.com/users/iam269/repos?sort=updated&per_page=100&page=${page}`);
            const repos = await response.json();

            if (repos.length === 0) {
                hasMore = false;
            } else {
                allRepos.push(...repos);
                page++;
            }
        }

        const webProjectsDiv = document.getElementById('web-projects');
        const gameProjectsDiv = document.getElementById('game-projects');
        const appProjectsDiv = document.getElementById('app-projects');
        const otherProjectsDiv = document.getElementById('other-projects');

        let webCount = 0, gameCount = 0, appCount = 0, otherCount = 0;

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
            if (nameLower.includes('web') || descLower.includes('web') || language === 'HTML' || language === 'CSS' || language === 'JavaScript') {
                targetDiv = webProjectsDiv;
                count = ++webCount;
                githubPagesLink = `<p><a href="https://iam269.github.io/${repo.name}" target="_blank">View GitHub Pages</a></p>`;
            } else if (nameLower.includes('game') || descLower.includes('game') || language === 'C#' || language === 'Unity') {
                targetDiv = gameProjectsDiv;
                count = ++gameCount;
            } else if (nameLower.includes('app') || descLower.includes('app') || language === 'Java' || language === 'Kotlin') {
                targetDiv = appProjectsDiv;
                count = ++appCount;
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
        document.body.innerHTML = '<p>Error loading projects. Please try again later.</p>';
    }
}

fetchProjects();