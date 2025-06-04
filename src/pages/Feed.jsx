import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import Sidebar from "../components/Sidebar";

export default function Feed(){
    return(
       <div className="h-screen flex flex-col">
        <Navbar/>
        <div className="flex flex-1">
         <div className="w-64 bg-white border-r">
          <Sidebar/>
         </div>

         <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
             <PostCard/>
         </div>

        </div>
       </div>
    )
}