import React from "react";


function RiskPrediction(){



const risks = [


{
level:"High Risk",
message:"Deadline delay detected.",
color:"text-red-400",
background:"bg-red-500/10 border-red-500/20"
},



{
level:"Medium Risk",
message:"Testing resources are limited.",
color:"text-yellow-400",
background:"bg-yellow-500/10 border-yellow-500/20"
},



{
level:"Low Risk",
message:"Team workload is balanced.",
color:"text-green-400",
background:"bg-green-500/10 border-green-500/20"
}


];







return (


<div

className="
bg-[#0f172a]
border
border-gray-800
rounded-xl
shadow-lg
p-6
mt-8
transition
duration-300
hover:border-blue-500
hover:shadow-xl
"

>


<h2

className="
text-xl
font-bold
text-white
mb-5
"

>

AI Risk Prediction

</h2>







<div className="
space-y-4
">


{


risks.map((risk)=>(


<div

key={risk.level}

className={`
${risk.background}
border
p-4
rounded-lg
transition
duration-300
hover:scale-[1.02]
`}

>



<h3

className={`
font-semibold
${risk.color}
`}

>

{risk.level}

</h3>





<p

className="
text-gray-400
text-sm
mt-1
"

>

{risk.message}

</p>





</div>



))


}



</div>





</div>



);


}



export default RiskPrediction;