// Local editorial illustrations. An uploaded CMS cover takes precedence.
export const ARTICLE_VISUALS = Object.freeze({
  'supplier-sample-checklist-algeria': {
    cover: '/assets/articles/supplier-sample-cover.webp',
    alt: 'رسم توضيحي لعينة منتج وطرد وعدسة وشريط قياس وبطاقة فحص',
    diagram: '/assets/articles/supplier-sample-checklist.svg',
    diagramAlt: 'فحص العينة: مواصفات واضحة، عينة مطابقة، تجربة استخدام، تكلفة كاملة، واتفاق توريد مكتوب. القرار بحسب الأدلة المتاحة.',
    caption: 'قائمة فحص تشغيلية مبسطة؛ لا تعني اعتماد مورد معين أو ضمان سلامة أي منتج.'
  },
  'small-business-automation-checklist': {
    cover: '/assets/articles/automation-checklist-cover.webp',
    alt: 'رسم توضيحي لحاسوب ومراحل أتمتة مع مراجعة بشرية ومسار استعادة',
    diagram: '/assets/articles/automation-review-flow.svg',
    diagramAlt: 'مسار أتمتة مقترح: استقبال سجل بمعرف فريد، فحص البيانات والتكرار، حفظ النتيجة، مراجعة بشرية للإجراء الحساس، وتسجيل الأخطاء والتنبيه عند التعطل.',
    caption: 'تصور تشغيلي عام، وليس لقطة من Make أو سيناريو تم تنفيذه فعلياً على الموقع.'
  },
  'product-photography-smartphone': {
    cover: '/assets/articles/product-photography-cover.webp',
    alt: 'رسم توضيحي لهاتف على حامل يصور كوباً أبيض بضوء نافذة ولوح عاكس',
    diagram: '/assets/articles/product-photo-shot-list.svg',
    diagramAlt: 'قائمة صور المنتج: صورة عامة، زاوية جانبية، تفاصيل مهمة، صورة توضح الحجم، ومحتويات العلبة. الصور يجب أن تطابق المنتج الفعلي.',
    caption: 'قائمة لقطات مقترحة؛ الغلاف المولّد توضيحي ولا يمثل صوراً فعلية لمنتج معروض للبيع.'
  },
  'cod-order-tracking-algeria': {
    cover: '/assets/articles/cod-tracking-cover.webp',
    alt: 'رسم توضيحي لطرد وهاتف متابعة وشاحنة توصيل',
    diagram: '/assets/articles/cod-order-flow.svg',
    diagramAlt: 'مسار مبسط: طلب جديد، ثم تأكيد، ثم شحن، ثم تسليم، ثم تحصيل المستحقات. التسليم والتحصيل مرحلتان منفصلتان.',
    caption: 'مسار مبسط للطلب؛ تُسجّل حالات الإلغاء والإرجاع والتأخر منفصلة عن المسار المكتمل.'
  },
  'ai-product-descriptions-checklist': {
    cover: '/assets/articles/ai-description-cover.webp',
    alt: 'رسم توضيحي لحاسوب ومنظم مكتب وبطاقة تحقق من مواصفات المنتج',
    diagram: '/assets/articles/ai-description-comparison.svg',
    diagramAlt: 'مقارنة بين ادعاءات غير موثقة مثل الأفضل وغير قابل للكسر، ووصف يستند إلى حقائق: منظم بلاستيكي بثلاثة أقسام وأبعاد محددة.',
    caption: 'مثال تعليمي لمقارنة الصياغة؛ لا يصف منتجاً معروضاً للبيع على الموقع.'
  },
  'mobile-product-page-checklist': {
    cover: '/assets/articles/mobile-product-cover.webp',
    alt: 'رسم توضيحي لهاتف يعرض صفحة منتج مبسطة وطرد أبيض وأحمر',
    diagram: '/assets/articles/mobile-product-anatomy.svg',
    diagramAlt: 'نموذج توضيحي لصفحة منتج على الهاتف: صورة، اسم ومواصفات، سعر وتكلفة توصيل وإجمالي، بيانات ضرورية، زر تأكيد، وروابط التواصل والخصوصية.',
    caption: 'تكوين توضيحي لترتيب المعلومات، وليس لقطة من متجر حقيقي أو نموذج طلب فعّال.'
  }
});

export const articleVisual = slug => Object.hasOwn(ARTICLE_VISUALS, slug) ? ARTICLE_VISUALS[slug] : undefined;
