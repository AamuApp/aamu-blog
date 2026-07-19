(() => {
    const initializePostToc = () => {
        const content = document.querySelector('.post-single .post-content');
        const shell = document.querySelector('.post-single .post-toc-shell');
        const list = shell?.querySelector('.post-toc-list');
        if (!content || !shell || !list) return;

        const headings = Array.from(content.querySelectorAll('h1, h2, h3'))
            .filter(heading => heading.textContent.trim());
        if (headings.length < 2) return;

        const usedIds = new Set(Array.from(document.querySelectorAll('[id]')).map(element => element.id));
        const slugify = value => value
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLocaleLowerCase('en')
            .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
            .replace(/^-+|-+$/g, '');
        const uniqueHeadingId = (heading, index) => {
            if (heading.id) return heading.id;
            const clone = heading.cloneNode(true);
            clone.querySelectorAll('.anchor').forEach(anchor => anchor.remove());
            const base = slugify(clone.textContent.trim()) || `section-${index + 1}`;
            let id = base;
            let suffix = 2;
            while (usedIds.has(id)) id = `${base}-${suffix++}`;
            usedIds.add(id);
            heading.id = id;
            return id;
        };

        const links = headings.map((heading, index) => {
            const id = uniqueHeadingId(heading, index);
            const clone = heading.cloneNode(true);
            clone.querySelectorAll('.anchor').forEach(anchor => anchor.remove());
            const item = document.createElement('li');
            const link = document.createElement('a');
            item.className = `post-toc-level-${heading.tagName.slice(1)}`;
            link.href = `#${encodeURIComponent(id)}`;
            link.textContent = clone.textContent.trim();
            link.addEventListener('click', event => {
                event.preventDefault();
                const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                heading.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
                window.history.pushState(null, '', `#${encodeURIComponent(id)}`);
            });
            item.append(link);
            list.append(item);
            return link;
        });

        let activeIndex = -1;
        let ticking = false;
        const updateActiveHeading = () => {
            ticking = false;
            const marker = window.scrollY + 112;
            let nextIndex = 0;
            for (let index = 0; index < headings.length; index += 1) {
                if (headings[index].getBoundingClientRect().top + window.scrollY <= marker) nextIndex = index;
                else break;
            }
            if (nextIndex === activeIndex) return;
            if (activeIndex >= 0) {
                links[activeIndex].classList.remove('is-active');
                links[activeIndex].removeAttribute('aria-current');
            }
            activeIndex = nextIndex;
            const activeLink = links[activeIndex];
            activeLink.classList.add('is-active');
            activeLink.setAttribute('aria-current', 'location');

            const nav = activeLink.closest('.post-toc');
            const linkTop = activeLink.offsetTop;
            if (linkTop < nav.scrollTop) nav.scrollTop = Math.max(0, linkTop - 16);
            else if (linkTop + activeLink.offsetHeight > nav.scrollTop + nav.clientHeight) {
                nav.scrollTop = linkTop + activeLink.offsetHeight - nav.clientHeight + 16;
            }
        };
        const requestActiveHeadingUpdate = () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(updateActiveHeading);
        };

        shell.hidden = false;
        window.addEventListener('scroll', requestActiveHeadingUpdate, { passive: true });
        window.addEventListener('resize', requestActiveHeadingUpdate, { passive: true });
        updateActiveHeading();

        if (window.location.hash) {
            const hashId = decodeURIComponent(window.location.hash.slice(1));
            const target = headings.find(heading => heading.id === hashId);
            if (target) window.requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
        }
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializePostToc);
    else initializePostToc();
})();
