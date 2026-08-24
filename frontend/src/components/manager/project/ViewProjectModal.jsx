import React from "react";


function ViewProjectModal({
open,
close,
project
}){


if(!open) return null;


return (

<div className="
fixed
inset-0
bg-black/60
flex
items-center
justify-center
z-50
">


<div className="
bg-[#0f172a]
border
border-gray-800
rounded-2xl
p-8
w-full
max-w-xl
shadow-2xl
">


<div className="
flex
justify-between
mb-6
">


<h2 className="
text-2xl
font-bold
text-white
">

Project Details

</h2>



<button

onClick={close}

className="
text-gray-400
hover:text-white
"

>

✕

</button>


</div>





<h3 className="
text-xl
font-semibold
text-blue-400
">

{project?.name}

</h3>



<p className="
text-gray-400
mt-3
">

{project?.description}

</p>







<div className="
mt-6
space-y-3
text-white
">


<p>

<b>Status:</b> {project?.status}

</p>


<p>

<b>Start Date:</b> {project?.startDate}

</p>


<p>

<b>Deadline:</b> {project?.deadline}

</p>


<p>

<b>Progress:</b> {project?.progress}%

</p>


<p>

<b>Team:</b> {project?.team} Members

</p>



</div>





<button

onClick={close}

className="
mt-6
w-full
bg-blue-600
hover:bg-blue-700
py-3
rounded-xl
"

>

Close

</button>




</div>


</div>

);


}


export default ViewProjectModal;