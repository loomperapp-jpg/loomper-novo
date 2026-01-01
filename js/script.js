/* ==========================================================================
   LOOMPER LOGIC - VERSÃO 100% (IBGE + RODAPÉ + DADOS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    carregarEstados(); // Inicia API do IBGE
    
    // Rastreio de indicação
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref') || urlParams.get('convite');
    if (ref) {
        const input = document.getElementById('input-indicado-por');
        if (input) input.value = ref;
    }
});

// --- API IBGE ---
function carregarEstados() {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
        .then(response => response.json())
        .then(estados => {
            const selectUF = document.getElementById('uf-select');
            estados.forEach(estado => {
                const option = document.createElement('option');
                option.value = estado.sigla;
                option.textContent = estado.sigla;
                selectUF.appendChild(option);
            });
        });
}

function buscarCidades() {
    const uf = document.getElementById('uf-select').value;
    const selectCidade = document.getElementById('cidade-select');
    
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

// --- CONTEÚDO DOS MODAIS DE RODAPÉ (Popups) ---
const footerContent = {
    'sobre': `<h3>Sobre o Loomper</h3><p>Somos o primeiro ecossistema dedicado a resolver a "última milha" da logística de cegonhas. Não substituímos pessoas; organizamos as relações entre motoristas, chapas e transportadoras.</p>`,
    
    'praque': `<h3>Para que Serve</h3><p>Para o Motorista: Encontrar apoio local confiável.<br>Para o Chapa: Ter serviço constante e pagamento justo.<br>Para a Transportadora: Reduzir riscos de avaria e atraso.</p>`,
    
    'duvidas': `<h3>Dúvidas Frequentes</h3><p><strong>Custa quanto?</strong> Nada durante o Beta.<br><strong>Quando lança?</strong> O App chega em 2026.<br><strong>É seguro?</strong> Sim, validamos todos os cadastros.</p>`,
    
    'legal': `<h3>Informações Legais</h3><p>LOOMPER®<br>Ajud.ai Brasil Inova Simples (I.S.)<br>CNPJ: 59.150.688/0001-39<br><a href="termos.html" style="color:#d4af37">Termos de Uso</a> | <a href="privacidade.html" style="color:#d4af37">Privacidade</a></p>`,
    
    'stakeholders': `<h3>Stakeholders</h3><p>Construído a quatro mãos com:<br>- Sindicatos de Transportes<br>- Associações de Cegonheiros<br>- Operadores Logísticos Independentes</p>`,
    
    'fale': `<h3>Fale Conosco</h3><p>WhatsApp: (11) 96585-8142<br>E-mail: contato@loomper.com.br<br><br>Atendimento de Seg a Sex, das 9h às 18h.</p>`,
    
    'apoie': `<h3><i class="fas fa-heart" style="color:#ff6b35"></i> Apoie o Projeto</h3><p>Ajude a manter a plataforma gratuita.</p>
              <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:20px;">
                <button class="donate-btn" onclick="copyPix()">R$ 20</button>
                <button class="donate-btn" onclick="copyPix()">R$ 50</button>
                <button class="donate-btn outline" onclick="copyPix()">Outro</button>
              </div>
              <p id="pix-msg" style="color:#25d366; display:none; margin-top:10px; font-weight:bold;">Chave PIX copiada: contato@loomper.com.br</p>`
};

function openFooterModal(key) {
    const content = footerContent[key];
    document.getElementById('footer-modal-content').innerHTML = content;
    document.getElementById('modal-footer').style.display = 'block';
}

function copyPix() {
    navigator.clipboard.writeText("contato@loomper.com.br").then(() => {
        const msg = document.getElementById('pix-msg') || document.getElementById('pix-feedback');
        if(msg) {
            msg.style.display = 'block';
            setTimeout(() => { msg.style.display = 'none'; }, 3000);
        } else {
            alert("Chave PIX copiada: contato@loomper.com.br");
        }
    });
}

// --- LÓGICA DE CADASTRO E FLUXO ---

const modalData = {
    'motorista': { title: 'Motorista Cegonheiro', btnText: 'Quero operar com segurança', intro: 'Se você vive a estrada, sabe:', bullets: ['Já perdeu tempo procurando chapa?', 'Improviso na descarga gera risco?', 'Quer previsibilidade?'], turn: 'A logística não precisa ser no grito.' },
    'ajudante': { title: 'Ajudante / Chapa', btnText: 'Quero mais oportunidades', intro: 'Na descarga, a realidade é dura:', bullets: ['Trabalho incerto?', 'Falta reconhecimento?', 'Quer sair da informalidade?'], turn: 'Quem trabalha bem merece constância.' },
    'transportadora': { title: 'Transportadora', btnText: 'Quero controle total', intro: 'Pequenos ruídos viram prejuízos:', bullets: ['Atrasos na ponta final?', 'Risco jurídico?', 'Falta padronização?'], turn: 'Organização é lucro.' }
};

function openFlow(profileKey) {
    const data = modalData[profileKey];
    document.getElementById('modal-title-pain').innerText = data.title;
    document.getElementById('modal-intro-text').innerText = data.intro;
    document.getElementById('modal-bullets-pain').innerHTML = data.bullets.map(t => `<li>${t}</li>`).join('');
    document.getElementById('modal-turn-text').innerText = data.turn;
    document.getElementById('btn-to-step-2').innerText = data.btnText;
    document.getElementById('input-perfil').value = profileKey;

    document.getElementById('step-1').style.display = 'block';
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-success').style.display = 'none';
    document.getElementById('modal-flow').style.display = 'block';
}

function goToStep2() {
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
}

function submitForm(event) {
    event.preventDefault();
    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    
    // Check de duplicidade simples
    const phone = document.getElementById('phone-input').value.replace(/\D/g, '');
    const profile = document.getElementById('input-perfil').value;
    const savedPhone = localStorage.getItem('loomper_phone');
    const savedProfile = localStorage.getItem('loomper_profile');

    if(savedPhone === phone && savedProfile === profile) {
        showSuccess(phone);
        return;
    }

    btn.innerText = 'Processando...';
    btn.disabled = true;
    document.getElementById('input-data-aceite').value = new Date().toLocaleString('pt-BR');

    const formData = new FormData(event.target);
    fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
    }).then(() => {
        localStorage.setItem('loomper_phone', phone);
        localStorage.setItem('loomper_profile', profile);
        showSuccess(phone);
        event.target.reset();
        btn.innerText = originalText;
        btn.disabled = false;
    }).catch(err => {
        alert('Erro ao enviar.');
        btn.disabled = false;
    });
}

function showSuccess(phone) {
    const link = `${window.location.origin}/?ref=${phone}`;
    document.getElementById('my-referral-link').value = link;
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-success').style.display = 'block';
}

function shareOnWhatsapp() {
    const link = document.getElementById('my-referral-link').value;
    const msg = `Fala parceiro! Tô usando o Loomper. Entra aí: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function openTimelineModal() { document.getElementById('modal-timeline').style.display = 'block'; }
function scrollToSection(id) { document.getElementById(id).scrollIntoView({behavior:'smooth'}); }
window.onclick = function(e) { if(e.target.classList.contains('modal')) e.target.style.display = 'none'; }

const phoneInp = document.getElementById('phone-input');
if(phoneInp) phoneInp.addEventListener('input', e => {
    let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
    e.target.value = !x[2] ? x[1] : `(${x[1]}) ${x[2]}${x[3] ? '-' + x[3] : ''}`;
});
