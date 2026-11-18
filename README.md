# Gazitime

বাংলা অনলাইন সংবাদপত্র — **Astro** দিয়ে বানানো স্ট্যাটিক সাইট, **Cloudflare Pages**-এ হোস্ট করা, আর পোস্ট লেখা হয় **Pages CMS** দিয়ে (কোড ছাড়া)।

লাইভ: https://gazitime.online

---

## পোস্ট করা (কোড ছাড়া)

1. যান https://app.pagescms.org → GitHub দিয়ে সাইন ইন → `sajidkhan133701/gazitime` রিপো বেছে নিন
2. বাম দিকের মেনুতে **খবর (পোস্ট)** → **New entry**
3. পূরণ করুন: শিরোনাম, URL নাম (ইংরেজিতে, যেমন `new-metro-line`), সারসংক্ষেপ, সেকশন, তারিখ, লেখক, ছবি, লেখা
4. **Save** → ৪০–৬০ সেকেন্ডে সাইটে লাইভ

**হোমপেজ সাজানো:** মেনুতে **হোমপেজ সাজানো** → প্রধান খবর, ডান পাশের তালিকা, মতামত স্ট্রিপ, আর প্রতিটি সেকশন ব্লকে কোন খবরগুলো দেখাবে সেগুলো বেছে নিন। খালি রাখলে ওই সেকশনের সর্বশেষ খবর নিজে থেকে বসবে।

**সেকশন যোগ/বাদ:** **সেকশনসমূহ** ফাইল থেকে।

---

## লোকালে চালানো

```powershell
cd "F:\Gazitime"
npm install      # প্রথমবার
npm run dev      # http://localhost:4321
npm run build    # dist/ তৈরি করে
```

## আপডেট / ডিপ্লয়

```powershell
git add -A
git commit -m "কী বদলালেন"
git push
```

Cloudflare Pages নিজেই বিল্ড করে (build command `npm run build`, output `dist`)।

## ফাইল কোথায়

| পাথ | কী |
|---|---|
| `src/content/blog/*.md` | প্রতিটা খবর (Markdown) |
| `src/data/homepage.json` | হোমপেজে কোন খবর কোথায় |
| `src/data/categories.json` | সেকশনের তালিকা |
| `src/data/site.json` | সাইটের নাম, স্লোগান, ইমেইল |
| `public/images/` | সব ছবি |
| `src/pages/news/[slug].astro` | খবরের ভেতরের পেজের ডিজাইন |
| `src/pages/index.astro` | হোমপেজ |
| `src/styles/global.css` | পুরো ডিজাইন |
| `.pages.yml` | Pages CMS-এর ফিল্ড সেটিং |

## যোগাযোগ ফর্ম

নিউজলেটার ও যোগাযোগ ফর্ম FormSubmit দিয়ে `hello@gazitime.online` এ যায়, যা Cloudflare Email Routing দিয়ে `sajidkhan133701@gmail.com`-এ ফরওয়ার্ড হয়।
