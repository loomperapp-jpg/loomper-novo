/* ==========================================================================
   LOOMPER LOGIC - VERSÃO FINAL (MOTOR COMPLETO)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // 1. Inicia API do IBGE
    carregarEstados();
    
    // 2. Verifica se veio por Indicação (MGM)
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref') || urlParams.get('convite');
    
    if (ref) {
        const inputIndicacao = document.getElementById('input-indicado-por');
        if (inputIndicacao) {
            inputIndicacao.value = ref;
            console.log("Indicação detectada:", ref);
        }
    }
});

// --- API IBGE (CIDADES E ESTADOS) ---
function carregarEstados() {
    const selectUF = document.getElementById('uf-select');
    if(!selectUF) return;

    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
        .then(response => response.json())
        .then(estados => {
            estados.forEach(estado => {
                const option = document.createElement('option');
                option.value = estado.sigla;
                option.textContent = estado.sigla;
                selectUF.appendChild(option);
            });
        })
        .catch(err => console.error("Erro IBGE:", err));
}

function buscarCidades() {
    const uf = document.getElementById('uf-select').value;
    const selectCidade = document.getElementById('cidade-select');
    
    if(!selectCidade) return;

    selectCidade.innerHTML = '<option value="">Carregando...</option>';
    selectCidade.disabled = true;

    if (uf) {
        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
            .then(response => response.json())
            .then(cidades => {
                selectCidade.innerHTML = '<option value="">Selecione a Cidade</option>';
                cidades.forEach(cidade => {
                    const option = document.createElement('option');
                    option.value = cidade.nome;
                    option.textContent = cidade.nome;
                    selectCidade.appendChild(option);
                });
                selectCidade.disabled = false;
            });
    } else {
        selectCidade.innerHTML = '<option value="">Aguardando UF...</option>';
    }
}

// --- CONTEÚDO DOS MODAIS DE RODAPÉ (MENU) ---
const footerContent = {
    'sobre': `
        <h3>Sobre o Loomper</h3>
        <p>Somos o primeiro ecossistema dedicado a resolver a "última milha" da logística de cegonhas. Não substituímos pessoas; organizamos as relações entre motoristas, chapas e transportadoras para gerar valor, segurança e dignidade.</p>
    `,
    
    'praque': `
        <h3>Para que Serve</h3>
        <ul style="list-style:none; padding:0;">
            <li style="margin-bottom:10px;">🚚 <strong>Para o Motorista:</strong> Encontrar apoio local confiável e qualificado.</li>
            <li style="margin-bottom:10px;">🤝 <strong>Para o Chapa:</strong> Ter serviço constante, previsível e pagamento justo.</li>
            <li style="margin-bottom:10px;">🏢 <strong>Para a Transportadora:</strong> Reduzir riscos de avaria, custos jurídicos e atrasos.</li>
        </ul>
    `,
    
    'duvidas': `
        <h3>Dúvidas Frequentes</h3>
        <p><strong>Custa quanto?</strong><br>Nada para motoristas e chapas durante o Beta.</p>
        <p><strong>Quando lança?</strong><br>O App oficial chega em Junho/2026. Agora estamos na fase de Pioneiros.</p>
        <p><strong>É seguro?</strong><br>Sim, validamos todos os cadastros e monitoramos a reputação.</p>
    `,
    
    'legal': `
        <h3>Informações Legais</h3>
        <p><strong>LOOMPER®</strong><br>Uma empresa do Grupo Ajud.ai Brasil Inova Simples (I.S.)</p>
        <p>CNPJ: 59.150.688/0001-39</p>
        <p style="margin-top:20px;">
            <a href="termos.html" target="_blank" style="color:#d4af37; text-decoration:underline;">Termos de Uso</a> | 
            <a href="privacidade.html" target="_blank" style="color:#d4af37; text-decoration:underline;">Política de Privacidade</a>
        </p>
    `,
    
    'stakeholders': `
        <h3>Investidores & Parceiros</h3>
        <p>Selecione seu perfil para contato direto com a diretoria:</p>
        <div class="investor-grid">
            <a href="mailto:contato@loomper.com.br?subject=Sou Anjo/Investidor - Gostaria de infos" class="investor-btn">👼 Anjo / Investidor</a>
            <a href="mailto:contato@loomper.com.br?subject=Sou Governo - Gostaria de infos" class="investor-btn">🏛️ Governo</a>
            <a href="mailto:contato@loomper.com.br?subject=Sou Montadora - Gostaria de infos" class="investor-btn">🏭 Montadora</a>
            <a href="mailto:contato@loomper.com.br?subject=Sou Transportadora - Gostaria de infos" class="investor-btn">🚚 Transportadora</a>
            <a href="mailto:contato@loomper.com.br?subject=Sou Seguradora - Gostaria de infos" class="investor-btn">🛡️ Seguradora</a>
        </div>
    `,
    
    'fale': `
        <h3>Fale Conosco</h3>
        <p>Estamos prontos para te ouvir.</p>
        <p><strong>WhatsApp:</strong> (11) 96585-8142</p>
        <p><strong>E-mail:</strong> contato@loomper.com.br</p>
        <p style="font-size:0.8rem; color:#888; margin-top:10px;">Atendimento de Seg a Sex, das 9h às 18h.</p>
    `,
    
    'apoie': `
        <h3><i class="fas fa-heart" style="color:#ff6b35"></i> Apoie o Projeto</h3>
        <p>O Loomper é uma iniciativa independente. Sua contribuição ajuda a manter a tecnologia gratuita para quem precisa.</p>
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:20px;">
            <button class="donate-btn" onclick="copyPix()">Apoiar R$ 20</button>
            <button class="donate-btn" onclick="copyPix()">Apoiar R$ 50</button>
            <button class="donate-btn outline" onclick="copyPix()">Outro Valor</button>
        </div>
        <p id="pix-msg-modal" style="color:#25d366; display:none; margin-top:15px; font-weight:bold; text-align:center;">
            <i class="fas fa-check"></i> Chave PIX copiada: contato@loomper.com.br
        </p>
    `
};

// Função que abre os modais do rodapé
function openFooterModal(key) {
    const content = footerContent[key];
    const contentDiv = document.getElementById('footer-modal-content');
    const modal = document.getElementById('modal-footer');
    
    if(contentDiv && modal && content) {
        contentDiv.innerHTML = content;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Trava scroll
    }
}

// --- FUNÇÕES DE NAVEGAÇÃO E UX ---

function scrollToSection(id) {
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({ behavior: 'smooth' });
}

function openTimelineModal() {
    const modal = document.getElementById('modal-timeline');
    if(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Destrava scroll
    }
}

// Fecha ao clicar fora
window.onclick = function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function copyPix() {
    navigator.clipboard.writeText("contato@loomper.com.br").then(() => {
        // Tenta achar feedback no rodapé ou no modal
        const feedbackFooter = document.getElementById('pix-feedback');
        const feedbackModal = document.getElementById('pix-msg-modal');
        
        if (feedbackFooter && feedbackFooter.offsetParent !== null) {
            feedbackFooter.style.display = 'block';
            setTimeout(() => { feedbackFooter.style.display = 'none'; }, 3000);
        } else if (feedbackModal) {
            feedbackModal.style.display = 'block';
            setTimeout(() => { feedbackModal.style.display = 'none'; }, 3000);
        } else {
            alert("Chave PIX copiada: contato@loomper.com.br");
        }
    });
}

// --- FLUXO DE CADASTRO (CARDS PRINCIPAIS) ---

const modalData = {
    'motorista': {
        title: 'Motorista Cegonheiro',
        btnText: 'Quero operar com segurança',
        intro: 'Se você vive a estrada, sabe:',
        bullets: ['Já perdeu tempo procurando chapa confiável?', 'Improviso na descarga gera risco de avaria?', 'Quer previsibilidade na rota?'],
        turn: 'A logística não precisa ser no grito.'
    },
    'ajudante': {
        title: 'Ajudante / Chapa',
        btnText: 'Quero mais oportunidades',
        intro: 'Na descarga, a realidade é dura:',
        bullets: ['O trabalho aparece só de vez em quando?', 'Falta reconhecimento profissional?', 'Quer sair da informalidade total?'],
        turn: 'Quem trabalha bem merece constância.'
    },
    'transportadora': {
        title: 'Transportadora',
        btnText: 'Quero controle total',
        intro: 'Pequenos ruídos viram grandes prejuízos:',
        bullets: ['Atrasos na ponta final?', 'Risco jurídico e operacional?', 'Falta de padronização nos processos?'],
        turn: 'Organização é lucro e proteção.'
    }
};

function openFlow(profileKey) {
    const data = modalData[profileKey];
    if(!data) return;

    // Popula textos
    document.getElementById('modal-title-pain').innerText = data.title;
    document.getElementById('modal-intro-text').innerText = data.intro;
    document.getElementById('modal-bullets-pain').innerHTML = data.bullets.map(t => `<li>${t}</li>`).join('');
    document.getElementById('modal-turn-text').innerText = data.turn;
    document.getElementById('btn-to-step-2').innerText = data.btnText;
    
    // Define input oculto
    document.getElementById('input-perfil').value = profileKey;

    // Reseta telas
    document.getElementById('step-1').style.display = 'block';
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-success').style.display = 'none';
    
    // Abre
    document.getElementById('modal-flow').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function goToStep2() {
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
}

// --- SUBMISSÃO DO FORMULÁRIO ---

function submitForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    
    // Pega dados para validação
    const phoneInput = document.getElementById('phone-input').value;
    const userId = phoneInput.replace(/\D/g, ''); // Apenas números
    const perfil = document.getElementById('input-perfil').value;
    
    // Validação
    if (userId.length < 10) {
        alert('Por favor, digite um WhatsApp válido.');
        return;
    }

    // CHECK DE DUPLICIDADE (Local)
    const savedUser = localStorage.getItem('loomper_user_id');
    const savedProfile = localStorage.getItem('loomper_user_profile');

    if (savedUser === userId && savedProfile === perfil) {
        showSuccessScreen(userId);
        return;
    }

    // Prepara envio
    btn.innerText = 'Processando...';
    btn.disabled = true;
    
    // Timestamp do aceite
    const dataAceiteInput = document.getElementById('input-data-aceite');
    if(dataAceiteInput) dataAceiteInput.value = new Date().toLocaleString('pt-BR');

    const formData = new FormData(form);

    // Envio Netlify
    fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
    })
    .then(() => {
        // Salva localmente
        localStorage.setItem('loomper_user_id', userId);
        localStorage.setItem('loomper_user_profile', perfil);
        
        showSuccessScreen(userId);
        
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

function showSuccessScreen(userId) {
    const siteUrl = window.location.origin;
    const inviteLink = `${siteUrl}/?ref=${userId}`;
    
    document.getElementById('my-referral-link').value = inviteLink;
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-success').style.display = 'block';
}

function shareOnWhatsapp() {
    const link = document.getElementById('my-referral-link').value;
    const msg = `Fala parceiro!
Tô participando da construção do Loomper - um app criado pra organizar a logística e valorizar quem faz o transporte acontecer.

Estamos formando um grupo seleto de pioneiros pra testar a versão beta e ajudar a moldar o app do nosso jeito.

Se fizer sentido pra você, entra aqui 👇
${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

// MÁSCARA TELEFONE
const phoneInp = document.getElementById('phone-input');
if (phoneInp) {
    phoneInp.addEventListener('input', function (e) {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
}
