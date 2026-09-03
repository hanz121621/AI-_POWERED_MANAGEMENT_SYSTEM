import {  useState } from "react";
import {
    UserRound,
    Mail,
    Phone,
    Briefcase,
    Save,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

function UpdateStaffProfile() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        specialization: "",
    });

    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");



    const loadUserData = () => {
        try {
            const storedUser =
                localStorage.getItem("user") ||
                localStorage.getItem("aipms_user");

            if (!storedUser) {
                return;
            }

            const user = JSON.parse(storedUser);

            setFormData({
                fullName:
                    user.fullName ||
                    user.name ||
                    user.username ||
                    "",

                email: user.email || "",

                phone:
                    user.phone ||
                    user.phoneNumber ||
                    "",

                specialization:
                    user.specialization ||
                    user.specialty ||
                    "",
            });
        } catch (err) {
            console.error("Failed to load profile:", err);
            setError("Unable to load your profile information.");
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setSuccess("");
        setError("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setSaving(true);
        setSuccess("");
        setError("");

        try {
            const storedUser =
                localStorage.getItem("user") ||
                localStorage.getItem("aipms_user");

            if (!storedUser) {
                throw new Error("User information was not found.");
            }

            const user = JSON.parse(storedUser);

            const updatedUser = {
                ...user,

                fullName: formData.fullName,
                name: formData.fullName,

                email: formData.email,

                phone: formData.phone,

                specialization: formData.specialization,
            };

            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            if (localStorage.getItem("aipms_user")) {
                localStorage.setItem(
                    "aipms_user",
                    JSON.stringify(updatedUser)
                );
            }

            setSuccess("Profile updated successfully.");
        } catch (err) {
            console.error("Failed to update profile:", err);
            setError(
                err.message ||
                    "Unable to update your profile."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-600/20 p-3">
                        <UserRound className="h-6 w-6 text-blue-400" />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            Update Profile
                        </h2>

                        <p className="text-sm text-slate-400">
                            Update your permitted personal and
                            profile information.
                        </p>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {success && (
                <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-800/60 bg-green-950/30 px-4 py-3 text-sm text-green-300">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>{success}</span>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-800/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-blue-900/60 bg-[#071a2d] p-6"
            >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* Full Name */}
                    <FormInput
                        icon={UserRound}
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />

                    {/* Email */}
                    <FormInput
                        icon={Mail}
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    {/* Phone */}
                    <FormInput
                        icon={Phone}
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    {/* Specialization */}
                    <FormInput
                        icon={Briefcase}
                        label="Specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                    />
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={loadUserData}
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-800 bg-[#0b2038] px-5 py-2.5 text-sm font-medium text-blue-300 transition hover:bg-blue-900/40 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Reload
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? (
                            <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

function FormInput({
    icon: Icon,
    label,
    name,
    type = "text",
    value,
    onChange,
    required = false,
}) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-medium text-slate-300"
            >
                {label}
            </label>

            <div className="relative">
                <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />

                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="w-full rounded-lg border border-blue-900/60 bg-[#0b2038] py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
            </div>
        </div>
    );
}

export default UpdateStaffProfile;
