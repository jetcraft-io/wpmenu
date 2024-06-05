/**
 * jetcraft-ws-wpmenu
 * {@link https://jetcraft.io/jetcraft-ws-wpmenu-01|Jetcraft}
 * ver. 1.1
 */
(function() {
    if(window.jetcraftInitWpmenu === true) return;
    window.jetcraftInitWpmenu = window.jetcraftInitWpmenu || false;

    const textNodeRelocation = ($meta) => {
        $meta.forEach(($metaItem) => {
            const $link = $metaItem.querySelector('a');
            const $existingSpan = $metaItem.querySelectorAll('span');
            const $textNode = $link.nextSibling;

            $existingSpan.forEach(($span) => $link.appendChild($span));

            $existingSpan.forEach(($span) => {
                $span.textContent = $span.textContent.replace(/[()]/g, '');
            });

            if ($textNode && $textNode.nodeType === Node.TEXT_NODE) {
                let $text = $textNode.textContent.trim();

                if ($text) {
                    $text = $text.replace(/[()]/g, '');
                    const $span = document.createElement('span');
                    $span.textContent = $text;
                    $link.appendChild($span);
                    $textNode.remove();
                }
            }

            $existingSpan.forEach(($span) => $span.style.display = 'inline-block');

            // fix original widget style
            /*
            $comps.forEach($comp => {
                $comp.querySelectorAll('.wp-widget ul').forEach($ul => {
                    $ul.style.opacity = '1';
                    $ul.style.transform = 'scale(1)';
                });
            });
            */
        });
    }

    const wpmenu = () => {
        const $comps = Array.from(document.querySelectorAll('.jetcraft-ws-wpmenu-01'));
        if ($comps.length === 0) return;

        $comps.forEach(($component) => {
            const $otherComps = $comps.filter($c => $c !== $component);
            const $select = $component?.querySelector('select');
            const $parentComp = $select?.closest('.jetcraft-ws-wpmenu-01');

            // Toggle active
            if (!$select) {
                const $title = $component?.querySelector('h5');
                const $mainmenu = $component.querySelector('ul:first-of-type');
                const $submenus = $component.querySelectorAll('ul ul');
                const $meta = $component.querySelectorAll('li:has(a)');

                $title?.addEventListener('click', () => {
                    $mainmenu.classList.toggle('active');

                    if (!$mainmenu.classList.contains('active')) {
                        $submenus.forEach(($submenu) => $submenu.classList.remove('active'));
                    }

                    // for arrow rotation
                    $title.classList.toggle('on');

                    // remove class on other component
                    $otherComps.forEach(($otherComp) => {
                        $otherComp.querySelectorAll('ul').forEach(($ul) => $ul.classList.remove('active'));
                        $otherComp.querySelectorAll('h5').forEach(($h5) => $h5.classList.remove('on'));
                    });
                });

                $component.addEventListener('click', (event) => {
                    const $item = event.target.closest('li:has(ul) > a');

                    if (!$item) return;

                    event.preventDefault();
                    event.stopPropagation();

                    const $submenu = $item.nextElementSibling;
                    const $parentLi = $item.closest('li');

                    $submenu.classList.toggle('active');
                    $item.classList.toggle('on');

                    if (!$submenu.classList.contains('active')) {
                        $submenu.querySelectorAll('ul').forEach(($ul) => $ul.classList.remove('active'));
                    }

                    // remove class on brother li
                    const $siblingLis = Array.from($parentLi.parentElement.children).filter((node) => node !== $parentLi);
                    $siblingLis.forEach(($siblingLi) => {
                        $siblingLi.querySelectorAll('ul').forEach(($ul) => $ul.classList.remove('active'));
                        $siblingLi.querySelectorAll('a').forEach(($a) => $a.classList.remove('on'));
                    });

                    $otherComps.forEach(($otherComp) => {
                        $otherComp.querySelectorAll('ul').forEach(($ul) => $ul.classList.remove('active'));
                        $otherComp.querySelectorAll('li:has(ul) > a').forEach(($a) => $a.classList.remove('on'));
                    });

                    // detect viewport
                    const $uls = $component.querySelectorAll('ul');
                    $uls.forEach(($ul, index) => {
                        if (index > 2) {
                            $ul.style.left = '100%';
                            $ul.style.right = 'initial';

                            const isOffScreen = $ul.offsetLeft + $ul.offsetWidth > window.innerWidth;

                            if (isOffScreen) {
                                $ul.style.left = 'initial';
                                $ul.style.right = '100%';
                            } else {
                                $ul.style.right = 'initial';
                                $ul.style.left = '100%';
                            }
                        }
                    });
                });

                // textNode relocation
                textNodeRelocation($meta);
            }
            else {
                // using select form
                $select.addEventListener('change', () => {
                    const selectedURL = $select.value;
                    if (selectedURL) {
                        if ($parentComp.classList.contains('new-tab')) {
                            window.open(selectedURL, '_blank', 'noopener');
                        } else {
                            window.location.href = selectedURL;
                        }
                    }
                });
            }
        });

        // remove class on outside of components
        document.addEventListener('click', (event) => {
            if (!event.target.matches('.jetcraft-ws-wpmenu-01 h5, .jetcraft-ws-wpmenu-01 h5 *, .jetcraft-ws-wpmenu-01 .no-link')) {
                $comps.forEach($comp => {
                    $comp.querySelectorAll('ul').forEach($ul => $ul.classList.remove('active'));
                    $comp.querySelectorAll('h5, li:has(ul) > a').forEach($el => $el.classList.remove('on'));
                });
            }
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        wpmenu();
    });


    if (!window.jetcraftInitWpmenu && window.elementorFrontend) {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/html.default', function() {

            if (!window.jetcraftInitWpmenu) {
                const $comps = Array.from(document.querySelectorAll('.jetcraft-ws-wpmenu-01'));
                if ($comps.length === 0) return;

                $comps.forEach(($component) => {
                    const $select = $component?.querySelector('select');

                    if (!$select) {
                        const $meta = $component.querySelectorAll('li:has(a)');
                        textNodeRelocation($meta);
                    }
                });

                window.jetcraftInitWpmenu = true;
            }
        });
    }

})();