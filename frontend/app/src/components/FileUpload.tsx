import React from "react";

import { Button, CircularProgress, Grid, Stack } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { DropzoneArea } from "react-mui-dropzone";
import { FormProvider, useForm } from "react-hook-form";

import { apiFetchBlob } from "../utils/Fetch";

const useStyles = makeStyles(() => ({
  dropZoneClass: {
    color: "#01579b",
    backgroundColor: "#E7FFFF",
  },
  previewContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E7FFFF",
  },
  preview: {
    right: "25%",
    backgroundColor: "#E7FFFF",
    maxWidth: "100vh",
    maxHeight: "60vh",
  },
  previewImg: {
    backgroundColor: "#E7FFFF",
    width: "200px",
    height: "156px",
  },
}));

type FormData = {
  file: FileList | null;
  backgroundEnhance: boolean;
};

interface Props {
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  setRestoredFile: React.Dispatch<React.SetStateAction<any>>;
  isFetching: boolean;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
  backgroundEnhance: boolean;
  faceUpsample: boolean;
  upscale: number;
  codeformerFidelity: number;
}

export const FileUpload: React.FC<Props> = ({
  selectedFile,
  setSelectedFile,
  setRestoredFile,
  isFetching,
  setIsFetching,
  backgroundEnhance,
  faceUpsample,
  upscale,
  codeformerFidelity,
}) => {
  const classes = useStyles();
  const methods = useForm<FormData>();

  const {
    handleSubmit,
    formState: { isDirty },
  } = methods;
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = () => {
    setIsFetching(true);

    if (selectedFile) {
      const formDataToSend = new FormData();
      formDataToSend.append("file", selectedFile);
      formDataToSend.append("background_enhance", backgroundEnhance.toString());
      formDataToSend.append("face_upsample", faceUpsample.toString());
      formDataToSend.append("upscale", upscale.toString());
      formDataToSend.append(
        "codeformer_fidelity",
        codeformerFidelity.toString()
      );

      apiFetchBlob("/api/face_restoration/restore", "POST", {}, formDataToSend)
        .then((response) => {
          setRestoredFile({ blob: response });
        })
        .catch((error) => {
          enqueueSnackbar("An error occurred", {
            variant: "error",
            autoHideDuration: 3000,
          });
          console.error("Error:", error);
        })
        .finally(() => setIsFetching(false));
    } else {
      enqueueSnackbar("Please select an image", {
        variant: "error",
        autoHideDuration: 3000,
      });
      console.error("No file selected.");
      setIsFetching(false);
    }
  };

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={1} justifyContent="center" alignItems="center">
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              style={{
                maxWidth: "80vh",
                maxHeight: "80vh",
              }}
            >
              <DropzoneArea
                acceptedFiles={["image/*"]}
                dropzoneText={"Drop image"}
                filesLimit={1}
                showAlerts={isDirty}
                dropzoneClass={classes.dropZoneClass}
                previewGridClasses={{
                  container: classes.previewContainer,
                  item: classes.preview,
                  image: classes.previewImg,
                }}
                onDelete={() => setRestoredFile(null)}
                onDrop={() => setRestoredFile(null)}
                getPreviewIcon={(file) => {
                  return React.createElement("img", {
                    className: classes.previewImg,
                    role: "presentation",
                    src: file.data,
                  });
                }}
                onChange={handleFileChange}
              />
            </Grid>
            {isFetching ? (
              <CircularProgress />
            ) : (
              <Button type="submit" variant="outlined">
                COMPUTE FACE RESTORATION
              </Button>
            )}
          </Stack>
        </form>
      </FormProvider>
    </>
  );
};

export default FileUpload;
