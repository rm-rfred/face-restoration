import React, { useEffect, useState } from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import DownloadIcon from "@mui/icons-material/Download";
import { Box, Button, CssBaseline, Grid, Stack } from "@mui/material";

import FileUpload from "./components/FileUpload";
import ReactCompareImage from "react-compare-image";
import { Settings } from "./components/Settings";

function App() {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [restoredFile, setRestoredFile] = useState<any>(null);
  const [backgroundEnhance, setBackgroundEnhance] = useState<boolean>(false);
  const [faceUpsample, setFaceUpsample] = useState<boolean>(true);
  const [upscale, setUpscale] = useState<number>(2);
  const [codeformerFidelity, setCodeformerFidelity] = useState<number>(0.7);

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
    if (restoredFile) {
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
        <Grid container rowSpacing={1}>
          <Grid xs={6}>
            <Stack alignItems="center" spacing={2}>
              <Grid container justifyContent="center" alignItems="center">
                <Grid item justifyContent="center" xs={8} md={8}>
                  <Stack alignItems="center">
                    <FileUpload
                      selectedFile={selectedFile}
                      setSelectedFile={setSelectedFile}
                      setRestoredFile={setRestoredFile}
                      isFetching={isFetching}
                      setIsFetching={setIsFetching}
                      backgroundEnhance={backgroundEnhance}
                      faceUpsample={faceUpsample}
                      upscale={upscale}
                      codeformerFidelity={codeformerFidelity}
                    />
                  </Stack>
                </Grid>
              </Grid>
              {selectedFile && restoredFile && (
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  style={{ maxWidth: "30vh" }}
                >
                  <Grid
                    item
                    sx={{ width: "70vh" }}
                    alignContent="center"
                    justifyContent="center"
                  >
                    <Stack>
                      <ReactCompareImage
                        leftImageCss={{ objectFit: "contain" }}
                        rightImageCss={{ objectFit: "contain" }}
                        leftImage={URL.createObjectURL(selectedFile)}
                        rightImage={URL.createObjectURL(restoredFile.blob)}
                      />
                      {restoredFile && (
                        <Button
                          variant="outlined"
                          type="submit"
                          onClick={onSubmit}
                        >
                          <DownloadIcon sx={{ color: "#E7FFFF" }} />
                        </Button>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              )}
            </Stack>
          </Grid>
          <Grid
            container
            xs={6}
            alignContent="flex"
            top="25%"
            left="60%"
            position="fixed"
          >
            <Grid xs>
              <Settings
                backgroundEnhance={backgroundEnhance}
                setBackgroundEnhance={setBackgroundEnhance}
              />
            </Grid>
          </Grid>
        </Grid>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
