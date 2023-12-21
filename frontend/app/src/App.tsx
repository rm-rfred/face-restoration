import React, { useEffect, useState } from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import DownloadIcon from "@mui/icons-material/Download";
import { CssBaseline, Grid, Stack } from "@mui/material";

import FileUpload from "./components/FileUpload";
import ReactCompareImage from "react-compare-image";
import { apiFetchBlob } from "./utils/Fetch";
import { useSnackbar } from "notistack";

function App() {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [restoredFile, setRestoredFile] = useState<any>(null);
  useEffect(() => {
    document.title = "Face restoration";
  }, []);
  const { enqueueSnackbar } = useSnackbar();

  const theme = createTheme({
    palette: {
      primary: {
        main: "#01579b",
        light: "#01579b",
        dark: "#ffbe4c",
        contrastText: "#000000",
      },
      secondary: {
        main: "#5a68e5",
        light: "#9196ff",
        dark: "#0d3eb2",
        contrastText: "#000000",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: "#5799CD",
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: "#01579b",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderColor: "#E7FFFF",
            color: "#E7FFFF",
          },
        },
      },
    },
  });

  const onSubmit = () => {
    setIsFetching(true);

    if (selectedFile) {
      const formDataToSend = new FormData();
      formDataToSend.append("file", selectedFile);

      apiFetchBlob("/api/face_restoration/restore", "POST", {}, formDataToSend)
        .then((response) => {
          // Create a Blob from the response
          const blob = new Blob([response], {
            type: "application/octet-stream",
          });

          // Create a Blob URL
          const url = window.URL.createObjectURL(blob);

          // Create an anchor element to trigger the download
          const a = document.createElement("a");
          a.href = url;
          a.download = "restored_face.jpg"; // Specify the desired filename
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
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

  console.log({ restoredFile });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme>
        <Stack alignItems="center">
          <Grid container justifyContent="center" alignItems="center">
            <Grid item justifyContent="center" xs={8} md={8}>
              <Stack spacing={4} alignItems="center" justifyContent="center">
                <FileUpload
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  setRestoredFile={setRestoredFile}
                  isFetching={isFetching}
                  setIsFetching={setIsFetching}
                />
                {selectedFile && restoredFile && (
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    style={{ maxWidth: "30%", maxHeight: "300px" }}
                  >
                    <ReactCompareImage
                      leftImageCss={{ objectFit: "contain" }}
                      rightImageCss={{ objectFit: "contain" }}
                      leftImage={URL.createObjectURL(selectedFile)}
                      rightImage={URL.createObjectURL(restoredFile.blob)}
                    />
                  </Grid>
                )}
                {restoredFile && <DownloadIcon onClick={onSubmit} />}
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
