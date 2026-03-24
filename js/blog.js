// js/blog.js

document.addEventListener('DOMContentLoaded', () => {
    const previewContainer = document.getElementById('blog-preview-container');
    const listContainer = document.getElementById('blog-list-container');

    if (previewContainer) {
        loadBlogPreviews('blog-preview-container', 3);
    }

    if (listContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const postSlug = urlParams.get('post');
        if (postSlug) {
            loadSinglePost(postSlug, 'blog-list-container');
        } else {
            loadBlogList('blog-list-container');
        }
    }
});

async function fetchBlogIndex() {
    try {
        // Use relative path to work in subdirectories or local file systems
        const res = await fetch('blog/index.json');
        if (!res.ok) throw new Error('Cannot fetch index.json');
        return await res.json();
    } catch (e) {
        console.error('Error fetching blog index:', e);
        return [];
    }
}

async function fetchPost(fileUrl) {
    try {
        // Ensure the path doesn't have a leading slash if we are using relative paths
        const cleanUrl = fileUrl.startsWith('/') ? fileUrl.substring(1) : fileUrl;
        const res = await fetch(cleanUrl);
        if (!res.ok) throw new Error('Cannot fetch post: ' + cleanUrl);
        const text = await res.text();
        return parsePost(text);
    } catch (e) {
        console.error('Error fetching post:', e);
        return null;
    }
}

function parsePost(rawText) {
    const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
    const match = rawText.match(frontMatterRegex);
    let meta = { title: '', date: '', lang: 'en', summary: '' };
    let body = rawText;

    if (match) {
        const yaml = match[1];
        body = rawText.slice(match[0].length).trim();
        
        const extract = (key) => {
            const r = new RegExp(`${key}:\\s*"(.*?)"`);
            const m = yaml.match(r);
            return m ? m[1] : '';
        };
        
        meta.title = extract('title');
        meta.date = extract('date');
        meta.lang = extract('lang');
        meta.summary = extract('summary');
    }

    return { meta, html: parseMarkdown(body) };
}

function parseMarkdown(md) {
    let html = md;

    // Code blocks
    html = html.replace(/```[\s\S]*?\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    // Inline code
    html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold, Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Blockquote
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Horizontal Rule
    html = html.replace(/^---$/gim, '<hr>');

    // Unordered Lists
    html = html.replace(/^\s*-\s+(.*)$/gim, '<ul><li>$1</li></ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');

    // Ordered Lists
    html = html.replace(/^\s*\d+\.\s+(.*)$/gim, '<ol><li>$1</li></ol>');
    html = html.replace(/<\/ol>\s*<ol>/g, '');

    // Paragraphs
    let blocks = html.split(/\n\s*\n/);
    blocks = blocks.map(block => {
        if (/^(<(h[1-6]|ul|ol|li|pre|blockquote|hr))/i.test(block.trim())) {
            return block.trim();
        }
        if (block.trim() === '') return '';
        return '<p>' + block.replace(/\n/g, '<br>') + '</p>';
    });

    return blocks.join('\n');
}

function createCardHTML(slug, meta) {
    return `
        <a href="blog.html?post=${slug}" class="blog-card">
            <div class="blog-card-meta">
                <span class="blog-card-date">${meta.date}</span>
                <span class="blog-card-lang ${meta.lang}">${meta.lang.toUpperCase()}</span>
            </div>
            <h3 class="blog-card-title">${meta.title}</h3>
            <p class="blog-card-summary">${meta.summary}</p>
        </a>
    `;
}

// Helper to sort posts by date (Descending)
function sortPosts(posts) {
    return posts.sort((a, b) => {
        const dateA = new Date(a.meta.date.split('.').reverse().join('-')); // Support DD.MM.YYYY
        const dateB = new Date(b.meta.date.split('.').reverse().join('-'));
        
        // If normalization fails, try ISO
        const finalA = isNaN(dateA) ? new Date(a.meta.date) : dateA;
        const finalB = isNaN(dateB) ? new Date(b.meta.date) : dateB;
        
        return finalB - finalA;
    });
}

async function loadBlogPreviews(containerId, limit) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const index = await fetchBlogIndex();
    const allPosts = [];
    
    for (const entry of index) {
        const post = await fetchPost(entry.file);
        if (post) {
            allPosts.push({ slug: entry.slug, ...post });
        }
    }
    
    const sortedPosts = sortPosts(allPosts);
    const postsToLoad = sortedPosts.slice(0, limit);
    
    let html = '';
    for (const post of postsToLoad) {
        html += createCardHTML(post.slug, post.meta);
    }
    
    container.innerHTML = html || '<p>No recent posts.</p>';
}

async function loadBlogList(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const index = await fetchBlogIndex();
    const currentLang = document.documentElement.getAttribute('data-lang') || 'en';
    
    const titleEn = "All Posts";
    const titleTr = "Tüm Yazılar";
    let html = `<h2 class="section-title" data-en="${titleEn}" data-tr="${titleTr}">${currentLang === 'en' ? titleEn : titleTr}</h2>
                <div class="content-box">`;
    
    const allPosts = [];
    for (const entry of index) {
        const post = await fetchPost(entry.file);
        if (post) {
            allPosts.push({ slug: entry.slug, ...post });
        }
    }
    
    const sortedPosts = sortPosts(allPosts);
    
    for (const post of sortedPosts) {
        html += createCardHTML(post.slug, post.meta);
    }
    
    html += `</div>`;
    container.innerHTML = html;
}

async function loadSinglePost(slug, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const index = await fetchBlogIndex();
    const entry = index.find(e => e.slug === slug);
    if (!entry) {
        container.innerHTML = '<p>Post not found.</p>';
        return;
    }
    
    const post = await fetchPost(entry.file);
    if (!post) {
        container.innerHTML = '<p>Failed to load post.</p>';
        return;
    }
    
    const currentLang = document.documentElement.getAttribute('data-lang') || 'en';
    const backEn = "&larr; Back to blog";
    const backTr = "&larr; Bloga dön";
    
    container.innerHTML = `
        <a href="blog.html" class="post-back-link" data-en="${backEn}" data-tr="${backTr}">${currentLang === 'en' ? backEn : backTr}</a>
        <div class="content-box single-post">
            <div class="post-header">
                <h1 class="post-title">${post.meta.title}</h1>
                <div class="blog-card-meta">
                    <span class="blog-card-date">${post.meta.date}</span>
                    <span class="blog-card-lang ${post.meta.lang}">${post.meta.lang.toUpperCase()}</span>
                </div>
            </div>
            <div class="post-content">
                ${post.html}
            </div>
        </div>
    `;
}
