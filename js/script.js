/* ==========================================================================
   LOOMPER LOGIC - VERSÃO MGM (RASTREAMENTO DE INDICAÇÃO)
   ========================================================================== */

// 1. RASTREAMENTO DE ENTRADA (Ao carregar a página)
document.addEventListener('DOMContentLoaded', function() {
    // Procura por ?ref= ou ?convite= na URL
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref') || urlParams.get('convite');
    
    // Se achou um código, salva no input oculto do formulário
    if (ref) {
        const inputIndicacao = document.getElementById('input-indicado-por');
        if (inputIndicacao) {
            inputIndicacao.value = ref;
            console.log('Indicação detectada:', ref);
        }
    }
});

// DADOS DOS MODAIS (Textos)
const modalData = {
    'motorista': {
        title: 'Motorista de Cegonha',
        bullets: ['Já perdeu tempo procurando ajudante confiável?', 'Já precisou improvisar na descarga?', 'Sente que a pressa vira risco?'],
        turn: 'A logística não precisa ser no grito nem na sorte.',
        btnText: 'Quero operar com mais segurança',
        intro: 'Se você vive a operação real, já passou por isso:'
    },
    'ajudante': {
        title: 'Ajudante / Chapa',
        bullets: ['Serviço aparece quando aparece?', 'Esforço não é reconhecido?', 'Falta continuidade?'],
        turn: 'Quem trabalha bem merece mais que sorte.',
        btnText: 'Quero mais oportunidades',
        intro: 'Na descarga, você sabe como funciona:'
    },
    'transportadora': {
        title: 'Transportadora',
        bullets: ['Atrasos por falta de apoio local?', 'Risco concentrado na descarga?', 'Dificuldade de padronização?'],
        turn: 'Organização é proteção da operação.',
        btnText: 'Quero controle operacional',
        intro: 'Pequenos ruídos viram grandes prejuízos:'
    }
};

// --- FUNÇÕES DE NAVEGAÇÃO ---

function scrollToSection(id) {
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({ behavior: 'smooth' });
}

function openFlow(profileKey) {
    const data = modalData[profileKey] || modalData['motorista']; 
    
    // Preenche textos
    document.getElementById('modal-intro-text').innerText = data.intro;
    document.getElementById('modal-title-pain').innerText = data.title;
    document.getElementById('modal-bullets-pain').innerHTML = data.bullets.map(t => `<li>${t}</li>`).join('');
    document.getElementById('modal-turn-text').innerText = data.turn;
    document.getElementById('btn-to-step-2').innerText = data.btnText;
    
    document.getElementById('input-perfil').value = profileKey;

    // Reseta telas
    document.getElementById('step-1').style.display = 'block';
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-success').style.display = 'none';
    
    document.getElementById('modal-flow').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function goToStep2() {
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.onclick = function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
}

// --- LÓGICA DE SUBMISSÃO E GERAÇÃO DE CONVITE ---

function submitForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    
    // 1. Pega o telefone para usar como ID
    const phoneInput = document.getElementById('phone-input').value;
    const userId = phoneInput.replace(/\D/g, ''); // Remove tudo que não é número (Ex: 11999998888)
    
    if (userId.length < 10) {
        alert('Por favor, digite um WhatsApp válido.');
        return;
    }

    btn.innerText = 'Processando...';
    btn.disabled = true;

    const formData = new FormData(form);

    // 2. Envia para o Netlify
    fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
    })
    .then(() => {
        // 3. SUCESSO: Gera o Link de Convite
        const siteUrl = window.location.origin; // Ex: https://loomper.netlify.app
        const inviteLink = `${siteUrl}/?ref=${userId}`;
        
        // Coloca o link no input da tela de sucesso
        document.getElementById('my-referral-link').value = inviteLink;
        
        // Troca a tela
        document.getElementById('step-2').style.display = 'none';
        document.getElementById('step-success').style.display = 'block';
        
        // Opcional: Salva no LocalStorage para lembrar que ele já se cadastrou
        localStorage.setItem('loomper_user_id', userId);

        form.reset();
        btn.innerText = originalText;
        btn.disabled = false;
    })
    .catch((err) => {
        console.error(err);
        alert('Erro de conexão. Tente novamente.');
        btn.innerText = originalText;
        btn.disabled = false;
    });
}

// --- COMPARTILHAR NO WHATSAPP ---
function shareOnWhatsapp() {
    const link = document.getElementById('my-referral-link').value;
    const msg = `Fala parceiro! Tô usando o Loomper pra organizar a logística. Entra aí no time de pioneiros que vale a pena: ${link}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

// --- MÁSCARA DE TELEFONE ---
const phoneInp = document.getElementById('phone-input');
if (phoneInp) {
    phoneInp.addEventListener('input', function (e) {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
}
