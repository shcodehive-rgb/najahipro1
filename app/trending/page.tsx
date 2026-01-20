import { client } from "@/sanity/lib/client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, BookOpen, Calendar, ImageOff } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"

// Metadata for SEO
export const metadata: Metadata = {
    title: "المقالات الأكثر قراءة | نجاحي برو",
    description: "اكتشف المقالات الأكثر قراءة والأكثر شعبية على منصة نجاحي برو - دروس، امتحانات، ومستجدات تعليمية.",
    openGraph: {
        title: "المقالات الأكثر قراءة | نجاحي برو",
        description: "اكتشف المقالات الأكثر قراءة والأكثر شعبية على منصة نجاحي برو.",
    },
}

// Fetch popular posts (isPopular == true)
async function getPopularPosts() {
    const query = `*[_type == "post" && isPopular == true] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    "category": level,
    "type": contentType,
    "date": _createdAt,
    "imageUrl": mainImage.asset->url
  }`

    return await client.fetch(query)
}

export default async function TrendingPage() {
    const articles = await getPopularPosts()

    return (
        <div className="min-h-screen bg-white" dir="rtl">
            <Header />
            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8">
                        <div className="mb-8 border-b pb-4 flex items-center justify-between">
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <TrendingUp className="w-8 h-8 text-red-500" />
                                المقالات الأكثر قراءة
                            </h1>
                            <span className="bg-red-50 text-red-600 px-4 py-1 rounded-full text-sm font-bold">
                                {articles.length} موضوع
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {articles.length > 0 ? (
                                articles.map((article: any) => (
                                    <Card
                                        key={article._id}
                                        className="overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full border-gray-100"
                                    >
                                        <div className="relative h-48 bg-gray-100">
                                            {article.imageUrl ? (
                                                <img
                                                    src={article.imageUrl}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                    <ImageOff className="w-8 h-8 opacity-20 mb-2" />
                                                    <span className="font-bold opacity-30">NAJAHIPRO</span>
                                                </div>
                                            )}
                                            <span className="absolute top-2 right-2 bg-red-600/90 text-white text-[10px] px-2 py-1 rounded">
                                                {article.category}
                                            </span>
                                        </div>
                                        <CardContent className="p-5 flex flex-col flex-grow">
                                            <h3 className="text-lg font-bold text-gray-800 mb-4 group-hover:text-red-600 line-clamp-2 leading-relaxed">
                                                {article.title}
                                            </h3>
                                            <div className="mt-auto flex items-center justify-between border-t pt-4">
                                                <Link href={`/blog/${article.slug}`}>
                                                    <Button variant="ghost" className="text-red-600 p-0 h-auto font-semibold gap-1 text-sm">
                                                        اقرأ المزيد <ArrowLeft className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>
                                                        {article.date ? new Date(article.date).toLocaleDateString('ar-MA') : '...'}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed">
                                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900">لا توجد مقالات رائجة حالياً</h3>
                                    <Link href="/">
                                        <Button className="mt-6 bg-red-600">العودة للرئيسية</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    <aside className="lg:col-span-4">
                        <Sidebar />
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    )
}
