'use client'

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/app/actions/updateProfile";
import { toast } from "sonner";
import { Loader2, Camera, User, Mail, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsForm({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(profile.avatar_url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    setLoading(false);
    if (result.success) {
      toast.success("Profile updated successfully");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-8">
      
      {/* 1. Avatar Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-gray-100 dark:border-gray-800 shadow-xl">
                <AvatarImage src={preview || ""} className="object-cover" />
                <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                    {profile.full_name?.charAt(0)}
                </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
            </div>
            <input 
                ref={fileInputRef} 
                type="file" 
                name="avatar" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
            />
        </div>
        <div className="text-center sm:text-left">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Profile Photo</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Click the image to upload a new one. <br/> Accepts JPG, PNG or GIF.
            </p>
            <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                className="h-9"
            >
                Change Photo
            </Button>
        </div>
      </div>

      <div className="h-px bg-gray-100 dark:bg-gray-800" />

      {/* 2. Personal Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" /> Full Name
            </Label>
            <Input 
                name="full_name" 
                defaultValue={profile.full_name} 
                className="h-11 bg-gray-50 dark:bg-black/20"
                required
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" /> Email Address
            </Label>
            <Input 
                defaultValue={profile.email} 
                disabled 
                className="h-11 bg-gray-50 dark:bg-black/20 opacity-70 cursor-not-allowed" 
            />
            <p className="text-[10px] text-gray-400">Email cannot be changed manually.</p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Shield className="w-4 h-4" /> Account Role
            </Label>
            <Input 
                defaultValue={profile.role} 
                disabled 
                className="h-11 bg-gray-50 dark:bg-black/20 opacity-70 capitalize cursor-not-allowed" 
            />
          </div>
      </div>

      <div className="h-px bg-gray-100 dark:bg-gray-800" />

      {/* 3. Footer Actions */}
      <div className="flex justify-end pt-2">
        <Button 
            type="submit" 
            disabled={loading}
            className="h-11 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 transition-opacity text-white"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Changes
        </Button>
      </div>

    </form>
  );
}