import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PencilIcon, HomeIcon } from "@heroicons/react/24/outline";
import assets from "../assets/assets";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      await updateProfile({ fullName: name, bio });
      navigate("/");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image, fullName: name, bio });
      navigate("/");
    };
  };

  return (
    <div className="min-h-screen bg-muted/20 flex items-center justify-center px-4 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-primary"
        onClick={() => navigate("/")}
      >
        <HomeIcon className="h-6 w-6" />
      </Button>

      <Card className="w-full max-w-4xl flex flex-col md:flex-row items-center border border-border shadow-2xl bg-white/80 dark:bg-card/70 backdrop-blur-xl rounded-3xl ring-1 ring-border/30">
        <CardContent className="w-full md:w-1/2 p-6 md:p-10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <PencilIcon className="h-5 w-5 text-muted-foreground" /> Edit
              Profile
            </CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Label
              htmlFor="avatar"
              className="flex items-center gap-3 cursor-pointer text-sm font-medium text-muted-foreground hover:text-primary transition"
            >
              <input
                onChange={(e) => setSelectedImage(e.target.files[0])}
                type="file"
                id="avatar"
                accept=".png,.jpg,.jpeg"
                hidden
              />
              <img
                src={
                  selectedImage
                    ? URL.createObjectURL(selectedImage)
                    : authUser?.profilePic || assets.avatar_icon
                }
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border border-border shadow hover:ring-2 hover:ring-primary transition-all duration-200 cursor-pointer"
              />
              Upload Profile Image
            </Label>

            <div>
              <Label htmlFor="name" className="text-sm text-foreground/80">
                Name
              </Label>
              <Input
                id="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                required
                placeholder="Your name"
                className="mt-1 ring-1 ring-muted bg-background focus:ring-2 focus:ring-primary transition"
              />
            </div>

            <div>
              <Label htmlFor="bio" className="text-sm text-foreground/80">
                Bio
              </Label>
              <Textarea
                id="bio"
                rows={4}
                onChange={(e) => setBio(e.target.value)}
                value={bio}
                required
                placeholder="Write profile bio"
                className="mt-1 ring-1 ring-muted bg-background focus:ring-2 focus:ring-primary transition"
              />
            </div>

            <Button
              type="submit"
              className="mt-4 w-full md:w-fit self-end bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:brightness-110 shadow-lg"
            >
              Save
            </Button>
          </form>
        </CardContent>

        <div className="w-full md:w-1/2 flex justify-center items-center p-6 md:p-10">
          <img
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : authUser?.profilePic || assets.logo_icon
            }
            alt="Preview"
            className="max-w-48 aspect-square rounded-full border-4 border-ring shadow-lg object-cover hover:ring-2 hover:ring-primary transition-all duration-200"
          />
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
