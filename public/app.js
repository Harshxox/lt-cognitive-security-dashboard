document.addEventListener('DOMContentLoaded', () => {
    // 1. HELPERS
    const visualWords = ['Ocean', 'Tiger', 'Rocket', 'Mango', 'Cobalt', 'Storm', 'Mountain', 'Nebula', 'Neon', 'Cactus'];
    function cleanIn(p) { return (p.replace(/[^a-zA-Z]/g, '').slice(0, 6) || "User").replace(/^./, c => c.toUpperCase()); }
    function genPassphrase(p) { return `${cleanIn(p)}-${visualWords[Math.floor(Math.random() * 10)]}-${visualWords[Math.floor(Math.random() * 10)]}`; }
    function genHybrid(p) { return `${visualWords[Math.floor(Math.random() * 10)]}-${cleanIn(p)}!${Math.floor(Math.random() * 90 + 10)}`; }
    function genSymbolInjected(p) { return `${cleanIn(p).replace(/a/gi, '@').replace(/s/gi, '$').replace(/i/gi, '!')}!#99`; }

    // 2. DOM
    const themeToggle = document.getElementById('themeToggle');

    const step1 = document.getElementById('step1'), step2 = document.getElementById('step2'), step3 = document.getElementById('step3');
    const continueBtn = document.getElementById('continueBtn'), firstNameInput = document.getElementById('firstName'), lastNameInput = document.getElementById('lastName'), dobInput = document.getElementById('dob'), phoneInput = document.getElementById('phone');
    const backBtn = document.getElementById('backBtn'), passwordInput = document.getElementById('passwordInput'), toggleView = document.getElementById('toggleView');
    const meterBar = document.getElementById('meterBar'), strengthText = document.getElementById('strengthText'), entropyText = document.getElementById('entropyText'), crackTime = document.getElementById('crackTime');
    const feedbackBox = document.getElementById('feedbackBox'), warningList = document.getElementById('warningList'), aiSuggestionsBox = document.getElementById('aiSuggestionsBox');
    const sug1 = document.getElementById('sug1'), sug2 = document.getElementById('sug2'), sug3 = document.getElementById('sug3');
    const rLen = document.getElementById('rule-len'), rUp = document.getElementById('rule-up'), rNum = document.getElementById('rule-num'), rSym = document.getElementById('rule-sym');
    const openMnemonicBtn = document.getElementById('openMnemonicBtn'), backToAnalyzerBtn = document.getElementById('backToAnalyzerBtn'), buildMnemonicBtn = document.getElementById('buildMnemonicBtn');
    const ans1 = document.getElementById('ans1'), ans2 = document.getElementById('ans2'), ans3 = document.getElementById('ans3');
    const resultBox = document.getElementById('mnemonicResult'), finalMnemonic = document.getElementById('finalMnemonic'), imageStub = document.getElementById('imageStub'), stubIcon = document.getElementById('stubIcon'), promptStubText = document.getElementById('promptStubText'), generatedImage = document.getElementById('generatedImage'), downloadImageBtn = document.getElementById('downloadImageBtn'), copyHashBtn = document.getElementById('copyHashBtn');

    let userPersonalData = [];

    if (toggleView) toggleView.addEventListener('click', () => { const t = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password'; passwordInput.setAttribute('type', t); toggleView.textContent = t === 'password' ? '👁️' : '🙈'; });
    if (continueBtn) continueBtn.addEventListener('click', () => { userPersonalData = [(firstNameInput?.value || '').toLowerCase(), (lastNameInput?.value || '').toLowerCase(), (phoneInput?.value || '')]; if (dobInput?.value) { const [y, m, d] = dobInput.value.split('-'); userPersonalData.push(y, m, d, `${d}${m}${y}`, `${y}${m}${d}`); } userPersonalData = userPersonalData.filter(i => i !== ""); step1.classList.add('hidden'); step2.classList.remove('hidden'); passwordInput.focus(); });
    if (backBtn) backBtn.addEventListener('click', () => { step2.classList.add('hidden'); step1.classList.remove('hidden'); });
    if (openMnemonicBtn) openMnemonicBtn.addEventListener('click', () => { step2.classList.add('hidden'); step3.classList.remove('hidden'); const pools = [["Favorite animal?", "Childhood hero?"], ["City to visit?", "Dream vacation?"], ["Favorite dessert?", "Daily gadget?"]]; ans1.placeholder = pools[0][Math.floor(Math.random() * pools[0].length)]; ans2.placeholder = pools[1][Math.floor(Math.random() * pools[1].length)]; ans3.placeholder = pools[2][Math.floor(Math.random() * pools[2].length)]; });
    if (backToAnalyzerBtn) backToAnalyzerBtn.addEventListener('click', () => { step3.classList.add('hidden'); step2.classList.remove('hidden'); });
    [sug1, sug2, sug3].forEach(btn => { if (btn) btn.addEventListener('click', () => { passwordInput.value = btn.innerText; passwordInput.dispatchEvent(new Event('input')); }); });

    // 3. SECURE API BREACH CHECK (STABLE)
    async function checkBreach(password) {
        const hash = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex).toUpperCase();
        try {
            const res = await fetch(`https://api.pwnedpasswords.com/range/${hash.slice(0, 5)}`);
            const leakedList = (await res.text()).split('\n');
            for (let line of leakedList) if (line.split(':')[0] === hash.slice(5)) return parseInt(line.split(':')[1]);
            return 0;
        } catch (e) { return -1; }
    }

    // 4. PASSWORD EVALUATION
    if (passwordInput) passwordInput.addEventListener('input', async (e) => {
        const val = e.target.value;
        if (rLen) rLen.classList.toggle('valid', val.length >= 12); if (rUp) rUp.classList.toggle('valid', /[A-Z]/.test(val)); if (rNum) rNum.classList.toggle('valid', /[0-9]/.test(val)); if (rSym) rSym.classList.toggle('valid', /[!@#$%^&*(),.?":{}|<>]/.test(val));

        if (val === '') { if (meterBar) meterBar.style.width = '0%'; if (strengthText) strengthText.textContent = 'None'; if (entropyText) entropyText.textContent = '0 bits'; if (crackTime) crackTime.textContent = '0s'; if (feedbackBox) feedbackBox.classList.add('hidden'); if (aiSuggestionsBox) aiSuggestionsBox.classList.add('hidden'); if (warningList) warningList.innerHTML = ''; return; }

        const readable = val.replace(/([A-Z])/g, ' $1').replace(/([0-9]+)/g, ' $1').trim();
        const doc = nlp(readable);
        const aiDict = [...doc.organizations().out('array'), ...doc.places().out('array'), ...doc.people().out('array')].map(w => w.toLowerCase());
        const result = zxcvbn(val, [...userPersonalData, ...aiDict]);
        if (result.sequence.some(m => m.dictionary_name === 'user_inputs')) { result.score = 0; result.feedback.warning = "🚨 TARGETING RISK: Contains personal/company data."; }

        if (entropyText) entropyText.textContent = `${Math.max(0, Math.log2(result.guesses)).toFixed(1)} bits`;
        if (crackTime) crackTime.textContent = result.crack_times_display.offline_fast_hashing_1e10_per_second;

        const colors = [{ w: '20%', c: '#ef4444', t: 'Critical' }, { w: '40%', c: '#f97316', t: 'Weak' }, { w: '60%', c: '#eab308', t: 'Moderate' }, { w: '80%', c: '#38bdf8', t: 'Strong' }, { w: '100%', c: '#10b981', t: 'Secure' }];
        if (meterBar) { meterBar.style.width = colors[result.score].w; meterBar.style.backgroundColor = colors[result.score].c; }
        if (strengthText) { strengthText.textContent = colors[result.score].t; strengthText.style.color = colors[result.score].c; }

        if (warningList) warningList.innerHTML = '';
        if (result.score < 3) {
            if (feedbackBox) feedbackBox.classList.remove('hidden');
            if (result.feedback.warning && warningList) warningList.innerHTML += `<li>${result.feedback.warning}</li>`;
            if (sug1) sug1.innerText = genPassphrase(val); if (sug2) sug2.innerText = genHybrid(val); if (sug3) sug3.innerText = genSymbolInjected(val);
            if (aiSuggestionsBox) aiSuggestionsBox.classList.remove('hidden');
        } else { if (feedbackBox) feedbackBox.classList.add('hidden'); if (aiSuggestionsBox) aiSuggestionsBox.classList.add('hidden'); }

        const breachStatusLi = document.createElement('li'); breachStatusLi.style.marginTop = "10px"; breachStatusLi.textContent = "🔍 Checking Live Databases...";
        if (warningList) warningList.appendChild(breachStatusLi); if (feedbackBox) feedbackBox.classList.remove('hidden');

        const leaks = await checkBreach(val);
        if (leaks > 0) { if (meterBar) { meterBar.style.width = '100%'; meterBar.style.backgroundColor = '#ef4444'; } if (strengthText) { strengthText.textContent = 'COMPROMISED'; strengthText.style.color = '#ef4444'; } breachStatusLi.innerHTML = `<strong>🚨 CRITICAL: Found in ${leaks.toLocaleString()} data breaches!</strong>`; }
        else if (leaks === 0) { breachStatusLi.textContent = "✅ Safe: No known breaches found."; } else if (leaks === -1) { breachStatusLi.textContent = "⚠️ Network error checking databases."; }
    });

    // 5. LOCAL AI IMAGE GENERATOR (UPDATED PROMPT)
    if (buildMnemonicBtn) buildMnemonicBtn.addEventListener('click', async () => {
        const w1 = ans1?.value || "Ironman"; const w2 = ans2?.value || "Song"; const w3 = ans3?.value || "Cake";
        const sym = ['@', '#', '$', '%', '*', '&', '!'][Math.floor(Math.random() * 7)];

        // Generate the random number here so we can pass it to the prompt
        const num = Math.floor(Math.random() * 90 + 10);

        const pwd = `${w1.charAt(0).toUpperCase() + w1.slice(1)}${w2.charAt(0).toUpperCase() + w2.slice(1)}${w3.charAt(0).toUpperCase() + w3.slice(1)}${sym}${num}`;
        if (finalMnemonic) finalMnemonic.innerText = pwd;

        // 🔥 NEW DYNAMIC PROMPT INCLUDES THE NUMBER 🔥
        const aiPrompt = `A masterpiece digital illustration of ${w1} wearing a futuristic jacket with the massive glowing number ${num} boldly printed on the chest, standing in ${w2} holding a ${w3}, highly detailed, breathtaking concept art.`;

        if (resultBox) resultBox.classList.remove('hidden'); if (generatedImage) generatedImage.classList.add('hidden'); if (stubIcon) stubIcon.classList.remove('hidden');
        if (promptStubText) { promptStubText.classList.remove('hidden'); promptStubText.innerText = `⏳ Contacting Local Python GPU...`; }
        if (resultBox) resultBox.scrollIntoView({ behavior: 'smooth' });

        try {
            const response = await fetch("http://127.0.0.1:8000/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: aiPrompt }) });
            if (!response.ok) throw new Error("Local server down.");
            const data = await response.json();
            if (stubIcon) stubIcon.classList.add('hidden'); if (promptStubText) promptStubText.classList.add('hidden');
            if (generatedImage) { generatedImage.src = data.image_base64; generatedImage.classList.remove('hidden'); }
            if (downloadImageBtn) downloadImageBtn.classList.remove('hidden');
        } catch (error) {
            console.error(error);
            if (promptStubText) { promptStubText.innerText = `⚠️ ERROR: Backend Offline. Did you start Python?`; promptStubText.style.color = "#ef4444"; }
        }
    });

    if (downloadImageBtn && generatedImage) {
        downloadImageBtn.addEventListener('click', () => {
            const a = document.createElement('a');
            a.href = generatedImage.src;
            a.download = `AGORAX_ASSET_${finalMnemonic.innerText ? finalMnemonic.innerText.toUpperCase() : 'SECURE'}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }

    if (copyHashBtn && finalMnemonic) {
        copyHashBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(finalMnemonic.innerText).then(() => {
                const originalText = copyHashBtn.innerText;
                copyHashBtn.innerText = "[COPIED!]";
                copyHashBtn.style.color = "var(--bg-dark)";
                copyHashBtn.style.backgroundColor = "var(--accent)";
                copyHashBtn.style.borderColor = "var(--accent)";
                setTimeout(() => {
                    copyHashBtn.innerText = originalText;
                    copyHashBtn.style.color = "";
                    copyHashBtn.style.backgroundColor = "";
                    copyHashBtn.style.borderColor = "";
                }, 2000);
            });
        });
    }

});