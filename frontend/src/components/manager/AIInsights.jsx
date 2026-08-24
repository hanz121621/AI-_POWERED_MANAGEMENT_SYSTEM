import React from "react";

import {
  AlertTriangle,
  TrendingUp,
  Clock,
} from "lucide-react";



function AIInsights() {



const insights = [


{
title:"Deadline Risk",
message:"Sprint deadline risk detected",
icon:AlertTriangle,
style:"bg-red-500/10 border-red-500/20",
iconColor:"text-red-400"
},



{
title:"Productivity",
message:"Team productivity increased 18%",
icon:TrendingUp,
style:"bg-green-500/10 border-green-500/20",
iconColor:"text-green-400"
},



{
title:"Milestone",
message:"Next milestone in 7 days",
icon:Clock,
style:"bg-blue-500/10 border-blue-500/20",
iconColor:"text-blue-400"
}


];






return (


<div

className="
bg-[#0f172a]
border
border-gray-800
rounded-xl
shadow-lg
p-6
transition-all
duration-300
hover:border-blue-500
hover:shadow-xl
"

>



<h2

className="
text-xl
font-bold
mb-5
text-white
"

>

AI Insights

</h2>








<div className="
space-y-4
">


{


insights.map((item)=>(


<div

key={item.title}

className={`
flex
gap-3
items-start
p-4
rounded-lg
border
${item.style}
transition
duration-300
hover:scale-[1.02]
`}

>


<item.icon

className={item.iconColor}

size={24}

/>





<div>


<h3

className="
font-semibold
text-white
"

>

{item.title}

</h3>





<p

className="
text-sm
text-gray-400
mt-1
"

>

{item.message}

</p>



</div>





</div>



))


}



</div>







</div>



);


}



export default AIInsights;