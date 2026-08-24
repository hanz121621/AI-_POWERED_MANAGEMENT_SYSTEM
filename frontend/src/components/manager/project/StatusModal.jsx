import React, { useState } from "react";

import {
  X,
  Activity
} from "lucide-react";



function StatusModal({
open,
close,
project
}) {



const [statusData,setStatusData] = useState({

status: project?.status || "Planning",

notes:""

});







if(!open) return null;







const handleChange=(e)=>{


setStatusData({

...statusData,

[e.target.name]:e.target.value

});


};








const updateStatus=(e)=>{


e.preventDefault();




if(!statusData.status){

alert("Please select project status.");

return;

}




alert(
"Project status updated successfully."
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
p-8
w-full
max-w-xl
shadow-2xl
"

>





{/* Header */}

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
flex
items-center
gap-2
">

<Activity className="text-orange-400"/>

Manage Project Status

</h2>




<button

onClick={close}

className="
text-gray-400
hover:text-white
"

>

<X/>

</button>



</div>







<p className="
text-gray-400
mb-6
">

Project:

<span className="
text-orange-400
ml-2
">

{project?.name}

</span>

</p>








<form

onSubmit={updateStatus}

className="
space-y-5
"

>








{/* Status Select */}


<div>


<label className="
text-gray-300
text-sm
">

Project Status

</label>



<select

name="status"

value={statusData.status}

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
focus:border-orange-500
"

>


<option value="Planning">

Planning

</option>


<option value="Active">

Active

</option>


<option value="On Hold">

On Hold

</option>


<option value="Completed">

Completed

</option>


<option value="Cancelled">

Cancelled

</option>



</select>



</div>









{/* Notes */}



<div>


<label className="
text-gray-300
text-sm
">

Status Notes / Progress Comments

</label>



<textarea

name="notes"

value={statusData.notes}

onChange={handleChange}

rows="4"

placeholder="Add status update details..."

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
focus:border-orange-500
"

/>



</div>









<button

type="submit"

className="
w-full
bg-orange-600
hover:bg-orange-700
py-3
rounded-xl
text-white
font-semibold
transition
"

>

Update Status

</button>







</form>







</div>


</div>


);


}



export default StatusModal;