import React from "react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";



function DashboardCharts(){


const progressData=[

{
name:"Week 1",
progress:30
},

{
name:"Week 2",
progress:45
},

{
name:"Week 3",
progress:65
},

{
name:"Week 4",
progress:80
}

];



const teamData=[

{
name:"Development",
tasks:120
},

{
name:"Design",
tasks:80
},

{
name:"Testing",
tasks:60
}

];





return (

<div className="
grid
lg:grid-cols-2
gap-6
">





{/* Project Analytics */}


<div

className="
bg-[#0f172a]
border
border-gray-800
rounded-xl
shadow-lg
p-6
transition
duration-300
hover:border-blue-500
hover:shadow-xl
"

>


<h2

className="
text-xl
font-bold
text-white
mb-5
"

>

Project Analytics

</h2>




<ResponsiveContainer
width="100%"
height={300}
>


<LineChart data={progressData}>


<CartesianGrid
strokeDasharray="3 3"
stroke="#1f2937"
/>


<XAxis

dataKey="name"

stroke="#9ca3af"

/>


<YAxis

stroke="#9ca3af"

/>


<Tooltip

contentStyle={{
background:"#0f172a",
border:"1px solid #374151",
color:"#fff"
}}

/>



<Line

type="monotone"

dataKey="progress"

stroke="#2563eb"

strokeWidth={3}

/>



</LineChart>


</ResponsiveContainer>



</div>









{/* Team Velocity */}



<div

className="
bg-[#0f172a]
border
border-gray-800
rounded-xl
shadow-lg
p-6
transition
duration-300
hover:border-blue-500
hover:shadow-xl
"

>



<h2

className="
text-xl
font-bold
text-white
mb-5
"

>

Team Velocity

</h2>





<ResponsiveContainer

width="100%"

height={300}

>


<BarChart data={teamData}>


<CartesianGrid
strokeDasharray="3 3"
stroke="#1f2937"
/>


<XAxis

dataKey="name"

stroke="#9ca3af"

/>


<YAxis

stroke="#9ca3af"

/>


<Tooltip

contentStyle={{
background:"#0f172a",
border:"1px solid #374151",
color:"#fff"
}}

/>



<Bar

dataKey="tasks"

fill="#16a34a"

radius={[6,6,0,0]}

/>



</BarChart>


</ResponsiveContainer>



</div>





</div>


);


}


export default DashboardCharts;