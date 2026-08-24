import React from "react";


function ProjectProgress() {


const projects = [

{
name: "AI PMS",
progress: 80,
color: "bg-blue-600",
},


{
name: "FieldSync",
progress: 65,
color: "bg-green-600",
},


{
name: "Library System",
progress: 45,
color: "bg-orange-500",
},

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

Project Progress

</h2>






<div className="
space-y-5
">


{

projects.map((project)=>(


<div key={project.name}>


<div className="
flex
justify-between
mb-2
">


<span

className="
font-medium
text-gray-200
"

>

{project.name}

</span>




<span

className="
text-gray-400
"

>

{project.progress}%

</span>



</div>







<div

className="
h-3
bg-gray-800
rounded-full
overflow-hidden
"

>


<div

className={`
h-3
rounded-full
${project.color}
transition-all
duration-1000
ease-out
`}

style={{

width:`${project.progress}%`

}}


/>



</div>






</div>



))


}



</div>





</div>



);


}


export default ProjectProgress;