import React, { useState } from "react";

import {
  X,
  FileText
} from "lucide-react";



function ProjectSpecificationModal({
  open,
  onClose,
  project
}) {


  const [formData,setFormData] = useState({

    objectives:"",
    scope:"",
    functional:"",
    nonFunctional:"",
    deliverables:"",
    technology:"",
    assumptions:"",
    constraints:""

  });





  if(!open) return null;







  const handleChange = (e)=>{


    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });


  };







  const handleSave = (e)=>{


    e.preventDefault();



    if(
      !formData.objectives ||
      !formData.scope ||
      !formData.functional
    ){

      alert(
        "Please complete all required fields."
      );

      return;

    }



    alert(
      "Project specification created successfully."
    );



    onClose();


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
max-w-4xl
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



<div

className="
flex
items-center
gap-3
"

>

<FileText

size={28}

className="text-blue-400"

/>



<h2

className="
text-2xl
font-bold
text-white
"

>

Create Project Specification

</h2>


</div>







<button

type="button"

onClick={onClose}

className="
text-gray-400
hover:text-white
transition
"

>

<X size={26}/>

</button>





</div>










<p

className="
text-gray-400
mb-6
"

>

Project:

<span

className="
text-blue-400
ml-2
font-semibold
"

>

{project?.name}

</span>


</p>









<form

onSubmit={handleSave}

className="
space-y-5
"

>







<Field

label="Project Objectives *"

name="objectives"

value={formData.objectives}

onChange={handleChange}

placeholder="Define project objectives"

/>







<Field

label="Project Scope *"

name="scope"

value={formData.scope}

onChange={handleChange}

placeholder="Define project scope"

/>








<Field

label="Functional Requirements *"

name="functional"

value={formData.functional}

onChange={handleChange}

placeholder="Enter functional requirements"

/>







<Field

label="Non-Functional Requirements"

name="nonFunctional"

value={formData.nonFunctional}

onChange={handleChange}

placeholder="Security, performance, scalability"

/>







<Field

label="Deliverables"

name="deliverables"

value={formData.deliverables}

onChange={handleChange}

placeholder="Project deliverables"

/>







<Field

label="Technology Stack"

name="technology"

value={formData.technology}

onChange={handleChange}

placeholder="React, .NET, PostgreSQL"

/>







<Field

label="Project Assumptions"

name="assumptions"

value={formData.assumptions}

onChange={handleChange}

placeholder="Project assumptions"

/>







<Field

label="Project Constraints"

name="constraints"

value={formData.constraints}

onChange={handleChange}

placeholder="Project limitations"

/>









<button

type="submit"

className="
w-full
bg-blue-600
hover:bg-blue-700
text-white
font-semibold
py-3
rounded-xl
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









function Field({

label,
name,
value,
onChange,
placeholder

}){


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





<textarea

name={name}

value={value}

onChange={onChange}

placeholder={placeholder}

rows="3"

className="
w-full
mt-2
bg-[#020617]
border
border-gray-700
rounded-xl
p-3
text-white
placeholder-gray-500
outline-none
focus:border-blue-500
"

>




</textarea>



</div>


);


}





export default ProjectSpecificationModal;