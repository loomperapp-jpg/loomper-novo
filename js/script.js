/* ==========================================================================
   LOOMPER LOGIC - VERSÃO 1.000.000%
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    carregarEstados();
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
    } else { selectCidade.innerHTML = '<option value="">Aguardando UF...</option>'; }
}

// --- CONTEÚDO MODAIS RODAPÉ (COM LÓGICA INVESTIDOR) ---
const footerContent = {
    'sobre': `<h3>Sobre o Loomper</h3><p>Somos o primeiro ecossistema dedicado a resolver a "última milha" da logística de cegonhas. Não substituímos pessoas; organizamos as relações.</p>`,
    
    'praque': `<h3>Para que Serve</h3><p>Motorista: Apoio local confiável.<br>Chapa: Serviço constante.<br>Transportadora: Redução de riscos.</p>`,
    
    'duvidas': `<h3>Dúvidas Frequentes</h3><p><strong>Custa quanto?</strong> Nada durante o Beta.<br><strong>Quando lança?</strong> O App chega em 2026.<br><strong>É seguro?</strong> Sim, validamos cadastros.</p>`,
    
    'legal': `<h3>Legal</h3><p>LOOMPER®<br>CNPJ: 59.150.688/0001-39<br><a href="termos.html" style="color:#d4af37">Termos de Uso</a> | <a href="privacidade.html" style="color:#d4af37">Privacidade</a></p>`,
    
    'stakeholders': `<h3>Área de Investidores & Parceiros</h3>
                     <p>Selecione seu perfil para contato direto:</p>
                     <div class="investor-grid">
                        <a href="mailto:contato@loomper.com.br?subject=Sou Anjo/Investidor - Quero saber mais" class="investor-btn">Anjo / Investidor</a>
                        <a href="mailto:contato@loomper.com.br?subject=Sou Governo - Quero saber mais" class="investor-btn">Governo</a>
                        <a href="mailto:contato@loomper.com.br?subject=Sou Montadora - Quero saber mais" class="investor-btn">Montadora</a>
                        <a href="mailto:contato@loomper.com.br?subject=Sou Transportadora - Quero saber mais" class="investor-btn">Transportadora</a>
                        <a href="mailto:contato@loomper.com.br?subject=Sou Seguradora - Quero saber mais" class="investor-btn">Seguradora</a>
                     </div>`,
    
    'fale': `<h3>Fale Conosco</h3><p>WhatsApp: (11) 96585-8142<br>E-mail: contato@loomper.com.br</p>`,
    
    'apoie': `<h3><i class="fas fa-heart" style="color:#ff6b35"></i> Apoie o Projeto</h3><p>Ajude a manter a plataforma gratuita.</p>
              <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:20px;">
                <button class="donate-btn" onclick="copyPix()">R$ 20</button>
                <button class="donate-btn" onclick="copyPix()">R$ 50</button>
                <button class="donate-btn outline" onclick="copyPix()">Outro</button>
              </div>
              <p id="pix-msg" style="color:#25d366; display:none; margin-top:10px; font-weight:bold;">Chave PIX copiada: contato@loomper.com.br</p>`
};

function openFooterModal(key) {
    document.getElementById('footer-modal-content').innerHTML = footerContent[key];
    document.getElementById('modal-footer').style.display = 'block';
}

function copyPix() {
    navigator.clipboard.writeText("contato@loomper.com.br").then(() => {
        const msg = document.getElementById('pix-msg');
        if(msg) { msg.style.display = 'block'; setTimeout(() => { msg.style.display = 'none'; }, 3000); }
        else { alert("Chave PIX copiada!"); }
    });
}

// --- FLUXO E FORMULÁRIO ---
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
    
    const phone = document.getElementById('phone-input').value.replace(/\D/g, '');
    const profile = document.getElementById('input-perfil').value;
    const savedPhone = localStorage.getItem('loomper_phone');
    const savedProfile = localStorage.getItem('loomper_profile');

    if(savedPhone === phone && savedProfile === profile) { showSuccess(phone); return; }

    btn.innerText = 'Processando...';
    btn.disabled = true;
    document.getElem
