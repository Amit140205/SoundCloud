import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../lib/axios";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Plus, Upload } from "lucide-react";
import { Input } from "../../../components/ui/input";

function AddAlbumDialog() {
  const [ albumDialogOpen, setAlbumDialogOpen ] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imageInputRef = useRef(null);
  const [newAlbum, setNewAlbum] = useState({
    title: "",
    artist: "",
    releaseYear: new Date().getFullYear(),
  });
  const [imageFile, setImageFile] = useState(null);

  const handleImageSubmit = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (!imageFile) return toast.error("Please upload an image");

      const formData = new FormData();

      formData.append("title", newAlbum.title);
      formData.append("artist", newAlbum.artist);
      formData.append("releaseYear", newAlbum.releaseYear.toString());
      formData.append("imageFile", imageFile);

      await axiosInstance.post("/admin/albums", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setNewAlbum({
        title: "",
        artist: "",
        releaseYear: new Date().getFullYear(),
      });

      setImageFile(null)
      toast.success("Album created successfully")
    } catch (error) {
        toast.error(`Failed to create album ${error.message}`)
    } finally {
        setIsLoading(false)
    }
  };

  return (
    <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
        <DialogTrigger asChild>
            <Button className="bg-violet-500 hover:bg-violet-600 text-white">
                <Plus className="mr-2 w-4 h-4"/>
                Add Album
            </Button>
        </DialogTrigger>
        <DialogContent className="bg-zinc-900 border-zinc-700">
            <DialogHeader>
                <DialogTitle>Add New Album</DialogTitle>
                <DialogDescription>Add a new album to your collection</DialogDescription>
            </DialogHeader>
            {/* image upload */}
            <div className="space-y-4 py-4">
                <input type="file" 
                    ref={imageInputRef}
                    onChange={handleImageSubmit}
                    accept="image/*"
                    className="hidden"
                />
                <div className="flex justify-center items-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
                    onClick={()=>imageInputRef.current?.click()}
                >
                    <div className="text-center">
                        <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                            <Upload className="h-6 w-6 text-zinc-400"/>
                        </div>
                        <div className="text-sm mb-2 text-zinc-400">
                            {imageFile?imageFile.name:"Upload album artwork"}
                        </div>
                        <Button variant="outline" size="sm" className="text-xs">
                            Choose File
                        </Button>
                    </div>
                </div>

                {/* title */}
                <div className="space-y-2">
                    <label className="font-medium text-sm">Album Title</label>
                    <Input
                    type="text" 
                    value={newAlbum.title}
                    onChange={(e)=>setNewAlbum({...newAlbum,title:e.target.value})}
                    placeholder="Enter album title"
                    className="bg-zinc-800 border-zinc-700 mt-2"
                    />
                </div>
                {/* artist */}
                <div className="space-y-2">
                    <label className="font-medium text-sm">Artist</label>
                    <Input
                    type="text" 
                    value={newAlbum.artist}
                    onChange={(e)=>setNewAlbum({...newAlbum,artist:e.target.value})}
                    placeholder="Enter artist name"
                    className="bg-zinc-800 border-zinc-700 mt-2"
                    />
                </div>
                {/* release year */}
                <div className="space-y-2">
                    <label className="font-medium text-sm">Release Year</label>
                    <Input
                    type="number" 
                    value={newAlbum.releaseYear}
                    onChange={(e)=>setNewAlbum({...newAlbum,releaseYear:parseInt(e.target.value)})}
                    placeholder="Enter release year"
                    className="bg-zinc-800 border-zinc-700 mt-2"
                    min={1900}
                    max={new Date().getFullYear()}
                    />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={()=>setAlbumDialogOpen(false)} disabled={isLoading}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} 
                disabled={isLoading || !newAlbum.title || !newAlbum.artist || !newAlbum.releaseYear || !imageFile}>
                    {isLoading ? "Loading..." : "Add Album"}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default AddAlbumDialog;
