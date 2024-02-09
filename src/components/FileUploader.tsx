import { convertFileToUrl } from "@/lib/utils";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import MediaImage from "../assets/Images/fileuploader-media.svg";
import { Typography } from "./typography";
import { Input } from "./ui/input";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  url: string;
};

const FileUploader = ({ fieldChange, url }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(url);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFile(acceptedFiles);
      setFileUrl(convertFileToUrl(acceptedFiles[0]));
      fieldChange(acceptedFiles);
      console.log({ acceptedFiles });
    },
    [file],
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });
  return (
    <div
      {...getRootProps()}
      className="flex flex-col items-center justify-center  cursor-pointer border-2 border-dotted border-input rounded-md px-4 py-6 "
    >
      <Input {...getInputProps()} />

      {fileUrl ? (
        <>
          <div className="w-full p-5 flex items-center justify-center">
            <Image
              src={fileUrl}
              alt="image"
              width={150}
              height={150}
              className="w-full object-cover"
            />
          </div>
          <Typography variant={"small"}>
            Click or drag another photo to replace.
          </Typography>
        </>
      ) : (
        <>
          <div>
            <Image src={MediaImage} alt="media-image" />
          </div>
          <Typography variant={"paragraph"} className="text-center">
            Drag and drop some files here,
            {/* or click to select files */}
          </Typography>
          <Typography variant={"muted"} className="text-center text-xs">
            Click to upload (SVG, PNG, JPG or GIF (max. 800x400px))
          </Typography>
        </>
      )}
    </div>
  );
};

export default FileUploader;
