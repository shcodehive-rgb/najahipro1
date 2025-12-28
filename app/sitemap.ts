import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client' // 👈 تأكدنا من المسار الصحيح

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.najahipro.com' // 👈 استعملنا الدومين الرسمي

  // 1. جلب جميع المقالات من Sanity
  const posts = await client.fetch(`
    *[_type == "post"] {
      "slug": slug.current,
      _updatedAt
    }
  `)

  // 2. تحويل المقالات إلى روابط
  // ملاحظة: تأكد واش المجلد ديال المقالات سميتو [slug] وسط post ولا blog
  // أنا درت ليك /post/ حيت هي الشائعة
  const postsUrls = posts.map((post: any) => ({
    url: `${baseUrl}/post/${post.slug}`, 
    lastModified: new Date(post._updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // 3. الروابط الثابتة (دير غير اللي عندك دابا بصح)
  const staticRoutes = [
    '', // الصفحة الرئيسية
    // '/contact', // 👈 حيد الشرطتين (//) غير إلا كنتي صاوبتي صفحة contact
    // '/about',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.5,
  })) as MetadataRoute.Sitemap

  return [...staticRoutes, ...postsUrls]
}