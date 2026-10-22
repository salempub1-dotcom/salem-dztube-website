# SalemDZTube — Official website (starter)

موقع تعريفي عربي RTL لقناة SalemDZTube، مستوحى من ملف PDF المرجعي الذي قدّمه صاحب المشروع.

## ما هو جاهز؟
- واجهة Responsive بتصميم أحمر / أبيض / أسود.
- الأقسام: التعريف، مجالات القناة، الفيديوهات، المقالات، التعاون، التذييل.
- تصفية الفيديوهات وتصنيفها والبحث فيها.
- فتح المقالات في نافذة قابلة للإغلاق.
- صور مصغّرة تلقائية **للفيديوهات التي تحتوي YouTube ID صحيح** فقط.
- بيانات المقالات والفيديوهات منفصلة في ملفات JSON للتعديل السريع.
- GitHub Actions للنشر على GitHub Pages.
- HTML دلالي، وسوم SEO أساسية، RTL، معايير وصول أساسية.

## تشغيله محلياً
لا تفتح `index.html` مباشرةً بالنقر المزدوج لأن المتصفح قد يمنع جلب JSON عبر `file://`.

```bash
cd SalemDZTube-Website
python -m http.server 8000
```
افتح `http://localhost:8000`.

## تحديث الفيديوهات
عدّل `content/videos.json`، وأضف:

```json
{"id":"unique-slug","title":"عنوان الفيديو","category":"التجارة الإلكترونية","tag":"COD","duration":"10:45","views":"","youtubeId":"DPVB2GNKNzQ"}
```

`youtubeId` هو الجزء بعد `v=` في رابط YouTube، أو بعد `youtu.be/`. لا تُضف `youtubeId` غير مؤكد؛ تظهر بطاقة المحتوى بدون رابط بدلاً من إرسال المستخدم إلى فيديو خاطئ.

## تحديث المقالات
عدّل `content/articles.json` وأضف عنصراً يحوي `id`, `tag`, `category`, `date`, `title`, `excerpt`, `body` (مصفوفة فقرات). النصوص الحالية **مسودات نموذجية وليست مقالات منقولة من الموقع**.

## تحديث الصور والإحصائيات
- الصورة `assets/hero-reference.jpg` مقتطعة من لقطة PDF المرجعية؛ استبدلها بأصل عالي الجودة من تصويرك بنفس اسم الملف (أو عدّل المسار في HTML).
- إحصائيات القناة في `index.html` قيم مرجعية من ملف PDF، وليست أرقام YouTube حية. حدّثها دورياً أو اربط YouTube Data API مستقبلاً بخادم آمن.
- البريد `salempub1@gmail.com` من ملف PDF.
- لا تتوفر روابط الفيديوهات الثلاثة القديمة في PDF، لذا تركنا `youtubeId` فارغاً حتى لا نخمنها.

## رفعه إلى GitHub
1. أنشئ مستودعاً جديداً باسم `salem-dztube-website`.
2. من داخل مجلد المشروع نفّذ:

```bash
git init
git add .
git commit -m "Initial SalemDZTube website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/salem-dztube-website.git
git push -u origin main
```

3. في إعدادات المستودع: `Settings` → `Pages` → `Build and deployment` → `Source: GitHub Actions`.
4. سيتم نشر الموقع عبر سير العمل الموجود في `.github/workflows/deploy.yml`.

للاستضافة على Vercel يمكنك استيراد المستودع باعتباره مشروع `Other` بدون Build Command؛ الموقع ثابت (Static).

## المرحلة القادمة
- ربط YouTube API لتحديث قائمة الفيديوهات وإحصائيات القناة بشكل آمن.
- صفحات مستقلة لكل مقال بروابط قابلة للفهرسة.
- CMS حقيقي لإدارة المحتوى دون تحرير JSON.
- تحسين SEO عبر sitemap وروابط Canonical بمجرد تحديد الدومين.
- إدراج الصورة الأصلية وشعار القناة وروابط التواصل المؤكدة.

## التقنية
Vanilla HTML / CSS / JavaScript؛ بدون حزم خارجية أو أسرار API، مناسب لتخزينه في GitHub وصيانته لسنوات.
