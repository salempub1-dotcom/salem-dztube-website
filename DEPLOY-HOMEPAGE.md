# استرجاع واجهة SalemDZTube

1. فك الضغط وارفع **محتويات المجلد نفسه** إلى جذر المستودع GitHub `salem-dztube-website` (ليس مجلداً إضافياً).
2. تأكد من وجود الملفات مباشرة في جذر المستودع: `index.html`, `styles.css`, `main.js`, `assets/`, `content/`, `articles/`, `admin/`.
3. Vercel → Project Settings → Build and Deployment → **Root Directory: `./`** (أو اتركه فارغاً)؛ Framework Preset: **Other**؛ Build Command: **فارغ**؛ Output Directory: **فارغ**.
4. Git Repository = `salempub1-dotcom/salem-dztube-website`، و Production Branch = `main`.
5. بعد النشر افتح عنوان موقعك واضغط تحديثاً قوياً Ctrl+F5، ثم تحقق من `/styles.css` و `/assets/hero-reference.jpg` و `/content/videos.json`؛ يجب أن تظهر الملفات لا صفحة 404.
6. لا تغيّر الهيكل أو تنقل `index.html` إلى مجلد فرعي.

### قاعدة مهمة
نسخة الصفحة الرئيسية مأخوذة مباشرة من حزمة المرحلة الأولى مع نفس stylesheet وJavaScript والصورة. باقي صفحات المرحلة الثالثة محفوظة. لاحظ أن رابط النشر الفعلي لم يتوفر للتحقق من المشكلة على الموقع الحي.
