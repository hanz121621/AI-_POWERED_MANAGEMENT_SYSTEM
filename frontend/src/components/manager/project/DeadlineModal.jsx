import React, { useState } from "react";
import { X, CalendarDays } from "lucide-react";


function DeadlineModal({
  open,
  close,
  project
}) {


const [data,setData] = useState({

deadline:"",
milestone:"",
notes:""

});



if(!open) return null;




const handleChange=(e)=>{

setData({

...data,

[e.target.name]:e.target.value

});

};





const saveDeadline=(e)=>{

e.preventDefault();


alert(
"Project deadline updated successfully."
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
p-8
w-full
max-w-xl
shadow-2xl
max-h-[90vh]
overflow-y-auto
"

>





{/* Header */}

<div

className="
flex
justify-between
items-center
mb-6
"

>


<div className="
flex
items-center
gap-3
">

<CalendarDays

className="text-green-400"

/>


<h2 className="
text-2xl
font-bold
text-white
">

Set / Update Project Deadline

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







<p className="
text-gray-400
mb-6
">

Project:

<span className="
text-green-400
ml-2
">

{project?.name}

</span>


</p>







<form

onSubmit={saveDeadline}

className="
space-y-5
"

>






<div>


<label className="
text-gray-300
text-sm
">

Deadline Date

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
text-gray-400
"

size={20}

/>



<input

type="date"

name="deadline"

value={data.deadline}

onChange={handleChange}

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
focus:border-green-500
"

/>


</div>


</div>







<div>


<label className="
text-gray-300
text-sm
">

Milestone Date

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
text-gray-400
"

size={20}

/>



<input

type="date"

name="milestone"

value={data.milestone}

onChange={handleChange}

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
focus:border-green-500
"

/>


</div>


</div>







<div>


<label className="
text-gray-300
text-sm
">

Deadline Notes

</label>



<textarea

name="notes"

value={data.notes}

onChange={handleChange}

rows="5"

placeholder="Reason for deadline change..."

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
focus:border-green-500
"

/>


</div>






<button

type="submit"

className="
w-full
bg-green-600
hover:bg-green-700
py-3
rounded-xl
text-white
font-semibold
"

>

Save Deadline

</button>






</form>






</div>





</div>

);

}


export default DeadlineModal;