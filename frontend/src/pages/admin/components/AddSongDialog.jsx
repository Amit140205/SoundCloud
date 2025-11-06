import React, { useRef, useState } from "react";
import { useMusicStore } from "../../../store/useMusicStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Plus, Upload } from "lucide-react";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../lib/axios";

function AddSongDialog() {
  const { albums } = useMusicStore();
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newSong, setNewSong] = useState({
    title: "",
    artist: "",
    album: "",
    duration: "0",
  });
  const [files, setFiles] = useState({
    audioFile: null,
    imageFile: null,
  });

  const audioInputRef = useRef();
  const imageInputRef = useRef();

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (!files.audioFile || !files.imageFile)
        return toast("please upload both audio and image file");

      const formData = new FormData();
      formData.append("title", newSong.title);
      formData.append("artist", newSong.artist);
      formData.append("duration", newSong.duration);

      if (newSong.album && newSong.album !== "none") {
        formData.append("albumId", newSong.album);
      }

      formData.append("imageFile", files.imageFile);
      formData.append("audioFile", files.audioFile);

      await axiosInstance.post("/admin/songs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setNewSong({
        title: "",
        artist: "",
        album: "",
        duration: "0",
      });

      setFiles({
        audioFile: null,
        imageFile: null,
      })

      toast.success("Song added successfully")
    } catch (error) {
        toast.error(`failed to add song ${error.message}`)
    } finally {
        setIsLoading(false)
    }
  };

  return (
    <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-black">
          <Plus className="mr-2 w-4 h-4" />
          Add Song
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
          <DialogDescription>
            Add a new song to your music library
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* file */}
          <input
            type="file"
            accept="audio/*"
            ref={audioInputRef}
            className="hidden"
            onChange={(e) =>
              setFiles((prev) => ({ ...prev, audioFile: e.target.files[0] }))
            }
          />
          {/* image */}
          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            className="hidden"
            onChange={(e) =>
              setFiles((prev) => ({ ...prev, imageFile: e.target.files[0] }))
            }
          />

          {/* image upload area */}
          <div
            className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
            onClick={() => imageInputRef.current?.click()}
          >
            <div className="text-center">
              {files.imageFile ? (
                <div className="space-y-2">
                  <div className="text-sm text-emerald-500">
                    Image Selected:
                  </div>
                  <div className="text-xs text-zinc-400">
                    {files.imageFile?.name.slice(0, 20)}
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                    <Upload className="h-6 w-6 text-zinc-400" />
                  </div>
                  <div className="text-sm text-zinc-400 mb-2">
                    Upload artwork
                  </div>
                  <Button className="text-xs" variant="outline" size="sm">
                    Choose File
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* upload area */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Audio File</label>
            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="outline"
                onClick={() => audioInputRef.current?.click()}
                className="w-full"
              >
                {files.audioFile
                  ? files.audioFile.name.slice(0, 20)
                  : "Choose Audio File"}
              </Button>
            </div>
          </div>

          {/* form */}
          {/* title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={newSong.title}
              className="bg-zinc-800 border-zinc- mt-2"
              onChange={(e) =>
                setNewSong({ ...newSong, title: e.target.value })
              }
            />
          </div>
          {/* artist */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Artist</label>
            <Input
              value={newSong.artist}
              className="bg-zinc-800 border-zinc-700 mt-2"
              onChange={(e) =>
                setNewSong({ ...newSong, artist: e.target.value })
              }
            />
          </div>
          {/* duration */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Duration (seconds)</label>
            <Input
              type="number"
              min="0"
              value={newSong.duration}
              className="bg-zinc-800 border-zinc-700 mt-2"
              onChange={(e) =>
                setNewSong({
                  ...newSong,
                  duration: e.target.value || "0",
                })
              }
            />
          </div>

          {/* album list */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Album (Optional)</label>
            <Select
              value={newSong.album}
              onValueChange={(value) =>
                setNewSong({ ...newSong, album: value })
              }
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700 mt-2">
                <SelectValue placeholder="Select album" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="none">No Album (single)</SelectItem>
                {albums?.map((album) => (
                  <SelectItem key={album._id} value={album._id}>
                    {album.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setSongDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-emerald-500 hover:bg-emerald-600 text-black" 
          disabled={isLoading || !newSong.title || !newSong.artist || !newSong.duration || 
          !files.audioFile || !files.imageFile || !newSong.album}>
            {isLoading ? "Loading..." : "Add Song"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddSongDialog;
