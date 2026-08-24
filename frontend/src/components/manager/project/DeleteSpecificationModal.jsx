import React from "react";


function DeleteSpecificationModal({
open,
close,
project,
confirmDelete
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
p-8
w-full
max-w-md
shadow-2xl
"

>


<h2

className="
text-xl
font-bold
text-white
mb-4
"

>

Delete Project Specification

</h2>





<p

className="
text-gray-400
mb-6
"

>

Are you sure you want to delete the specification for:

<span className="text-white block mt-2 font-semibold">

{project?.name}

</span>


</p>







<div className="
flex
gap-4
">


<button

onClick={close}

className="
flex-1
bg-gray-700
hover:bg-gray-600
py-3
rounded-xl
transition
"

>

Cancel

</button>






<button

onClick={confirmDelete}

className="
flex-1
bg-red-600
hover:bg-red-700
py-3
rounded-xl
transition
"

>

Delete

</button>





</div>





</div>



</div>


);


}


export default DeleteSpecificationModal;