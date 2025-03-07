const formularioTarefa = document.getElementById('formulario-tarefa');
const listaTarefas = document.getElementById('lista-tarefas');
const totalEstrelas = document.getElementById('total-estrelas');
const pontuacao = document.getElementById('pontuacao');
let estrelas = 0;

function atualizarEstrelas() {
    totalEstrelas.textContent = estrelas;
}

function animarEstrelas() {
    pontuacao.classList.add('animacao');
    setTimeout(() => {
        pontuacao.classList.remove('animacao');
    }, 200);
}

function gerarCorAleatoria() {
    const r = Math.floor(Math.random() * 156) + 100;
    const g = Math.floor(Math.random() * 156) + 100;
    const b = Math.floor(Math.random() * 156) + 100;
    return `rgb(${r}, ${g}, ${b})`;
}

formularioTarefa.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome-tarefa').value;
    const categoria = document.getElementById('categoria-tarefa').value;
    if (nome.trim() === '') return;

    const tarefaItem = document.createElement('li');
    tarefaItem.classList.add('tarefa-item');
    const corTarefa = gerarCorAleatoria();
    tarefaItem.innerHTML = `
        <span class="categoria-${categoria}" style="color: ${corTarefa};">${nome}</span>
        <div>
            <button class="concluir-tarefa"><i class="fas fa-check"></i></button>
            <button class="remover-tarefa"><i class="fas fa-trash-alt"></i></button>
        </div>
    `;
    listaTarefas.appendChild(tarefaItem);

    const concluirTarefa = tarefaItem.querySelector('.concluir-tarefa');
    const removerTarefa = tarefaItem.querySelector('.remover-tarefa');

    concluirTarefa.addEventListener('click', () => {
        tarefaItem.classList.toggle('concluida');
        if (tarefaItem.classList.contains('concluida')) {
            estrelas++;
            animarEstrelas();
        } else {
            estrelas--;
            animarEstrelas();
        }
        atualizarEstrelas();
    });

    removerTarefa.addEventListener('click', () => {
        const tarefaConcluida = tarefaItem.classList.contains('concluida');
        listaTarefas.removeChild(tarefaItem);
        if (tarefaConcluida) {
            estrelas--;
            atualizarEstrelas();
        }
    });

    formularioTarefa.reset();
});

atualizarEstrelas();const staticAssets = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './icon-192x192.png',
    './icon-512x512.png'
  ];
  
  self.addEventListener('install', async event => {
    const cache = await caches.open('static-assets');
    await cache.addAll(staticAssets);
  });
  
  self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);
  
    if (url.origin === location.origin) {
      event.respondWith(cacheFirst(req));
    } else {
      event.respondWith(networkFirst(req));
    }
  });
  
  async function cacheFirst(req) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);
  }
  
  async function networkFirst(req) {
    const cache = await caches.open('dynamic-assets');
  
    try {
      const res = await fetch(req);
      cache.put(req, res.clone());
      return res;
    } catch (error) {
      const cachedResponse = await cache.match(req);
      return cachedResponse || await caches.match('./offline.html');
    }
  }