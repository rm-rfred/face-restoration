import React from "react";

import {
  Paper,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Slider,
  TextField,
  CardHeader,
  Avatar,
  IconButton,
  Tooltip,
  Grid,
} from "@mui/material";

import HelpIcon from "@mui/icons-material/Help";

interface Props {
  backgroundEnhance: boolean;
  setBackgroundEnhance: React.Dispatch<React.SetStateAction<boolean>>;
  faceUpsample: boolean;
  setFaceUpsample: React.Dispatch<React.SetStateAction<boolean>>;
  upscale: number;
  setUpscale: React.Dispatch<React.SetStateAction<number>>;
  codeformerFidelity: number;
  setCodeformerFidelity: React.Dispatch<React.SetStateAction<number>>;
}

export const Settings: React.FC<Props> = ({
  backgroundEnhance,
  setBackgroundEnhance,
  faceUpsample,
  setFaceUpsample,
  upscale,
  setUpscale,
  codeformerFidelity,
  setCodeformerFidelity,
}) => {
  const handleBackgroundEnhanceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBackgroundEnhance(event.target.checked);
  };

  const handleUpsampleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFaceUpsample(event.target.checked);
  };

  const handleUpscaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpscale(parseInt(event.target.value));
  };

  const handleFidelityChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setCodeformerFidelity(newValue);
    }
  };

  return (
    <Paper
      style={{
        backgroundColor: "#E7FFFF",
        width: "60%",
        paddingLeft: "3%",
        paddingRight: "3%",
      }}
      elevation={2}
    >
      <CardHeader
        avatar={<Avatar aria-label="recipe" src="/codeformer_icon.png" />}
        title="CodeFormer settings"
      />
      <FormGroup>
        <Grid container>
          <Grid item md={11}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={backgroundEnhance}
                  onChange={handleBackgroundEnhanceChange}
                />
              }
              label="Background enhance"
            />
          </Grid>
          <Grid item xs={6} md={1} alignContent="center">
            <Tooltip title="Enhance background regions with Real-ESRGAN">
              <HelpIcon />
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item md={11}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={faceUpsample}
                  onChange={handleUpsampleChange}
                />
              }
              label="Upsample"
            />
          </Grid>
          <Grid item xs={6} md={1} alignContent="center">
            <Tooltip
              title="Upsample"
              style={{ alignItems: "right", right: "2px" }}
            >
              <HelpIcon />
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item md={11}>
            <FormControlLabel
              style={{ width: "80%" }}
              control={
                <TextField
                  value={upscale}
                  onChange={handleUpscaleChange}
                  type="number"
                />
              }
              label="upscale"
              labelPlacement="top"
            />
          </Grid>
          <Grid item xs={6} md={1} alignContent="center">
            <Tooltip title="Rescaling factor (up to 4)">
              <HelpIcon />
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item md={11}>
            <FormControlLabel
              style={{ width: "80%" }}
              control={
                <Slider
                  aria-label="Fidelity"
                  defaultValue={codeformerFidelity}
                  onChange={handleFidelityChange}
                  step={0.01}
                  min={0}
                  max={1}
                  valueLabelDisplay="auto"
                />
              }
              label="Fidelity"
              labelPlacement="top"
            />
          </Grid>
          <Grid item md={1} alignContent="center">
            <Tooltip title="0 for better quality, 1 for better identity">
              <HelpIcon />
            </Tooltip>
          </Grid>
        </Grid>
      </FormGroup>
    </Paper>
  );
};

// enhance the background regions with Real-ESRGAN
