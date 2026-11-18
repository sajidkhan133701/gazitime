# Gazitime

Bilingual (বাংলা / English) news website for **gazitime.online**.

| | |
|---|---|
| **Live** | https://gazitime.online |
| **Hosting** | Cloudflare Pages (free) |
| **Repo** | https://github.com/sajidkhan133701/gazitime |
| **Stack** | Plain HTML + CSS + JS — kono build step nei |

> Ei folder = puro website. Ekhane edit koro, tarpor `deploy.ps1` chalao — live hoye jabe.

---

## Folder structure

```
Gazitime/
├── index.html        <- puro page (masthead, nav, lead, cards, sidebar, opinion, footer)
├── css/style.css     <- sob design, color, responsive
├── js/script.js      <- language toggle, search, menu, clock
├── images/           <- chhobi gula (metro.jpg, cricket.jpg, tech.jpg, ...)
├── favicon.svg       <- browser tab icon
├── 404.html          <- not-found page
├── robots.txt        <- search engine rule
├── sitemap.xml       <- Google er jonno page list
├── _headers          <- security + cache header (Cloudflare)
├── deploy.ps1        <- ek command e live
└── preview.ps1       <- local e dekhar jonno
```

---

## Ki kore edit korbe

### Text badlate
`index.html` khulo. Prottek text e **dui bhasha** ache:

```html
<h3 data-bn="বাংলা লেখা" data-en="English text">বাংলা লেখা</h3>
```

- `data-bn` = Bangla version
- `data-en` = English version
- vitore ja ache = default (Bangla) — eta o same text rakho

Dui jagay edit koro, nahole ek bhashay purono text theke jabe.

### Chhobi badlate
`images/` folder e tomar chhobi rakho (onek bharr hole `.jpg`, width ~1400px), tarpor `index.html` e `src` change koro:

```html
<img src="images/metro.jpg" alt="...">
```

### Color / design badlate
`css/style.css` er ekdom upore:

```css
:root {
  --accent: #c8102e;   /* lal color (logo, button, link hover) */
  --ink: #14161a;      /* text color */
  --paper: #ffffff;    /* background */
}
```

Ei value gulo badlale puro site er look change hobe.

### Notun news card add korte
`index.html` e `id="cards"` er vitore ekta `<article class="card">` copy-paste koro, tarpor text + image badlo. Language toggle automatic kaj korbe jodi `data-bn` / `data-en` deowa thake.

---

## Deploy (edit kore live kora)

```powershell
cd "F:\Gazitime"

.\preview.ps1                      # 1) nijer PC te dekho -> http://localhost:5600
.\deploy.ps1 "notun khobor add korlam"   # 2) live koro -> ~40 sec
```

`deploy.ps1` nijei `git add` + `commit` + `push` kore dey. Push holei Cloudflare Pages nije build kore live kore fele.

Manual git:

```powershell
git add -A
git commit -m "message"
git push
```

**Note:** PowerShell script block korle ekbar chalao:
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

---

## Hosting kothay kivabe

- Cloudflare Pages project: `gazitime` (repo er `main` branch theke auto build)
- Framework preset: `None`, build command: khali, output directory: khali (repo root)
- DNS: `CNAME gazitime.online -> <project>.pages.dev` (Proxied), `www` o same
- SSL: automatic

DNS/build log dekhতে: https://dash.cloudflare.com → Workers & Pages → `gazitime`

GitHub account: `sajidkhan133701`

---

## Contact form / newsletter

Newsletter form `FormSubmit` use kore (`https://formsubmit.co/hello@gazitime.online`).
Prothom bar live site theke submit korলে oi email e ekta confirmation link asbe — seta click korlei form kaj korbe.

Nijer email chaile `index.html` e ei line ta badlo:

```html
<form action="https://formsubmit.co/YOUR-EMAIL" method="POST">
```

---

## Note

Content gula **demo/placeholder** — asol khobor diye replace koro. Chhobi gula AI-generated, iccha moto badle felte paro.
