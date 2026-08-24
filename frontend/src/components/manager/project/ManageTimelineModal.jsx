import React, { useState, useRef } from "react";

import {
  X,
  CalendarDays
} from "lucide-react";



function ManageTimelineModal({
  open,
  close,
  project
}) {



const [timeline, setTimeline] = useState({

  startDate:"",
  deadline:"",
  milestone:"",
  sprint:"",
  taskDuration:"",
  deliveryDate:""

});






if(!open) return null;







const handleChange=(e)=>{


setTimeline({

  ...timeline,

  [e.target.name]: e.target.value

});


};








const handleSave=(e)=>{


e.preventDefault();



if(
  timeline.startDate &&
  timeline.deadline &&
  timeline.deadline < timeline.startDate
){

alert(
"Deadline cannot be earlier than the start date."
);

return;

}





alert(
"Project timeline updated successfully."
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









{/* Modal Container */}

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










{/* Header Fixed */}

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


<div>


<h2

className="
text-2xl
font-bold
text-white
"

>

Manage Project Timeline

</h2>



<p

className="
text-gray-400
text-sm
mt-1
"

>

{project?.name}

</p>


</div>







<button

type="button"

onClick={close}

className="
text-gray-400
hover:text-white
transition
"

>

<X size={26}/>

</button>




</div>












{/* Scrollable Body */}

<div

className="
flex-1
overflow-y-auto
p-6
"

>





<form

id="timelineForm"

onSubmit={handleSave}

className="
space-y-5
"

>









<DateField

label="Project Start Date"

name="startDate"

value={timeline.startDate}

onChange={handleChange}

color="text-blue-400"

/>








<DateField

label="Project Deadline"

name="deadline"

value={timeline.deadline}

onChange={handleChange}

color="text-red-400"

/>








<div>


<label

className="
text-gray-300
text-sm
font-medium
"

>

Milestones

</label>



<input

name="milestone"

value={timeline.milestone}

onChange={handleChange}

placeholder="Enter milestones"

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








<div>


<label

className="
text-gray-300
text-sm
font-medium
"

>

Sprint Dates

</label>



<input

name="sprint"

value={timeline.sprint}

onChange={handleChange}

placeholder="Enter sprint dates"

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









<div>


<label

className="
text-gray-300
text-sm
font-medium
"

>

Task Duration

</label>



<input

name="taskDuration"

value={timeline.taskDuration}

onChange={handleChange}

placeholder="Example: 14 days"

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









<DateField

label="Delivery Date"

name="deliveryDate"

value={timeline.deliveryDate}

onChange={handleChange}

color="text-green-400"

/>








</form>





</div>









{/* Fixed Footer */}

<div

className="
border-t
border-gray-800
p-6
"

>


<button

type="submit"

form="timelineForm"

className="
w-full
bg-blue-600
hover:bg-blue-700
py-3
rounded-xl
text-white
font-semibold
transition
"

>

Save Changes

</button>



</div>









</div>








</div>

);

}









function DateField({

label,

name,

value,

onChange,

color

}){


const inputRef = useRef(null);




return (

<div>


<label

className="
text-gray-300
text-sm
font-medium
"

>

{label}

</label>





<div

className="
relative
mt-2
"

>


<input

ref={inputRef}

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
pr-12
text-white
outline-none
focus:border-blue-500
"

/>





<button

type="button"

onClick={()=>inputRef.current?.showPicker()}

className="
absolute
right-3
top-3
"

>


<CalendarDays

size={22}

className={color}

/>


</button>





</div>


</div>

);


}







export default ManageTimelineModal;