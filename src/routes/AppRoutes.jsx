import {Routes, Route} from "react-router-dom"
import Feed from "../pages/Feed"
import Profile from "../pages/Profile"
import Messages from "../pages/Messages"
import Login from "../pages/Login"
import NotFound from "../pages/NotFound"
import Club from "../pages/Club"
import Events from "../pages/Events"

export default function AppRoutes(){
    return(
        <Routes>
           <Route path="/" element={<Feed/>}/>
           <Route path="/profile/:id" element={<Profile/>}/>
           <Route path="/messages" element={<Messages/>}/>
           <Route path="/login" element={<Login/>}/>
           <Route path="/club" element={<Club/>}/>
           <Route path="/event" element={<Events/>}/>
           <Route path="*" element={<NotFound/>}/>
              
        </Routes>
    );
}