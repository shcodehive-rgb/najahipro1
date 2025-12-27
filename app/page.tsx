import { client } from "@/sanity/client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import BackToTop from "@/components/BackToTop"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowLeft, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"

// 1. جلب مقالات الواجهة (المقالات الكبيرة الفوق)
async function getFeaturedPosts() {
  const query = `*[_type == "post" && isFeatured == true][0...3] | order(_createdAt desc) {
    _id, 
    title, 
    "category": level, 
    "date": _createdAt, 
    "imageUrl": mainImage.asset->url,
    "excerpt": content 
  }`
  const posts = await client.fetch(query)
  return posts.map((post: any) => ({
    ...post,
    excerpt: typeof post.excerpt === 'string' ? post.excerpt.substring(0, 100) + "..." : ""
  }))
}

// 2. جلب آخر المستجدات (القائمة العادية)
async function getLatestPosts() {
  const query = `*[_type == "post" && isFeatured != true][0...6] | order(_createdAt desc) {
    _id, 
    title, 
    "category": level, 
    "date": _createdAt, 
    "imageUrl": mainImage.asset->url,
    "excerpt": content
  }`
  const posts = await client.fetch(query)
  return posts.map((post: any) => ({
    ...post,
    excerpt: typeof post.excerpt === 'string' ? post.excerpt.substring(0, 140) + "..." : ""
  }))
}

// 3. جلب مقالات القسم الجديد (الأخبار الرائجة / المستجدات)
async function getTrendingPosts() {
  const query = `*[_type == "post" && isTrending == true][0...4] | order(_createdAt desc) {
    _id, 
    title, 
    "category": level, 
    "date": _createdAt, 
    "imageUrl": mainImage.asset->url
  }`
  return await client.fetch(query)
}

export default async function Home() {
  const featuredPosts = await getFeaturedPosts()
  const latestPosts = await getLatestPosts()
  const trendingPosts = await getTrendingPosts()

  const mainFeature = featuredPosts[0]
  const subFeatures = featuredPosts.slice(1, 3)

  return (
    <div className="min-h-screen bg-gray-50/50" dir="rtl">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* --- قسم الواجهة الرئيسية (Hero) --- */}
        {mainFeature && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
            <div className="lg:col-span-8 group relative h-[450px] rounded-3xl overflow-hidden shadow-2xl">
              <img src={mainFeature.imageUrl} alt={mainFeature.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-0 p-8 w-full text-right">
                <Badge className="bg-blue-600 mb-4">{mainFeature.category}</Badge>
                <Link href={`/blog/${mainFeature._id}`}>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 hover:text-blue-400 transition-colors leading-tight">
                    {mainFeature.title}
                  </h2>
                </Link>
                <div className="flex items-center text-gray-300 text-sm gap-4 justify-start">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {new Date(mainFeature.date).toLocaleDateString('ar-MA')}</span>
                  <Link href={`/blog/${mainFeature._id}`} className="text-white font-bold flex items-center gap-2 hover:mr-2 transition-all">
                    اقرأ المزيد <ArrowLeft className="w-4 h-4"/>
                  </Link>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              {subFeatures.map((post: any) => (
                <div key={post._id} className="relative flex-1 rounded-3xl overflow-hidden shadow-xl group">
                  <img src={post.imageUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 p-6 text-right">
                    <Badge className="bg-purple-600 mb-2">{post.category}</Badge>
                    <Link href={`/blog/${post._id}`}><h3 className="text-lg font-bold text-white hover:text-purple-300 transition-colors">{post.title}</h3></Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-16">
            
            {/* 1. قسم آخر المستجدات (الرئيسي) */}
            <section>
              <h3 className="text-2xl font-black text-gray-900 mb-8 border-r-8 border-blue-600 pr-4 flex items-center gap-3">
                <Zap className="text-blue-600" /> آخر المستجدات
              </h3>
              <div className="grid gap-8 text-right">
                {latestPosts.map((post: any) => (
                  <Link key={post._id} href={`/blog/${post._id}`} className="flex flex-col md:flex-row gap-6 bg-white p-5 rounded-3xl border border-gray-100 hover:shadow-2xl transition-all group text-right">
                    <div className="w-full md:w-56 h-40 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-duration-500" />
                    </div>
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-3 text-blue-600 bg-blue-50">{post.category}</Badge>
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 leading-snug">{post.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-4">{post.excerpt}</p>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(post.date).toLocaleDateString('ar-MA')}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* 2. قسم "أخبار رائجة" (التصميم الجديد) */}
            <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
              <h3 className="text-2xl font-black text-gray-900 mb-10 flex items-center justify-between">
                <span className="flex items-center gap-3"><TrendingUp className="text-red-500" /> مقالات رائجة</span>
                <Link href="/archive" className="text-sm text-blue-600 hover:underline">مشاهدة الكل</Link>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
                {trendingPosts.map((post: any) => (
                  <div key={post._id} className="group">
                    <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                      <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                      <Badge className="absolute top-3 right-3 bg-red-500">Trending</Badge>
                    </div>
                    <Link href={`/blog/${post._id}`}><h4 className="font-bold text-gray-900 hover:text-red-500 transition-colors line-clamp-2 leading-relaxed">{post.title}</h4></Link>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-12">
            <Sidebar />
          </aside>
        </div>
      </main>

      <BackToTop />
      <Footer />
    </div>
  )
}