import React from "react";


function ProjectTable(){


const projects=[

{
name:"AI PMS",
status:"Active",
progress:"80%",
deadline:"Aug 30",
statusColor:"text-green-400"
},


{
name:"FieldSync",
status:"Pending",
progress:"65%",
deadline:"Sep 15",
statusColor:"text-yellow-400"
},


{
name:"Library System",
status:"Completed",
progress:"100%",
deadline:"July 20",
statusColor:"text-blue-400"
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
mt-8
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
mb-6
"

>

Projects Overview

</h2>





<div className="
overflow-x-auto
">


<table className="
w-full
text-left
">


<thead>


<tr

className="
border-b
border-gray-800
text-gray-400
"

>


<th className="py-3">
Project
</th>


<th className="py-3">
Status
</th>


<th className="py-3">
Progress
</th>


<th className="py-3">
Deadline
</th>


</tr>


</thead>







<tbody>


{

projects.map((project)=>(


<tr

key={project.name}

className="
border-b
border-gray-800
hover:bg-[#020617]
transition
"

>


<td className="
py-4
text-white
font-medium
">

{project.name}

</td>




<td className={`
py-4
font-semibold
${project.statusColor}
`}>

{project.status}

</td>





<td className="
py-4
text-gray-300
">

{project.progress}

</td>





<td className="
py-4
text-gray-400
">

{project.deadline}

</td>





</tr>



))


}



</tbody>




</table>



</div>





</div>


);


}



export default ProjectTable;