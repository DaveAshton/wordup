import React from "react";
import { render, screen } from "@testing-library/react";
import { CellProps, Cell } from "../Cell";
import { LetterStatus } from "../../../model";

const createComponent = (
  isFocussed: boolean,
  status: LetterStatus,
  letter: string
) => {
  const props: CellProps = {
    isFocussed,
    status,
    letter,
  };
  return render(<Cell {...props} />);
};

test("given Correct cell, renders letter and classNames", () => {
  createComponent(false, LetterStatus.Correct, "Z");
  const element = screen.getByText(/Z/i);
  expect(element).toBeInTheDocument();

  expect(element.classList.contains("Correct")).toBeTruthy();
});

test("given Incorrect cell, renders letter and classNames", () => {
  createComponent(false, LetterStatus.Incorrect, "X");
  const element = screen.getByText(/X/i);
  expect(element).toBeInTheDocument();

  expect(element.classList.contains("Incorrect")).toBeTruthy();
});

test("given ValidOutOfPosition cell, renders letter and classNames", () => {
  createComponent(false, LetterStatus.ValidOutOfPosition, "X");
  const element = screen.getByText(/X/i);
  expect(element).toBeInTheDocument();

  expect(element.classList.contains("ValidOutOfPosition")).toBeTruthy();
});

test("given NotSet cell, renders letter and classNames", () => {
  createComponent(true, LetterStatus.NotSet, "A");
  //console.log(screen.debug())
  const element = screen.getByText(/A/i);
  expect(element).toBeInTheDocument();

  expect(element.classList.contains("NotSet")).toBeTruthy();
  expect(element.classList.contains("Focussed")).toBeTruthy();
});