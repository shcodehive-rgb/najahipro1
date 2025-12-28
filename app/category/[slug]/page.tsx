import { client } from "@/sanity/lib/client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FolderOpen, BookOpen, Calendar, ImageOff } from "lucide-react"
import Link from "next/link"

// 1. عناوين الصفحات
const titles: Record<string, string> = {
  "doros": "جميع الدروس والمحاضرات",
  "imtihanat": "جميع الامتحانات والفروض",
  "moubaryat": "مستجدات المباريات والتوظيف",
  "akhbar": "آخر المستجدات والأخبار",
  "tawjih": "التوجيه المدرسي والمهني",
  "2bac": "الثانية باكالوريا",
  "1bac": "الأولى باكالوريا",
  "tc": "الجذع المشترك",
  "3ac": "الثالثة إعدادي",
  "primaire": "التعليم الابتدائي",
  "college": "التعليم الإعدادي",
  "lycee": "التعليم الثانوي التأهيلي",
  "university": "التعليم الجامعي",
}

// 2. دالة جلب البيانات مع تصحيح الرابط والصور
async function getCategoryData(slug: string) {
  let query = "";
  let params: any = { slug };

  if (slug === "doros") {
    query = `*[_type == "post" && contentType == "cours"]`;
  } else if (slug === "imtihanat") {
    query = `*[_type == "post" && contentType == "exam"]`;
  } else if (slug === "moubaryat") {
    query = `*[_type == "post" && (contentType == "concours" || level in ["concours-primaire", "concours-secondaire", "master"])]`;
  } else if (slug === "tawjih") {
    query = `*[_type == "post" && (contentType == "tawjih" || contentType == "news" || level == "tawjih")]`;
  } else {
    let levels = [slug];
    if (slug === "lycee") levels = ["lycee", "tc", "1bac", "2bac"];
    if (slug === "college") levels = ["college", "1ac", "2ac", "3ac", "3eme"];
    if (slug === "primaire") levels = ["primaire", "6eme"];
    query = `*[_type == "post" && level in $levels && contentType != "news"]`;
    params = { levels };
  }

  // الكويري النهائي مع الترتيب وجلب الصور
  const finalQuery = `${query} | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    "category": level,
    "type": contentType,
    "date": _createdAt,
    "imageUrl": mainImage.asset->url
  }`;

  return await client.fetch(finalQuery, params);
}

// 3. المكون الأساسي
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articles = await getCategoryData(slug);
  const pageTitle = titles[slug] || slug;

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="mb-8 border-b pb-4 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FolderOpen className="w-8 h-8 text-blue-600" />
                {pageTitle}
              </h1>
              <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-sm font-bold">
                {articles.length} موضوع
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.length > 0 ? (
                articles.map((article: any) => (
                  <Card key={article._id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full border-gray-100">
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
                      <span className="absolute top-2 right-2 bg-blue-600/90 text-white text-[10px] px-2 py-1 rounded">
                        {article.category}
                      </span>
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
                          <span>{article.date ? new Date(article.date).toLocaleDateString('ar-MA') : '...'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900">لا يوجد محتوى حالياً</h3>
                  <Link href="/"><Button className="mt-6 bg-blue-600">العودة للرئيسية</Button></Link>
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
  );
}