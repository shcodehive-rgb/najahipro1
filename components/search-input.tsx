"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchInput() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="ابحث عن دروس، امتحانات..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <Button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl shadow-sm"
        >
          بحث
        </Button>
      </div>
    </form>
  )
}
