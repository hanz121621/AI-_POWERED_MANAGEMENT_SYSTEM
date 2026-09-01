
const ViewAssignedTeam = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Assigned Team
        </h2>
        <p className="text-muted-foreground">
          View the team members assigned to you.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">
          No team members available.
        </p>
      </div>
    </div>
  );
};

export default ViewAssignedTeam;