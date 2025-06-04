import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import Sidebar from "../components/Sidebar";


export default function Feed(){
    return(
         <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
             <PostCard/>
         </div>
    )
}