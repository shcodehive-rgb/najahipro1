import { client } from "@/sanity/lib/client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button" // تأكد أن عندك Button
import { Comments } from "@/components/Comments" // تأكد أن عندك Comments
import { Calendar, User, FileText, Download, MessageCircle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { Metadata } from 'next'

// 1. جلب المقال باستعمال Slug (ماشي ID)
async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "category": level,
    "date": _createdAt,
    "imageUrl": mainImage.asset->url,
    content,
    "downloadUrl": driveLink,
    "fileUrl": file.asset->url
  }`
  const post = await client.fetch(query, { slug })
  return post
}

// 2. مقالات ذات صلة
async function getRelatedPosts(category: string, currentId: string) {
  // هنا كنستعملو level باش نجيبو مقالات من نفس المستوى
  const query = `*[_type == "post" && level == $category && _id != $currentId][0...3]{
    _id,
    title,
    "slug": slug.current,
    "imageUrl": mainImage.asset->url,
    "category": level,
    "date": _createdAt
  }`
  return await client.fetch(query, { category, currentId })
}

// 3. Metadata لـ SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'مقال غير موجود' }
  return {
    title: post.title,
    description: `اقرأ المزيد حول ${post.title} على منصة نجاحي برو.`,
    openGraph: { title: post.title, images: [post.imageUrl || '/images/default.jpg'] },
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)

  // إلا مالقاش المقال، طلع صفحة 404
  if (!post) notFound()

  const relatedPosts = await getRelatedPosts(post.category, post._id)

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* كود منع كليك يمين (اختياري) */}
      <script dangerouslySetInnerHTML={{
        __html: `document.addEventListener('contextmenu', event => event.preventDefault());`
      }} />

      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* شريط التنقل العلوي (Breadcrumbs) */}
        <div className="text-sm text-gray-500 mb-6 flex gap-2 items-center flex-wrap">
           <Link href="/" className="hover:text-blue-600">الرئيسية</Link> 
           <span>/</span> 
           <Link href={`/category/${post.category}`} className="text-gray-400 hover:text-blue-600">{post.category}</Link> 
           <span>/</span> 
           <span className="text-blue-600 font-bold truncate max-w-[200px]">{post.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <article className="lg:col-span-8">
            <div className="mb-8">
              <Badge className="bg-blue-600 mb-3 hover:bg-blue-700 text-sm px-3 py-1">{post.category || "عام"}</Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-6 text-sm text-gray-500 border-b border-gray-100 pb-6">
                <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full"><User className="w-4 h-4 text-blue-600"/> Admin</span>
                <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full"><Calendar className="w-4 h-4 text-blue-600"/> {new Date(post.date).toLocaleDateString('ar-MA')}</span>
              </div>
            </div>

            <div className="relative w-full mb-10 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
               {post.imageUrl ? (
                 <img src={post.imageUrl} alt={post.title} className="w-full h-auto object-cover max-h-[500px]" />
               ) : (
                 <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400">لا توجد صورة</div>
               )}
            </div>

            {/* المحتوى */}
            <div className="prose prose-lg prose-blue max-w-none 
                            prose-headings:font-bold 
                            prose-h1:text-4xl prose-h1:mb-6
                            prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-blue-600 prose-h2:border-r-4 prose-h2:border-blue-600 prose-h2:pr-4
                            prose-h3:text-2xl prose-h3:mt-6
                            text-gray-800 leading-loose mb-12 font-medium">
              {typeof post.content === 'string' ? (
                <ReactMarkdown>{post.content}</ReactMarkdown>
              ) : (
                <div className="p-6 bg-amber-50 border-2 border-dashed border-amber-200 rounded-2xl text-amber-700 text-center">
                  <p>⚠️ المحتوى غير متوفر كنص (يرجى التأكد من كتابته في Sanity كـ Markdown)</p>
                </div>
              )}
            </div>

            {/* PDF Viewer */}
            {post.fileUrl && (
              <div className="my-10 w-full shadow-2xl rounded-2xl overflow-hidden border-4 border-blue-50">
                <div className="bg-blue-600 p-3 text-white text-center font-bold flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" /> معاينة مباشرة للملف
                </div>
                <div className="relative w-full h-[600px] bg-gray-100">
                  <iframe
                    src={`https://docs.google.com/gview?url=${post.fileUrl}&embedded=true`}
                    className="w-full h-full"
                    frameBorder="0"
                  ></iframe>
                </div>
              </div>
            )}

            {/* زر التحميل */}
            {post.downloadUrl && (
              <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl p-6 mb-16 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="text-center sm:text-right">
                    <h4 className="font-bold text-gray-900 text-xl">تحميل الملف المرفق</h4>
                    <p className="text-sm text-gray-500 mt-1">صيغة PDF - جاهز للطباعة</p>
                  </div>
                </div>
                <a href={post.downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-lg shadow-lg shadow-blue-200">
                    <Download className="w-5 h-5 ml-2" /> تحميل الآن
                  </Button>
                </a>
              </div>
            )}

            <div className="mt-12 mb-16">
               <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2 border-b pb-4">
                 <MessageCircle className="w-6 h-6 text-blue-600" /> التعليقات
               </h3>
               <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                 <Comments post={post} /> 
               </div>
            </div>

            {/* مقالات ذات صلة */}
            {relatedPosts.length > 0 && (
              <div className="mt-12 border-t-4 border-blue-600 pt-8 bg-gray-50 p-6 rounded-2xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">مواضيع قد تهمك أيضاً</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((item: any) => (
                    <Link key={item._id} href={`/blog/${item.slug}`} className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                      <div className="h-40 overflow-hidden relative">
                        {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full bg-gray-200 flex items-center justify-center">NAJAHIPRO</div>}
                        <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">{item.category}</span>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-gray-800 text-sm leading-relaxed group-hover:text-blue-600 line-clamp-2 min-h-[40px]">{item.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article> 

          <aside className="lg:col-span-4 space-y-8">
            <Sidebar />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}