// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Spinner from "./Spinner";

test("Spinner renders correctly when `show` is true", () => {
  render(<Spinner on={true} />);
  const spinner = screen.queryByText(/Please wait.../i);
  expect(spinner).toBeInTheDocument();
});
