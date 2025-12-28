import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.najahipro.com' // الدومين الرسمي ديالك

  // 1. جلب المقالات (Posts)
  // ملاحظة: كنستعملو slug حيت هو الأحسن لـ SEO (adSense كيبغيه)
  const posts = await client.fetch(`
    *[_type == "post"] {
      "slug": slug.current,
      _updatedAt
    }
  `)

  // 2. تحويل المقالات لروابط
  const postsUrls = posts.map((post: any) => ({
    // عندك المجلد سميتو "blog"، إذن الرابط غايكون /blog/slug
    url: `${baseUrl}/blog/${post.slug}`, 
    lastModified: new Date(post._updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // 3. الصفحات الثابتة (شفتهم عندك فالصورة)
  const staticRoutes = [
    '',         // الصفحة الرئيسية
    '/about',   // من نحن
    '/contact', // اتصل بنا
    '/privacy', // سياسة الخصوصية
    '/terms',   // شروط الاستخدام
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.5,
  })) as MetadataRoute.Sitemap

  return [...staticRoutes, ...postsUrls]
}