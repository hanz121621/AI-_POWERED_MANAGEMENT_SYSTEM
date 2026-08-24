import React, { useState } from "react";

import {
  X,
  CalendarDays,
  Plus
} from "lucide-react";



function SprintModal({
  open,
  close,
  project
}) {



const [sprint,setSprint] = useState({

name:"",
goal:"",
description:"",
startDate:"",
endDate:"",
duration:"",
priority:"Medium"

});






if(!open) return null;






const handleChange=(e)=>{


setSprint({

...sprint,

[e.target.name]:e.target.value

});


};







const handleSave=(e)=>{


e.preventDefault();



if(
!sprint.name ||
!sprint.startDate ||
!sprint.endDate
){

alert(
"Please complete all required fields."
);

return;

}



if(
sprint.endDate < sprint.startDate
){

alert(
"Sprint end date cannot be earlier than start date."
);

return;

}



alert(
"Sprint created successfully."
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
p-5
"

>









<div

className="
bg-[#0f172a]
border
border-gray-800
rounded-2xl
w-full
max-w-2xl
h-[90vh]
shadow-2xl
flex
flex-col
"

>









{/* Header */}

<div

className="
flex
justify-between
items-center
p-6
border-b
border-gray-800
"

>


<div

className="
flex
items-center
gap-3
"

>


<Plus

className="text-purple-400"

/>



<h2

className="
text-2xl
font-bold
text-white
"

>

Create Sprint

</h2>



</div>






<button

onClick={close}

className="
text-gray-400
hover:text-white
"

>

<X size={26}/>

</button>




</div>









{/* Scroll Area */}

<div

className="
flex-1
overflow-y-auto
p-6
"

>


<form

id="sprintForm"

onSubmit={handleSave}

className="
space-y-5
"

>





<p

className="
text-gray-400
"

>

Project:

<span

className="
text-purple-400
ml-2
font-semibold
"

>

{project?.name}

</span>


</p>









{/* Sprint Name */}

<div>


<label className="
text-gray-300
text-sm
">

Sprint Name *

</label>


<input

name="name"

value={sprint.name}

onChange={handleChange}

placeholder="Sprint 1"

className="
w-full
mt-2
bg-[#020617]
border
border-gray-700
rounded-xl
p-3
text-white
focus:border-purple-500
outline-none
"

/>


</div>









{/* Goal */}

<div>


<label className="
text-gray-300
text-sm
">

Sprint Goal

</label>



<input

name="goal"

value={sprint.goal}

onChange={handleChange}

placeholder="Complete authentication module"

className="
w-full
mt-2
bg-[#020617]
border
border-gray-700
rounded-xl
p-3
text-white
focus:border-purple-500
outline-none
"

/>


</div>









{/* Description */}

<div>


<label className="
text-gray-300
text-sm
">

Description

</label>


<textarea

name="description"

value={sprint.description}

onChange={handleChange}

rows="4"

placeholder="Describe sprint objectives..."

className="
w-full
mt-2
bg-[#020617]
border
border-gray-700
rounded-xl
p-3
text-white
focus:border-purple-500
outline-none
"

/>


</div>









{/* Dates */}

<div className="
grid
grid-cols-2
gap-4
">



<DateInput

label="Start Date"

name="startDate"

value={sprint.startDate}

onChange={handleChange}

/>



<DateInput

label="End Date"

name="endDate"

value={sprint.endDate}

onChange={handleChange}

/>



</div>









{/* Duration */}

<div>


<label className="
text-gray-300
text-sm
">

Sprint Duration

</label>



<input

name="duration"

value={sprint.duration}

onChange={handleChange}

placeholder="Example: 2 weeks"

className="
w-full
mt-2
bg-[#020617]
border
border-gray-700
rounded-xl
p-3
text-white
focus:border-purple-500
outline-none
"

/>


</div>









{/* Priority */}

<div>


<label className="
text-gray-300
text-sm
">

Priority

</label>



<select

name="priority"

value={sprint.priority}

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







</form>


</div>









{/* Footer */}

<div

className="
border-t
border-gray-800
p-6
"

>


<button

form="sprintForm"

type="submit"

className="
w-full
bg-purple-600
hover:bg-purple-700
py-3
rounded-xl
text-white
font-semibold
transition
"

>

Save Sprint

</button>



</div>








</div>







</div>

);

}









function DateInput({

label,
name,
value,
onChange

}){


return (

<div>


<label

className="
text-gray-300
text-sm
"

>

{label}

</label>



<div className="
relative
mt-2
">


<CalendarDays

className="
absolute
left-3
top-3
text-purple-400
"

size={20}

/>



<input

type="date"

name={name}

value={value}

onChange={onChange}

className="
w-full
bg-[#020617]
border
border-gray-700
rounded-xl
p-3
pl-10
text-white
outline-none
focus:border-purple-500
"

/>



</div>


</div>

);


}







export default SprintModal;