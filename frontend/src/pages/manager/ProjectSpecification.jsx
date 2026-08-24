import { useState } from "react";


function ProjectSpecification() {


  const [specification, setSpecification] = useState({

    objectives: "",
    scope: "",
    functionalRequirements: "",
    nonFunctionalRequirements: "",
    deliverables: "",
    technologyStack: "",
    assumptions: "",
    constraints: ""

  });



  const [message, setMessage] = useState("");



  const handleChange = (e)=>{

    setSpecification({

      ...specification,

      [e.target.name]: e.target.value

    });

  };



  const handleSave = ()=>{


    if(
      !specification.objectives ||
      !specification.scope ||
      !specification.functionalRequirements
    ){

      setMessage(
        "Please complete all required fields."
      );

      return;

    }



    setMessage(
      "Project specification created successfully."
    );


  };



  const handleDelete = ()=>{


    setSpecification({

      objectives:"",
      scope:"",
      functionalRequirements:"",
      nonFunctionalRequirements:"",
      deliverables:"",
      technologyStack:"",
      assumptions:"",
      constraints:""

    });



    setMessage(
      "Project specification deleted successfully."
    );


  };





  return (

    <div className="p-6">


      <h1 className="text-3xl font-bold mb-6">

        Project Specification

      </h1>




      {
        message &&

        <div className="
        bg-blue-100
        border
        border-blue-400
        p-3
        rounded
        mb-5
        ">

          {message}

        </div>

      }







      <div className="
      bg-white
      shadow
      rounded-lg
      p-6
      ">


      <div className="grid md:grid-cols-2 gap-5">



      {/* Objectives */}

      <div>

      <label className="font-semibold">

      Project Objectives *

      </label>

      <textarea

      name="objectives"

      value={specification.objectives}

      onChange={handleChange}

      className="
      w-full
      border
      p-3
      rounded
      mt-2
      "

      rows="4"

      placeholder="Enter project objectives"

      />

      </div>





      {/* Scope */}

      <div>

      <label className="font-semibold">

      Project Scope *

      </label>


      <textarea

      name="scope"

      value={specification.scope}

      onChange={handleChange}

      className="
      w-full
      border
      p-3
      rounded
      mt-2
      "

      rows="4"

      placeholder="Define project scope"

      />


      </div>








      {/* Functional Requirements */}


      <div>

      <label className="font-semibold">

      Functional Requirements *

      </label>


      <textarea

      name="functionalRequirements"

      value={
        specification.functionalRequirements
      }

      onChange={handleChange}


      className="
      w-full
      border
      p-3
      rounded
      mt-2
      "

      rows="4"

      placeholder="
      Example:
      User authentication,
      Task management
      "

      />

      </div>








      {/* Non Functional Requirements */}


      <div>


      <label className="font-semibold">

      Non Functional Requirements

      </label>


      <textarea

      name="nonFunctionalRequirements"

      value={
        specification.nonFunctionalRequirements
      }

      onChange={handleChange}


      className="
      w-full
      border
      p-3
      rounded
      mt-2
      "

      rows="4"

      placeholder="
      Security,
      Performance,
      Scalability
      "

      />

      </div>







      {/* Deliverables */}


      <div>


      <label className="font-semibold">

      Deliverables

      </label>


      <textarea

      name="deliverables"

      value={specification.deliverables}

      onChange={handleChange}


      className="
      w-full
      border
      p-3
      rounded
      mt-2
      "

      rows="3"


      />

      </div>







      {/* Technology Stack */}


      <div>


      <label className="font-semibold">

      Technology Stack

      </label>


      <textarea

      name="technologyStack"

      value={specification.technologyStack}

      onChange={handleChange}


      className="
      w-full
      border
      p-3
      rounded
      mt-2
      "


      rows="3"

      placeholder="
      React,
      .NET,
      PostgreSQL
      "

      />


      </div>







      {/* Assumptions */}


      <div>


      <label className="font-semibold">

      Project Assumptions

      </label>


      <textarea

      name="assumptions"

      value={specification.assumptions}

      onChange={handleChange}


      className="
      w-full
      border
      p-3
      rounded
      mt-2
      "


      rows="3"


      />


      </div>







      {/* Constraints */}


      <div>


      <label className="font-semibold">

      Project Constraints

      </label>


      <textarea

      name="constraints"

      value={specification.constraints}

      onChange={handleChange}


      className="
      w-full
      border
      p-3
      rounded
      mt-2
      "


      rows="3"


      />


      </div>




      </div>







      <div className="
      mt-6
      flex
      gap-4
      ">



      <button

      onClick={handleSave}

      className="
      bg-blue-600
      text-white
      px-6
      py-3
      rounded
      "

      >

      Save Specification

      </button>





      <button

      onClick={handleDelete}

      className="
      bg-red-600
      text-white
      px-6
      py-3
      rounded
      "

      >

      Delete Specification

      </button>



      </div>




      </div>



    </div>


  );

}



export default ProjectSpecification;