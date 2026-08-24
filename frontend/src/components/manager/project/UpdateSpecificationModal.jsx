import React, {useState} from "react";


function UpdateSpecificationModal({
open,
close,
project
}){


const [form,setForm]=useState({

objectives:"Existing project objectives...",
scope:"Existing project scope...",
functional:"Existing functional requirements...",
nonFunctional:"Existing non-functional requirements...",
deliverables:"Existing deliverables...",
technology:"React, .NET, PostgreSQL",
assumptions:"Existing assumptions...",
constraints:"Existing constraints..."

});





if(!open) return null;





const handleChange=(e)=>{

setForm({

...form,

[e.target.name]:e.target.value

});

};






const handleSubmit=(e)=>{

e.preventDefault();


alert(
"Project specification updated successfully."
);


close();


};







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
max-h-[90vh]
overflow-y-auto
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

Update Project Specification

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









<form

onSubmit={handleSubmit}

className="
space-y-4
"

>


{


[

["objectives","Project Objectives"],

["scope","Project Scope"],

["functional","Functional Requirements"],

["nonFunctional","Non Functional Requirements"],

["deliverables","Deliverables"],

["technology","Technology Stack"],

["assumptions","Project Assumptions"],

["constraints","Constraints"]

].map(([name,label])=>(


<div key={name}>


<label className="
text-sm
text-gray-300
">

{label}

</label>



<textarea

name={name}

value={form[name]}

onChange={handleChange}

className="
w-full
mt-2
bg-[#020617]
border
border-gray-700
rounded-xl
p-3
text-white
outline-none
focus:border-blue-500
"

/>


</div>


))


}








<button

type="submit"

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

Save Changes

</button>





</form>







</div>



</div>


);


}


export default UpdateSpecificationModal;