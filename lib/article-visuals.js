// Local editorial illustrations. An uploaded CMS cover takes precedence.
export const ARTICLE_VISUALS = Object.freeze({
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
