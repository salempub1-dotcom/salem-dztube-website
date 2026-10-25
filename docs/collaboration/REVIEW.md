# تعاون وإعلان — مراجعة التنفيذ

- Branch: `feat/collaboration-page-20261025`
- Pull request: https://github.com/salempub1-dotcom/salem-dztube-website/pull/7
- Approved project: `salem-dztube-website-ab5g` / `elmiraj1`.
- Preview: https://salem-dztube-website-ab5g-git-feat-collaboratio-ded6ba-elmiraj1.vercel.app/collaboration/
- Status: Vercel GitHub check Ready. Direct inspection is blocked by Vercel Authentication; connected Vercel API returns 403 for protected access. The user can review with their existing Vercel session. Authorize this team/project in the Vercel connection for agent inspection. Deployment Protection was not changed.
- No merge or Production release. DNS, Hostinger, Search Console and AdSense unchanged.

## التنفيذ

صفحة HTML قابلة للفهرسة على `/collaboration/` وفق مرجع المستخدم، بصورة المشروع الحالية `hero-salem-smooth.webp`، وألوانه وأقسامه. الأرقام 147K+ / 8M+ / 710+ مرجعية وليست بيانات مباشرة. أسعار افتتاحية: Shorts 15,000، دمج 35,000، مخصص 60,000، دمج + Shorts 45,000 دج. تحديد الباقة آلي مع قابلية تغييره. لا توجد وعود نتائج، والإفصاح عن الرعاية واضح.

الرئيسية لم يتغير محتواها أو CSS أو ترتيب أقسامها. مقارنة المصدر مع main تؤكد أن التغييرات روابط التعاون فقط. استمر قسم `#partnership` ومسارات التواصل القديمة. أُضيف رابط تعاون في القوائم والتذييل، وشرح معالجة بيانات النموذج في الخصوصية. Canonical الصفحة الجديدة يستخدم www كما طلب المستخدم، دون تغيير إعدادات بقية الصفحات.

## Supabase

فُحص الجدول `public.collaboration_requests` قبل أي تغيير. الهجرة إضافية فقط، مع حقول الشركة/رابطها والهاتف والباقة والميزانية والتاريخ والموافقة ومعرّف إعادة المحاولة. لم تُحذف بيانات موجودة أو تتغير صلاحيات تسجيل الدخول.

مسار RPC عام محدود يستدعي وظيفة إدخال خاصة، يتحقق في قاعدة البيانات من النوع والطول والبريد والرابط والباقة والموافقة والتاريخ، ويرفض HTML. لا يملك الزائر قراءة الجدول أو تحديثه أو الإدخال المباشر فيه. الإدخال يمر عبر وظيفة ضيقة فقط. RLS للقراءة والتحديث ما زال يتحقق من `site_admins`.

منع إساءة الاستخدام: حقل مصيدة، حد أدنى للوقت في الواجهة، قفل قاعدة بيانات وتحديد طلب لكل بريد كل عشر دقائق، ومعرّف idempotency لمنع تكرار الطلب عند إعادة المحاولة. هذا دفاع أساسي؛ ليس CAPTCHA ولا حدّاً على مستوى IP، ويمكن تجاوزه باستخدام عناوين بريد مختلفة. إذا ظهر إساءة استخدام، يضاف تحدٍّ موثوق والتحقق منه خادمياً في مهمة مستقلة.

لوحة الإدارة أضيف إليها عرض الطلبات بتفاصيلها، تحميل 25 طلباً في الدفعة، متابعة الحالات new/in_progress/closed، ورسائل نجاح وفشل. تُعرض جميع بيانات الطلب كنص، دون innerHTML. تُزال تفاصيل الطلبات من DOM عند الخروج. لم يُجر تسجيل دخول بكلمة مرور المدير؛ فُحصت السياسات ببيئة SQL معزولة وبمستخدم غير مدير.

## الاختبارات

- `npm run check`: نجحت الاختبارات الـ28 والبناء.
- 1440 / 1024 / 768 / 390 / 320: لا تمرير أفقي، لا صور مفقودة، الباقات الأربع تحدد الحقل الصحيح.
- axe WCAG2 A/AA وWCAG2.1 AA: لا مخالفات آلية في الصفحة الجديدة. ليس تدقيق وصول يدوياً كاملاً.
- لا أخطاء pageerror في الاختبارات المحلية.
- الرئيسية والمقالات والإدارة والتواصل والخصوصية وPDF: HTTP 200 محلياً. لا يدّعي ذلك اختبار تسجيل دخول الإدارة.
- رسالة الفشل اختُبرت باستجابة 503 مضبوطة: لا نجاح وهمي.
- REST الفعلي: إدخال 200 مع معرّف، إعادة نفس الطلب أعادت المعرف نفسه، طلب آخر خلال عشر دقائق رفض، قراءة الزائر وإدخاله المباشر رفضا 401، وHTML رفض 400.
- ربط النموذج الكامل: قيم من المتصفح إلى RPC الفعلي وتأكيد نجاح التخزين. استخدم اختبار Sandbox جسراً HTTPS عبر Python لنقل الطلب نفسه دون محاكاة نجاح، بسبب تعذر اتصال Chromium المباشر بالخدمة في البيئة. يبقى اختبار المتصفح المنشور محجوباً بحماية Vercel.
- لم يُجر Lighthouse أو قياس Core Web Vitals ميداني؛ لا تُنسب أرقام أداء غير مقاسة.
- فاحص Supabase لا يعرض مشاكل RLS جديدة. توجد ملاحظة سابقة: Leaked Password Protection معطل. لم يُغير إعداد Auth خارج نطاق المهمة.

النتائج المفصلة: `qa-results.json`، `api-qa-results.json`، `roundtrip-qa-results.json`.

## Media Kit

`media/salemdztube-media-kit-ar.pdf`، ثلاث صفحات عربية A4، نحو 189 KB. يتضمن الهوية والصورة الحالية والأرقام المرجعية والباقات وآلية التعاون والبريد المؤكد وفيديوهين فعليين. لم تُختلق ديموغرافيا أو نسب تفاعل أو أسماء شركاء. فُحصت الصفحات الثلاث بصرياً بعد التوليد والتحسين.

المصدر: `scripts/media-kit.mjs` يولد `docs/collaboration/media-kit-source.html`. يُحوّل HTML إلى PDF عبر Chromium/Playwright مع printBackground وpreferCSSPageSize، ثم يمكن تحسينه باستخدام Ghostscript. لا تُضاف مكتبات PDF/Playwright إلى تحميل الموقع أو اعتمادياته الإنتاجية.

## قبل الدمج

1. مراجعة صفحة Preview بحساب Vercel الذي يملك المشروع، والسماح للاتصال بالوصول للمشروع إذا أُريد استكمال فحص الوكيل المنشور.
2. اختبار إرسال تجاري من المعاينة ومتابعته من لوحة المدير الفعلية، دون مشاركة كلمة المرور.
3. اعتماد صياغة الأسعار والأسعار المبدئية والتصميم والـPDF.
4. الموافقة الصريحة على الدمج والنشر الرسمي. الهجرة الإضافية طُبقت بالفعل استعداداً للنموذج؛ لا تُطبّق SQL مرتين يدوياً دون مراجعة سجل migrations.

## الملفات المتغيرة

- `admin/admin.css`
- `admin/admin.js`
- `admin/index.html`
- `api/render.js`
- `index.html`
- `lib/layout.js`
- `scripts/build.mjs`
- `scripts/dev.mjs`
- `scripts/legal.mjs`
- `scripts/collaboration.mjs`
- `scripts/media-kit.mjs`
- `collaboration/collaboration.css`
- `collaboration/collaboration.js`
- `media/salemdztube-media-kit-ar.pdf`
- `supabase/migrations/20261025190040_collaboration_requests_form.sql`
- `tests/collaboration.test.mjs`
- `docs/collaboration/REVIEW.md`
- `docs/collaboration/qa-results.json`
- `docs/collaboration/api-qa-results.json`
- `docs/collaboration/roundtrip-qa-results.json`
- `docs/collaboration/media-kit-source.html`
- `docs/collaboration/screenshots/desktop.jpg`
- `docs/collaboration/screenshots/mobile.jpg`
