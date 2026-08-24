import React from "react";
import { Bell, Search } from "lucide-react";


function ManagerNavbar(){


return (

<header

className="
h-20
bg-white
border-b
flex
items-center
justify-between
px-8
sticky
top-0
z-40
"

>



{/* Search */}


<div className="relative w-96">


<Search

className="
absolute
left-3
top-3
text-slate-400
"

/>



<input

type="text"

placeholder="Search projects..."

className="
w-full
pl-10
pr-4
py-3
rounded-lg
border
border-slate-300
bg-slate-50
text-slate-800
outline-none
focus:ring-2
focus:ring-blue-500
"

/>


</div>







{/* Notification + Profile */}


<div className="flex items-center gap-6">



<button

className="
relative
p-3
rounded-full
hover:bg-slate-100
"

>


<Bell

size={24}

className="text-slate-700"

/>



<span

className="
absolute
top-2
right-2
w-2
h-2
bg-red-600
rounded-full
"

/>


</button>






<div className="flex items-center gap-3">


<div

className="
w-10
h-10
rounded-full
bg-blue-600
flex
items-center
justify-center
text-white
font-bold
"

>

M

</div>



<div>


<p className="font-semibold text-slate-800">

Manager

</p>


<p className="text-sm text-slate-500">

manager@email.com

</p>


</div>



</div>



</div>





</header>


);


}


export default ManagerNavbar;