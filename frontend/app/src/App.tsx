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
    if (selectedFile) {
      const url = window.URL.createObjectURL(restoredFile.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "restored_face.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

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
