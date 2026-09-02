
import {  useState } from "react";
import {
    UserRound,
    Mail,
    Phone,
    Briefcase,
    Building2,
    BadgeCheck,
    RefreshCw,
} from "lucide-react";

function ViewStaffProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadProfile = () => {
        try {
            setLoading(true);

            const storedUser =
                localStorage.getItem("user") ||
                localStorage.getItem("aipms_user");

            if (storedUser) {
                const user = JSON.parse(storedUser);

                setProfile({
                    fullName:
                        user.fullName ||
                        user.name ||
                        user.username ||
                        "Staff Member",
                    email: user.email || "Not provided",
                    phone: user.phone || user.phoneNumber || "Not provided",
                    role: user.role || "Staff",
                    department:
                        user.department ||
                        user.departmentName ||
                        "Not assigned",
                    organization:
                        user.organization ||
                        user.organizationName ||
                        "Not assigned",
                    specialization:
                        user.specialization ||
                        user.specialty ||
                        "Not provided",
                });
            } else {
                setProfile({
                    fullName: "Staff Member",
                    email: "Not provided",
                    phone: "Not provided",
                    role: "Staff",
                    department: "Not assigned",
                    organization: "Not assigned",
                    specialization: "Not provided",
                });
            }
        } catch (error) {
            console.error("Failed to load staff profile:", error);
        } finally {
            setLoading(false);
        }
    };



    if (loading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <div className="flex items-center gap-3 text-blue-300">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Loading profile...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-600/20 p-3">
                        <UserRound className="h-6 w-6 text-blue-400" />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            My Profile
                        </h2>

                        <p className="text-sm text-slate-400">
                            View your staff profile information.
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-blue-900/60 bg-[#071a2d] p-6">
                <div className="mb-6 flex flex-col items-center gap-4 border-b border-blue-900/50 pb-6 sm:flex-row">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/20">
                        <UserRound className="h-10 w-10 text-blue-400" />
                    </div>

                    <div className="text-center sm:text-left">
                        <h3 className="text-xl font-semibold text-white">
                            {profile?.fullName}
                        </h3>

                        <div className="mt-1 flex items-center justify-center gap-2 text-sm text-blue-300 sm:justify-start">
                            <BadgeCheck className="h-4 w-4" />
                            {profile?.role}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <ProfileItem
                        icon={UserRound}
                        label="Full Name"
                        value={profile?.fullName}
                    />

                    <ProfileItem
                        icon={Mail}
                        label="Email"
                        value={profile?.email}
                    />

                    <ProfileItem
                        icon={Phone}
                        label="Phone"
                        value={profile?.phone}
                    />

                    <ProfileItem
                        icon={BadgeCheck}
                        label="Role"
                        value={profile?.role}
                    />

                    <ProfileItem
                        icon={Briefcase}
                        label="Department"
                        value={profile?.department}
                    />

                    <ProfileItem
                        icon={Building2}
                        label="Organization"
                        value={profile?.organization}
                    />

                    <ProfileItem
                        icon={Briefcase}
                        label="Specialization"
                        value={profile?.specialization}
                    />
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={loadProfile}
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-800 bg-[#0b2038] px-4 py-2 text-sm font-medium text-blue-300 transition hover:bg-blue-900/40"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </button>
                </div>
            </div>
        </div>
    );
}

function ProfileItem({ icon: Icon, label, value }) {
    return (
        <div className="rounded-xl border border-blue-900/50 bg-[#0b2038] p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                <Icon className="h-4 w-4 text-blue-400" />
                <span>{label}</span>
            </div>

            <p className="break-words text-sm font-medium text-white">
                {value || "Not provided"}
            </p>
        </div>
    );
}

export default ViewStaffProfile;
