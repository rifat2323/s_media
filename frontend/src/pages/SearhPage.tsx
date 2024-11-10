import { useEffect, useRef, useState } from "react"
import { Search, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import People from "@/components/search/People"
import { throttle } from "throttle-debounce"
import Post from "@/components/search/Post"
import { useNavigate } from "react-router-dom"


export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("posts")
  const [shouldLoadMore,setShouldLoadMore] = useState(true)


  const ref = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  useEffect(()=>{
      if(!ref.current) return
      const element = ref.current
     const handelScroll =throttle( 400,()=>{
     
     
      if(element.scrollTop + element.clientHeight >=element.scrollHeight - 100){
        setShouldLoadMore(true)
      }
      
     })
    
      element.addEventListener("scroll",handelScroll)
      return ()=>{
        element.removeEventListener("scroll",handelScroll)
      }
    
     },[])
  const navigate = useNavigate()
  return (
    <div ref={ref} className="h-screen overflow-y-auto scrollbar-hide w-full ">
      <div className="w-full mx-auto bg-white rounded-xl  overflow-hidden">
        <div className="p-4 w-full">
          <div className=" w-full flex gap-1 sm:gap-2  md:gap-4 sm:items-center justify-between mb-4">
            <div className="  flex items-center space-x-2">
              {/* Placeholder for logo */}
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              
            </div>
            <div className="flex flex-1 items-center space-x-2">
              <Input
              ref={inputRef}
                type="text"
                placeholder="Search..."
                className=" w-full h-9 rounded-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                tabIndex={1}
              />
              <Button onClick={()=>{
                navigate(`/search/${inputRef.current?.value}`)
                setShouldLoadMore(true)

              }} size="sm" className="rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
           
          </div>

          <div className="mt-4 flex justify-center">
            <div className="border-b border-gray-200 w-full max-w-md">
              <nav className="-mb-px flex justify-around" aria-label="Tabs">
                {["posts", "people"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab)
                      setShouldLoadMore(true)
                    }}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300
                      ${
                        activeTab === tab
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Search Results</h2>
            {activeTab === "people" ? <People  shouldLoadMore={shouldLoadMore} setShouldLoadMore={setShouldLoadMore} />: <Post setShouldLoadMore={setShouldLoadMore} shouldLoadMore={shouldLoadMore}/>}
          </div>
        </div>
      </div>
    </div>
  )
}