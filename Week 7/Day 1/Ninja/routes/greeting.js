const express = require('express');

const router = express.Router();
const emojis = ['😀', '🎉', '🌟', '🎈', '👋'];

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

function renderPage({ name = '', emoji = emojis[0], error = '', greeting = '' } = {}) {
    const escapedName = escapeHtml(name);
    const emojiOptions = emojis.map((option) => `
                <label class="emoji-choice">
                    <input type="radio" name="emoji" value="${option}"${option === emoji ? ' checked' : ''}>
                    <span aria-hidden="true">${option}</span>
                    <span class="sr-only">${option}</span>
                </label>`).join('');
    const errorMessage = error ? `<p class="error" role="alert">${escapeHtml(error)}</p>` : '';
    const greetingMessage = greeting
        ? `<p class="greeting" role="status">${emoji} ${escapedName}, ${greeting}</p>`
        : '';

    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>A Little Hello</title>
    <style>
        :root {
            color-scheme: light;
            font-family: "Trebuchet MS", "Segoe UI", sans-serif;
            color: #18323a;
            background: #eaf7f3;
        }
        * { box-sizing: border-box; }
        body {
            min-height: 100vh;
            margin: 0;
            display: grid;
            place-items: center;
            padding: 28px 18px;
            background: radial-gradient(ellipse at 12% 12%, #d3f3e8 0, transparent 38%),
                        linear-gradient(145deg, #f2fbf8, #e6f2fb);
        }
        main {
            width: min(100%, 520px);
            padding: clamp(24px, 6vw, 48px);
            border: 1px solid #c8e1da;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.92);
            box-shadow: 0 18px 50px rgba(31, 84, 78, 0.12);
        }
        .eyebrow {
            margin: 0 0 10px;
            color: #087e78;
            font-size: 0.78rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
        }
        h1 {
            margin: 0;
            color: #173a40;
            font-family: Georgia, "Times New Roman", serif;
            font-size: clamp(2rem, 8vw, 3rem);
            font-weight: 500;
            line-height: 1.08;
        }
        .intro { margin: 12px 0 30px; color: #527077; line-height: 1.5; }
        label[for="name"] { display: block; margin-bottom: 8px; font-weight: 700; }
        input[type="text"] {
            width: 100%;
            min-height: 48px;
            padding: 10px 13px;
            border: 1px solid #a8c9c3;
            border-radius: 6px;
            color: inherit;
            font: inherit;
        }
        input[type="text"]:focus-visible, input[type="radio"]:focus-visible + span {
            outline: 3px solid #f29a66;
            outline-offset: 3px;
        }
        fieldset { margin: 22px 0 26px; padding: 0; border: 0; }
        legend { margin-bottom: 11px; font-weight: 700; }
        .emoji-list { display: flex; flex-wrap: wrap; gap: 9px; }
        .emoji-choice {
            position: relative;
            display: grid;
            width: 52px;
            height: 52px;
            place-items: center;
            border: 1px solid #bfd9d2;
            border-radius: 8px;
            background: #f2faf7;
            cursor: pointer;
        }
        .emoji-choice:has(input:checked) {
            border-color: #087e78;
            background: #dff4ed;
            box-shadow: inset 0 0 0 1px #087e78;
        }
        .emoji-choice input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; }
        .emoji-choice span[aria-hidden="true"] { font-size: 1.55rem; }
        .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; }
        button {
            width: 100%;
            min-height: 48px;
            border: 0;
            border-radius: 6px;
            background: #087e78;
            color: white;
            font: inherit;
            font-weight: 700;
            cursor: pointer;
        }
        button:hover { background: #066761; }
        .error, .greeting { margin: 22px 0 0; padding: 13px 15px; border-radius: 6px; line-height: 1.5; }
        .error { border: 1px solid #e7a59c; background: #fff1ee; color: #8f3128; }
        .greeting { border: 1px solid #a8d8c7; background: #eaf8f1; color: #155643; font-size: 1.15rem; font-weight: 700; }
        @media (prefers-reduced-motion: no-preference) {
            main { animation: arrive 380ms ease-out both; }
            @keyframes arrive { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        }
    </style>
</head>
<body>
    <main>
        <p class="eyebrow">A little hello</p>
        <h1>Make someone smile.</h1>
        <p class="intro">Put a name to the good vibes.</p>
        <form action="/greet" method="post">
            <label for="name">Your name</label>
            <input id="name" name="name" type="text" maxlength="50" value="${escapedName}" autocomplete="given-name" required>
            <fieldset>
                <legend>Pick your emoji</legend>
                <div class="emoji-list">${emojiOptions}
                </div>
            </fieldset>
            <button type="submit">Send a greeting</button>
        </form>
        ${errorMessage}
        ${greetingMessage}
    </main>
</body>
</html>`;
}

router.get('/', (req, res) => {
    res.type('html').send(renderPage());
});

router.post('/greet', (req, res) => {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const emoji = typeof req.body.emoji === 'string' ? req.body.emoji : '';

    if (!name || name.length > 50) {
        return res.status(400).type('html').send(renderPage({
            name: name.slice(0, 50),
            emoji: emojis.includes(emoji) ? emoji : emojis[0],
            error: 'Enter a name between 1 and 50 characters.'
        }));
    }
    if (!emojis.includes(emoji)) {
        return res.status(400).type('html').send(renderPage({
            name,
            error: 'Choose one of the available emojis.'
        }));
    }

    res.type('html').send(renderPage({
        name,
        emoji,
        greeting: 'hope your day is wonderful!'
    }));
});

module.exports = router;