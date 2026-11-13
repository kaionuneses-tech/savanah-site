// Borda do topo ao rolar
const topo = document.querySelector('.topo');
const marcaTopo = () => topo.classList.toggle('rolou', scrollY > 8);
addEventListener('scroll', marcaTopo, { passive: true });
marcaTopo();

// Menu mobile
const menuBtn = document.querySelector('.menu-btn');
const nav = document.getElementById('nav');
menuBtn.addEventListener('click', () => {
  const aberto = nav.classList.toggle('aberto');
  menuBtn.setAttribute('aria-expanded', aberto);
});
nav.addEventListener('click', e => {
  if (e.target.closest('a')) { nav.classList.remove('aberto'); menuBtn.setAttribute('aria-expanded', 'false'); }
});

// Filtro de empreendimentos
const botoes = document.querySelectorAll('.filtros button');
const emps = document.querySelectorAll('.emp');
const vazio = document.querySelector('.vazio');
function filtrar(fase) {
  botoes.forEach(b => b.setAttribute('aria-pressed', b.dataset.filtro === fase));
  let visiveis = 0;
  emps.forEach(el => {
    const mostra = fase === 'todos' || el.dataset.fase === fase;
    el.hidden = !mostra;
    if (mostra) visiveis++;
  });
  vazio.hidden = visiveis > 0;
}
document.querySelectorAll('[data-filtro]').forEach(b => b.addEventListener('click', () => filtrar(b.dataset.filtro)));

// "Quero saber mais" já escolhe o empreendimento no formulário
const interesse = document.getElementById('interesse');
document.querySelectorAll('[data-interesse]').forEach(a =>
  a.addEventListener('click', () => { interesse.value = a.dataset.interesse; })
);

// Formulário: valida e abre o e-mail com a mensagem pronta
// shortcut: usa mailto, sem backend; trocar por um endpoint (ex.: Formspree ou API própria) quando houver servidor
const form = document.getElementById('form');
const status = form.querySelector('.form__status');
form.addEventListener('submit', e => {
  e.preventDefault();
  const invalidos = [...form.querySelectorAll('[required]')].filter(c => !c.checkValidity());
  form.querySelectorAll('[required]').forEach(c => c.setAttribute('aria-invalid', !c.checkValidity()));
  if (invalidos.length) {
    status.className = 'form__status erro';
    status.textContent = 'Preencha nome, telefone e um e-mail válido para enviarmos sua mensagem.';
    invalidos[0].focus();
    return;
  }
  const d = new FormData(form);
  const corpo = `Nome: ${d.get('nome')}\nTelefone: ${d.get('tel')}\nE-mail: ${d.get('email')}\nInteresse: ${d.get('interesse')}\n\n${d.get('msg')}`;
  location.href = `mailto:contato@savanahempreendimentos.com.br?subject=${encodeURIComponent('Contato pelo site: ' + d.get('interesse'))}&body=${encodeURIComponent(corpo)}`;
  status.className = 'form__status ok';
  status.textContent = 'Abrimos seu aplicativo de e-mail com a mensagem pronta. É só enviar.';
});
