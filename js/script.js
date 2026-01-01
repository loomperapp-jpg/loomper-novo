/* ==========================================================================
   LOOMPER LOGIC - VERSÃO LANÇAMENTO
   ========================================================================== */

// 1. RASTREAMENTO E PREVENÇÃO DE DUPLICIDADE
document.addEventListener('DOMContentLoaded', function() {
    // Rastreio de indicação
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref') || urlParams.get('convite');
    if (ref) {
        const inputIndicacao = document.getElementById('input-indicado-por');
        if (inputIndicacao) inputIndicacao.value = ref;
    }

    // Checa se usuário já está cadastrado nesta máquina (LocalStorage)
    const savedId = localStorage.getItem('loomper_user_id');
    if (savedId) {
        console.log('Usuário já cadastrado:', savedId);
        // Opcional: Poderíamos mudar o botão do Hero para "Ver meu link", 
        // mas vamos deixar ele acessar o form e tratamos no submit.
    }
});

// DADOS DOS PERFIS
const modalData = {
    'motorista': {
        title: 'Motorista Cegonheiro',
        bullets: ['Já perdeu tempo procurando chapa confiável?', 'Improviso na descarga gera risco?', 'Quer previsibilidade na rota?'],
        turn: 'A logística não precisa ser no grito.',
        btnText: 'Quero operar com segurança',
        intro: 'Se você vive a estrada, sabe:'
    },
    'ajudante': {
        title: 'Ajudante / Chapa',
        bullets: ['Trabalho aparece só de vez em quando?', 'Falta reconhecimento profissional?', 'Quer sair da informalidade total?'],
        turn: 'Quem trabalha bem merece constância.',
        btnText: 'Quero mais oportunidades',
        intro: 'Na descarga, a realidade é dura:'
    },
    'transportadora': {
        title: 'Transportadora',
        bullets: ['Atrasos na ponta final?', 'Risco jurídico e operacional?', 'Falta de padronização?'],
        turn: 'Organização é lucro e proteção.',
        btnText: 'Quero controle total',
        intro: 'Pequenos ruídos viram grandes prejuízos:'
    }
};

// --- NAVEGAÇÃO E MODAIS ---

function scrollToSection(id) {
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({ behavior: 'smooth' });
}

function openFlow(profileKey) {
    const data = modalData[profileKey];
    
    // Preenche textos
    document.getElementById('modal-intro-text').innerText = data.intro;
    document.getElementById('modal-title-pain').innerText = data.title;
    document.getElementById('modal-bullets-pain').innerHTML = data.bullets.map(t => `<li>${t}</li>`).join('');
    document.getElementById('modal-turn-text').innerText = data.turn;
    document.getElementById('btn-to-step-2').innerText = data.btnText;
    
    document.getElementById('input-perfil').value = profileKey;

    // Reseta visualização
    document.getElementById('step-1').style.display = 'block';
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-success').style.display = 'none';
    
    document.getElementById('modal-flow').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function goToStep2() {
    // Registra data/hora do aceite dos termos (Ponto D - Preparação)
    const now = new Date().toLocaleString('pt-BR');
    document.getElementById('input-data-aceite').value = now;
    
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
}

function openTimelineModal() {
    document.getElementById('modal-timeline').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.onclick = function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// --- LÓGICA DE SUBMISSÃO (Com verificação de duplicidade Ponto I) ---

function submitForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    
    // Pega telefone e remove formatação
    const phoneInput = document.getElementById('phone-input').value;
    const userId = phoneInput.replace(/\D/g, '');
    const perfil = document.getElementById('input-perfil').value;
    
    // Validação básica
    if (userId.length < 10) {
        alert('Digite um WhatsApp válido.');
        return;
    }

    // CHECK DE DUPLICIDADE (Simulado via LocalStorage para MVP estático)
    const savedUser = localStorage.getItem('loomper_user_id');
    const savedProfile = localStorage.getItem('loomper_user_profile');

    if (savedUser === userId && savedProfile === perfil) {
        // Usuário já cadastrado com mesmo perfil -> Mostra tela de sucesso direto
        showSuccessScreen(userId);
        return; 
    }

    btn.innerText = 'Processando...';
    btn.disabled = true;

    // Atualiza Timestamp do aceite
    document.getElementById('input-data-aceite').value = new Date().toLocaleString('pt-BR');

    const formData = new FormData(form);

    fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
    })
    .then(() => {
        // Salva localmente para evitar duplo cadastro
        localStorage.setItem('loomper_user_id', userId);
        localStorage.setItem('loomper_user_profile', perfil);
        
        showSuccessScreen(userId);
        
        form.reset();
        btn.innerText = originalText;
        btn.disabled = false;
    })
    .catch((err) => {
        console.error(err);
        alert('Erro de conexão.');
        btn.innerText = originalText;
        btn.disabled = false;
    });
}

function showSuccessScreen(userId) {
    const siteUrl = window.location.origin;
    const inviteLink = `${siteUrl}/?ref=${userId}`;
    
    document.getElementById('my-referral-link').value = inviteLink;
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-success').style.display = 'block';
}

// --- FUNÇÕES UTILITÁRIAS ---

function shareOnWhatsapp() {
    const link = document.getElementById('my-referral-link').value;
    const msg = `Fala parceiro! Tô usando o Loomper. Entra aí no time de pioneiros: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

function copyPix() {
    navigator.clipboard.writeText("contato@loomper.com.br").then(() => {
        const feedback = document.getElementById('pix-feedback');
        feedback.style.display = 'block';
        setTimeout(() => { feedback.style.display = 'none'; }, 3000);
    });
}

// Máscara Telefone
const phoneInp = document.getElementById('phone-input');
if (phoneInp) {
    phoneInp.addEventListener('input', function (e) {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
}
