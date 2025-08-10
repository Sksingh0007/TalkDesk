import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { HomeIcon, CameraIcon } from "@heroicons/react/24/outline";
import assets from "../assets/assets";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState(authUser.fullName || "");
  const [username, setUsername] = useState(authUser.username || "");
  const [bio, setBio] = useState(authUser.bio || "");
  const [backgroundImage, setBackgroundImage] = useState(
    authUser.backgroundImage || ""
  );
  const [selectedBg, setSelectedBg] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let profilePicData = authUser.profilePic || null;
    let bgImageData = backgroundImage || null;

    // Convert new profile pic if selected
    if (selectedImage) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      await new Promise((resolve) => {
        reader.onload = () => {
          profilePicData = reader.result;
          resolve();
        };
      });
    }

    // Convert new background image if selected
    if (selectedBg) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedBg);
      await new Promise((resolve) => {
        reader.onload = () => {
          bgImageData = reader.result;
          resolve();
        };
      });
    }

    await updateProfile({
      fullName: name,
      username,
      bio,
      profilePic: profilePicData,
      backgroundImage: bgImageData,
    });

    navigate("/");
  };
  console.log("auth user", authUser);
  return (
    <div className="h-full w-full bg-card flex   items-center justify-center border   py-6 relative">
      {/* Home Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-primary transition"
        onClick={() => navigate("/")}
      >
        <HomeIcon className="h-6 w-6" />
      </Button>

      {/* Left: Profile Form */}
      <div className="w-full h-full max-w-lg rounded-l-sm  bg-white/80 dark:bg-card/80  shadow-md p-5 flex flex-col gap-2 border ">
        <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
          Edit Profile
        </h2>
        <p className="text-base text-muted-foreground mb-2">
          Update your personal details, profile picture, and background image.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          {/* Avatar Upload */}
          <Label
            htmlFor="avatar"
            className="flex items-center gap-4 cursor-pointer group hover:scale-105 transition-transform"
          >
            <input
              onChange={(e) => setSelectedImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
            />
            <div className="relative">
              <img
                src={
                  selectedImage
                    ? URL.createObjectURL(selectedImage)
                    : authUser?.profilePic || assets.avatar_icon
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/30 shadow-lg group-hover:brightness-90 transition"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition">
                <CameraIcon className="w-7 h-7 text-white" />
              </div>
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-primary">
              Change Profile Picture
            </span>
          </Label>

          {/* Username */}
          <div className="space-y-1">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <Input
              id="username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              type="text"
              required
              placeholder="Unique username"
              className="mt-1 focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Name */}
          <div className="space-y-1">
            <Label htmlFor="name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              required
              placeholder="Your name"
              className="mt-1 focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <Label htmlFor="bio" className="text-sm font-medium">
              Bio
            </Label>
            <Textarea
              id="bio"
              rows={4}
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              required
              placeholder="Write something about yourself..."
              className="mt-1 focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Background Image Upload */}
          <Label
            htmlFor="backgroundImage"
            className="flex items-center gap-4 cursor-pointer group hover:scale-105 transition-transform"
          >
            <input
              onChange={(e) => setSelectedBg(e.target.files[0])}
              type="file"
              id="backgroundImage"
              accept=".png,.jpg,.jpeg"
              hidden
            />
            <div className="relative w-32 h-16 rounded-xl overflow-hidden border-2 border-primary/30 bg-muted shadow group-hover:brightness-95 transition">
              {selectedBg || backgroundImage ? (
                <img
                  src={
                    selectedBg
                      ? URL.createObjectURL(selectedBg)
                      : backgroundImage
                  }
                  alt="Background Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-muted-foreground flex items-center justify-center h-full w-full">
                  Upload Background
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
                <CameraIcon className="w-7 h-7 text-white" />
              </div>
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-primary">
              Change Background Image
            </span>
          </Label>

          {/* Save Button */}
          <Button
            type="submit"
            className="w-full md:w-fit self-end mt-4 bg-gradient-to-r from-primary to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:brightness-110 hover:scale-105 transition"
          >
            Save Changes
          </Button>
        </form>
      </div>

      <div className="w-full h-full  flex flex-col justify-start items-center p-5  bg-white/70 dark:bg-background/80 rounded-r-sm shadow-md border ">
        <div className="flex flex-col items-center gap-6 text-center w-full">
          {/* Background Preview */}
          <div className="w-full h-36 rounded-2xl overflow-hidden mb-6 relative shadow-lg">
            {(selectedBg || backgroundImage) && (
              <img
                src={
                  selectedBg ? URL.createObjectURL(selectedBg) : backgroundImage
                }
                alt="Background Preview"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          </div>
          <img
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : authUser?.profilePic || assets.logo_icon
            }
            alt="Preview"
            className="w-40 h-40 rounded-full border-4 border-primary/40 shadow-xl object-cover -mt-16 bg-white"
          />
          <h3 className="text-2xl font-bold text-primary mt-2">{name}</h3>
          <span className="text-base text-muted-foreground font-mono">
            @{username}
          </span>
          <p className="text-base text-muted-foreground max-w-md mt-2">{bio}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
