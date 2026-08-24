import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";



function CreateProjectSpecification() {


  const [formData, setFormData] = useState({

    objectives: "",
    scope: "",
    functionalRequirements: "",
    nonFunctionalRequirements: "",
    deliverables: "",
    technologyStack: "",
    assumptions: "",
    constraints: "",

  });



  const handleChange = (e)=>{

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };



  const handleSubmit = (e)=>{

    e.preventDefault();


    console.log(formData);


    alert(
      "Project specification created successfully."
    );


  };



  return (

    <div>


      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Create Project Specification
        </h1>


        <p className="text-slate-600 mt-2">
          Define project objectives, requirements and constraints.
        </p>

      </div>




      <Card>


        <CardHeader>

          <CardTitle>
            Project Specification Form
          </CardTitle>

        </CardHeader>



        <CardContent>


          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >


            <div>

              <label>
                Project Objectives
              </label>

              <Textarea
                name="objectives"
                value={formData.objectives}
                onChange={handleChange}
                placeholder="Enter project objectives"
              />

            </div>




            <div>

              <label>
                Project Scope
              </label>

              <Textarea
                name="scope"
                value={formData.scope}
                onChange={handleChange}
                placeholder="Enter project scope"
              />

            </div>




            <div>

              <label>
                Functional Requirements
              </label>

              <Textarea
                name="functionalRequirements"
                value={formData.functionalRequirements}
                onChange={handleChange}
                placeholder="Enter functional requirements"
              />

            </div>





            <div>

              <label>
                Non Functional Requirements
              </label>

              <Textarea
                name="nonFunctionalRequirements"
                value={formData.nonFunctionalRequirements}
                onChange={handleChange}
                placeholder="Enter non functional requirements"
              />

            </div>





            <div>

              <label>
                Deliverables
              </label>

              <Textarea
                name="deliverables"
                value={formData.deliverables}
                onChange={handleChange}
                placeholder="Enter deliverables"
              />

            </div>





            <div>

              <label>
                Technology Stack
              </label>


              <Input

                name="technologyStack"

                value={formData.technologyStack}

                onChange={handleChange}

                placeholder="Example: React, .NET, PostgreSQL"

              />


            </div>





            <div>

              <label>
                Project Assumptions
              </label>


              <Textarea

                name="assumptions"

                value={formData.assumptions}

                onChange={handleChange}

                placeholder="Enter assumptions"

              />


            </div>





            <div>

              <label>
                Project Constraints
              </label>


              <Textarea

                name="constraints"

                value={formData.constraints}

                onChange={handleChange}

                placeholder="Enter constraints"

              />


            </div>





            <Button type="submit">

              Save Specification

            </Button>



          </form>


        </CardContent>


      </Card>


    </div>

  );

}


export default CreateProjectSpecification;