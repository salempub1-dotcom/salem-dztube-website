# ربط AdSense — تحقق فقط

معرّف الناشر المرسل من صاحب الموقع: `ca-pub-4932171916184035`.

التعديل يضيف `google-adsense-account` إلى الصفحات العامة القابلة للفهرسة، وملف `/ads.txt` الحقيقي. لا يُحمّل `adsbygoogle.js` ولا ينشئ وحدات إعلان، ولا يغيّر CSP للسماح بالإعلانات، ولا يطلب مراجعة من Google. استُخدمت طريقة التحقق بالوسم وفق توثيق Google لأن تحميل السكربت المرسل قد يشغّل الإعلانات التلقائية بحسب إعداد الحساب. صفحات الإدارة و404 ونسخ Vercel Preview مستثناة من التحقق.

الكود الذي أرسله صاحب الموقع محفوظ هنا للمراجعة، ولا ينفذ داخل الموقع:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4932171916184035" crossorigin="anonymous"></script>
```

قبل تفعيل تحميل السكربت: مراجعة حالة الموقع في حساب AdSense، وإعداد CMP والإفصاحات بحسب الزوار، ثم إعداد السماح المحدد للخدمات في CSP واختبار عدم تأثير مواضع الإعلان على القراءة. لا تكفي إضافة الكود أو ads.txt لإثبات قبول الموقع.

عند الانتقال إلى دومين خاص: يبقى معرّف الحساب نفسه إذا بقي الحساب نفسه. تضاف الوجهة الجديدة في Sites وتخضع للتحقق والمراجعة. تُراجع روابط canonical وsitemap وOpen Graph والتحويلات وملف ads.txt على الدومين الجديد. لا يُغيّر الدومين في هذا التعديل.

المراجع الرسمية:
- https://support.google.com/adsense/answer/12169212
- https://support.google.com/adsense/answer/105516
- https://support.google.com/adsense/answer/12171612
- https://support.google.com/adsense/answer/12170421
