import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Shield,
  Camera,
  Edit3,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Modal from "@/components/Modal";
import StatusBadge from "@/components/shared/StatusBadge";
import { useEffect } from "react";
import { authService, projectService } from "@/services";

interface ProfileFormData {
  name: string;
  email: string;
  department: string;
  phone: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage2() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);
  useEffect(() => {
    async function loadDepartments() {
      try {
        const filters = await projectService.getFilterOptions();

        setDepartments(filters.departments);
      } catch (err) {
        console.error(err);
      }
    }

    loadDepartments();
  }, []);
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      department: "",
      phone: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch: watchPassword,
  } = useForm<PasswordFormData>();

  const newPassword = watchPassword("newPassword");

  const handleProfileSave = async (
    data: ProfileFormData
  ) => {
    try {
      setIsSaving(true);

        await authService.updateProfile(data);

        await refreshUser();

      toast.success(
        "Profile updated successfully!"
      );

      setIsEditing(false);

    } catch (err) {

      toast.error(
        "Failed to update profile."
      );

    } finally {

      setIsSaving(false);

    }
  };

  const handlePasswordChange = async (
    data: PasswordFormData
  ) => {
    try {
      setChangingPassword(true);

      await authService.changePassword({
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });

      toast.success(
        "Password changed successfully!"
      );

      setPasswordModalOpen(false);

      resetPassword();

    } catch (err) {

      toast.error(
        "Unable to change password."
      );

    } finally {

      setChangingPassword(false);

    }
  };

  const handleCancelEdit = () => {
    resetProfile();
    setIsEditing(false);
  };

  const departmentOptions = departments.map((d) => ({
  value: d,
  label: d,
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Profile Settings</h1>
        <p className="text-surface-500 mt-1">Manage your account information and preferences</p>
      </div>

      {/* Profile Header Card */}
      <Card className="overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 -m-6 mb-0" />
        
        <div className="relative px-6 pb-6 -mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "U"}
                </div>
              </div>
              <button className="absolute bottom-1 right-1 p-2 rounded-full bg-white border border-surface-200 shadow-sm text-surface-500 hover:text-primary-600 cursor-pointer transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 pt-4 sm:pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-surface-900">{user?.name}</h2>
                  <p className="text-sm text-surface-500">{user?.email}</p>
                </div>
                <StatusBadge status={user?.role || "student"} size="md" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-surface-400" />
                <h3 className="text-base font-semibold text-surface-900">Personal Information</h3>
              </div>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Edit3 className="h-4 w-4" />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <form onSubmit={handleProfileSubmit(handleProfileSave)}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Full Name"
                    disabled={!isEditing}
                    error={profileErrors.name?.message}
                    {...registerProfile("name", {
                      required: "Name is required",
                    })}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    disabled={!isEditing}
                    error={profileErrors.email?.message}
                    {...registerProfile("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Select
                    label="Department"
                    options={departmentOptions}
                    disabled={!isEditing}
                    {...registerProfile("department")}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+91 98765 43210"
                    disabled={!isEditing}
                    {...registerProfile("phone")}
                  />
                </div>

                {isEditing && (
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100">
                    <Button variant="outline" type="button" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button type="submit" isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Info */}
          <Card>
            <h3 className="text-base font-semibold text-surface-900 mb-4">Account Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-surface-50">
                  <Shield className="h-4 w-4 text-surface-500" />
                </div>
                <div>
                  <p className="text-xs text-surface-400">Role</p>
                  <p className="text-sm font-medium text-surface-900 capitalize">{user?.role}</p>
                </div>
              </div>

            
            </div>
          </Card>

          {/* Security */}
          <Card>
            <h3 className="text-base font-semibold text-surface-900 mb-4">Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="h-4 w-4 text-surface-500" />
                  <div>
                    <p className="text-sm font-medium text-surface-900">Password</p>
                    <p className="text-xs text-surface-400">Last changed 30 days ago</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPasswordModalOpen(true)}
                >
                  Change
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Email Verified</p>
                    <p className="text-xs text-green-600">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <h3 className="text-base font-semibold text-red-600 mb-4">Danger Zone</h3>
            <p className="text-sm text-surface-500 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="danger" className="w-full">
              Delete Account
            </Button>
          </Card>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={passwordModalOpen}
        onClose={() => {
          setPasswordModalOpen(false);
          resetPassword();
        }}
        title="Change Password"
        size="sm"
      >
        <form onSubmit={handlePasswordSubmit(handlePasswordChange)} className="space-y-4">
          <Input
            label="Current Password"
            type={showCurrentPassword ? "text" : "password"}
            error={passwordErrors.currentPassword?.message}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="cursor-pointer hover:text-surface-600 transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            {...registerPassword("currentPassword", {
              required: "Current password is required",
            })}
          />

          <Input
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            error={passwordErrors.newPassword?.message}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="cursor-pointer hover:text-surface-600 transition-colors"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            {...registerPassword("newPassword", {
              required: "New password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />

          <Input
            label="Confirm New Password"
            type="password"
            error={passwordErrors.confirmPassword?.message}
            {...registerPassword("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
          />

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPasswordModalOpen(false);
                resetPassword();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={changingPassword}>
              Change Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
