import React from "react";


function StatCard({
  title,
  value,
  icon: Icon,
  color,
  onClick
}) {


return (

<div

onClick={onClick}

className="
bg-[#0f172a]
border
border-gray-800
rounded-xl
shadow-lg
p-6
cursor-pointer
transition-all
duration-300
hover:-translate-y-2
hover:border-blue-500
hover:shadow-2xl
"


>


<div className="
flex
items-center
justify-between
">





{/* Text */}


<div>


<p className="
text-sm
text-gray-400
font-medium
">

{title}

</p>





<h2 className="
text-3xl
font-bold
text-white
mt-2
">

{value}

</h2>



</div>









{/* Icon */}


<div

className={`
${color}
w-14
h-14
rounded-xl
flex
items-center
justify-center
transition-transform
duration-300
hover:scale-110
shadow-lg
`}

>


<Icon

size={28}

className="text-white"

/>


</div>





</div>



</div>


);


}


export default StatCard;