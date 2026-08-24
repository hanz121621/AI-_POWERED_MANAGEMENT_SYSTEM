import React, { useState } from "react";
import { FolderKanban, Users, Calendar, Flag } from "lucide-react";

import ManagerSidebar from "../../components/manager/ManagerSidebar";
import ManagerNavbar from "../../components/manager/ManagerNavbar";


function AssignProject() {


const [project,setProject] = useState("");
const [member,setMember] = useState("");
const [priority,setPriority] = useState("Medium");
const [date,setDate] = useState("");



const handleAssign = (e)=>{
    e.preventDefault();

    console.log({
        project,
        member,
        priority,
        date
    });

    alert("Project Assigned Successfully");
};




return (

<div className="
flex
min-h-screen
bg-[#020617]
text-white
">


{/* Sidebar */}

<ManagerSidebar />





{/* Main Content */}

<main className="
ml-64
flex-1
">


<ManagerNavbar />




<div className="
p-8
">


{/* Header */}

<div className="
mb-8
">


<h1 className="
text-3xl
font-bold
">

Assign Project

</h1>


<p className="
text-gray-400
mt-2
">

Assign projects to team members and manage responsibilities

</p>


</div>









{/* Form Card */}


<div className="
max-w-3xl
bg-[#0f172a]
border
border-gray-800
rounded-xl
p-8
shadow-lg
">



<form
onSubmit={handleAssign}
className="
space-y-6
"
>



{/* Project */}


<div>


<label className="
flex
items-center
gap-2
text-sm
font-medium
mb-2
">

<FolderKanban size={18}/>

Select Project

</label>


<select

value={project}

onChange={(e)=>setProject(e.target.value)}

className="
w-full
bg-[#020617]
border
border-gray-700
rounded-lg
px-4
py-3
text-white
focus:outline-none
focus:border-blue-500
"

>


<option value="">
Choose project
</option>

<option>
AI Project Management System
</option>

<option>
FieldSync Platform
</option>

<option>
Library Management System
</option>


</select>


</div>








{/* Member */}


<div>


<label className="
flex
items-center
gap-2
text-sm
font-medium
mb-2
">

<Users size={18}/>

Assign Member

</label>



<select

value={member}

onChange={(e)=>setMember(e.target.value)}

className="
w-full
bg-[#020617]
border
border-gray-700
rounded-lg
px-4
py-3
text-white
focus:outline-none
focus:border-blue-500
"

>


<option value="">
Choose team member
</option>


<option>
John Developer
</option>


<option>
Sarah Designer
</option>


<option>
Michael Tester
</option>


</select>


</div>









{/* Priority */}


<div>


<label className="
flex
items-center
gap-2
text-sm
font-medium
mb-2
">


<Flag size={18}/>

Priority

</label>



<select

value={priority}

onChange={(e)=>setPriority(e.target.value)}

className="
w-full
bg-[#020617]
border
border-gray-700
rounded-lg
px-4
py-3
text-white
focus:outline-none
focus:border-blue-500
"

>


<option>
High
</option>

<option>
Medium
</option>

<option>
Low
</option>


</select>


</div>









{/* Deadline */}


<div>


<label className="
flex
items-center
gap-2
text-sm
font-medium
mb-2
">

<Calendar size={18}/>

Deadline

</label>



<input

type="date"

value={date}

onChange={(e)=>setDate(e.target.value)}

className="
w-full
bg-[#020617]
border
border-gray-700
rounded-lg
px-4
py-3
text-white
focus:outline-none
focus:border-blue-500
"

/>


</div>









{/* Button */}


<button

type="submit"

className="
w-full
bg-blue-600
hover:bg-blue-700
py-3
rounded-lg
font-semibold
transition
duration-300
"

>

Assign Project

</button>





</form>



</div>




</div>


</main>



</div>

);


}


export default AssignProject;