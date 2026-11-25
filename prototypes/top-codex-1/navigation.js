(function () {
  const menu = document.querySelector('#site-menu');
  const bar = document.querySelector('[data-menu-bar]');
  const drawer = document.querySelector('#menu-drawer');
  const drawerToggle = document.querySelector('[data-menu-toggle]');
  const desktop = matchMedia(document.documentElement.hasAttribute('data-desktop-preview')
    ? '(min-width: 75rem)'
    : '(min-width: 75rem) and (not (pointer: coarse))');
  const categories = [...menu.querySelectorAll('[data-category-toggle]')].map((button) => ({
    button,
    label: button.previousElementSibling,
    group: button.parentElement,
    submenu: document.getElementById(button.getAttribute('aria-controls')),
  }));
  let activeCategory = null;

  function selectCategory(active) {
    activeCategory = active;
    categories.forEach((category) => {
      const expanded = category === active;
      category.button.setAttribute('aria-expanded', String(expanded));
      category.submenu.inert = desktop.matches && !expanded;
    });
  }

  function arrangeMenu() {
    if (drawer.open) drawer.close();
    const wide = desktop.matches;
    menu.toggleAttribute('data-desktop', wide);
    drawerToggle.hidden = wide;
    bar.hidden = !wide;
    (wide ? bar : drawer).append(menu);
    categories.forEach(({ button, label }) => {
      button.hidden = !wide;
      label.hidden = wide;
    });
    selectCategory(null);
  }

  drawerToggle.addEventListener('click', () => {
    drawer.showModal();
    drawerToggle.setAttribute('aria-expanded', 'true');
  });
  drawer.querySelector('[data-menu-close]').addEventListener('click', () => drawer.close());
  drawer.addEventListener('click', (event) => {
    if (event.target === drawer && event.clientX >= drawer.getBoundingClientRect().right) drawer.close();
  });
  drawer.addEventListener('close', () => {
    drawerToggle.setAttribute('aria-expanded', String(drawer.open));
  });
  categories.forEach((category) => {
    const { button, group, submenu } = category;
    button.addEventListener('click', () => selectCategory(activeCategory === category ? null : category));
    group.addEventListener('pointerenter', (event) => {
      if (!desktop.matches || event.pointerType !== 'mouse') return;
      if (activeCategory?.submenu.contains(document.activeElement)) return;
      selectCategory(category);
    });
    group.addEventListener('pointerleave', () => {
      if (activeCategory === category && !submenu.contains(document.activeElement)) selectCategory(null);
    });
    group.addEventListener('focusout', (event) => {
      if (activeCategory === category && !group.contains(event.relatedTarget) && !group.matches(':hover')) {
        selectCategory(null);
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (activeCategory && !activeCategory.group.contains(event.target)) selectCategory(null);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !activeCategory) return;
    const { button, submenu } = activeCategory;
    if (submenu.contains(document.activeElement)) button.focus();
    selectCategory(null);
  });

  desktop.addEventListener('change', arrangeMenu);
  arrangeMenu();
})();
