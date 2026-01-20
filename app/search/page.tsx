import { client } from "@/sanity/lib/client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search, BookOpen, Calendar, ImageOff } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"

// Search function using Sanity GROQ
async function searchPosts(searchQuery: string) {
    if (!searchQuery || searchQuery.trim() === "") {
        return []
    }

    const query = `*[_type == "post" && (
    title match $searchQuery + "*" || 
    pt::text(content) match $searchQuery + "*"
  )] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    "imageUrl": mainImage.asset->url,
    "date": _createdAt,
    "type": contentType,
    "category": level
  }`

    return await client.fetch(query, { searchQuery })
}

// Metadata for SEO
export async function generateMetadata({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>
}): Promise<Metadata> {
    const { q } = await searchParams
    const searchQuery = q || ""

    return {
        title: searchQuery ? `نتائج البحث: ${searchQuery} | نجاحي برو` : "البحث | نجاحي برو",
        description: `نتائج البحث عن "${searchQuery}" في منصة نجاحي برو.`,
    }
}

export default async function SearchPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q } = await searchParams
    const searchQuery = q || ""
    const results = await searchPosts(searchQuery)

    return (
        <div className="min-h-screen bg-white" dir="rtl">
            <Header />
            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8">
                        {/* Search Header */}
                        <div className="mb-8 border-b pb-4">
                            <div className="flex items-center gap-3 mb-4">
                                <Search className="w-8 h-8 text-blue-600" />
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {searchQuery ? `نتائج البحث عن: "${searchQuery}"` : "البحث"}
                                </h1>
                            </div>
                            {searchQuery && (
                                <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-sm font-bold">
                                    {results.length} نتيجة
                                </span>
                            )}
                        </div>

                        {/* Search Results */}
                        {!searchQuery ? (
                            <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed">
                                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    ابحث عن الدروس والامتحانات
                                </h3>
                                <p className="text-gray-500">
                                    استخدم شريط البحث في الأعلى للعثور على المحتوى الذي تبحث عنه
                                </p>
                            </div>
                        ) : results.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {results.map((article: any) => (
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
                                            {article.category && (
                                                <span className="absolute top-2 right-2 bg-blue-600/90 text-white text-[10px] px-2 py-1 rounded">
                                                    {article.category}
                                                </span>
                                            )}
                                        </div>
                                        <CardContent className="p-5 flex flex-col flex-grow">
                                            <h3 className="text-lg font-bold text-gray-800 mb-4 group-hover:text-blue-600 line-clamp-2 leading-relaxed">
                                                {article.title}
                                            </h3>
                                            <div className="mt-auto flex items-center justify-between border-t pt-4">
                                                <Link href={`/blog/${article.slug}`}>
                                                    <Button variant="ghost" className="text-blue-600 p-0 h-auto font-semibold gap-1 text-sm">
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
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed">
                                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    لم يتم العثور على نتائج
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    لم نتمكن من العثور على أي محتوى يطابق بحثك عن "{searchQuery}"
                                </p>
                                <Link href="/">
                                    <Button className="bg-blue-600">العودة للرئيسية</Button>
                                </Link>
                            </div>
                        )}
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
