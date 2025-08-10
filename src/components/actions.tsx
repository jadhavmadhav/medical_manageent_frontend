import { MouseEventHandler } from "react";
import { Button } from "./ui/button";

export const downloadButton = (
  handleClick: MouseEventHandler<HTMLButtonElement> | undefined
) => {
  return (
    <Button onClick={handleClick} color="red">
      Download
    </Button>
  );
};
