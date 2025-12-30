import { client } from "@/sanity/lib/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, ArrowLeft, Star, ExternalLink } from "lucide-react"
import Link from "next/link"

// جلب المقالات "الأكثر قراءة" (isPopular)
async function getPopularPosts() {
  // لاحظ هنا: زدنا "slug": slug.current
  const query = `*[_type == "post" && isPopular == true] | order(_createdAt desc)[0...4] {
    _id,
    title,
    "slug": slug.current, 
    "imageUrl": mainImage.asset->url,
    "category": level
  }`
  return await client.fetch(query)
}

export async function Sidebar() {
  const popularPosts = await getPopularPosts()

  return (
    <div className="space-y-6">
      
      {/* بطاقة: مقالات رائجة */}
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-50 bg-gray-50/50">
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-900">
            <TrendingUp className="w-5 h-5 text-red-500" />
            مقالات رائجة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {popularPosts.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {popularPosts.map((post: any, index: number) => (
                <Link 
                  key={post._id} 
                  href={`/blog/${post.slug}`} // ✅ هنا التصحيح: استعملنا slug عوض _id
                  className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    {post.category && (
                      <span className="text-[10px] text-gray-400 mt-1 block">{post.category}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-400 text-sm">
              لا توجد مقالات رائجة حالياً
            </div>
          )}
        </CardContent>
      </Card>

      {/* بطاقة: إشهار أو روابط مفيدة (اختياري) */}
      <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none shadow-md overflow-hidden relative">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <CardContent className="p-6 relative z-10">
          <Star className="w-8 h-8 text-yellow-300 mb-4" />
          <h3 className="text-lg font-bold mb-2">باك حر 2026؟</h3>
          <p className="text-blue-100 text-sm mb-4 leading-relaxed">
            استعد للامتحانات الوطنية مع ملخصات حصرية ونماذج امتحانات سابقة.
          </p>
          <Link href="/category/2bac">
            <Button variant="secondary" size="sm" className="w-full font-bold text-blue-700 hover:bg-white">
              اكتشف الدروس <ExternalLink className="w-3 h-3 mr-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>

    </div>
  )
}