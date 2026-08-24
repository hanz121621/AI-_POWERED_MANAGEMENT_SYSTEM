import React, { useState } from "react";

import {
  FileText,
  Clock,
  CalendarDays,
  Trash2,
  Users,
  Edit3,
  Eye,
  Activity,
  ListTodo
} from "lucide-react";


import ProjectSpecificationModal from "./modals/ProjectSpecificationModal";
import UpdateSpecificationModal from "./UpdateSpecificationModal";
import DeleteSpecificationModal from "./DeleteSpecificationModal";
import ViewProjectModal from "./ViewProjectModal";
import ManageTimelineModal from "./ManageTimelineModal";
import DeadlineModal from "./DeadlineModal";
import StatusModal from "./StatusModal";
import SprintModal from "./SprintModal";





function ProjectCard({ project }) {



const [openSpecification,setOpenSpecification] = useState(false);

const [openUpdate,setOpenUpdate] = useState(false);

const [openDelete,setOpenDelete] = useState(false);

const [openView,setOpenView] = useState(false);

const [openTimeline,setOpenTimeline] = useState(false);

const [openDeadline,setOpenDeadline] = useState(false);

const [openStatus,setOpenStatus] = useState(false);

const [openSprint,setOpenSprint] = useState(false);







return (

<div

className="
bg-[#0f172a]
border
border-gray-800
rounded-2xl
p-6
shadow-lg
transition-all
duration-300
hover:-translate-y-1
hover:border-blue-500
hover:shadow-xl
"

>









{/* Header */}

<div

className="
flex
justify-between
items-start
mb-5
"

>


<div>


<h2

className="
text-xl
font-bold
text-white
"

>

{project.name}

</h2>



<p

className="
text-gray-400
text-sm
mt-2
"

>

{project.description}

</p>


</div>





<span

className={`

px-3
py-1
rounded-full
text-xs
font-semibold

${
project.status==="Active"

?

"bg-green-500/20 text-green-400"

:

project.status==="Completed"

?

"bg-blue-500/20 text-blue-400"

:

"bg-yellow-500/20 text-yellow-400"

}

`}

>

{project.status}

</span>



</div>









{/* Progress */}

<div>


<div

className="
flex
justify-between
mb-2
"

>

<span className="text-gray-400">

Progress

</span>


<span className="text-white font-bold">

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

className="
h-full
bg-gradient-to-r
from-blue-500
to-purple-600
rounded-full
"

style={{

width:`${project.progress}%`

}}

/>


</div>


</div>









{/* Info */}

<div

className="
grid
grid-cols-2
gap-4
mt-6
"

>


<div

className="
bg-[#020617]
rounded-xl
p-4
flex
items-center
gap-3
"

>


<CalendarDays

className="text-blue-400"

size={20}

/>


<div>

<p className="text-gray-400 text-xs">

Deadline

</p>


<p className="text-white text-sm">

{project.deadline}

</p>


</div>


</div>







<div

className="
bg-[#020617]
rounded-xl
p-4
flex
items-center
gap-3
"

>


<Users

className="text-purple-400"

size={20}

/>


<div>


<p className="text-gray-400 text-xs">

Team

</p>


<p className="text-white text-sm">

{project.team} Members

</p>


</div>


</div>



</div>









{/* Actions */}

<div

className="
grid
grid-cols-2
gap-3
mt-6
"

>





<button

onClick={()=>setOpenView(true)}

className="
flex
items-center
justify-center
gap-2
bg-cyan-600
hover:bg-cyan-700
text-white
py-3
rounded-xl
transition
"

>

<Eye size={18}/>

View Project

</button>









<button

onClick={()=>setOpenSpecification(true)}

className="
flex
items-center
justify-center
gap-2
bg-blue-600
hover:bg-blue-700
text-white
py-3
rounded-xl
transition
"

>

<FileText size={18}/>

Create Specification

</button>









<button

onClick={()=>setOpenUpdate(true)}

className="
flex
items-center
justify-center
gap-2
bg-purple-600
hover:bg-purple-700
text-white
py-3
rounded-xl
transition
"

>

<Edit3 size={18}/>

Update Specification

</button>









<button

onClick={()=>setOpenTimeline(true)}

className="
flex
items-center
justify-center
gap-2
bg-indigo-600
hover:bg-indigo-700
text-white
py-3
rounded-xl
transition
"

>

<Clock size={18}/>

Manage Timeline

</button>









<button

onClick={()=>setOpenDeadline(true)}

className="
flex
items-center
justify-center
gap-2
bg-green-600
hover:bg-green-700
text-white
py-3
rounded-xl
transition
"

>

<CalendarDays size={18}/>

Set Deadline

</button>









<button

onClick={()=>setOpenStatus(true)}

className="
flex
items-center
justify-center
gap-2
bg-orange-600
hover:bg-orange-700
text-white
py-3
rounded-xl
transition
"

>

<Activity size={18}/>

Update Status

</button>









<button

onClick={()=>setOpenSprint(true)}

className="
flex
items-center
justify-center
gap-2
bg-purple-600
hover:bg-purple-700
text-white
py-3
rounded-xl
transition
"

>

<ListTodo size={18}/>

Manage Sprint

</button>









<button

onClick={()=>setOpenDelete(true)}

className="
col-span-2
flex
items-center
justify-center
gap-2
bg-red-600
hover:bg-red-700
text-white
py-3
rounded-xl
transition
"

>

<Trash2 size={18}/>

Delete Specification

</button>







</div>









{/* Modals */}


<ProjectSpecificationModal

open={openSpecification}

onClose={()=>setOpenSpecification(false)}

project={project}

/>





<UpdateSpecificationModal

open={openUpdate}

close={()=>setOpenUpdate(false)}

project={project}

/>





<ViewProjectModal

open={openView}

close={()=>setOpenView(false)}

project={project}

/>





<ManageTimelineModal

open={openTimeline}

close={()=>setOpenTimeline(false)}

project={project}

/>





<DeadlineModal

open={openDeadline}

close={()=>setOpenDeadline(false)}

project={project}

/>





<StatusModal

open={openStatus}

close={()=>setOpenStatus(false)}

project={project}

/>





<SprintModal

open={openSprint}

close={()=>setOpenSprint(false)}

project={project}

/>





<DeleteSpecificationModal

open={openDelete}

close={()=>setOpenDelete(false)}

project={project}

/>






</div>

);

}



export default ProjectCard;