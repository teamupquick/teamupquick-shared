import { Box, Button, Stack, Typography } from "@mui/material";
import type { FileWithPath } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { theme } from "@shared/utils/theme";
import UploadFileIcon from "@mui/icons-material/UploadFile";

type UploadType = "resume" | "certificate";

interface Props {
  id: UploadType;
  title: string;
  text: string;
  file: FileWithPath | null;
  onFileChange: (file: FileWithPath | null) => void;
}

export default function Dropzone(props: Props) {
  const { id, title, text, file, onFileChange } = props;
  const [previewLink, setPreviewLink] = useState("");

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const objectUrl = URL.createObjectURL(acceptedFiles[0]);
      setPreviewLink(objectUrl);
      onFileChange(acceptedFiles[0]);
    },
    [onFileChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [],
    },
  });

  return (
    <Stack width="244px">
      <Typography variant="h6" fontSize="18px" fontWeight={700} mb="14px">
        {title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          background: "#F9F9FC",
          alignItems: "center",
          justifyContent: "center",
          p: "20px 4px",
          height: "150px",
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />

        {file !== null ? (
          <Typography variant="caption">{file.path}</Typography>
        ) : (
          <>
            <UploadFileIcon />
            <Typography variant="caption" my="8px">
              {isDragActive ? "拖放檔案到此處" : text}
            </Typography>
            <Button
              sx={{
                padding: "4px 8px",
                fontSize: "12px",
                color: "white",
                background: "#3B3839",
              }}
            >
              上傳檔案
            </Button>
          </>
        )}
      </Box>

      <Typography variant="caption" color={theme.text.secondary}>
        *上傳檔案以PDF檔格式為主
      </Typography>

      {previewLink && file && (
        <a href={previewLink} download={file.name}>
          預覽 {file.name}
        </a>
      )}
    </Stack>
  );
}
