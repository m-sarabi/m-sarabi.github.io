document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('lang-select').addEventListener('change', (ev) => {
        document.body.classList.toggle('show-fa', ev.target.value === 'fa');
        document.body.classList.toggle('show-en', ev.target.value === 'en');
        document.body.setAttribute('dir', ev.target.value === 'fa' ? 'rtl' : 'ltr');

        document.querySelector('header nav').classList.toggle('hidden', true);
    });

    document.addEventListener('click', (ev) => {
        if (ev.target !== document.querySelector('.nav-toggle') && ev.target !== document.getElementById('lang-select')) {
            document.querySelector('header nav').classList.toggle('hidden', true);
        }
        Prism.highlightAll();
    });

    document.querySelector('.nav-toggle').addEventListener('click', () => {
        document.querySelector('header nav').classList.toggle('hidden');
    });
});