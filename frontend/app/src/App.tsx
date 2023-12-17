import React, { useEffect, useState } from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  Grid,
  IconButton,
  PaletteMode,
  Stack,
} from "@mui/material";
import { Cookies } from "react-cookie";
import { Grid as GridLoader } from "react-loader-spinner";
import { Brightness4, Brightness7 } from "@mui/icons-material";

import FileUpload from "./components/FileUpload";
import ReactCompareImage from "react-compare-image";

function App() {
  const [isFetching, setIsFetching] = useState(false);
  const cookies = new Cookies();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [themeMode, setThemeMode] = useState<PaletteMode>(
    cookies.get("theme") || "dark"
  );
  const [restoredFile, setRestoredFile] = useState<any>(null);
  useEffect(() => {
    document.title = "Face restoration";
  }, []);
  let loadingColor = themeMode === "light" ? "#E7FFFF" : "#01579b";

  const theme = createTheme({
    palette: {
      mode: themeMode,
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
            background: themeMode === "light" ? "#030342" : "#D9FBFC",
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: themeMode === "light" ? "#01579b" : "#01579b",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderColor: themeMode === "light" ? "#E7FFFF" : "#01579b",
            color: themeMode === "light" ? "#E7FFFF" : "#01579b",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme>
        {isFetching && (
          <Grid
            item
            sx={{
              position: "fixed",
              left: 25,
              top: 25,
              zIndex: 5,
              color: "#C12F1D",
            }}
          >
            <GridLoader
              height="20"
              width="20"
              color={loadingColor}
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="three-circles-rotating"
            />
          </Grid>
        )}

        <IconButton
          color="inherit"
          sx={{ position: "fixed", right: 25, top: 25, zIndex: 5 }}
          onClick={() => {
            let newTheme: PaletteMode = themeMode === "dark" ? "light" : "dark";
            setThemeMode(newTheme);
            cookies.set("theme", newTheme);
          }}
        >
          {cookies.get("theme") === "dark" ? (
            <Brightness7 style={{ color: "#01579b" }} />
          ) : (
            <Brightness4 style={{ color: "#E7FFFF" }} />
          )}
        </IconButton>
        <Stack alignItems="center">
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{ height: "90vh" }}
          >
            <Grid item justifyContent="center" xs={8} md={8}>
              <Stack spacing={2} alignItems="center" justifyContent="center">
                <FileUpload
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  setRestoredFile={setRestoredFile}
                  setIsFetching={setIsFetching}
                />
                <Stack alignItems="center" direction="row" spacing={2}></Stack>
              </Stack>
            </Grid>
          </Grid>
          {selectedFile && restoredFile && (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              style={{ maxWidth: "80vh", maxHeight: "10vh" }}
            >
              <ReactCompareImage
                leftImageCss={{ objectFit: "contain" }}
                rightImageCss={{ objectFit: "contain" }}
                leftImage={URL.createObjectURL(selectedFile)}
                rightImage={URL.createObjectURL(restoredFile.blob)}
              />
            </Grid>
          )}
        </Stack>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
