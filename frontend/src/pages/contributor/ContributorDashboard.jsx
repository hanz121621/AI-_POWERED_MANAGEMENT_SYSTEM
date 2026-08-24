

function ContributorDashboard(){


return (

<div className="
min-h-screen
bg-[#020617]
text-white
p-8
">


<h1 className="
text-3xl
font-bold
mb-6
">

Contributor Dashboard

</h1>



<div className="
grid
md:grid-cols-3
gap-6
">


<div className="
bg-[#0f172a]
p-6
rounded-xl
border
border-gray-800
">

<h2 className="font-semibold text-xl">
My Tasks
</h2>

<p className="text-gray-400 mt-2">
View assigned tasks
</p>

</div>




<div className="
bg-[#0f172a]
p-6
rounded-xl
border
border-gray-800
">

<h2 className="font-semibold text-xl">
My Projects
</h2>

<p className="text-gray-400 mt-2">
Track project progress
</p>

</div>




<div className="
bg-[#0f172a]
p-6
rounded-xl
border
border-gray-800
">

<h2 className="font-semibold text-xl">
Notifications
</h2>

<p className="text-gray-400 mt-2">
Check updates
</p>

</div>


</div>


</div>

);

}


export default ContributorDashboard;