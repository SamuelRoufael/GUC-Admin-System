import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

export default function CheckboxLabels(props) {
  const [state, setState] = React.useState(false);

  function handleChange() {
    setState(!state);
    props.onChange(!state,props.id);
  }

  return (
    <FormControlLabel
      control={
        <FormControlLabel id={props.label_} key={props.label_} disabled={props.disable_} control ={<Checkbox checked={state} onChange={handleChange} />} />
      }
      label= {props.label_}
    />
  );
}
