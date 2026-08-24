import React from "react";


function CreateSpecificationModal({
open,
close,
project
}){


if(!open) return null;



return (

<div

className="
fixed
inset-0
bg-black/60
flex
items-center
justify-center
z-50
"

>


<div

className="
bg-[#0f172a]
border
border-gray-800
rounded-2xl
w-full
max-w-3xl
p-8
shadow-2xl
"

>


<div className="
flex
justify-between
items-center
mb-6
">


<h2 className="
text-2xl
font-bold
text-white
">

Create Project Specification

</h2>




<button

onClick={close}

className="
text-gray-400
hover:text-white
text-xl
"

>

✕

</button>


</div>







<p className="
text-gray-400
mb-5
">

Project:

<span className="text-white ml-2">

{project?.name}

</span>

</p>







<form className="space-y-4">



<textarea

placeholder="Project Objectives"

className="
w-full
bg-[#020617]
border
border-gray-700
rounded-xl
p-3
text-white
outline-none
"

/>




<textarea

placeholder="Project Scope"

className="
w-full
bg-[#020617]
border
border-gray-700
rounded-xl
p-3
text-white
outline-none
"

/>




<textarea

placeholder="Functional Requirements"

className="
w-full
bg-[#020617]
border
border-gray-700
rounded-xl
p-3
text-white
outline-none
"

/>





<textarea

placeholder="Non Functional Requirements"

className="
w-full
bg-[#020617]
border
border-gray-700
rounded-xl
p-3
text-white
outline-none
"

/>





<button

type="button"

onClick={close}

className="
w-full
bg-blue-600
hover:bg-blue-700
py-3
rounded-xl
font-semibold
transition
"

>

Save Specification

</button>




</form>




</div>


</div>


);


}


export default CreateSpecificationModal;